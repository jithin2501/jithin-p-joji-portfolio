# ====================================================
# Stage 1: Build Next.js frontend
# ====================================================
FROM node:20-bookworm-slim AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ====================================================
# Stage 2: Final Production Container
# ====================================================
FROM python:3.12-slim-bookworm AS runner
WORKDIR /app

# Install Node.js 20, Nginx, and system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    nginx \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy and install backend Python dependencies
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./

# Copy and install frontend production Node dependencies
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public
COPY frontend/next.config.ts ./
COPY frontend/app ./app

# Copy the start script and Nginx config to the root
WORKDIR /app
COPY start.sh ./
COPY nginx.conf ./
RUN chmod +x start.sh

# Render will provide the PORT env variable (default 10000)
EXPOSE 10000

CMD ["./start.sh"]
