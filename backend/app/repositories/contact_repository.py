from bson import ObjectId
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.contact import Contact

class ContactRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["contacts"]

    async def create(self, contact: Contact) -> Contact:
        doc = contact.to_mongo()
        result = await self.collection.insert_one(doc)
        contact.id = str(result.inserted_id)
        return contact

    async def get_all(self) -> List[Contact]:
        contacts = []
        cursor = self.collection.find().sort("createdAt", -1)
        async for doc in cursor:
            contacts.append(Contact.from_mongo(doc))
        return contacts

    async def get_by_id(self, id: str) -> Optional[Contact]:
        if not ObjectId.is_valid(id):
            return None
        doc = await self.collection.find_one({"_id": ObjectId(id)})
        return Contact.from_mongo(doc)

    async def delete(self, id: str) -> bool:
        if not ObjectId.is_valid(id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
