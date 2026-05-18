import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.v1.contacts import router as contact_router
from app.api.v1.settings import router as settings_router
from app.api.v1.resumes import router as resumes_router
from app.api.v1.experiences import router as experiences_router
from app.api.v1.academics import router as academics_router
from app.api.v1.skills import router as skills_router
from app.api.v1.projects import router as projects_router

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
app.include_router(settings_router, prefix="/api/v1/settings", tags=["Settings v1"])
app.include_router(resumes_router, prefix="/api/v1/resumes", tags=["Resumes v1"])
app.include_router(experiences_router, prefix="/api/v1/experiences", tags=["Experiences v1"])
app.include_router(academics_router, prefix="/api/v1/academics", tags=["Academics v1"])
app.include_router(skills_router, prefix="/api/v1/skills", tags=["Skills v1"])
app.include_router(projects_router, prefix="/api/v1/projects", tags=["Projects v1"])

# Support compatibility with previous spring boot controller routes
app.include_router(contact_router, prefix="/api/contacts", tags=["Contacts Compatibility"])
app.include_router(settings_router, prefix="/api/settings", tags=["Settings Compatibility"])
app.include_router(resumes_router, prefix="/api/resumes", tags=["Resumes Compatibility"])
app.include_router(experiences_router, prefix="/api/experiences", tags=["Experiences Compatibility"])
app.include_router(academics_router, prefix="/api/academics", tags=["Academics Compatibility"])
app.include_router(skills_router, prefix="/api/skills", tags=["Skills Compatibility"])
app.include_router(projects_router, prefix="/api/projects", tags=["Projects Compatibility"])

@app.get("/")
async def root():
    return {"message": "Portfolio API is running successfully"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
