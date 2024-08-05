from dotenv import load_dotenv
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from theGame.lib import message
import os

def start_client():
    load_dotenv('../.env')
    api_key = os.environ['MISTRAL_API_KEY']
    return MistralClient(api_key=api_key)

client = None
# model = 'mistral-small-latest'