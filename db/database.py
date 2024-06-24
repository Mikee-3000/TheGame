from dotenv import load_dotenv
import os
from enum import Enum
from sqlalchemy import create_engine, String, URL, Enum as SQLAlchemyEnum
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from typing import Annotated

# source: https://fastapi.tiangolo.com/tutorial/sql-databases


str255 = Annotated[str, 255]
class MetricsType(Enum):
    measured = 'measured'
    projected = 'projected'
    interpolated = 'interpolated'

class GameType(Enum):
    Keynes = 'Keynes'
    Marx = 'Marx'
    Smith = 'Smith'

url_object = URL.create(
    'postgresql',
    username=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    host=os.getenv('DB_HOST'),
    database=os.getenv('DB_NAME')
)

# Engine provides the source of DB connectivity
engine = create_engine(url_object)

# Create a session factory, this will be used to create a session objects,
# one object for each request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the base class, from which all the models will inherit
class Base(DeclarativeBase):
    type_annotation_map = {
        # enables type oriented mapping for models
        str255: String(255),
        MetricsType: SQLAlchemyEnum(MetricsType, name='metrics_type'),
        GameType: SQLAlchemyEnum(GameType, name='game_type')
    }