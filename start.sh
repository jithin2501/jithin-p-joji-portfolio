#!/bin/bash

# Substitute PORT in Nginx configuration
echo "Configuring Nginx to listen on port ${PORT:-10000}..."
sed -i "s/PORT_PLACEHOLDER/${PORT:-10000}/g" /app/nginx.conf

# Start FastAPI backend in the background on port 8081
echo "Starting FastAPI backend on port 8081..."
cd /app/backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8081 &

# Start Next.js frontend in the background on port 3000
echo "Starting Next.js frontend on port 3000..."
cd /app/frontend
npm run start -- -p 3000 &

# Start Nginx in the foreground
echo "Starting Nginx reverse proxy..."
nginx -c /app/nginx.conf -g "daemon off;"
