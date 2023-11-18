"""File name: llama-rayserve.py"""
import warnings
from typing import Dict
from starlette.requests import Request


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

        #see https://python.langchain.com/docs/use_cases/question_answering/local_retrieval_qa
        # qa_llm = RetrievalQA.from_chain_type(llm=llm,
        #                                     chain_type='stuff',
        #                                     retriever=retriever,
        #                                     return_source_documents=True,
        #                                     chain_type_kwargs={'prompt': prompt}) 

        # Set up memory and langchain for both QA and Conversation
        memory = ConversationBufferWindowMemory(memory_key="history", k=4, return_only_outputs=True)
        chain = ConversationChain(llm=llm, memory=memory, prompt=prompt, verbose=True)

        # question_generator_chain = LLMChain(llm=llm, prompt=qaPrompt, verbose=False)
        qa_memory = ConversationBufferMemory(memory_key="chat_history", input_key="question", k=4, return_messages=True)
        qa_chain = ConversationalRetrievalChain.from_llm(llm=llm, chain_type="stuff", memory=qa_memory, retriever=retriever, verbose=False)

        self.convo = chain
        self.qa = qa_chain
        self.zsc = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
        self.candidate_labels = ["Follow-Up Description", "Sorting", "Searching", "Design", "Data Structures", "Comparison", "Proofs", "Asymptomatic analysis", "Dynamic Programming", "Greedy Methods", "Grading", "Course Description", "Class Time", "Assignment Details", "Class Location", "Professor Contact Info", "Office Hours", "Syllabus", "Final Exam Date","Thanksgiving Break"]
        self.syllabus_labels = ["Grading", "Course Description", "Assignment Details", "Class Time", "Class Location", "Professor Contact Info", "Office Hours", "Syllabus","Final Exam Date", "Thanksgiving Break"]
        self.last_was_qa = None

    def model(self, query: str) -> str:

        # Classify Query as either QA or Conversation
        classification_object = self.zsc(query, self.candidate_labels)
        print(classification_object)
        classification = classification_object['labels'][0]

        response = ""
        syllabus_related = (classification in self.syllabus_labels)

        # If the query is a follow-up question, use the last_was_qa variable to determine whether to use QA or Conversation
        if (classification == "Follow-Up Description" and self.last_was_qa != None):
            syllabus_related = self.last_was_qa
        elif (classification == "Follow-Up Description"):
            syllabus_related = classification_object['labels'][1] in self.syllabus_labels

        # If the query is syllabus related, use the QA model, else use the Conversation model
        if (syllabus_related): 
            response = self.qa({"question": query, "chat_history": ""})['answer']
            self.last_was_qa = True
        else: 
            response = self.convo.predict(input=query)
            self.last_was_qa = False

        return ("QA: " if syllabus_related else "Convo: ") + response

    def __init__(self):
        self.loadllms()

    def __call__(self, request: Request) -> Dict:
        question = request.query_params["text"]
        print("Question: " + question)
        llm_response = self.model(question)
        print("Response:\n" + llm_response)
        return llm_response

# 2: Deploy the deployment.
llama2_app = LlamaLlm.bind()
serve.run(llama2_app, route_prefix="/", port="80")

# 3: Run from command like
# serve run llama_rayserve:llama2_app 