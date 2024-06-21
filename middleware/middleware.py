from db.crud import get_game_scenario_by_id
from db.database import SessionLocal
from fastapi import HTTPException, Request, Response, Depends
from pydantic import BaseModel


def setup_accept_header(app):
    @app.middleware("http")
    async def add_accept_ch_header(request: Request, call_next):
        try:
            response = await call_next(request)
            # Set the Accept-CH header
            response.headers["Accept-CH"] = "Sec-CH-UA,Sec-CH-UA-Arch,Sec-CH-UA-Bitness,Sec-CH-UA-Full-Version-List,Sec-CH-UA-Mobile,Sec-CH-UA-Model,Sec-CH-UA-Platform,Sec-CH-UA-Platform-Version"
            return response
        except HTTPException as exc:
            # Update the headers of the exception response
            for key, value in response.headers.items():
                exc.headers[key] = value

            raise exc
    
# Each request needs an independent session
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class GameID(BaseModel):
    game_id: int

def get_game_by_id(gameId: GameID):
    db = SessionLocal()
    return get_game_scenario_by_id(db, gameId.game_id)
