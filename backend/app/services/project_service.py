from typing import List, Optional
from app.repositories.project_repository import ProjectRepository
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate

class ProjectService:
    def __init__(self, repository: ProjectRepository):
        self.repository = repository

    async def create_project(self, schema: ProjectCreate) -> Project:
        project = Project(
            title=schema.title,
            subtitle=schema.subtitle,
            description=schema.description,
            long_desc=schema.long_desc,
            image=schema.image,
            images=schema.images,
            category=schema.category,
            role=schema.role,
            duration=schema.duration,
            completed=schema.completed,
            tools=schema.tools,
            methodology=schema.methodology,
            features=schema.features,
            tech_stack=schema.tech_stack,
            learned=schema.learned,
            featured=schema.featured,
            live_url=schema.live_url,
            github_url=schema.github_url
        )
        return await self.repository.create(project)

    async def get_all_projects(self) -> List[Project]:
        return await self.repository.get_all()

    async def get_project_by_id(self, id: str) -> Optional[Project]:
        return await self.repository.get_by_id(id)

    async def update_project(self, id: str, schema: ProjectUpdate) -> Optional[Project]:
        update_data = {}
        fields = [
            "title", "subtitle", "description", "long_desc", "image", "images",
            "category", "role", "duration", "completed", "tools", "methodology",
            "features", "tech_stack", "learned", "featured", "live_url", "github_url"
        ]
        for field in fields:
            val = getattr(schema, field, None)
            if val is not None:
                update_data[field] = val

        # Handle naming conventions differences if any
        if "long_desc" in update_data:
            update_data["long_desc"] = update_data["long_desc"]
        if "tech_stack" in update_data:
            update_data["tech_stack"] = update_data["tech_stack"]
        if "live_url" in update_data:
            update_data["live_url"] = update_data["live_url"]
        if "github_url" in update_data:
            update_data["github_url"] = update_data["github_url"]

        return await self.repository.update(id, update_data)

    async def delete_project(self, id: str) -> bool:
        return await self.repository.delete(id)
