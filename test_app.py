from fastapi import FastAPI
from fastapi.testclient import TestClient
from .app import app
import json
import re
import time
from datetime import datetime as dt
from uuid import UUID
from bs4 import BeautifulSoup

client = TestClient(app)

# globals
game_id = 0
seconds_in_day = 86400
current_timestamp = timestamp = int(time.time())
current_date = dt.strftime(dt.utcfromtimestamp(current_timestamp), '%Y-%m-%d')
tomorrow_timestamp = current_timestamp + seconds_in_day
tomorrow_date = dt.strftime(dt.utcfromtimestamp(tomorrow_timestamp), '%Y-%m-%d')

sample_metrics = {
    'gt_timestamp': current_timestamp,
    'population': 30000,
    'consumption': 1000,
    'investment': 500,
    'net_export': 200,
    'government_income': 300,
    'inflation': 2,
    'unemployment_rate': 5,
    'money_supply': 10000,
    'government_debt': 5000,
    'aggregate_demand': 1500,
}

sample_policy_settings = {
    'interest_rate': 5,
    'government_spending': 400,
    'open_market_operations': 100,
    'individual_tax_rate': 20,
    'corporate_tax_rate': 25,
    'gt_timestamp': current_timestamp,
}

with open('test_data/sample_game_state.json', 'r') as f:
    sample_game_state = json.load(f)

with open('test_data/sample_end_game_data.json', 'r') as f:
    sample_end_game_data = json.load(f)

game_state_id = ''

def test_new_scenario_from_json():
    response = client.post(
        '/scenario/new-from-json',
        headers = {'Content-Type': 'application/json'},
        json = {}
    )
    # this doesn't return any other data
    assert response.status_code == 200
    assert response.json() == {'status': 'success'}

def test_start_game():
    response = client.get('/game/2')
    assert response.status_code == 200
    assert re.search('<div id="data" style="display:none;" data-scenario="2" data-gamestate="None"></div>', response.text)

def test_new_game():
    global game_id
    response = client.post(
        '/game/new',
        headers = {'Content-Type': 'application/json'},
        json = {
            'start_gt_timestamp': current_timestamp,
            'scenario_id': 2
        }
    )
    assert response.status_code == 200
    assert response.json()['game']['game_id'] > 0
    # check that the current date key exists
    assert response.json()['metrics'].get(current_date, False)
    # check that expected metrics data points exist
    for key in sample_metrics.keys():
        assert response.json()['metrics'][current_date].get(key, False)
    game_id = response.json()['game']['game_id']

def test_send_policy():
    global game_id
    response = client.post(
        '/set-policy',
        headers = {'Content-Type': 'application/json'},
        json = {
            'game': {
                'game_id': game_id,
                'rl_timestamp': current_timestamp,
            },
            'metrics': [
                sample_metrics
            ],
            'policySettings': sample_policy_settings
        }
    )
    assert response.status_code == 200
    returned_metrics = response.json()
    for key in returned_metrics.keys():
        # check keys are valid dates
        assert re.match(r'\d{4}-\d{2}-\d{2}', key)
        # check that all expected metrics data points exist
        for m_key in sample_metrics.keys():
            assert returned_metrics[key].get(m_key, False)

def test_save_game():
    global game_id
    global sample_game_state
    global game_state_id
    sample_game_state['gameId'] = game_id
    response = client.post(
        '/save-game',
        headers = {'Content-Type': 'application/json'},
        json = sample_game_state
    )
    assert response.status_code == 200
    assert response.json()['message'] == 'Game state saved successfully'
    # check if saved game id is a valid UUID
    saved_game_id = response.json()['saved_game_id']
    try:
        UUID(saved_game_id)
        game_state_id = saved_game_id
        assert True
    except ValueError:
        assert False

def test_load_game():
    global game_state_id
    global sample_game_state
    response = client.get(f'/game/load/{game_state_id}')
    # parse the response as HTML
    soup = BeautifulSoup(response.text, 'html.parser')
    data_div = soup.find('div', {'id': 'data'})
    data = data_div.attrs['data-gamestate']
    # parse the data attribute as JSON
    data_json = json.loads(data)
    # check that the game state data matches the expected data
    assert data_json['gameId'] == sample_game_state['gameId']
    # randomly check some data
    assert data_json['metrics'][tomorrow_date]['inflation'] == sample_game_state['metrics'][tomorrow_date]['inflation']

def test_win_lose():
    global game_id
    global sample_end_game_data
    sample_end_game_data['game_id'] = game_id
    response = client.post(
        '/win-lose',
        headers = {'Content-Type': 'application/json'},
        json = sample_end_game_data
    )   
    assert response.json()['result'] == 'WON' or response.json()['result'] == 'LOST'
