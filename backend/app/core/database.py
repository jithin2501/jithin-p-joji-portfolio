import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI)
    
    db_name = settings.DATABASE_NAME
    # Parse database name from Atlas connection string if present
    if "/" in settings.MONGODB_URI.split("://")[-1]:
        path = settings.MONGODB_URI.split("/")[-1]
        path_db = path.split("?")[0]
        if path_db:
            db_name = path_db
            
    db_instance.db = db_instance.client[db_name]
    logger.info(f"Connected to MongoDB database: {db_name}")

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db_instance.client:
        db_instance.client.close()
    logger.info("MongoDB connection closed.")

def get_database():
    return db_instance.db
