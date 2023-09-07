import json
import boto3

ENDPOINT = "huggingface-pytorch-tgi-inference-2023-09-05-17-57-42-061"
runtime = boto3.client('runtime.sagemaker')

def lambda_handler(event, context):
    # TODO implement
    query_params = event['queryStringParameters']
    query = query_params.get('query')
    
    #hyper param
    payload = {
        "inputs": query,
        "parameters": {
            "do_sample": True,
            "top_p": 0.7,
            "temperature": 0.3,
            "top_k": 50,
            "max_new_tokens": 512,
            "repetition_penalty": 1.03
        }
    }
            
    response = runtime.invoke_endpoint(EndpointName=ENDPOINT, ContentType="application/json", Body=json.dumps(payload))
    prediction = json.loads(response['Body'].read().decode('utf-8'))
    final_result = prediction[0]['generated_text']

    return {
        'statusCode': 200,
        'body': json.dumps(final_result)
    }
