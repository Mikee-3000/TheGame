from dotenv import load_dotenv
load_dotenv('.env')
from db.database import Base, engine
from db.crud import *
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
import json
from lib import client
from lib.message import system_message, talk
from middleware.middleware import *
from mistralai.models.chat_completion import ChatMessage
from pydantic import BaseModel
from schemas.schemas import *
from sqlalchemy.orm import Session
import uvicorn

# Init Mistral
client.client = client.start_client()

# Create the database tables
Base.metadata.create_all(bind=engine)

# Create the FastAPI app
app = FastAPI()

setup_accept_header(app)

# Static has all the HTML/JS/... files
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# api endpoints

# start a new game
# needs a reference to the system prompt
# initial policy settings
# game time date
# real life datetime

@app.post('/scenario/new', response_model=ScenarioSchema)
async def new_scenario(scenario_schema: ScenarioSchema, db: Session = Depends(db_session)):
    try:
        scenario = create_scenario(db, scenario_schema)
        return scenario
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/game/new', response_model=GameSchema)
async def new_game(game_create_schema: GameCreateSchema, db: Session = Depends(db_session)):
    try:
        game_schema = create_game(
            start_gt_timestamp=game_create_schema.start_gt_timestamp,
            scenario_id=game_create_schema.scenario_id,
            ai_model=game_create_schema.ai_model,
            db=db
        )
        return game_schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @app.post('/set-policy', response_model=MetricsSchema)
@app.post('/set-policy')
def send_policy(policySettings: PolicySettingsSchema,
                metrics: list[MetricsSchema],
                db: Session = Depends(db_session),
                game: GameScenarioSchema = Depends(get_game_by_id)
):
    return game
    # try:
        
    #     policy_settings_message = {}
    #     policy_settings_message['model'] = config.ai_model
    #     policy_and_metrics = json.dumps({
    #         **policySettings.model_dump(),
    #         **metrics.model_dump()
    #     })
    #     policy_settings_message['messages'] = [
    #         system_message,
    #         ChatMessage(role='user', content=policy_and_metrics)]
    #     try:
    #         metrics_response, message_content = talk(policy_settings_message)
    #         metrics_response['previous_government_debt'] = metrics.government_debt
    #         metrics_response['government_spending'] = policySettings.government_spending
    #     except Exception as e:
    #         raise HTTPException(status_code=500, detail=str("103" + e))
    #     # store the response in the db
    #     # TODO
    #     # return the response
    #     response = MetricsComputedSchema.model_validate(metrics_response)
    #     return response
    #     # return message_json
    # except Exception as e:
    #     print(e)
    #     raise HTTPException(status_code=500, detail=str(e))

@app.get("/", response_class=HTMLResponse)
async def root(request: Request, response: Response):
    return templates.TemplateResponse(
        request=request, name="index.html", context={"id": id}
    )


if __name__ == "__main__":
    uvicorn.run(
        "app:app", 
        host="0.0.0.0", port=8080, log_level="debug", reload="true"
    )

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

# @app.post('/game/new', response_model=GameSchema)
# def new_game(game_create_schema: GameCreateSchema, db: Session = Depends(db_session)):
#     try:
#         game_schema = create_game(game_create_schema.system_prompt_id, db)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post('/systemPrompt/new/', response_model=SystemPromptSchema)
# def new_system_prompt(systemPromptSchema: SystemPromptSchema, db: Session = Depends(db_session)):
#     """
#     Creates a new system prompt in the database
#     """
#     try:
#         system_prompt = create_system_prompt(db, systemPromptSchema.content)
#         system_prompt_schema = SystemPromptSchema.model_validate(system_prompt)
#         return system_prompt_schema
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))