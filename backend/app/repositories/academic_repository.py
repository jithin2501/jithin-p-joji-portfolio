from bson import ObjectId
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.academic import Academic

class AcademicRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["academics"]
        self.db = db

    async def create(self, acad: Academic) -> Academic:
        doc = acad.to_mongo()
        result = await self.collection.insert_one(doc)
        acad.id = str(result.inserted_id)
        return acad

    async def get_all(self) -> List[Academic]:
        records = []
        # Sort by creation time so the user's added order is preserved
        cursor = self.collection.find().sort("created_at", -1)
        async for doc in cursor:
            records.append(Academic.from_mongo(doc))
        return records

    async def get_by_id(self, id: str) -> Optional[Academic]:
        if not ObjectId.is_valid(id):
            return None
        doc = await self.collection.find_one({"_id": ObjectId(id)})
        return Academic.from_mongo(doc)

    async def update(self, id: str, updated_data: dict) -> Optional[Academic]:
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

    async def get_settings(self) -> dict:
        doc = await self.db["academic_settings"].find_one({"_id": "global"})
        if not doc:
            return {
                "description": "A strong academic foundation that shaped\nmy problem-solving mindset and passion\nfor technology.",
                "highlights": [
                    "Consistent Academic Excellence",
                    "Major Focus in Software Engineering",
                    "10+ Technical Semester Projects",
                    "Consistent Dean's List Awardee",
                    "Specialized in Full-Stack Dev"
                ],
                "stat1_label": "B.Tech",
                "stat1_value": "8.5",
                "stat2_label": "12th (PCMB)",
                "stat2_value": "91%",
                "stat3_label": "10th",
                "stat3_value": "80%"
            }
        # Convert _id to string or remove it for pydantic
        doc.pop("_id", None)
        return doc

    async def update_settings(self, data: dict) -> dict:
        data.pop("_id", None)
        await self.db["academic_settings"].update_one(
            {"_id": "global"},
            {"$set": data},
            upsert=True
        )
        return await self.get_settings()
