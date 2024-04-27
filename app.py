from fastapi import FastAPI
from lib import client
from pydantic import BaseModel

client.client = client.start_client()

app = FastAPI() 



class Metrics(BaseModel):
    population: int
    interest_rate: float
    government_spending: float
    taxes: float
    money_supply: float
    food_import_allowed: bool


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post('/send_metrics')
async def send_metrics(metrics: Metrics):
    resp = await client.send_metrics(metrics)
    return resp
