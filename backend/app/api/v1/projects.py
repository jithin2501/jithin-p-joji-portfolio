from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.core.database import get_database
from app.repositories.project_repository import ProjectRepository
from app.services.project_service import ProjectService
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter()

def get_project_service(db = Depends(get_database)) -> ProjectService:
    repository = ProjectRepository(db)
    return ProjectService(repository)

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate,
    service: ProjectService = Depends(get_project_service)
):
    project = await service.create_project(project_in)
    return ProjectResponse(
        id=project.id,
        title=project.title,
        subtitle=project.subtitle,
        description=project.description,
        long_desc=project.long_desc,
        image=project.image,
        images=project.images,
        category=project.category,
        role=project.role,
        duration=project.duration,
        completed=project.completed,
        tools=project.tools,
        methodology=project.methodology,
        features=project.features,
        tech_stack=project.tech_stack,
        learned=project.learned,
        featured=project.featured,
        live_url=project.live_url,
        github_url=project.github_url,
        created_at=project.created_at
    )

@router.get("/", response_model=List[ProjectResponse])
async def get_projects(service: ProjectService = Depends(get_project_service)):
    records = await service.get_all_projects()
    return [
        ProjectResponse(
            id=p.id,
            title=p.title,
            subtitle=p.subtitle,
            description=p.description,
            long_desc=p.long_desc,
            image=p.image,
            images=p.images,
            category=p.category,
            role=p.role,
            duration=p.duration,
            completed=p.completed,
            tools=p.tools,
            methodology=p.methodology,
            features=p.features,
            tech_stack=p.tech_stack,
            learned=p.learned,
            featured=p.featured,
            live_url=p.live_url,
            github_url=p.github_url,
            created_at=p.created_at
        ) for p in records
    ]

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project_by_id(
    project_id: str,
    service: ProjectService = Depends(get_project_service)
):
    project = await service.get_project_by_id(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project record not found"
        )
    return ProjectResponse(
        id=project.id,
        title=project.title,
        subtitle=project.subtitle,
        description=project.description,
        long_desc=project.long_desc,
        image=project.image,
        images=project.images,
        category=project.category,
        role=project.role,
        duration=project.duration,
        completed=project.completed,
        tools=project.tools,
        methodology=project.methodology,
        features=project.features,
        tech_stack=project.tech_stack,
        learned=project.learned,
        featured=project.featured,
        live_url=project.live_url,
        github_url=project.github_url,
        created_at=project.created_at
    )

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    service: ProjectService = Depends(get_project_service)
):
    project = await service.update_project(project_id, project_in)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project record not found or invalid ID"
        )
    return ProjectResponse(
        id=project.id,
        title=project.title,
        subtitle=project.subtitle,
        description=project.description,
        long_desc=project.long_desc,
        image=project.image,
        images=project.images,
        category=project.category,
        role=project.role,
        duration=project.duration,
        completed=project.completed,
        tools=project.tools,
        methodology=project.methodology,
        features=project.features,
        tech_stack=project.tech_stack,
        learned=project.learned,
        featured=project.featured,
        live_url=project.live_url,
        github_url=project.github_url,
        created_at=project.created_at
    )

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    service: ProjectService = Depends(get_project_service)
):
    success = await service.delete_project(project_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project record not found or invalid ID"
        )
