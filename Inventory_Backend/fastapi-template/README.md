pip freeze > requirements.txt - to update requirement.txt

psql -U myuser -d mydb

\dt

source .venv/bin/activate

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
