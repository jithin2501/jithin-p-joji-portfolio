from typing import List, Optional
from app.repositories.skill_repository import SkillRepository
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate

class SkillService:
    def __init__(self, repository: SkillRepository):
        self.repository = repository

    async def create_skill(self, schema: SkillCreate) -> Skill:
        skill = Skill(
            name=schema.name,
            color=schema.color,
            slug=schema.slug,
            desc=schema.desc,
            page=schema.page
        )
        return await self.repository.create(skill)

    async def get_all_skills(self) -> List[Skill]:
        return await self.repository.get_all()

    async def get_skill_by_id(self, id: str) -> Optional[Skill]:
        return await self.repository.get_by_id(id)

    async def update_skill(self, id: str, schema: SkillUpdate) -> Optional[Skill]:
        update_data = {}
        if schema.name is not None:
            update_data["name"] = schema.name
        if schema.color is not None:
            update_data["color"] = schema.color
        if schema.slug is not None:
            update_data["slug"] = schema.slug
        if schema.desc is not None:
            update_data["desc"] = schema.desc
        if schema.page is not None:
            update_data["page"] = schema.page

        return await self.repository.update(id, update_data)

    async def delete_skill(self, id: str) -> bool:
        return await self.repository.delete(id)
