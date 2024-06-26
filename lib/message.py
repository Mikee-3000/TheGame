from datetime import datetime as dt
import json
import lib.chat_logging as log
from lib import client
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import os
import re


def talk(
    user_message: ChatMessage,
    system_message: ChatMessage,
    model: str,
):
    chat_response = client.client.chat(
        model=model,
        messages=[user_message, system_message]
    )
    try:
        assert len(chat_response.choices) == 1
    except AssertionError as e:
        print(e.message)

    message_content = chat_response.choices[0].message.content
    try:
        message_json = re.findall(r'```json([^`]+)```', message_content)[0]
        print(message_json)
        return json.loads(message_json), chat_response.choices[0]
    except IndexError:
        # sometimes the AI sends only the JSON
        try:
            print(message_content)
            return json.loads(message_content)
        except json.JSONDecodeError:
            # stuck
            print(message_content)
            # TODO: more error handling