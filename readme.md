# Setup, Dependency Install, Run
1. `cp env_example .env`
2. edit .env, change the Mistral API key
3. `python -m venv venv`
4. `source venv/bin/activate` (works on Linux and macOS, for Windows please search online)
5. `./build.sh` gets the npm packages and distributes some JS libs
6. `pip install -r requirements.txt`
7. `uvicorn app:app --reload --host 0.0.0.0 --port 8000`

# Access using curl
```
curl --request POST \
  --url http://localhost:8000/send_metrics \
  --header 'Content-Type: application/json' \
  --data '{
    "population": 1000,
    "interest_rate": 1000.00,
    "government_spending": 1000.00,
    "taxes": 1000.00,
    "money_supply": 1000.00,
    "food_import_allowed": true
  }'
```