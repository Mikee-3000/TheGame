def log_message(message: ChatMessage, log_file: str):
    with open(log_file, 'a') as f:
        f.write(f'{message.role}: {message.content}\n')