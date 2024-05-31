from pydantic import BaseModel, field_validator, ValidationInfo, computed_field
from typing import Annotated, Optional

class SystemPromptSchema(BaseModel):
    id: Annotated[Optional[int], 'The ID of the system prompt'] = None
    content: Annotated[str, 'The content of the system prompt']

    class Config:
        from_attributes = True

class GameCreateSchema(BaseModel):
    system_prompt_id: Annotated[int, 'The ID of the system prompt']

    class Config:
        from_attributes = True

class GameSchema(GameCreateSchema):
    id: Annotated[int, 'The ID of the game']
    start_rl_timestamp: Annotated[int, 'The real life timestamp when the game started']
    end_rl_timestamp: Annotated[Optional[int], 'The real life timestamp when the game ended']
    system_prompt_schema: Annotated[SystemPromptSchema, 'The system prompt schema']
    result: Annotated[Optional[str], 'The result of the game']

    class Config:
        from_attributes = True


class ExchangeSchema(BaseModel):
    id: Annotated[int, 'The ID of the exchange']
    game_id: Annotated[int, 'The ID of the game that the exchange belongs to']

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
    unemployment_rate: Annotated[float, 'The unemployment rate']
    money_supply: Annotated[float, 'The money supply']

    class Config:
        from_attributes = True

class MetricsCompleteSchema(MetricsSchema):
    government_debt: Annotated[float, 'The government debt']
    aggregate_demand: Annotated[float, 'The aggregate demand']

class MetricsComputedSchema(MetricsSchema):
    previous_government_debt: Annotated[float, 'The previous government debt']
    government_spending: Annotated[float, 'The government spending']

    @computed_field
    @property
    def government_debt(self) -> float:
        return self.previous_government_debt - self.government_income + self.government_spending
    
    @computed_field
    @property
    def aggregate_demand(self) -> float:
        return self.consumption + self.investment + self.net_export + self.government_spending

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