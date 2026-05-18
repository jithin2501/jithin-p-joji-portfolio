from typing import List, Optional
from app.repositories.experience_repository import ExperienceRepository
from app.models.experience import Experience
from app.schemas.experience import ExperienceCreate, ExperienceUpdate

class ExperienceService:
    def __init__(self, repository: ExperienceRepository):
        self.repository = repository

    async def create_experience(self, schema: ExperienceCreate) -> Experience:
        exp = Experience(
            title=schema.title,
            company=schema.company,
            date_from=schema.date_from,
            date_to=schema.date_to,
            desc=schema.desc,
            tags=schema.tags,
            location=schema.location,
            dot_color=schema.dot_color
        )
        return await self.repository.create(exp)

    async def get_all_experiences(self) -> List[Experience]:
        return await self.repository.get_all()

    async def get_experience_by_id(self, id: str) -> Optional[Experience]:
        return await self.repository.get_by_id(id)

    async def update_experience(self, id: str, schema: ExperienceUpdate) -> Optional[Experience]:
        # Filter only set fields for update
        update_data = {}
        if schema.title is not None:
            update_data["title"] = schema.title
        if schema.company is not None:
            update_data["company"] = schema.company
        if schema.date_from is not None:
            update_data["date_from"] = schema.date_from
        if schema.date_to is not None:
            update_data["date_to"] = schema.date_to
        if schema.desc is not None:
            update_data["desc"] = schema.desc
        if schema.tags is not None:
            update_data["tags"] = schema.tags
        if schema.location is not None:
            update_data["location"] = schema.location
        if schema.dot_color is not None:
            update_data["dot_color"] = schema.dot_color

        return await self.repository.update(id, update_data)

    async def delete_experience(self, id: str) -> bool:
        return await self.repository.delete(id)
