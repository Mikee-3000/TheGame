from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from lib import client
from pydantic import BaseModel
import uvicorn

client.client = client.start_client()

app = FastAPI() 
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

class Metrics(BaseModel):
    population: int
    interestRate: float
    govtSpending: float
    taxRate: float
    moneySupply: float
    foodImport: bool


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(
        request=request, name="index.html", context={"id": id}
    )

@app.post('/send_metrics')
async def send_metrics(metrics: Metrics):
    resp = await client.send_metrics(metrics)
    return resp

if __name__ == "__main__":
    uvicorn.run(
        "app:app", 
        host="127.0.0.1", port=8080, log_level="debug", reload="true"
    )
        