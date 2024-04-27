from dotenv import load_dotenv
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from lib import message
import os

def start_client():
    load_dotenv('../.env')
    api_key = os.environ['MISTRAL_API_KEY']
    return MistralClient(api_key=api_key)

async def send_metrics(metrics):
    metrics_string = f"population: {metrics.population}, interest rate: {metrics.interest_rate}, government spending: {metrics.government_spending}, taxes: {metrics.taxes}, money supply: {metrics.money_supply}, food import allowed: {metrics.food_import_allowed}"
    messages = [message.system_message]
    messages.append(ChatMessage(role='user', content=metrics_string))
    return message.talk(messages)

client = None
model = 'mistral-small-latest'