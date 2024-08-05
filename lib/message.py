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
        pass

    message_content = chat_response.choices[0].message.content
    try:
        metrics_list = []
        for i in range(expected_metrics_amount):
            message_json = re.findall(r'```([^`]+)```', message_content)[i].strip()
            metrics_list.append(json.loads(message_json))
        return (metrics_list, chat_response.choices[0])
    except IndexError as e:
        # sometimes the AI sends only the JSON
        try:
            loaded_json = json.loads(message_content)
            if not isinstance(loaded_json, list):
                return ([loaded_json], chat_response.choices[0])
            else:
                return (loaded_json, chat_response.choices[0])
        except json.JSONDecodeError:
            # stuck
            # probably an almost-ok JSON, that might still be fixed
            all_tokens = re.split(r'[\'\"\n{}":\s,]', message_content)
            tokens = []
            for token in all_tokens:
                token = re.sub(r'[\'\"\n{}":\s,]', '', token)
                if token == '':
                    continue
                tokens.append(token)
            fixed_json = {}
            key = None
            for i, token in enumerate(tokens):
                if token == '':
                    continue
                if i % 2 == 0:
                    # key
                    key = token
                else:
                    try:
                        token = float(token)
                    except ValueError:
                        pass
                    fixed_json[key] = token
            return [fixed_json], chat_response.choices[0]

def get_game_result(
    user_message: ChatMessage,
    system_message: ChatMessage,
    model: str,
):
    chat_response = client.client.chat(
        model=model,
        messages=[user_message, system_message]
    )
    message_content = chat_response.choices[0].message.content
    # get win or lose
    try:
        result = re.findall('(WON|LOST)', message_content)[0]
    except IndexError:
        print(message_content)
    return {
        'result': result,
        'verdict': message_content,
        'raw': chat_response.choices[0]
    }