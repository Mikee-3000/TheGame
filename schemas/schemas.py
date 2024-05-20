from pydantic import BaseModel
from typing import Annotated, Optional

class Game(BaseModel):
    id: Annotated[int, 'The ID of the game']
    start_rl_timestamp: Annotated[int, 'The real life timestamp when the game started']
    end_rl_timestamp: Annotated[Optional[int], 'The real life timestamp when the game ended']
    result: Annotated[Optional[str], 'The result of the game']

    class Config:
        orm_mode = True


class Exchange(BaseModel):
    id: Annotated[int, 'The ID of the exchange']
    game_id: Annotated[int, 'The ID of the game that the exchange belongs to']

    class Config:
        orm_mode = True

class SystemPrompt(BaseModel):
    id: Annotated[int, 'The ID of the system prompt']
    content: Annotated[str, 'The content of the system prompt']

    class Config:
        orm_mode = True

class Message(BaseModel):
    id: Annotated[int, 'The ID of the message']
    exchange_id: Annotated[int, 'The ID of the exchange that the message belongs to']
    system_prompt_id: Annotated[Optional[int], 'The ID of the system prompt that the message includes']
    rl_timestamp: Annotated[int, 'The real life timestamp of the message']
    gt_timestamp: Annotated[int, 'The game time timestamp of the message']
    role: Annotated[str, 'The role of the message sender']
    content: Annotated[Optional[str], 'The content of the message']
    message_json: Annotated[dict, 'The JSON representation of the message']

    class Config:
        orm_mode = True

class Metrics(BaseModel):
    id: Annotated[int, 'The ID of the metrics']
    message_id: Annotated[int, 'The ID of the message that the metrics belong to']
    population: Annotated[int, 'The population']
    consumption: Annotated[float, 'The consumption']
    investment: Annotated[float, 'The investment']
    net_export: Annotated[float, 'The net export']
    government_incompent: Annotated[float, 'The government income']
    government_debt: Annotated[float, 'The government debt']
    money_supply: Annotated[float, 'The money supply']
    aggregate_demand: Annotated[float, 'The aggregate demand']
    inflation: Annotated[float, 'The inflation']
    unemployment_rate: Annotated[float, 'The unemployment rate']

    class Config:
        orm_mode = True

class PolicySettings(BaseModel):
    id: Annotated[int, 'The ID of the policy settings']
    message_id: Annotated[int, 'The ID of the message that the policy settings belong to']
    interest_rate: Annotated[float, 'The interest rate']
    government_spending: Annotated[float, 'The government spending']
    open_market_operations: Annotated[float, 'The open market operations']
    population_growth: Annotated[float, 'The population growth']

    class Config:
        orm_mode = True