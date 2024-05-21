from db.database import Base, engine, SessionLocal
from db.crud import create_game, create_exchange
from db.models import Game 
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from lib import client
from pydantic import BaseModel
from schemas.schemas import Game as GameSchema, Exchange as ExchangeSchema
from sqlalchemy.orm import Session
import uvicorn

# Init Mistral
client.client = client.start_client()

# Create the database tables
Base.metadata.create_all(bind=engine)


app = FastAPI() 
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Each request needs an independent session
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Metrics(BaseModel):
    population: int
    interestRate: float
    govtSpending: float
    taxRate: float
    moneySupply: float
    foodImport: bool
    gdp: float
    inflationRate: float
    consumerConfidence: float
    investmentLevel: float
    tradeBalance: float
    governmentDebt: float
    unemploymentRate: float
    populationGrowth: float


@app.post('/game/new', response_model=GameSchema)
def new_game(db: Session = Depends(db_session)):
    try:
        game = create_game(db)
        gameSchema = GameSchema.model_validate(game)
        return gameSchema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/exchange/new', response_model=ExchangeSchema)
def new_game(game: GameSchema, db: Session = Depends(db_session)):
    try:
        exchange = create_exchange(db, game.id)
        exchangeSchema = ExchangeSchema.model_validate(exchange)
        return exchangeSchema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @app.get("/", response_class=HTMLResponse)
# async def root(request: Request):
#     return templates.TemplateResponse(
#         request=request, name="index.html", context={"id": id}
#     )

# @app.post('/send_metrics')
# async def send_metrics(metrics: Metrics):
#     try:
#         resp = await client.send_metrics(metrics)
#         return JSONResponse(content=resp)
#     except Exception as e:
#         print(e)
#         print(resp)
#         print(metrics)
#         raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "app:app", 
        host="127.0.0.1", port=8080, log_level="debug", reload="true"
    )
        