from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.core.database import get_database
from app.repositories.skill_repository import SkillRepository
from app.services.skill_service import SkillService
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse

router = APIRouter()

def get_skill_service(db = Depends(get_database)) -> SkillService:
    repository = SkillRepository(db)
    return SkillService(repository)

@router.post("/", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill_in: SkillCreate,
    service: SkillService = Depends(get_skill_service)
):
    skill = await service.create_skill(skill_in)
    return SkillResponse(
        id=skill.id,
        name=skill.name,
        color=skill.color,
        slug=skill.slug,
        desc=skill.desc,
        page=skill.page,
        created_at=skill.created_at
    )

@router.get("/", response_model=List[SkillResponse])
async def get_skills(service: SkillService = Depends(get_skill_service)):
    records = await service.get_all_skills()
    return [
        SkillResponse(
            id=s.id,
            name=s.name,
            color=s.color,
            slug=s.slug,
            desc=s.desc,
            page=s.page,
            created_at=s.created_at
        ) for s in records
    ]

@router.get("/{skill_id}", response_model=SkillResponse)
async def get_skill_by_id(
    skill_id: str,
    service: SkillService = Depends(get_skill_service)
):
    skill = await service.get_skill_by_id(skill_id)
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill record not found"
        )
    return SkillResponse(
        id=skill.id,
        name=skill.name,
        color=skill.color,
        slug=skill.slug,
        desc=skill.desc,
        page=skill.page,
        created_at=skill.created_at
    )

@router.put("/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: str,
    skill_in: SkillUpdate,
    service: SkillService = Depends(get_skill_service)
):
    skill = await service.update_skill(skill_id, skill_in)
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill record not found or invalid ID"
        )
    return SkillResponse(
        id=skill.id,
        name=skill.name,
        color=skill.color,
        slug=skill.slug,
        desc=skill.desc,
        page=skill.page,
        created_at=skill.created_at
    )

@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_id: str,
    service: SkillService = Depends(get_skill_service)
):
    success = await service.delete_skill(skill_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill record not found or invalid ID"
        )
