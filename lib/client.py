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
    metrics_string = f"population: {metrics.population}, interest rate: {metrics.interestRate}, government spending: {metrics.govtSpending}, tax rate: {metrics.taxRate}, money supply: {metrics.moneySupply}, food import allowed: {metrics.foodImport}"
    messages = [message.system_message]
    messages.append(ChatMessage(role='user', content=metrics_string))
    return message.talk(messages)

client = None
model = 'mistral-small-latest'