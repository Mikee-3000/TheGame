from datetime import datetime as dt
from dotenv import load_dotenv
from lib.chat_logging import log_message
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import os

load_dotenv()
api_key = os.environ['MISTRAL_API_KEY']
model = 'mistral-large-latest'

client = MistralClient(api_key=api_key)

messages = [
    ChatMessage(role='user', content='What is the best French cheese?')
]

for message in messages:
    log_message(message, 'logs/chat.log', thread_position='top')

# No streaming
chat_response = client.chat(
    model=model,
    messages=messages,
)

for resp in chat_response.choices:
    log_message(resp.message, 'logs/chat.log', model=model, thread_position='bottom')