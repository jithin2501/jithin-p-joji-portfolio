from bson import ObjectId
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.analytics import AnalyticsVisit

class AnalyticsRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["analytics_visits"]

    async def create(self, visit: AnalyticsVisit) -> AnalyticsVisit:
        doc = visit.to_mongo()
        result = await self.collection.insert_one(doc)
        visit.id = str(result.inserted_id)
        return visit

    async def get_all(self) -> List[AnalyticsVisit]:
        visits = []
        cursor = self.collection.find().sort("createdAt", -1)
        async for doc in cursor:
            visits.append(AnalyticsVisit.from_mongo(doc))
        return visits

    async def get_stats(self) -> dict:
        total_visits = await self.collection.count_documents({})
        unique_users = len(await self.collection.distinct("userId"))
        
        # Aggregate by path
        pipeline = [
            {"$group": {"_id": "$path", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        top_paths = []
        cursor = self.collection.aggregate(pipeline)
        async for doc in cursor:
            top_paths.append({"path": doc["_id"], "count": doc["count"]})

        # Aggregate by country
        pipeline_geo = [
            {"$group": {"_id": "$country", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        top_countries = []
        cursor_geo = self.collection.aggregate(pipeline_geo)
        async for doc in cursor_geo:
            top_countries.append({"country": doc["_id"], "count": doc["count"]})

        return {
            "totalVisits": total_visits,
            "uniqueUsers": unique_users,
            "topPaths": top_paths,
            "topCountries": top_countries
        }

    async def delete_all(self) -> bool:
        await self.collection.delete_many({})
        return True
