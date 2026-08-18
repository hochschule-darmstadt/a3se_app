# Builds the one backend image docker-compose.yml's `api` and `seed`
# services both run (different `command:`, same image) -- see DR-0014 and
# docker-compose.yml. Not a multi-stage build: the backend has no compiled
# artifacts, only pyproject-declared pure-Python dependencies (DR-0010).
FROM python:3.13-slim

WORKDIR /app

COPY pyproject.toml ./
COPY src ./src
COPY scripts ./scripts

RUN pip install --no-cache-dir -e .

EXPOSE 8000

CMD ["python", "scripts/serve.py"]
