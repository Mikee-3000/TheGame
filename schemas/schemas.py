from datetime import datetime as dt
from datetime import timedelta
from db.database import GameType
import inspect
from lib.interpolation import interpolate
from pydantic import BaseModel, field_validator, ValidationInfo, computed_field, Field
from typing import Annotated, Optional, get_type_hints


class ScenarioSchema(BaseModel):
    id: Annotated[Optional[int], 'The ID of the scenario'] = None
    name: Annotated[str, 'The name of the scenario']
    description: Annotated[str, 'The description of the scenario']
    game_type: Annotated[GameType, 'The game type of the scenario, e.g. Keynes, Marx, Smith']
    system_prompt: Annotated[str, 'The system prompt of the scenario']
    initial_system_prompt: Annotated[str, 'The initial system prompt of the scenario']
    imageURL: Annotated[str, 'The URL of the image of the scenario']

    # enable default values in class attributes
    class Config:
        from_attributes = True

class GameCreateSchema(BaseModel):
    start_gt_timestamp: Annotated[Optional[int], 'The game time timestamp of the game']
    # ai_model: Annotated[str, 'The AI model of the game']
    scenario_id: Annotated[int, 'The ID of the scenario']

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
    # id: Annotated[Optional[int], 'The ID of the metrics'] = None
    gt_timestamp: Annotated[Optional[int], 'The game time timestamp']
    population: Annotated[int, 'The population', 'Interpolation']
    consumption: Annotated[float, 'The consumption', 'Interpolation']
    investment: Annotated[float, 'The investment', 'Interpolation']
    net_export: Annotated[float, 'The net export', 'Interpolation']
    government_income: Annotated[float, 'The government income', 'Interpolation']
    inflation: Annotated[float, 'The inflation', 'Interpolation']
    unemployment_rate: Annotated[float, 'The unemployment rate', 'Interpolation']
    money_supply: Annotated[float, 'The money supply', 'Interpolation']
    government_debt: Annotated[float, 'The government debt', 'Interpolation']
    aggregate_demand: Annotated[float, 'The aggregate demand', 'Interpolation']

    class Config:
        from_attributes = True

    @classmethod
    def interpolate(cls, start_metrics: dict, end_metrics: dict):
        day_metrics = {}
        start_ts = dt.fromtimestamp(start_metrics['gt_timestamp'])
        end_ts = dt.fromtimestamp(end_metrics['gt_timestamp'])
        # the amount of days not including the start day or the end day
        days = (end_ts - start_ts).days
        interpolated_metrics = {}
        # this ensures that interpolation only happens for fields that have the 'Interpolation' annotation, so excluding the id and timestamp
        annotations = inspect.get_annotations(cls)
        interpolated_fields = [f for f in annotations if 'Interpolation' in annotations[f].__metadata__]
        for f in interpolated_fields:
            interpolated_metrics[f] = interpolate(
                start_metrics[f],
                end_metrics[f],
                days + 1, # the "interpolation" for the end day is the same as the projection, but the dates need to match
                get_type_hints(cls)[f]
            )
        # change the lists of values into a metrics object for each day 
        for day in range(1, days): # skip the first day, as it is the same as the start metrics
            dt_day = start_ts + timedelta(days=day)
            dt_timestamp = dt_day.timestamp()
            dt_day_str = dt_day.strftime('%Y-%m-%d')
            daily_values = {f: interpolated_metrics[f][day] for f in interpolated_fields}
            daily_values['gt_timestamp'] = dt_timestamp
            day_metric = cls(**daily_values)
            day_metrics[dt_day_str] = day_metric
        return day_metrics


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

    @classmethod
    def create(cls,
               interest_rate: float = 0,
               government_spending: float = 0,
               open_market_operations: float = 0,
               individual_tax_rate: float = 0,
               corporate_tax_rate: float = 0,
               gt_timestamp: Optional[int] = None
    ):
        return cls(
            interest_rate = interest_rate,
            government_spending = government_spending,
            open_market_operations = open_market_operations,
            individual_tax_rate = individual_tax_rate,
            corporate_tax_rate = corporate_tax_rate,
            gt_timestamp = gt_timestamp
        )

class MetricsForStateSaveSchema(BaseModel):
   gtTimestamp: Annotated[int, 'The game time timestamp']
   aggregateDemand: Annotated[float, 'The aggregate demand']
   consumption: Annotated[float, 'The consumption']
   governmentDebt: Annotated[float, 'The government debt']
   governmentIncome: Annotated[float, 'The government income']
   inflation: Annotated[float, 'The inflation']
   investment: Annotated[float, 'The investment']
   moneySupply: Annotated[float, 'The money supply']
   netExport: Annotated[float, 'The net export']
   population: Annotated[int, 'The population']
   unemploymentRate: Annotated[float, 'The unemployment rate']

class PolicySettingsForStateSaveSchema(BaseModel):
    corporateIncomeTaxRate: Annotated[float, 'The corporate income tax rate']
    governmentSpending: Annotated[float, 'The government spending']
    individualIncomeTaxRate: Annotated[float, 'The individual income tax rate']
    interestRate: Annotated[float, 'The interest rate']
    openMarketOperations: Annotated[float, 'The open market operations']

class GameStateSchema(BaseModel):
    scenarioId: Annotated[int, 'The ID of the scenario']
    gameDayInSeconds: Annotated[int, 'The duration of a single game day in seconds']
    startTimestamp: Annotated[int, 'The start timestamp of the game']
    currentTimestamp: Annotated[int, 'The end timestamp of the game']
    currentDate: Annotated[str, 'The current date, YYYY-MM-DD']
    endTimestamp: Annotated[int, 'The end timestamp of the game']
    endDate: Annotated[str, 'The end date, YYYY-MM-DD']
    lastTenDays: Annotated[list[str], 'The dates of the last ten days']
    mistralApiKey: Annotated[Optional[str], 'The Mistral API key'] = None
    metrics: Annotated[dict[str, MetricsForStateSaveSchema], 'The metrics for each day']
    policySettings: Annotated[PolicySettingsForStateSaveSchema, 'The policy settings']
    result: Annotated[Optional[str], 'The result of the game'] = None
    gameId: Annotated[Optional[int], 'The ID of the game'] = None
    llmRoundTripTimes: Annotated[Optional[list[float]], 'Recorded round trip times of the LLM requests'] = None
    llmAverageRoundTripTime: Annotated[Optional[float], 'Average round trip time of the LLM requests'] = None
    llmAverageRoundTripTimeInGameDays: Annotated[Optional[float], 'Average round trip time of the LLM requests in game days'] = None
    failedLlmCalls: Annotated[Optional[int], 'Number of failed LLM calls'] = None
    yesterday: Annotated[Optional[str], 'The date of yesterday in game days'] = None

class GameStateIdSchema(BaseModel):
    game_state_id: Annotated[str, 'ID of the saved game state']
