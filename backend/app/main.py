import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.v1.contacts import router as contact_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup database operations
    await connect_to_mongo()
    yield
    # Shutdown database operations
    await close_mongo_connection()

app = FastAPI(
    title="Portfolio Backend API",
    description="Python/FastAPI and MongoDB backend for Portfolio website",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API v1 routes
app.include_router(contact_router, prefix="/api/v1/contacts", tags=["Contacts v1"])

# Support compatibility with previous spring boot controller route: /api/contacts
app.include_router(contact_router, prefix="/api/contacts", tags=["Contacts Compatibility"])

@app.get("/")
async def root():
    return {"message": "Portfolio API is running successfully"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
