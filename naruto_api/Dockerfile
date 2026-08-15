FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    API_HOST=0.0.0.0 \
    API_PORT=3333 \
    GUNICORN_WORKERS=4 \
    GUNICORN_THREADS=8 \
    GUNICORN_TIMEOUT=60

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY narutoapi ./narutoapi
COPY finalQuotes.csv wsgi.py app.py ./

RUN useradd --create-home --uid 1000 naruto && chown -R naruto:naruto /app
USER naruto

EXPOSE 3333

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
    CMD python -c "import os,sys,urllib.request; url=f\"http://127.0.0.1:{os.getenv('API_PORT','3333')}/health\"; sys.exit(0 if urllib.request.urlopen(url, timeout=4).status == 200 else 1)"

CMD ["sh", "-c", "gunicorn --bind ${API_HOST}:${API_PORT} --workers ${GUNICORN_WORKERS} --threads ${GUNICORN_THREADS} --timeout ${GUNICORN_TIMEOUT} --access-logfile - --error-logfile - wsgi:app"]
