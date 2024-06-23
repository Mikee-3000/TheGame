from db.database import GameType
from pydantic import BaseModel, field_validator, ValidationInfo, computed_field, Field
from typing import Annotated, Optional


class ScenarioSchema(BaseModel):
    id: Annotated[Optional[int], 'The ID of the scenario'] = None
    name: Annotated[str, 'The name of the scenario']
    description: Annotated[str, 'The description of the scenario']
    game_type: Annotated[GameType, 'The game type of the scenario, e.g. Keynes, Marx, Smith']
    system_prompt: Annotated[str, 'The system prompt of the scenario']

    # enable default values in class attributes
    class Config:
        from_attributes = True

class GameCreateSchema(BaseModel):
    start_gt_timestamp: Annotated[Optional[int], 'The game time timestamp of the game']
    scenario_id: Annotated[int, 'The ID of the scenario']
    ai_model: Annotated[str, 'The AI model of the game']

    class Config:
        from_attributes = True

class GameSchema(GameCreateSchema):
    id: Annotated[Optional[int], 'The ID of the game']
    start_rl_timestamp: Annotated[Optional[int], 'The real life timestamp when the game started']
    end_rl_timestamp: Annotated[Optional[int], 'The real life timestamp when the game ended']
    result: Annotated[Optional[str], 'The result of the game']

    class Config:
        from_attributes = True

class GameScenarioSchema(GameSchema):
    scenario: Annotated[ScenarioSchema, 'The scenario of the game']
    rl_timestamp: Annotated[int, 'The real life timestamp of the game']

class MetricsSchema(BaseModel):
    id: Annotated[Optional[int], 'The ID of the metrics'] = None
    gt_timestamp: Annotated[Optional[int], 'The game time timestamp']
    population: Annotated[int, 'The population']
    consumption: Annotated[float, 'The consumption']
    investment: Annotated[float, 'The investment']
    net_export: Annotated[float, 'The net export']
    government_income: Annotated[float, 'The government income']
    inflation: Annotated[float, 'The inflation']
    unemployment_rate: Annotated[float, 'The unemployment rate']
    money_supply: Annotated[float, 'The money supply']
    government_debt: Annotated[float, 'The government debt']
    aggregate_demand: Annotated[float, 'The aggregate demand']

    class Config:
        from_attributes = True


class PolicySettingsSchema(BaseModel):
    # id: Annotated[Optional[int], 'The ID of the metrics'] = None
    interest_rate: Annotated[float, 'The interest rate']
    government_spending: Annotated[float, 'The government spending']
    open_market_operations: Annotated[float, 'The open market operations']
    individual_tax_rate: Annotated[float, 'The individual tax rate']
    corporate_tax_rate: Annotated[float, 'The corporation tax rate']
    gt_timestamp: Annotated[Optional[int], 'The game time timestamp']

    class Config:
        from_attributes = True
