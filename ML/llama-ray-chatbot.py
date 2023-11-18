"""UI for the Chatbot"""

import warnings
import streamlit as st
import requests
warnings.filterwarnings("ignore")


st.set_page_config(page_title="LLaMa Chatbot", page_icon=":robot:")
st.header("LLaMa Chatbot. How may I help you?")

def get_question():
    '''Reads the text from the text input box'''
    question = st.text_input("You: ", key = input)
    return question
    
user_prompt = get_question()
submit = st.button('Answer')

if submit:
    llm_response = requests.get("http://localhost:8000/", 
                                params={"text": user_prompt}, 
                                timeout= 30000)
    st.text_area("Response:", llm_response.text)


#Run this command from command line
#streamlit run ./llama-ray-chatbot.py