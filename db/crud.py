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

    # return GameSchema(id=db_game.id, start_rl_timestamp=db_game.start_rl_timestamp, scenario_id=db_game.scenario_id, start_gt_timestamp=db_game.start_gt_timestamp)

# def create_policy_settings_message(metricsSchema: MetricsSchema, policySettingsSchema: PolicySettingsSchema):

#     return policy_settings_message

# def create_exchange(db: Session, game_id: int):
#     db_exchange = Exchange(game_id=game_id)
#     db.add(db_exchange)
#     db.commit()
#     db.refresh(db_exchange)
#     return db_exchange

# def create_system_prompt(db: Session, content: str):
#     # print('config is ', config.system_prompt)
#     # content = config.system_prompt.content
#     db_system_prompt = SystemPrompt(content=content)
#     db.add(db_system_prompt)
#     db.commit()
#     db.refresh(db_system_prompt)
#     return db_system_prompt

# def create_message(db: Session, exchange_id: int, system_prompt_id: int, gt_timestamp: int, role: str, content: str, message_json: dict):
#     rl_timestamp = datetime.datetime.now().timestamp()
#     db_message = Message(exchange_id=exchange_id, system_prompt_id=system_prompt_id, rl_timestamp=rl_timestamp, gt_timestamp=gt_timestamp, role=role, content=content, message_json=message_json)
#     db.add(db_message)
#     db.commit()
#     db.refresh(db_message)
#     return db_message


# def create_metrics_message():
#     calculated_metrics = {
#         'government_debt': 0
#     }
#     metrics = Metrics(**message_json)
#     pass
    # "populationGrowth": 0.004,
    # "gdp": 10150,
    # "inflationRate": 2.8,
    # "consumerConfidence": 0.85,
    # "investmentLevel": 9600,
    # "tradeBalance": -1500.3,
    # "unemploymentRate": 0.052,
    # "governmentDebt": 12000.2


    # population: Mapped[int]
    # consumption: Mapped[float]
    # investment: Mapped[float]
    # net_export: Mapped[float]
    # government_income: Mapped[float]
    # inflation: Mapped[float]
    # --
    # government_debt: Mapped[float]
    # money_supply: Mapped[float]
    # aggregate_demand: Mapped[float]
    # unemployment_rate: Mapped[float]


    # id: Annotated[int, 'The ID of the metrics']
    # population: Annotated[int, 'The population']
    # consumption: Annotated[float, 'The consumption']
    # investment: Annotated[float, 'The investment']
    # net_export: Annotated[float, 'The net export']
    # government_income: Annotated[float, 'The government income']
    # government_debt: Annotated[float, 'The government debt']
    # money_supply: Annotated[float, 'The money supply']
    # aggregate_demand: Annotated[float, 'The aggregate demand']
    # inflation: Annotated[float, 'The inflation']
    # unemployment_rate: Annotated[float, 'The unemployment rate']