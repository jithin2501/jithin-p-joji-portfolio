import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Force load the local .env file to override system-level environment variables
load_dotenv(override=True)

class Settings(BaseSettings):
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/portfolio")
    DATABASE_NAME: str = "portfolio"
    PORT: int = int(os.getenv("PORT", 8080))
    HOST: str = "0.0.0.0"

    class Config:
        extra = "ignore"

settings = Settings()
