from datetime import datetime as dt
from dotenv import load_dotenv
load_dotenv('.env')
from db.crud import *
from db.database import Base, engine
from db.models import Game
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
import json
from lib import client
from lib.message import talk
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
                metrics: dict[str, dict] = Depends(dated_metrics_dict),
                db: Session = Depends(db_session),
                game: Game = Depends(get_game_by_id)
):
    try:
        # convert the object into a dict
        policy_settings = policySettings.model_dump()
        policy_and_metrics = json.dumps({
            **policy_settings,
            **metrics
        })
        # create the prompt for the LLM
        user_message = ChatMessage(role='user', content=policy_and_metrics)
        system_message = ChatMessage(role='system', content=game.scenario.system_prompt)
        try:
            # send it to the LLM
            metrics_response, raw_llm_response = talk(
                user_message=user_message,
                system_message=system_message,
                model=game.ai_model
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str("103" + e))
        metrics_response['gt_timestamp'] = dt.strptime(metrics_response['projection_date'], '%Y-%m-%d').timestamp()
        game_data = {'game_id': game.id, 'rl_timestamp': game.rl_timestamp}

        raw_messages = {
            'user_message': str(user_message),
            'system_message': str(system_message),
            'raw_llm_response': str(raw_llm_response),
            'model': game.ai_model
        }

        # create a value for every day using linear interpolation
        interpolated_metrics = MetricsSchema.interpolate(
            metrics[metrics['current_game_date']],
            metrics_response,
        )
        # everything gets stored in the db
        store_message_exchange(
            db=db,
            policy_settings=policy_settings,
            measured_metrics=metrics,
            projected_metrics=metrics_response,
            interpolated_metrics=interpolated_metrics,
            game_data=game_data,
            raw_message=raw_messages
        )
        api_response = {
            **interpolated_metrics,
            metrics_response['projection_date']: metrics_response
        }
        return api_response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

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
