# CSProject
Virtual TA for Students to use for their course/classes

## Web_client

Frontend is written in ReactJS with the ViteJS framework

## Server

The backend of the application is built using NodeJS and Express, which help with API routing and do the heavy lifting by creating a custom gateway between the deployed Large Language Model(LLM), the database(using DynamoDB), and the frontend

## Machine Learning

Built on top of Llama-2, by META.
- The model is finetuned on a custom dataset which allows users to ask it questions related to specific courses
- The model is deployed using K8 and Google Cloud's compute engine
