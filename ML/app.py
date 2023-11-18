#Model Imports
from langchain.llms import CTransformers
from langchain.llms import LlamaCpp
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.chains import ConversationChain
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain.chains import (
    StuffDocumentsChain, LLMChain, ConversationalRetrievalChain
)
from langchain.memory import ConversationBufferMemory
from langchain.chains import AnalyzeDocumentChain
# from langchain.llms.huggingface_pipeline import HuggingFacePipeline
from transformers import pipeline

#Web Imports
from flask import Flask, request, jsonify, redirect, url_for
import sys
import os
app = Flask(__name__)

################## Model Setup ##################

# Prompts
llamaTemplatev2 = """
[INST] <<SYS>> 
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

qaTemplatev2 = """
[INST] <<SYS>> 
You are a helpful, respectful and honest teaching assistant in the Computer Science Dept in UT Dallas. 
If you are asked for coding or mathematical solutions, say 'As a TA, I'm cannot provide you solutions, but can guide you.' \
and provide reference to documentation. 
If you don't know the answer to a question, please don't share false information. 
At the end of every response say 'Please refer to the syllabus for more information.' \
Syllabus Topics include: Instructor, Grading, Course Description, Course Objectives, Course Topics, Course Materials, Room and Time, \
<</SYS>>
Context: {chat_history} 
Question: {question} 
Only return the helpful answer below and nothing else. Keep your response to less than 5 sentences. 
Helpful answer:[/INST]
"""

chainPrompt = PromptTemplate(input_variables=["history", "input"], template = llamaTemplatev2)
qaPrompt = PromptTemplate(input_variables=["chat_history", "question"], template = qaTemplatev2)


# Model 
#model_path = "./llama2/llama.cpp/models/13B/ggml-model-q4_0.bin" # Path to Quantized Llama Model (13B) compiled for Apple Silicon
model_path = "/Users/rubenmathew/Desktop/UTD/CS 4485/CSProject.nosync/ML/llama2/llama.cpp/models/13B/ggml-model-q4_0.bin"
n_gpu_layers = 1  # Metal set to 1 is enough.
n_batch = 4096  # Should be between 1 and n_ctx, consider the amount of RAM of your Apple Silicon Chip.
n_context = 4096
last_n_tokens_size = 300
max_new_tokens = 4096 #max is 4096 tokens for LLaMa 2

llm = LlamaCpp(
	model_path=model_path,
	n_gpu_layers=n_gpu_layers,
	task='text-generation',
	return_full_text=True,
	n_batch=n_batch,
	n_ctx=n_context,
	last_n_tokens_size=last_n_tokens_size,
	max_new_tokens=max_new_tokens,
	top_p=0.9,
	top_k=40,
	f16_kv=True,  # MUST set to True, otherwise you will run into problem after a couple of calls
	verbose=False, # Verbose is required to pass to the callback manager
	temperature= 0.0,
	repetition_penalty=1.8
)

# Embeddings
embeddings = HuggingFaceEmbeddings(
	model_name="sentence-transformers/all-MiniLM-L6-v2",
	model_kwargs={'device': 'mps'})
db = FAISS.load_local("/Users/rubenmathew/Desktop/UTD/CS 4485/CSProject.nosync/ML/faiss", embeddings)

# prepare a version of the llm pre-loaded with the local content
retriever = db.as_retriever(search_kwargs={'k': 6})

# Set up memory and langchain for both QA and Conversation
#memory = ConversationBufferWindowMemory(memory_key="history", k=4, return_only_outputs=True)
chain = ConversationChain(llm=llm, prompt=chainPrompt, verbose=False)

# question_generator_chain = LLMChain(llm=llm, prompt=qaPrompt, verbose=False)
#qa_memory = ConversationBufferMemory(memory_key="chat_history", input_key="question", k=4, return_messages=True)
qa_chain = ConversationalRetrievalChain.from_llm(llm=llm, chain_type="stuff", retriever=retriever, verbose=False)

# Set up pipeline for Zero-Shot Classification
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
candidate_labels = ["Sorting", "Searching", "Design", "Data Structures", "Proofs", "Asymptomatic analysis", "Dynamic Programming", "Greedy Methods", "Grading", "Course Description", "Class Time", "Assignment Details", "Class Location", "Professor Contact Info"]
syllabus_labels = ["Grading", "Course Description", "Assignment Details", "Class Time", "Class Location", "Professor Contact Info"]


################## Model Calling Functions ##################
def convo_model_with_history(hist, query):
	chat_history = hist
	convo = chain.predict(input=query)
	return convo

def convo_model(query):
	return convo_model_with_history("", query)

def docqa_model(query):
	return qa_chain({"question": query, "chat_history":""})['answer']

def zsc_model(query):
	classification_object = classifier(query, candidate_labels)
	classification = classification_object['labels'][0]

	# modelType = {"QA": 0.0, "Convo": 0.0}
	# for label in classification_object['labels']:
		# if label in syllabus_labels:
		# 	modelType["QA"] += classification_object['scores'][classification_object['labels'].index(label)]
		# else:
		# 	modelType["Convo"] += classification_object['scores'][classification_object['labels'].index(label)]

	# return [("QA" if modelType["QA"] > modelType["Convo"] else "Convo"), str(classification_object)]
	return ["QA" if classification in syllabus_labels else "Convo", str(classification_object)]

################## Routing Functions ##################
@app.route('/history/<hist>/convo/<query>')
def query_convo_with_history(hist, query):
	return 'query: %s' % query + "\nConversational Model:" + convo_model_with_history(hist, query)

@app.route('/convo/<query>')
def query_convo(query):
	return 'query: %s' % query + "\nConversational Model:" + convo_model(query)

@app.route('/docqa/<query>')
def query_docqa(query):
	return 'query: %s' % query + "\nSyllabus Model:" + docqa_model(query)

@app.route('/zsc/<query>')
def query_classifier(query):
	return 'query: %s' % query + "\nZSC Model:" + zsc_model(query)

@app.route('/model/<query>')
def query_model(query):
	model = zsc_model(query)
	print(model[1])
	if model[0] == "QA": return query_docqa(query)
	else: return query_convo(query)

# Temporary Shutdown Solution
@app.route('/shutdown')
def shutdown():
	sys.exit()
	os.exit(0)
	return


################## Web Setup ##################
if __name__ == '__main__':

	while True:
		try:
			app.run(debug = True)
		except:
			print("Error: server crashed. Restarting...")
		


