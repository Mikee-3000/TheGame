from datetime import datetime as dt
import json
import lib.chat_logging as log
from lib import client
from mistralai.models.chat_completion import ChatMessage
import os
import re


def talk(policy_settings_message):

    chat_response = client.client.chat(
        model=policy_settings_message['model'],
        messages=policy_settings_message['messages']
    )

    message_content = chat_response.choices[-1].message.content
    try:
        message_json = re.findall(r'```json([^`]+)```', message_content)[0]
        return json.loads(message_json), message_content
    except IndexError:
        # sometimes the AI sends only the JSON
        try:
            return json.loads(message_content)
        except json.JSONDecodeError:
            # stuck
            print(message_content)
            # TODO: more error handling

system_message = ChatMessage(role='system', content='You are an AI game engine, finetuned in Keynesian economics. The player runs a country and can set interest rates, government spending, taxes, money supply and allows or bans import of food.  The player sends you the parameters, together with current population, and you reply with what the population, consumption, investment, net export, government income and inflation will be within a month. You always return one specific number for each parameter, formatted as JSON. The JSON keys are population, consumption, investment, net_export, government_income, inflation. Booleans values are expressed as 0 or 1. The player can then use these numbers to make decisions for the country.')
    