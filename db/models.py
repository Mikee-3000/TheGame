from db.base_class import Base
from sqlalchemy import Boolean, ForeignKey, Integer, String, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing_extensions import Annotated

# sources:
# - https://fastapi.tiangolo.com/tutorial/sql-databases
# - https://docs.sqlalchemy.org/en/20/changelog/whatsnew_20.html

str50 = Annotated[str, 50]
str255 = Annotated[str, 255]

class User(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    start_rl_timestamp: Mapped[BigInteger] = mapped_column()
    end_rl_timestamp: Mapped[BigInteger]
    result: Mapped[str255]
