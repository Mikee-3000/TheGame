from dotenv import load_dotenv
import json
from mistralai.client import MistralClient
from mistralai.models.models import ModelCard
from mistralai.models.chat_completion import ChatMessage
import os

load_dotenv('../.env')
api_key = os.environ['MISTRAL_API_KEY']

def list_models():
    client = MistralClient(api_key=api_key)
    for model_data in client.list_models():
        print(model_data[1])
        for model in model_data[1]:
            if type(model) == ModelCard:
                print(model.id)

if __name__ == '__main__':
    list_models()
        