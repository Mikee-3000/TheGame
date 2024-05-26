# from mistralai.models.chat_completion import ChatMessage
from config import config
import json
from schemas.schemas import *
import datetime 

# def create_policy_settings_message(metricsSchema: MetricsSchema, policySettingsSchema: PolicySettingsSchema):

#     return policy_settings_message

# def create_game(db: Session):
#     current_timestamp = datetime.datetime.now().timestamp()
#     db_game = Game(start_rl_timestamp=current_timestamp)
#     db.add(db_game)
#     db.commit()
#     db.refresh(db_game)
#     return db_game

# def create_exchange(db: Session, game_id: int):
#     db_exchange = Exchange(game_id=game_id)
#     db.add(db_exchange)
#     db.commit()
#     db.refresh(db_exchange)
#     return db_exchange

# def create_system_prompt(db: Session):
#     print('config is ', config.system_prompt)
#     content = config.system_prompt.content
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