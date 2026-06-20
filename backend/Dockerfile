FROM python:3.12-slim-bookworm AS base

WORKDIR /app
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev curl \
    libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf-xlib-2.0-0 \
    libffi-dev shared-mime-info \
    libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 \
    libxkbcommon0 libasound2 libatspi2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml .
RUN pip install --no-cache-dir -e . \
    && mkdir -p /ms-playwright \
    && playwright install chromium \
    && chmod -R 755 /ms-playwright

COPY . .

# Non-root user
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app /ms-playwright
USER appuser

EXPOSE 8000

CMD ["gunicorn", "app.main:app", \
    "-w", "2", \
    "-k", "uvicorn.workers.UvicornWorker", \
    "--bind", "0.0.0.0:8000", \
    "--timeout", "120", \
    "--keep-alive", "5", \
    "--access-logfile", "-"]
