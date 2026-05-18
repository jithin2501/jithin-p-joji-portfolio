from app.repositories.settings_repository import SettingsRepository
from app.models.settings import PortfolioSettings, HeroStats, SocialLinks
from app.schemas.settings import SettingsResponse

class SettingsService:
    def __init__(self, repository: SettingsRepository):
        self.repository = repository

    async def get_settings(self) -> PortfolioSettings:
        return await self.repository.get_settings()

    async def update_settings(self, schema: SettingsResponse) -> PortfolioSettings:
        hero = HeroStats(
            projects=schema.hero.projects,
            experience=schema.hero.experience,
            commits=schema.hero.commits,
            satisfaction=schema.hero.satisfaction
        )
        socials = SocialLinks(
            github=schema.socials.github,
            linkedin=schema.socials.linkedin,
            email=schema.socials.email,
            phone=schema.socials.phone,
            location=schema.socials.location
        )
        settings = PortfolioSettings(hero=hero, socials=socials)
        return await self.repository.save_settings(settings)
