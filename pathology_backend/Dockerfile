# ---- Base Python image ----
FROM python:3.11-slim

WORKDIR /app
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential libpq-dev --no-install-recommends

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Start server
CMD ["gunicorn", "pathology_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
