#!/bin/bash

# Start FastAPI backend in the background on 127.0.0.1:8080
echo "Starting FastAPI backend..."
cd /app/backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8080 &

# Start Next.js frontend in the foreground on the Render-assigned PORT
echo "Starting Next.js frontend on port $PORT..."
cd /app/frontend
exec npm run start -- -p $PORT
