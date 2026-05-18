from bson import ObjectId
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.experience import Experience

class ExperienceRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["experiences"]

    async def create(self, exp: Experience) -> Experience:
        doc = exp.to_mongo()
        result = await self.collection.insert_one(doc)
        exp.id = str(result.inserted_id)
        return exp

    async def get_all(self) -> List[Experience]:
        experiences = []
        # Sort by creation time so the user's added order is preserved
        cursor = self.collection.find().sort("created_at", -1)
        async for doc in cursor:
            experiences.append(Experience.from_mongo(doc))
        return experiences

    async def get_by_id(self, id: str) -> Optional[Experience]:
        if not ObjectId.is_valid(id):
            return None
        doc = await self.collection.find_one({"_id": ObjectId(id)})
        return Experience.from_mongo(doc)

    async def update(self, id: str, updated_data: dict) -> Optional[Experience]:
        if not ObjectId.is_valid(id):
            return None
        
        # Remove _id if present in dict
        updated_data.pop("_id", None)
        
        result = await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": updated_data}
        )
        if result.matched_count > 0:
            return await self.get_by_id(id)
        return None

    async def delete(self, id: str) -> bool:
        if not ObjectId.is_valid(id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
