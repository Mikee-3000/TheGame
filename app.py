from config import config
from db.database import Base, engine, SessionLocal
from db.crud import *
# from db.crud import create_game, create_exchange, create_system_prompt, create_message, create_policy_settings_message
from db.models import Game 
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
import json
from lib import client
from lib.message import system_message, talk
from mistralai.models.chat_completion import ChatMessage
from pydantic import BaseModel
from schemas.schemas import *
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

@app.post('/game/new', response_model=GameSchema)
def new_game(game_create_schema: GameCreateSchema, db: Session = Depends(db_session)):
    try:
        game_schema = create_game(game_create_schema.system_prompt_id, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/systemPrompt/new/', response_model=SystemPromptSchema)
def new_system_prompt(systemPromptSchema: SystemPromptSchema, db: Session = Depends(db_session)):
    """
    Creates a new system prompt in the database
    """
    try:
        system_prompt = create_system_prompt(db, systemPromptSchema.content)
        system_prompt_schema = SystemPromptSchema.model_validate(system_prompt)
        return system_prompt_schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# TODO: change response model to MetricsMessageSchema
@app.post('/set-policy', response_model=MetricsComputedSchema)
# @app.post('/set-policy')
def send_policy(policySettings: PolicySettingsSchema, metrics: MetricsCompleteSchema, gameData: GameDataSchema , db: Session = Depends(db_session)):
    try:
        gt_timestamp = gameData.gt_timestamp
        # exchange = create_exchange(db, game.id)
        # create a new message with the policy settings
        # TODO: when system_prompt selection is implemented, use that
        # and store the message in the db
        # policy_settings_message = create_policy_settings_message(db, exchange.id, gt_timestamp, 'user', policySettings) 
        # send the message to the AI and get response
        policy_settings_message = {}
        policy_settings_message['model'] = config.ai_model
        policy_and_metrics = json.dumps({
            **policySettings.model_dump(),
            **metrics.model_dump()
        })
        policy_settings_message['messages'] = [
            system_message,
            ChatMessage(role='user', content=policy_and_metrics)]
        try:
            metrics_response, message_content = talk(policy_settings_message)
            metrics_response['previous_government_debt'] = metrics.government_debt
            metrics_response['government_spending'] = policySettings.government_spending
        except Exception as e:
            raise HTTPException(status_code=500, detail=str("103" + e))
        # store the response in the db
        # TODO
        # return the response
        response = MetricsComputedSchema.model_validate(metrics_response)
        return response
        # return message_json
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
