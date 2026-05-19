from app.repositories.settings_repository import SettingsRepository
from app.models.settings import PortfolioSettings, HeroStats, SocialLinks
from app.schemas.settings import SettingsResponse
from app.services.cloudinary_service import CloudinaryService

class SettingsService:
    def __init__(self, repository: SettingsRepository):
        self.repository = repository
        self.cloudinary_service = CloudinaryService()

    async def get_settings(self) -> PortfolioSettings:
        return await self.repository.get_settings()

    async def update_settings(self, schema: SettingsResponse) -> PortfolioSettings:
        hero = HeroStats(
            projects=schema.hero.projects,
            experience=schema.hero.experience,
            commits=schema.hero.commits,
            satisfaction=schema.hero.satisfaction,
            availability=schema.hero.availability,
            clients=schema.hero.clients
        )
        socials = SocialLinks(
            github=schema.socials.github,
            linkedin=schema.socials.linkedin,
            email=schema.socials.email,
            phone=schema.socials.phone,
            location=schema.socials.location,
            whatsapp=schema.socials.whatsapp,
            instagram=schema.socials.instagram
        )
        
        # Check if the incoming about_image is a base64 string and upload it to Cloudinary
        about_image_url = schema.about_image or ""
        if about_image_url and about_image_url.startswith("data:"):
            try:
                uploaded_url = self.cloudinary_service.upload_base64_image(about_image_url)
                if uploaded_url:
                    about_image_url = uploaded_url
            except Exception as e:
                print("Cloudinary upload failed, falling back to original value:", e)

        settings = PortfolioSettings(
            hero=hero,
            socials=socials,
            about_image=about_image_url
        )
        return await self.repository.save_settings(settings)
