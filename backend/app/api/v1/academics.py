from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.core.database import get_database
from app.repositories.academic_repository import AcademicRepository
from app.services.academic_service import AcademicService
from app.schemas.academic import AcademicCreate, AcademicUpdate, AcademicResponse, AcademicSettingsSchema

router = APIRouter()

def get_academic_service(db = Depends(get_database)) -> AcademicService:
    repository = AcademicRepository(db)
    return AcademicService(repository)

@router.get("/settings", response_model=AcademicSettingsSchema)
async def get_academic_settings(service: AcademicService = Depends(get_academic_service)):
    return await service.get_settings()

@router.put("/settings", response_model=AcademicSettingsSchema)
async def update_academic_settings(
    settings_in: AcademicSettingsSchema,
    service: AcademicService = Depends(get_academic_service)
):
    return await service.update_settings(settings_in)

@router.post("/", response_model=AcademicResponse, status_code=status.HTTP_201_CREATED)
async def create_academic(
    acad_in: AcademicCreate, 
    service: AcademicService = Depends(get_academic_service)
):
    acad = await service.create_academic(acad_in)
    return AcademicResponse(
        id=acad.id,
        title=acad.title,
        school=acad.school,
        location=acad.location,
        date_range=acad.date_range,
        score=acad.score,
        color_theme=acad.color_theme,
        icon_type=acad.icon_type,
        created_at=acad.created_at
    )

@router.get("/", response_model=List[AcademicResponse])
async def get_academics(service: AcademicService = Depends(get_academic_service)):
    records = await service.get_all_academics()
    return [
        AcademicResponse(
            id=a.id,
            title=a.title,
            school=a.school,
            location=a.location,
            date_range=a.date_range,
            score=a.score,
            color_theme=a.color_theme,
            icon_type=a.icon_type,
            created_at=a.created_at
        ) for a in records
    ]

@router.get("/{acad_id}", response_model=AcademicResponse)
async def get_academic_by_id(
    acad_id: str, 
    service: AcademicService = Depends(get_academic_service)
):
    acad = await service.get_academic_by_id(acad_id)
    if not acad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic record not found"
        )
    return AcademicResponse(
        id=acad.id,
        title=acad.title,
        school=acad.school,
        location=acad.location,
        date_range=acad.date_range,
        score=acad.score,
        color_theme=acad.color_theme,
        icon_type=acad.icon_type,
        created_at=acad.created_at
    )

@router.put("/{acad_id}", response_model=AcademicResponse)
async def update_academic(
    acad_id: str,
    acad_in: AcademicUpdate,
    service: AcademicService = Depends(get_academic_service)
):
    acad = await service.update_academic(acad_id, acad_in)
    if not acad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic record not found or invalid ID"
        )
    return AcademicResponse(
        id=acad.id,
        title=acad.title,
        school=acad.school,
        location=acad.location,
        date_range=acad.date_range,
        score=acad.score,
        color_theme=acad.color_theme,
        icon_type=acad.icon_type,
        created_at=acad.created_at
    )

@router.delete("/{acad_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_academic(
    acad_id: str, 
    service: AcademicService = Depends(get_academic_service)
):
    success = await service.delete_academic(acad_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic record not found or invalid ID"
        )
