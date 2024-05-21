from sqlalchemy.orm import Session

from db.models import Game, Exchange, SystemPrompt, Message, Metrics, PolicySettings
from schemas.schemas import Game as GameSchema, Exchange as ExchangeSchema, SystemPrompt as SystemPromptSchema, Message as MessageSchema, Metrics as MetricsSchema, PolicySettings as PolicySettingsSchema
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