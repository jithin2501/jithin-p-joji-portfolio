from typing import List, Optional
from app.repositories.academic_repository import AcademicRepository
from app.models.academic import Academic
from app.schemas.academic import AcademicCreate, AcademicUpdate, AcademicSettingsSchema

class AcademicService:
    def __init__(self, repository: AcademicRepository):
        self.repository = repository

    async def create_academic(self, schema: AcademicCreate) -> Academic:
        acad = Academic(
            title=schema.title,
            school=schema.school,
            location=schema.location,
            date_range=schema.date_range,
            score=schema.score,
            color_theme=schema.color_theme,
            icon_type=schema.icon_type
        )
        return await self.repository.create(acad)

    async def get_all_academics(self) -> List[Academic]:
        return await self.repository.get_all()

    async def get_academic_by_id(self, id: str) -> Optional[Academic]:
        return await self.repository.get_by_id(id)

    async def update_academic(self, id: str, schema: AcademicUpdate) -> Optional[Academic]:
        update_data = {}
        if schema.title is not None:
            update_data["title"] = schema.title
        if schema.school is not None:
            update_data["school"] = schema.school
        if schema.location is not None:
            update_data["location"] = schema.location
        if schema.date_range is not None:
            update_data["date_range"] = schema.date_range
        if schema.score is not None:
            update_data["score"] = schema.score
        if schema.color_theme is not None:
            update_data["color_theme"] = schema.color_theme
        if schema.icon_type is not None:
            update_data["icon_type"] = schema.icon_type

        return await self.repository.update(id, update_data)

    async def delete_academic(self, id: str) -> bool:
        return await self.repository.delete(id)

    async def get_settings(self) -> dict:
        return await self.repository.get_settings()

    async def update_settings(self, schema: AcademicSettingsSchema) -> dict:
        data = {
            "description": schema.description,
            "highlights": schema.highlights,
            "stat1_label": schema.stat1_label,
            "stat1_value": schema.stat1_value,
            "stat2_label": schema.stat2_label,
            "stat2_value": schema.stat2_value,
            "stat3_label": schema.stat3_label,
            "stat3_value": schema.stat3_value
        }
        return await self.repository.update_settings(data)
