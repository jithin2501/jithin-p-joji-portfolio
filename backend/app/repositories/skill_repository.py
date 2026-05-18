from bson import ObjectId
from typing import List, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.skill import Skill

class SkillRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["skills"]
        self.db = db

    async def seed_if_empty(self):
        count = await self.collection.count_documents({})
        if count > 0:
            return

        # Preseed skills to populate the frontend immediately
        seeds = [
            # Page 1 (Core)
            {"name": "HTML5", "color": "#E34F26", "slug": "html", "desc": "Semantic markup for modern, accessible websites.", "page": 1},
            {"name": "CSS3", "color": "#1572B6", "slug": "css", "desc": "Advanced styling with Flexbox, Grid, animations and more.", "page": 1},
            {"name": "JavaScript", "color": "#F7DF1E", "slug": "js", "desc": "Dynamic and interactive experiences for the modern web.", "page": 1},
            {"name": "React", "color": "#61DAFB", "slug": "react", "desc": "Building reusable UI components with a declarative approach.", "page": 1},
            {"name": "Next.js", "color": "#FFFFFF", "slug": "nextjs", "desc": "The React framework for production-grade web apps.", "page": 1},
            {"name": "Tailwind CSS", "color": "#06B6D4", "slug": "tailwind", "desc": "Utility-first CSS framework for rapid UI development.", "page": 1},
            {"name": "Node.js", "color": "#339933", "slug": "nodejs", "desc": "JavaScript runtime for scalable backend applications.", "page": 1},
            {"name": "MongoDB", "color": "#47A248", "slug": "mongodb", "desc": "NoSQL database for modern, flexible and scalable apps.", "page": 1},
            {"name": "Express.js", "color": "#FFFFFF", "slug": "express", "desc": "Fast and minimal web framework for Node.js applications.", "page": 1},
            {"name": "PostgreSQL", "color": "#4169E1", "slug": "postgres", "desc": "Relational database for structured data management.", "page": 1},
            {"name": "Docker", "color": "#2496ED", "slug": "docker", "desc": "Containerization for consistent dev and production environments.", "page": 1},
            {"name": "Git & GitHub", "color": "#F05032", "slug": "git", "desc": "Version control and collaboration for efficient development.", "page": 1},
            
            # Page 2 (Advanced)
            {"name": "TypeScript", "color": "#3178C6", "slug": "ts", "desc": "Typed JavaScript for better developer ergonomics.", "page": 2},
            {"name": "GraphQL", "color": "#E10098", "slug": "graphql", "desc": "Query language for APIs and runtime for fulfilling queries.", "page": 2},
            {"name": "Redux", "color": "#764ABC", "slug": "redux", "desc": "Predictable state container for JavaScript apps.", "page": 2},
            {"name": "AWS", "color": "#FF9900", "slug": "aws", "desc": "Amazon Web Services for cloud computing and hosting.", "page": 2},
            {"name": "Firebase", "color": "#FFCA28", "slug": "firebase", "desc": "Google's platform for building mobile and web apps.", "page": 2},
            {"name": "Kubernetes", "color": "#326CE5", "slug": "kubernetes", "desc": "Orchestration for automated container deployment.", "page": 2},
            {"name": "Redis", "color": "#DC382D", "slug": "redis", "desc": "In-memory data structure store for caching and more.", "page": 2},
            {"name": "SQLite", "color": "#003B57", "slug": "sqlite", "desc": "Self-contained, serverless relational database engine.", "page": 2},
            {"name": "Figma", "color": "#F24E1E", "slug": "figma", "desc": "Collaborative interface design tool for modern teams.", "page": 2},
            {"name": "SASS", "color": "#CC6699", "slug": "sass", "desc": "CSS preprocessor with variables and nesting capabilities.", "page": 2},
            {"name": "Jest", "color": "#C21325", "slug": "jest", "desc": "Delightful JavaScript testing framework for quality code.", "page": 2},
            {"name": "Vercel", "color": "#FFFFFF", "slug": "vercel", "desc": "Platform for frontend developers to deploy instantly.", "page": 2}
        ]

        # Insert sequentially to preserve initial ordering
        for s in seeds:
            s["created_at"] = datetime.utcnow()
            await self.collection.insert_one(s)

    async def create(self, skill: Skill) -> Skill:
        doc = skill.to_mongo()
        result = await self.collection.insert_one(doc)
        skill.id = str(result.inserted_id)
        return skill

    async def get_all(self) -> List[Skill]:
        await self.seed_if_empty()
        records = []
        cursor = self.collection.find().sort("created_at", 1)
        async for doc in cursor:
            records.append(Skill.from_mongo(doc))
        return records

    async def get_by_id(self, id: str) -> Optional[Skill]:
        if not ObjectId.is_valid(id):
            return None
        doc = await self.collection.find_one({"_id": ObjectId(id)})
        return Skill.from_mongo(doc)

    async def update(self, id: str, updated_data: dict) -> Optional[Skill]:
        if not ObjectId.is_valid(id):
            return None
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
