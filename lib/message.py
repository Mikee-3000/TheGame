from datetime import datetime as dt
import lib.chat_logging as log
from lib import client
from mistralai.models.chat_completion import ChatMessage
import os


def talk(messages):

    for message in messages:
        log.log_message(message, log.log_file, thread_position='top')

    # No streaming
    chat_response = client.client.chat(
        model=client.model,
        messages=messages,
    )

    for resp in chat_response.choices:
        log.log_message(resp.message, log.log_file, model=client.model, thread_position='bottom')
    return chat_response.choices

system_message = ChatMessage(role='system', content='You are an AI game engine, finetuned in Keynesian economics. The player runs a country and can set interest rates, government spending, taxes, money supply and allows or bans import of food.  The player sends you the parameters, together with current population, and you reply with what the population growth, GDP, inflation rate, unemployment rate, consumer confidence, investment levels, trade balance and government debt will be within a month. You always return one specific number for each parameter, formatted as JSON.')
    