# from mistralai.models.chat_completion import ChatMessage
from sqlalchemy.orm import Session, joinedload
import json
from schemas.schemas import *
from db.models import *
import datetime 

def create_scenario(
        db: Session,
        scenario_schema: ScenarioSchema
    ):
    db_scenario = Scenario(
        name=scenario_schema.name,
        description=scenario_schema.description,
        game_type=scenario_schema.game_type,
        system_prompt=scenario_schema.system_prompt
    )
    db.add(db_scenario)
    db.commit()
    db.refresh(db_scenario)
    return db_scenario

def create_game(
        start_gt_timestamp: int,
        scenario_id: int,
        ai_model: str,
        db: Session
        ):
    current_timestamp = round(datetime.datetime.now().timestamp())
    db_game = Game(
        start_gt_timestamp=start_gt_timestamp,
        start_rl_timestamp=current_timestamp,
        ai_model=ai_model,
        scenario_id=scenario_id
    )
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game


def get_game_scenario_by_id(db: Session, game_id: int):
    query = db.query(Game).outerjoin(Scenario, Game.scenario_id == Scenario.id)
    query = query.filter(Game.id == game_id)
    query = query.options(joinedload(Game.scenario))
    game = query.first()
    return game

def store_message_exchange(
        db: Session,
        policy_settings: dict,
        measured_metrics: dict,
        projected_metrics: dict,
        interpolated_metrics: dict,
        game_data: dict,
        raw_message: dict
):
    policy_settings_model = PolicySettings(
        game_id=game_data['game_id'],
        rl_timestamp=game_data['rl_timestamp'],
        **policy_settings)
    db.add(policy_settings_model)

    for day in sorted(measured_metrics.keys()):
        # there is an extra key with a string date value, skip that
        if isinstance(measured_metrics[day], dict):
            measured_metric_model = Metrics(
                game_id=game_data['game_id'],
                rl_timestamp=game_data['rl_timestamp'],
                metrics_type=MetricsType.measured,
                measurement_date=day,
                **measured_metrics[day]
            )
            db.add(measured_metric_model)
    for day in sorted(interpolated_metrics.keys()):
        interpolated_metric_model = Metrics(
            game_id=game_data['game_id'],
            rl_timestamp=game_data['rl_timestamp'],
            metrics_type=MetricsType.interpolated,
            projection_date=day,
            **interpolated_metrics[day].model_dump()
        )
        db.add(interpolated_metric_model)
    projected_metrics_model = Metrics(
        game_id=game_data['game_id'],
        rl_timestamp=game_data['rl_timestamp'],
        metrics_type=MetricsType.projected,
        **projected_metrics
    )    
    db.add(projected_metrics_model)

    raw_messages_model = RawMessages(  
        game_id=game_data['game_id'],
        rl_timestamp=game_data['rl_timestamp'],
        **raw_message
    )
    db.add(raw_messages_model)

    db.commit()
    db.refresh(policy_settings_model)
