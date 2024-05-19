from dotenv import load_dotenv
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# source: https://fastapi.tiangolo.com/tutorial/sql-databases

load_dotenv('../.env')

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
Base = DeclarativeBase()