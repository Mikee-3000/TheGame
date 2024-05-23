from config import config
from db.database import Base, engine, SessionLocal
from db.crud import create_game, create_exchange, create_system_prompt, create_message, create_policy_settings_message
from db.models import Game 
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from lib import client
from lib.message import system_message, talk
from pydantic import BaseModel
from schemas.schemas import Game as GameSchema, Exchange as ExchangeSchema, MetricsMessage as MetricsMessageSchema, PolicySettings as PolicySettingsSchema, SystemPrompt as SystemPromptSchema, PolicySettingsMessage as PolicySettingsMessageSchema, PolicySettingsCreate as PolicySettingsCreateSchema, GameDate as GameDateSchema
from sqlalchemy.orm import Session
import uvicorn

# Init Mistral
client.client = client.start_client()

# Create the database tables
Base.metadata.create_all(bind=engine)

# Configure the game
config.system_prompt=system_message
config.system_prompt_id=1
config.ai_model='mistral-small-latest'


# Create the FastAPI app
app = FastAPI() 

# Static has all the HTML/JS/... files
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
        game_schema = GameSchema.model_validate(game)
        return game_schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/exchange/new', response_model=ExchangeSchema)
def new_game(game: GameSchema, db: Session = Depends(db_session)):
    try:
        exchange = create_exchange(db, game.id)
        exchange_schema = ExchangeSchema.model_validate(exchange)
        return exchange_schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/systemPrompt/new', response_model=SystemPromptSchema)
def new_system_prompt(db: Session = Depends(db_session)):
    try:
        # TODO: change that it actually creates a new system prompt
        # rather than storing the one added to config
        system_prompt = create_system_prompt(db)
        system_prompt_schema = SystemPromptSchema.model_validate(system_prompt)
        return system_prompt_schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# TODO: change response model to MetricsMessageSchema
@app.post('/policy/send')
def send_policy(policySettings: PolicySettingsCreateSchema, gameData: GameDateSchema, game: GameSchema, db: Session = Depends(db_session)):
    try:
        gt_timestamp = gameData.gt_timestamp
        exchange = create_exchange(db, game.id)
        # create a new message with the policy settings
        # TODO: when system_prompt selection is implemented, use that
        # and store the message in the db
        policy_settings_message = create_policy_settings_message(db, exchange.id, gt_timestamp, 'user', policySettings) 
        # send the message to the AI and get response
        resp = talk(policy_settings_message)
        # store the response in the db
        # TODO
        # return the response
        return resp
    except Exception as e:
        print(e)
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
        