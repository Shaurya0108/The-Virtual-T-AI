"""File name: llama-rayserve.py"""
import warnings
from typing import Dict
from starlette.requests import Request

import re

from ray import serve

from langchain.embeddings import HuggingFaceInstructEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts.prompt import PromptTemplate
from langchain.chains import ConversationalRetrievalChain, ConversationChain
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain.memory import ConversationBufferMemory
from transformers import pipeline

from langchain.llms import LlamaCpp
warnings.filterwarnings("ignore")

# 1: Wrap the pretrained sentiment analysis model in a Serve deployment.
@serve.deployment
class LlamaLlm:
    """Class to load and Serve LLM"""

    def loadllms(self) -> RetrievalQA:
        """Function loading the LLM"""
        model_path = "./llama2/llama.cpp/models/13B/ggml-model-q4_0.bin" # Path to Quantized Llama Model (13B) compiled for Apple Silicon
        n_gpu_layers = 1  # Metal set to 1 is enough.
        n_batch = 4096  # Should be between 1 and n_ctx, consider the amount of RAM of your Apple Silicon Chip.
        n_context = 4096
        last_n_tokens_size = 300
        max_new_tokens = 4096 #max is 4096 tokens for LLaMa 2
        # Make sure the model path is correct for your system
        
        llm = LlamaCpp(
            model_path=model_path ,
            n_gpu_layers=n_gpu_layers,
            task='text-generation',
            return_full_text=True,
            n_batch=n_batch,
            n_ctx=n_context,
            top_p=0.9,
            top_k=40,
            last_n_tokens_size=last_n_tokens_size,
            max_new_tokens=max_new_tokens, #max is 4096 tokens for LLaMa 2
            f16_kv=True,  # MUST set to True, otherwise you will run into problem after a couple of calls
            verbose=False, # Verbose is required to pass to the callback manager
            temperature= 0.0,
            repetition_penalty=1.8
        )
        
        template = """[INST] <<SYS>> 
        You are a helpful, respectful and honest teaching assistant in the Computer Science Dept in UT Dallas. 
        Do not greet the user.
        If you are asked for coding or mathematical solutions, say 'As a TA, I'm cannot provide you solutions, but can guide you.' \
        and provide reference to documentation.
        If you don't know the answer to a question, please don't share false information. Instead say 'I don't know, please contact the TA.'
        <</SYS>>
        Context: {history} 
        Question: {input} 
        Only return the helpful answer below and nothing else. Keep your response to less than 5 sentences. 
        Helpful answer:[/INST]
        """

        # load the interpreted information from the local database
        embeddings = HuggingFaceInstructEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'mps'}) #original value: cpu
        db = FAISS.load_local("faiss", embeddings)

        # prepare a version of the llm pre-loaded with the local content
        retriever = db.as_retriever(search_type="similarity", search_kwargs={'k': 2})
        prompt = PromptTemplate(input_variables=["history", "input"], template=template)

        # Set up memory and langchain for both QA and Conversation
        memory = ConversationBufferWindowMemory(memory_key="history", k=4, return_only_outputs=True)
        chain = ConversationChain(llm=llm, memory=memory, prompt=prompt, verbose=True)

        # question_generator_chain = LLMChain(llm=llm, prompt=qaPrompt, verbose=False)
        qa_memory = ConversationBufferMemory(memory_key="chat_history", input_key="question", k=4, return_messages=True)
        qa_chain = ConversationalRetrievalChain.from_llm(llm=llm, chain_type="stuff", memory=qa_memory, retriever=retriever, verbose=False)

        self.convo = chain
        self.qa = qa_chain
        self.zsc = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
        self.candidate_labels = [
            "Sorting Algorithms", "Search Algorithms", "Design", "Data Structures", "Comparison", "Proofs", "Asymptomatic analysis", "Dynamic Programming", "Greedy Methods", 
            "Grading", "Course Description", "Class Time", "Assignment Details", "Class Location", "Comet Creed", "Professor Contact Info", "Office Hours", "Syllabus", "Final Exam Date", "Thanksgiving Break"
            ]
        PARTITION_INDEX = 9 # Number of labels on first row of candidate_labels (Non-syllabus related)
        self.syllabus_labels = self.candidate_labels[PARTITION_INDEX:]
        self.last_was_qa = None


    def preprocess(self, query: str) -> str:
        """Function to preprocess the query"""

        # make pronouns to "the professor's"
        query = re.sub(' her | his ', " the professor's ", query)

        # Hardcoded replacements
        if re.match('who is the professor', query.lower()):
            query = re.sub('who is the professor', "What is the professor's name", query.lower())

        return query

    def model(self, query: str) -> str:

        # Classify Query as either QA or Conversation
        classification_object = self.zsc(query, self.candidate_labels)
        print(classification_object)
        classification = classification_object['labels'][0]

        response = ""
        syllabus_related = (classification in self.syllabus_labels)

        # If the query is syllabus related, use the QA model, else use the Conversation model
        if (syllabus_related): 
            response = "This is a default response."
            response = self.qa({"question": query, "chat_history": ""})['answer']
            self.last_was_qa = True
        else: 
            response = "This is a default response."
            response = self.convo.predict(input=query)
            self.last_was_qa = False

        # return ("QA: " if syllabus_related else "Convo: ") + response
        return response

    def hardcodedResponse(self, query: str) -> str:
        """Function to return hardcoded responses"""

        question_answer_pairs = {
            "what is the professor's name": "The professor is Anjum Chida",
        }

        query = query.lower()

        for question in question_answer_pairs.keys():
            if re.match(question, query):
                return question_answer_pairs[question]

        return None

    def postprocess(self, response: str) -> str:
        """Function to postprocess the response"""

        # Get rid of retelling of the prompt
        temp = response.find('teaching assistant in the Computer Science Department at UT Dallas:')
        if (temp != -1): response = response[temp+67:]

        # Get rid of qa prompt
        temp = response.find('Based on the provided information')
        if (temp != -1): response = response[temp+33:]

        temp = response.find('Based on the provided context')
        if (temp != -1): response = response[temp+29:]

        temp = response.find('Based on the given information')
        if (temp != -1): response = response[temp+30:]

        temp = response.find('Based on the given context')
        if (temp != -1): response = response[temp+26:]
        
        temp = response.find('context provided')
        if (temp != -1): response = response[temp+16:]

        # Get rid of artifacts
        while re.match(",|\.|\?|!|:|;", response):
            response = response[1:]

        # Whitespace cleanup
        response = re.sub(' +', ' ', response)
        response = re.sub('\n+', '\n', response)
        response = response.strip()

        # Capitalize first letter
        response = response[0].upper() + response[1:]

        return response
    
    def __init__(self):
        self.loadllms()

    # # Network Server Code
    # async def __call__(self, request: Request) -> Dict:
    #     payload = await request.json()
    #     print(payload)
    #     question = payload["text"]
    #     print("Question: " + question)

    #     question = self.preprocess(question)
    #     print("Preprocessed Question: " + question)

    #     response = self.hardcodedResponse(question)
    #     print("Hardcoded?: " + str(bool(response != None)))
    #     if response: return response

    #     llm_response = self.model(question)
    #     print("Response:\n" + llm_response)

    #     llm_response = self.postprocess(llm_response)
    #     print("Post Processed Response:\n" + llm_response)

    #     return llm_response

    # Streamlit Local Code
    def __call__(self, request: Request) -> Dict:
        question = request.query_params["text"]
        print("Question: " + question)

        question = self.preprocess(question)
        print("Preprocessed Question: " + question)

        response = self.hardcodedResponse(question)
        print("Hardcoded?: " + str(bool(response != None)))
        if response: return response

        llm_response = self.model(question)
        print("Response:\n" + llm_response)

        llm_response = self.postprocess(llm_response)
        print("Post Processed Response:\n" + llm_response)

        return llm_response

# 2: Deploy the deployment.
llama2_app = LlamaLlm.bind()
serve.run(llama2_app, route_prefix="/", host="0.0.0.0", port="8000")

# 3: Run from command like
# serve run llama_rayserve:llama2_app