from datetime import datetime as dt
from dotenv import load_dotenv
load_dotenv('.env')
from theGame.db.crud import *
from theGame.db.crud import get_scenario_by_id as get_scenario_by_id_crud
from theGame.db.database import Base, engine
from theGame.db.models import Game
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
import json
from theGame.lib import client
from theGame.lib.message import talk, get_game_result
from theGame.middleware.middleware import *
from mistralai.models.chat_completion import ChatMessage
import os
from pydantic import BaseModel
from theGame.schemas.schemas import *
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

# test added
@app.post('/scenario/new-from-json')
def new_scenario_from_json(db: Session = Depends(db_session)):
    try:
        create_scenarios_from_json(db)
        return JSONResponse(content={'status': 'success'})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# test added
@app.get('/game/{scenario_id}', response_class=HTMLResponse)
def start_game(
    request: Request,
    response: Response,
    scenario_id: int,
    db: Session = Depends(db_session)
):
    try:
        scenario = get_scenario_by_id_crud(db, scenario_id)
        return templates.TemplateResponse(
            request=request, name="new_scene.jinja2", context={"id": id, "scenario": scenario, "game_state": None}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# test added
@app.get('/game/load/{game_state_id}', response_class=HTMLResponse)
def load_game(
    request: Request,
    response: Response,
    game_state_id: str,
    db: Session = Depends(db_session)
):
    try: 
        game_state = get_game_state_by_id(db, game_state_id)
        if game_state is None:
            raise HTTPException(status_code=404, detail='Game state not found')
        scenario_id = game_state.data['scenarioId']
        scenario = get_scenario_by_id_crud(db, scenario_id)
        json_data = json.dumps(game_state.data)
        return templates.TemplateResponse(
            request=request, name="new_scene.jinja2", context={"id": id, "scenario": scenario, "game_state": json_data}
        )
    except Exception as e:
        scenarios = get_all_scenarios(db)
        return templates.TemplateResponse(
            request=request, name="game_selection.jinja2", context={"id": id, "scenarios": scenarios, "announcement": "A game with the specified ID was not found. Please make sure your token is correct."}
        )

# test added
@app.post('/game/new')
def new_game(
    game: GameCreateSchema,
    scenario: ScenarioSchema = Depends(get_scenario_by_id),
    db: Session = Depends(db_session),
    ):
    # raise HTTPException(status_code=500, detail='mock exception')
    try:
        # request the initial metrics and policy settings from the LLLM
        # game_time_str = dt.strftime(dt.fromtimestamp(game.start_gt_timestamp), '%Y-%m-%d')
        game_time_str = dt.strftime(dt.utcfromtimestamp(game.start_gt_timestamp), '%Y-%m-%d')
        user_prompt = f"The game is starting, the game date is {game_time_str}. Please provide 2 sets of metrics - one for the game date and one for 30 days from the game date."
        user_message = ChatMessage(role='user', content=user_prompt)
        system_message = ChatMessage(role='system', content=scenario.initial_system_prompt)
        metrics_response, raw_llm_response = talk(
            user_message=user_message,
            system_message=system_message,
            model=os.environ['MISTRAL_MODEL'],
            expected_metrics_amount=2
        )
        # add timestamp to the metrics based on the projection dates
        [
            m.update({'gt_timestamp': dt.strptime(m['projection_date'], '%Y-%m-%d').timestamp()})
            for m in metrics_response
        ]
        # create interpolated metrics
        interpolated_metrics = MetricsSchema.interpolate(metrics_response[0], metrics_response[1])
        game_object = create_game(
            start_gt_timestamp=game.start_gt_timestamp,
            scenario_id=scenario.id,
            ai_model=os.environ['MISTRAL_MODEL'],
            db=db
        )
        game_data = {'game_id': game_object.id, 'rl_timestamp': game_object.start_rl_timestamp}
        raw_messages = {
            'user_message': str(user_message),
            'system_message': str(system_message),
            'raw_llm_response': str(raw_llm_response),
            'model': os.environ['MISTRAL_MODEL']
        }
        store_message_exchange(
            db=db,
            policy_settings=PolicySettingsSchema.create(
                0.0, 0.0, 0.0, 0.0, 0.0,
                game.start_gt_timestamp
        ).model_dump(),
            initial_metrics=metrics_response[0],
            projected_metrics=metrics_response[1],
            interpolated_metrics=interpolated_metrics,
            game_data=game_data,
            raw_message=raw_messages
        )
        return {'game': game_data, 'metrics': {
            metrics_response[0]['projection_date']: metrics_response[0],
            **interpolated_metrics,
            metrics_response[1]['projection_date']: metrics_response[1]
            }}
    except Exception as e:
        # print(e)
        raise HTTPException(status_code=500, detail=str(e))

# test added
@app.post('/win-lose')
def win_lose(
    end_game_data: EndGameSchema,
    db: Session = Depends(db_session
)):
    scenario = get_scenario_by_id_crud(db, end_game_data.scenarioId)
    system_prompt = f'''
    You are an AI game engine, finetuned in economics as described by {scenario.name}.You are being sent 2 sets of economic metrics, one from the start of the game and one from the end. You are to judge whether the player won or lost. Please start your response with either "WON" or "LOST" followed by a brief explanation.
    '''
    user_prompt = end_game_data.model_dump_json()
    system_message = ChatMessage(role='system', content=system_prompt)
    user_message = ChatMessage(role='user', content=user_prompt)
    try:
        # send it to the LLM
        judgment = get_game_result(
            user_message=user_message,
            system_message=system_message,
            model=os.environ['MISTRAL_MODEL']
        )
    except Exception as e:
        print(181)
        raise HTTPException(status_code=500, detail=str(e))
    result = judgment['result']
    verdict = judgment['verdict']
    raw = judgment['raw']
    raw_messages = {
        'user_message': str(user_message),
        'system_message': str(system_message),
        'raw_llm_response': str(raw),
        'model': os.environ['MISTRAL_MODEL']
    }
    store_end_game_exchange(db, end_game_data.gameId, raw_messages)
    game = update_game_by_id(db, end_game_data.gameId, result, verdict)
    return {
        'result': result,
        'verdict': verdict
    }

# test added
@app.post('/set-policy')
def send_policy(policySettings: PolicySettingsSchema,
                metrics: dict[str, dict] = Depends(dated_metrics_dict),
                db: Session = Depends(db_session),
                game: Game = Depends(get_game_by_id)
):
    # raise HTTPException(status_code=500, detail='mock exception')
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
            metrics_response_list, raw_llm_response = talk(
                user_message=user_message,
                system_message=system_message,
                model=os.environ['MISTRAL_MODEL']
            )
            # print(162)
            # print(metrics_response_list)
            metrics_response = metrics_response_list[0]
        except Exception as e:
            # print(166)
            raise HTTPException(status_code=500, detail=str(e))
        metrics_response['gt_timestamp'] = dt.strptime(metrics_response['projection_date'], '%Y-%m-%d').timestamp()
        game_data = {'game_id': game.id, 'rl_timestamp': game.rl_timestamp}

        raw_messages = {
            'user_message': str(user_message),
            'system_message': str(system_message),
            'raw_llm_response': str(raw_llm_response),
            'model': os.environ['MISTRAL_MODEL']
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
        # print(e)
        raise HTTPException(status_code=500, detail=str(e))

# test added
@app.post("/save-game/")
def save_game(
    gameStateSchema: GameStateSchema,
    db: Session = Depends(db_session)
):
    saved_game_id = create_game_state(db, gameStateSchema)
    return {"message": "Game state saved successfully",
            "saved_game_id": saved_game_id}

# visual test only
@app.get("/", response_class=HTMLResponse)
def root(
    request: Request,
    response: Response,
    db: Session = Depends(db_session)
):
    scenarios = get_all_scenarios(db)
    return templates.TemplateResponse(
        request=request, name="game_selection.jinja2", context={"id": id, "scenarios": scenarios}
    )

# visual test only
@app.get("/info/", response_class=HTMLResponse)
def root(
    request: Request,
    response: Response,
):
    return templates.TemplateResponse(
        request=request, name="info.jinja2", context={}
    )

if __name__ == "__main__":
    uvicorn.run(
        "app:app", 
        host="0.0.0.0", port=8080, log_level="debug", reload="true"
    )
