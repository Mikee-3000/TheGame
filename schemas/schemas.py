from pydantic import BaseModel
from typing import Annotated, Optional

class GameSchema(BaseModel):
    id: Annotated[int, 'The ID of the game']
    start_rl_timestamp: Annotated[int, 'The real life timestamp when the game started']
    end_rl_timestamp: Annotated[Optional[int], 'The real life timestamp when the game ended']
    result: Annotated[Optional[str], 'The result of the game']

    class Config:
        from_attributes = True


class ExchangeSchema(BaseModel):
    id: Annotated[int, 'The ID of the exchange']
    game_id: Annotated[int, 'The ID of the game that the exchange belongs to']

    class Config:
        from_attributes = True

class SystemPromptSchema(BaseModel):
    id: Annotated[int, 'The ID of the system prompt']
    content: Annotated[str, 'The content of the system prompt']

    class Config:
        from_attributes = True

class Message(BaseModel):
    id: Annotated[int, 'The ID of the message']
    exchange_id: Annotated[int, 'The ID of the exchange that the message belongs to']
    policy_settings_id: Annotated[Optional[int], 'The ID of the policy settings that the message includes']
    metrics_id: Annotated[Optional[int], 'The ID of the metrics that the message includes']
    system_prompt_id: Annotated[Optional[int], 'The ID of the system prompt that the message includes']
    rl_timestamp: Annotated[int, 'The real life timestamp of the message']
    gt_timestamp: Annotated[int, 'The game time timestamp of the message']
    role: Annotated[str, 'The role of the message sender']
    content: Annotated[Optional[str], 'The content of the message']
    message_json: Annotated[Optional[dict], 'The JSON representation of the message']

    class Config:
        from_attributes = True

class MetricsSchema(BaseModel):
    # id: Annotated[int, 'The ID of the metrics']
    # generated fields
    population: Annotated[int, 'The population']
    consumption: Annotated[float, 'The consumption']
    investment: Annotated[float, 'The investment']
    net_export: Annotated[float, 'The net export']
    government_income: Annotated[float, 'The government income']
    inflation: Annotated[float, 'The inflation']
    # calculated fields
    government_debt: Annotated[float, 'The government debt']
    money_supply: Annotated[float, 'The money supply']
    aggregate_demand: Annotated[float, 'The aggregate demand']
    unemployment_rate: Annotated[float, 'The unemployment rate']

    class Config:
        from_attributes = True

class PolicySettingsSchema(BaseModel):
    interest_rate: Annotated[float, 'The interest rate']
    government_spending: Annotated[float, 'The government spending']
    open_market_operations: Annotated[float, 'The open market operations']
    individual_tax_rate: Annotated[float, 'The individual tax rate']
    corporate_tax_rate: Annotated[float, 'The corporation tax rate']

    class Config:
        from_attributes = True

# class PolicySettings(PolicySettingsCreate):
#     id: Annotated[int, 'The ID of the policy settings']

#     class Config:
#         from_attributes = True 

# class PolicySettingsMessage(Message):
#     policy_settings: Annotated[PolicySettings, 'The policy settings of the message']

#     class Config:
#         from_attributes = True 

# class MetricsMessage(Message):
#     metrics: Annotated[Metrics, 'The metrics of the message']

#     class Config:
#         from_attributes = True

class GameDataSchema(BaseModel):
    gt_timestamp: Annotated[int, 'The game time timestamp']

    class Config:
        from_attributes = True 