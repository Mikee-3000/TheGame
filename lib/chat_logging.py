from datetime import datetime as dt
from mistralai.models.chat_completion import ChatMessage

def log_message(message: ChatMessage, log_file: str, model=None, thread_position=None):
    with open(log_file, 'a') as f:
        if thread_position == 'top':
            f.write('--------------------------------------------------------------\n')
        f.write(dt.strftime(dt.now(), '%Y-%m-%d %H:%M:%S\n'))
        if model:
            f.write(f'{message.role} ({model}): {message.content}\n')
        else:
            f.write(f'{message.role}: {message.content}\n')
        if thread_position == 'bottom':
            f.write('--------------------------------------------------------------\n')

log_file = 'logs/chat.log'