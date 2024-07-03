from datetime import datetime as dt
import json
import lib.chat_logging as log
from lib import client
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import os
import re
from typing import Any, Union


def talk(
    user_message: ChatMessage,
    system_message: ChatMessage,
    model: str,
    expected_metrics_amount = 1
) -> Union[list[dict[str, Any]], dict[str, Any]]:
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
        metrics_list = []
        for i in range(expected_metrics_amount):
            message_json = re.findall(r'```json([^`]+)```', message_content)[i]
            metrics_list.append(json.loads(message_json))
        return metrics_list, chat_response.choices[0]
    except IndexError:
        # sometimes the AI sends only the JSON
        try:
            return json.loads(message_content)
        except json.JSONDecodeError:
            # stuck
            print(message_content)
            # TODO: more error handling