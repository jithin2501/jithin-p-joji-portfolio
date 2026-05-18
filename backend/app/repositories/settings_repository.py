from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.settings import PortfolioSettings

class SettingsRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["settings"]

    async def get_settings(self) -> PortfolioSettings:
        doc = await self.collection.find_one({"_id": "global"})
        if not doc:
            # Return defaults
            return PortfolioSettings.from_mongo(None)
        return PortfolioSettings.from_mongo(doc)

    async def save_settings(self, settings: PortfolioSettings) -> PortfolioSettings:
        doc = settings.to_mongo()
        await self.collection.replace_one(
            {"_id": "global"},
            doc,
            upsert=True
        )
        return settings
