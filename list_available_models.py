from dotenv import load_dotenv
import json
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import os

load_dotenv()
api_key = os.environ['MISTRAL_API_KEY']
model = 'mistral-large-latest'

client = MistralClient(api_key=api_key)
for model_data in client.list_models():
    for model in model_data:
        # model = json.dumps(model, indent=2)
        print(model)
        