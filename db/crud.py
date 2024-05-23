from mistralai.models.chat_completion import ChatMessage
from sqlalchemy.orm import Session
from config import config
import json

from db.models import Game, Exchange, SystemPrompt, Message, Metrics, PolicySettings
from schemas.schemas import Game as GameSchema, Exchange as ExchangeSchema, SystemPrompt as SystemPromptSchema, Message as MessageSchema, Metrics as MetricsSchema, PolicySettings as PolicySettingsSchema, MetricsMessage as MetricsMessageSchema, PolicySettingsMessage as PolicySettingsMessageSchema, PolicySettingsCreate as PolicySettingsCreateSchema
import datetime 

def create_game(db: Session):
    current_timestamp = datetime.datetime.now().timestamp()
    db_game = Game(start_rl_timestamp=current_timestamp)
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

def create_exchange(db: Session, game_id: int):
    db_exchange = Exchange(game_id=game_id)
    db.add(db_exchange)
    db.commit()
    db.refresh(db_exchange)
    return db_exchange

def create_system_prompt(db: Session):
    print('config is ', config.system_prompt)
    content = config.system_prompt.content
    db_system_prompt = SystemPrompt(content=content)
    db.add(db_system_prompt)
    db.commit()
    db.refresh(db_system_prompt)
    return db_system_prompt

def create_message(db: Session, exchange_id: int, system_prompt_id: int, gt_timestamp: int, role: str, content: str, message_json: dict):
    rl_timestamp = datetime.datetime.now().timestamp()
    db_message = Message(exchange_id=exchange_id, system_prompt_id=system_prompt_id, rl_timestamp=rl_timestamp, gt_timestamp=gt_timestamp, role=role, content=content, message_json=message_json)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def create_policy_settings_message(db: Session, exchange_id: int, gt_timestamp: int, role: str, policy_settings: PolicySettingsCreateSchema):

    # create and store the policy settings
    db_policy_settings = PolicySettings(**policy_settings.model_dump())
    db.add(db_policy_settings)
    db.commit()
    db.refresh(db_policy_settings)

    # db_system_prompt = db.query(SystemPrompt).filter(SystemPrompt.id == system_prompt_id).first()

    print('policy_settings is ', db_policy_settings.id)
    policy_settings_schema = PolicySettingsSchema.model_validate(db_policy_settings)
    system_prompt_schema = SystemPromptSchema(**{"id": config.system_prompt_id, "content": config.system_prompt.content})

    system_message = ChatMessage(role='system', content=system_prompt_schema.content) 
    user_message = ChatMessage(role=role, content=json.dumps(policy_settings_schema.model_dump()))
    policy_settings_message = {
        "messages": [system_message, user_message],
        "model": config.ai_model
    }
    # create and store the message
    rl_timestamp = datetime.datetime.now().timestamp()
    db_message = Message(exchange_id=exchange_id, policy_settings_id=db_policy_settings.id, system_prompt_id=config.system_prompt_id, rl_timestamp=rl_timestamp, gt_timestamp=gt_timestamp, role=role, message_json={"model": config.ai_model, "messages": [system_message.model_dump(), user_message.model_dump()]})
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    print('here')
    return policy_settings_message
    