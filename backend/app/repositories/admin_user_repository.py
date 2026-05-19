from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.models.admin_user import AdminUser
from datetime import datetime

class AdminUserRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["admin_users"]

    async def get_all_admins(self) -> List[AdminUser]:
        cursor = self.collection.find()
        docs = await cursor.to_list(length=100)
        return [AdminUser.from_mongo(doc) for doc in docs]

    async def find_by_pincode(self, pincode: str) -> Optional[AdminUser]:
        doc = await self.collection.find_one({"pincode": pincode})
        if doc:
            return AdminUser.from_mongo(doc)
        return None

    async def find_by_username(self, username: str) -> Optional[AdminUser]:
        doc = await self.collection.find_one({"username": username})
        if doc:
            return AdminUser.from_mongo(doc)
        return None

    async def create_admin(self, admin: AdminUser) -> AdminUser:
        doc = admin.to_mongo()
        result = await self.collection.insert_one(doc)
        admin.id = str(result.inserted_id)
        return admin

    async def update_last_login(self, admin_id: str, last_login: datetime):
        await self.collection.update_one(
            {"_id": ObjectId(admin_id)},
            {"$set": {"lastLogin": last_login}}
        )

    async def delete_admin(self, admin_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(admin_id)})
        return result.deleted_count > 0
