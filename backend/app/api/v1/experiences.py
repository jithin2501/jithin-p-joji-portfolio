from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.core.database import get_database
from app.repositories.experience_repository import ExperienceRepository
from app.services.experience_service import ExperienceService
from app.schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceResponse

router = APIRouter()

def get_experience_service(db = Depends(get_database)) -> ExperienceService:
    repository = ExperienceRepository(db)
    return ExperienceService(repository)

@router.post("/", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
async def create_experience(
    exp_in: ExperienceCreate, 
    service: ExperienceService = Depends(get_experience_service)
):
    exp = await service.create_experience(exp_in)
    return ExperienceResponse(
        id=exp.id,
        title=exp.title,
        company=exp.company,
        date_from=exp.date_from,
        date_to=exp.date_to,
        desc=exp.desc,
        tags=exp.tags,
        location=exp.location,
        dot_color=exp.dot_color,
        created_at=exp.created_at
    )

@router.get("/", response_model=List[ExperienceResponse])
async def get_experiences(service: ExperienceService = Depends(get_experience_service)):
    experiences = await service.get_all_experiences()
    return [
        ExperienceResponse(
            id=e.id,
            title=e.title,
            company=e.company,
            date_from=e.date_from,
            date_to=e.date_to,
            desc=e.desc,
            tags=e.tags,
            location=e.location,
            dot_color=e.dot_color,
            created_at=e.created_at
        ) for e in experiences
    ]

@router.get("/{exp_id}", response_model=ExperienceResponse)
async def get_experience_by_id(
    exp_id: str, 
    service: ExperienceService = Depends(get_experience_service)
):
    exp = await service.get_experience_by_id(exp_id)
    if not exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience item not found"
        )
    return ExperienceResponse(
        id=exp.id,
        title=exp.title,
        company=exp.company,
        date_from=exp.date_from,
        date_to=exp.date_to,
        desc=exp.desc,
        tags=exp.tags,
        location=exp.location,
        dot_color=exp.dot_color,
        created_at=exp.created_at
    )

@router.put("/{exp_id}", response_model=ExperienceResponse)
async def update_experience(
    exp_id: str,
    exp_in: ExperienceUpdate,
    service: ExperienceService = Depends(get_experience_service)
):
    exp = await service.update_experience(exp_id, exp_in)
    if not exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found or invalid ID"
        )
    return ExperienceResponse(
        id=exp.id,
        title=exp.title,
        company=exp.company,
        date_from=exp.date_from,
        date_to=exp.date_to,
        desc=exp.desc,
        tags=exp.tags,
        location=exp.location,
        dot_color=exp.dot_color,
        created_at=exp.created_at
    )

@router.delete("/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experience(
    exp_id: str, 
    service: ExperienceService = Depends(get_experience_service)
):
    success = await service.delete_experience(exp_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found or invalid ID"
        )
