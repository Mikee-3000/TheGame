from theGame.db.database import Base, str255, str5000, MetricsType, GameType
from sqlalchemy import Boolean, ForeignKey, BigInteger, Text, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Text
# from typing_extensions import Annotated
from typing import Annotated, Optional
import uuid

# sources:
# - https://fastapi.tiangolo.com/tutorial/sql-databases
# - https://docs.sqlalchemy.org/en/20/changelog/whatsnew_20.html


# often used field presets
intpk = Annotated[int, mapped_column(primary_key=True, autoincrement=True)]


class Scenario(Base):
    __tablename__ = 'scenarios'

    id: Mapped[intpk]
    name: Mapped[str255]
    description: Mapped[str255]
    game_type: Mapped[GameType]
    system_prompt: Mapped[str] = mapped_column(Text)
    initial_system_prompt: Mapped[str] = mapped_column(Text)
    start_image_url: Mapped[str255]
    win_image_url: Mapped[str255]
    lose_image_url: Mapped[str255]

    # one scenario has many games
    games: Mapped[list['Game']] = relationship('Game', back_populates='scenario')

class GameState(Base):
    __tablename__ = 'game_states'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    data: Mapped[dict] = mapped_column(JSONB)

class Game(Base):
    __tablename__ = 'games'

    id: Mapped[intpk]
    ai_model: Mapped[str255]
    start_rl_timestamp: Mapped[int] = mapped_column(BigInteger)
    # not null is now the default, nullables are explicitly defined by the use of Optional
    end_rl_timestamp: Mapped[Optional[int]] = mapped_column(BigInteger)
    start_gt_timestamp: Mapped[int] = mapped_column(BigInteger)
    result: Mapped[Optional[str255]]
    verdict: Mapped[Optional[str5000]]

    scenario_id: Mapped[int] = mapped_column(ForeignKey('scenarios.id'), nullable=False)
    scenario: Mapped['Scenario'] = relationship('Scenario', back_populates='games')


class Metrics(Base):
    __tablename__ = 'metrics'

    id: Mapped[intpk]
    population: Mapped[int]
    consumption: Mapped[float]
    investment: Mapped[float]
    net_export: Mapped[float]
    government_income: Mapped[float]
    inflation: Mapped[float]
    unemployment_rate: Mapped[float]
    money_supply: Mapped[float]
    government_debt: Mapped[float]
    aggregate_demand: Mapped[float]

    gt_timestamp: Mapped[int] = mapped_column(BigInteger)
    rl_timestamp: Mapped[int] = mapped_column(BigInteger)
    projection_date: Mapped[Optional[str255]]
    measurement_date: Mapped[Optional[str255]]
    metrics_type: Mapped[MetricsType]
    
    game_id: Mapped[Optional[int]] = mapped_column(ForeignKey('games.id'))


    # each metric belongs to one message
    # message: Mapped['Message'] = relationship('Message', back_populates='metrics')

class PolicySettings(Base):
    __tablename__ = 'policy_settings'

    id: Mapped[intpk]
    interest_rate: Mapped[float]
    government_spending: Mapped[float]
    open_market_operations: Mapped[float]
    individual_tax_rate: Mapped[float]
    corporate_tax_rate: Mapped[float]

    gt_timestamp: Mapped[int] = mapped_column(BigInteger)
    rl_timestamp: Mapped[int] = mapped_column(BigInteger)

    game_id: Mapped[Optional[int]] = mapped_column(ForeignKey('games.id'))

class RawMessages(Base):
    __tablename__ = 'raw_messages'

    id: Mapped[intpk]
    user_message: Mapped[str] = mapped_column(Text)
    system_message: Mapped[str] = mapped_column(Text)
    raw_llm_response: Mapped[str] = mapped_column(Text)
    model: Mapped[str255]

    rl_timestamp: Mapped[int] = mapped_column(BigInteger)

    game_id: Mapped[Optional[int]] = mapped_column(ForeignKey('games.id'))