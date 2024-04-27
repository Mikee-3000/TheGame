# Setup, Dependency Install, Run
1. `cp env_example .env`
2. edit .env, change the Mistral API key
3. `python -m venv venv`
4. `source venv/bin/activate` (works on Linux and macOS, for Windows please search online)
5. `pip install -r requirements.txt`
6. `uvicorn app:app --reload --host 0.0.0.0 --port 8000`
