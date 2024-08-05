from datetime import datetime as dt
from db.crud import get_game_scenario_by_id, get_scenario_by_id as crud_get_scenario_by_id
from db.database import SessionLocal
from fastapi import HTTPException, Request, Response, Depends
from pydantic import BaseModel
from schemas.schemas import MetricsSchema, GameCreateSchema


def setup_accept_header(app):
    @app.middleware("http")
    async def add_accept_ch_header(request: Request, call_next):
        try:
            response = await call_next(request)
            # Set the Accept-CH header
            response.headers["Accept-CH"] = "Sec-CH-UA,Sec-CH-UA-Arch,Sec-CH-UA-Bitness,Sec-CH-UA-Full-Version-List,Sec-CH-UA-Mobile,Sec-CH-UA-Model,Sec-CH-UA-Platform,Sec-CH-UA-Platform-Version"
            return response
        except HTTPException as exc:
            # Update the headers of the exception response
            for key, value in response.headers.items():
                exc.headers[key] = value

            raise exc
    
# Each request needs an independent session
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Game(BaseModel):
    game_id: int
    rl_timestamp: int

def get_game_by_id(game: Game):
    db = SessionLocal()
    found_game = get_game_scenario_by_id(db, game.game_id)
    found_game.rl_timestamp = game.rl_timestamp
    return found_game

def get_scenario_by_id(game: GameCreateSchema):
    db = SessionLocal()
    found_scenario = crud_get_scenario_by_id(db, game.scenario_id)
    return found_scenario

def dated_metrics_dict(metrics: list[MetricsSchema]) -> dict[dt, MetricsSchema]:
    dated_metrics = {}
    metrics_capture_date = None
    for metric in metrics:
        metric_game_date = dt.strftime(dt.utcfromtimestamp(metric.gt_timestamp), '%Y-%m-%d')
        dated_metrics[metric_game_date] = metric.model_dump()
        # get the highest timestamp, as the game date of the current measurement
        if metrics_capture_date is None:
            metrics_capture_date = metric_game_date
        if metric_game_date > metrics_capture_date:
            metrics_capture_date = metric_game_date
    dated_metrics['current_game_date'] = metrics_capture_date
    return dated_metrics
