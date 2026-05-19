from fastapi import APIRouter, Depends, status
from app.core.database import get_database
from app.repositories.settings_repository import SettingsRepository
from app.services.settings_service import SettingsService
from app.schemas.settings import SettingsResponse, HeroStatsSchema, SocialLinksSchema

router = APIRouter()

def get_settings_service(db = Depends(get_database)) -> SettingsService:
    repository = SettingsRepository(db)
    return SettingsService(repository)

@router.get("/", response_model=SettingsResponse)
async def get_settings(service: SettingsService = Depends(get_settings_service)):
    settings = await service.get_settings()
    return SettingsResponse(
        hero=HeroStatsSchema(
            projects=settings.hero.projects,
            experience=settings.hero.experience,
            commits=settings.hero.commits,
            satisfaction=settings.hero.satisfaction,
            availability=settings.hero.availability
        ),
        socials=SocialLinksSchema(
            github=settings.socials.github,
            linkedin=settings.socials.linkedin,
            email=settings.socials.email,
            phone=settings.socials.phone,
            location=settings.socials.location,
            whatsapp=settings.socials.whatsapp,
            instagram=settings.socials.instagram
        ),
        about_image=settings.about_image
    )

@router.put("/", response_model=SettingsResponse)
async def update_settings(settings_in: SettingsResponse, service: SettingsService = Depends(get_settings_service)):
    settings = await service.update_settings(settings_in)
    return SettingsResponse(
        hero=HeroStatsSchema(
            projects=settings.hero.projects,
            experience=settings.hero.experience,
            commits=settings.hero.commits,
            satisfaction=settings.hero.satisfaction,
            availability=settings.hero.availability
        ),
        socials=SocialLinksSchema(
            github=settings.socials.github,
            linkedin=settings.socials.linkedin,
            email=settings.socials.email,
            phone=settings.socials.phone,
            location=settings.socials.location,
            whatsapp=settings.socials.whatsapp,
            instagram=settings.socials.instagram
        ),
        about_image=settings.about_image
    )
