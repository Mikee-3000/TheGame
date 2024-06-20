from db.database import Base, str255, MetricsType, GameType
from sqlalchemy import Boolean, ForeignKey, BigInteger, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Text
# from typing_extensions import Annotated
from typing import Annotated, Optional

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

    # one scenario has many games
    games: Mapped[list['Game']] = relationship('Game', back_populates='scenario')


class Game(Base):
    __tablename__ = 'games'

    id: Mapped[intpk]
    start_rl_timestamp: Mapped[int] = mapped_column(BigInteger)
    # not null is now the default, nullables are explicitly defined by the use of Optional
    end_rl_timestamp: Mapped[Optional[int]] = mapped_column(BigInteger)
    start_gt_timestamp: Mapped[int] = mapped_column(BigInteger)
    result: Mapped[Optional[str255]]

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

    game_time: Mapped[Optional[int]]
    real_time: Mapped[int]
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

    game_time: Mapped[Optional[int]]
    real_time: Mapped[int]

    game_id: Mapped[Optional[int]] = mapped_column(ForeignKey('games.id'))

# class Exchange(Base):
#     __tablename__ = 'exchanges'

#     id: Mapped[intpk]
#     game_id: Mapped[int] = mapped_column(ForeignKey('games.id'), nullable=False)

#     # each exchange belongs to one game
#     game: Mapped['Game'] = relationship('Game', back_populates='exchanges')
#     # each exchange can have more than one message
#     messages: Mapped['Message'] = relationship('Message', back_populates='exchange')

# class Message(Base):
#     __tablename__ = 'messages'

#     id: Mapped[intpk]
#     exchange_id: Mapped[int] = mapped_column(ForeignKey('exchanges.id'), nullable=False)
#     policy_settings_id: Mapped[int] = mapped_column(ForeignKey('policy_settings.id'), nullable=True)
#     metrics_id: Mapped[int] = mapped_column(ForeignKey('metrics.id'), nullable=True)
#     system_prompt_id: Mapped[int] = mapped_column(ForeignKey('system_prompts.id'), nullable=True)
#     rl_timestamp: Mapped[int] # real live timestamp
#     gt_timestamp: Mapped[int] # game time timestamp
#     role: Mapped[str255]
#     content: Mapped[Optional[str]]
#     message_json: Mapped[dict] = mapped_column(JSONB)

#     # each message belongs to one exchange
#     exchange: Mapped['Exchange'] = relationship('Exchange', back_populates='messages')
#     # each message can have one set of metrics and/or policy settings
#     metrics: Mapped['Metrics'] = relationship('Metrics', back_populates='message')
#     policy_settings: Mapped['PolicySettings'] = relationship('PolicySettings', back_populates='message')
#     system_prompt: Mapped['SystemPrompt'] = relationship('SystemPrompt', back_populates='messages')


# class SystemPrompt(Base):
#     __tablename__ = 'system_prompts'

    # id: Mapped[intpk]
    # content: Mapped[str] = mapped_column(Text)
    # description: Mapped[Optional[str255]]
    # game_type: Mapped[Optional[str255]]

    # one system prompt has many messages
    # messages: Mapped['Message'] = relationship('Message', back_populates='system_prompt')
    # games: Mapped['Game'] = relationship('Game', back_populates='system_prompt')