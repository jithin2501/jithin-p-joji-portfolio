from pydantic import BaseModel, Field
from typing import Optional

class HeroStatsSchema(BaseModel):
    projects: str = Field(..., description="Project count statistic (e.g. 15+)")
    experience: str = Field(..., description="Years of experience (e.g. 1yr)")
    commits: str = Field(..., description="Github commit count (e.g. 2K+)")
    satisfaction: str = Field(..., description="Client satisfaction rate (e.g. 99%)")
    availability: Optional[str] = Field("Open to freelance & opportunities", description="Current availability status")
    clients: Optional[str] = Field("10+", description="Happy Clients statistic (e.g. 10+)")

class SocialLinksSchema(BaseModel):
    github: str = Field(..., description="GitHub profile URL")
    linkedin: str = Field(..., description="LinkedIn profile URL")
    email: str = Field(..., description="Contact Email Address")
    phone: str = Field(..., description="Contact Phone Number")
    location: str = Field(..., description="Location Address")
    whatsapp: Optional[str] = Field("https://wa.me/919061058123", description="WhatsApp profile URL or link")
    instagram: Optional[str] = Field("https://instagram.com/", description="Instagram profile URL")

class SettingsResponse(BaseModel):
    hero: HeroStatsSchema
    socials: SocialLinksSchema
    about_image: Optional[str] = ""

    class Config:
        from_attributes = True
