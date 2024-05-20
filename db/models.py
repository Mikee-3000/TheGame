from db.base_class import Base
from sqlalchemy import Boolean, ForeignKey, JSON, String, BigInteger, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
# from typing_extensions import Annotated
from typing import Annotated, Optional

# sources:
# - https://fastapi.tiangolo.com/tutorial/sql-databases
# - https://docs.sqlalchemy.org/en/20/changelog/whatsnew_20.html


# often used field presets
intpk = Annotated[int, mapped_column(primary_key=True, autoincrement=True)]
msgfk = Annotated[str, mapped_column(ForeignKey("messages.id"), nullable=False)]


class Game(Base):
    __tablename__ = "games"

    id: Mapped[intpk]
    start_rl_timestamp: Mapped[BigInteger]
    # not null is now the default, nullables are explicitly defined by the use of Optional
    end_rl_timestamp: Mapped[Optional[BigInteger]]
    result: Mapped[str255]

    # one game has many exchanges
    exchanges = relationship("Exchange", back_populates="game")


class Exchange(Base):
    __tablename__ = "exchanges"

    id: Mapped[intpk]
    game_id = Annotated[int, mapped_column(ForeignKey("games.id"), nullable=False)]

    # each exchange belongs to one game
    game = relationship("Game", back_populates="exchanges")


class SystemPrompt(Base):
    __tablename__ = "system_prompts"

    id: Mapped[intpk]
    content: Mapped[str255]

    # one system prompt has many exchanges
    exchanges = relationship("Exchange", back_populates="system_prompt")


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[intpk]
    exchange_id = Annotated[int, mapped_column(ForeignKey("exchanges.id"), nullable=False)]
    system_prompt_id = Annotated[int, mapped_column(ForeignKey("system_prompts.id"), nullable=True)]
    rl_timestamp: Mapped[BigInteger] # real live timestamp
    gt_timestamp: Mapped[BigInteger] # game time timestamp
    role: Mapped[str255]
    content: Mapped[Optional[Text]]
    message_json: Mapped[JSON]

    # each message belongs to one exchange
    exchange = relationship("Exchange", back_populates="messages")
    # each message can have one set of metrics or policy settings
    metrics = relationship("Metrics", back_populates="message")
    policy_settings = relationship("PolicySettings", back_populates="message")


class Metrics(Base):
    __tablename__ = "metrics"

    id: Mapped[intpk]
    message_id = Mapped[msgfk]
    population: Mapped[int]
    consumption: Mapped[float]
    investment: Mapped[float]
    net_export: Mapped[float]
    government_income: Mapped[float]
    government_debt: Mapped[float]
    money_supply: Mapped[float]
    aggregate_demand: Mapped[float]
    inflation: Mapped[float]

    # each metric belongs to one message
    message = relationship("Message", back_populates="metrics")

class PolicySettings(Base):
    __tablename__ = "policy_settings"

    id: Mapped[intpk]
    message_id = Mapped[msgfk]
    intereset_rate: Mapped[float]
    govenment_spending: Mapped[float]
    open_market_operations: Mapped[float]
    individal_tax_rate: Mapped[float]
    corporate_tax_rate: Mapped[float]

    # each policy setting belongs to one message
    message = relationship("Message", back_populates="policy_settings")
