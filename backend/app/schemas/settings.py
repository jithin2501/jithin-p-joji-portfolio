from pydantic import BaseModel, Field

class HeroStatsSchema(BaseModel):
    projects: str = Field(..., description="Project count statistic (e.g. 15+)")
    experience: str = Field(..., description="Years of experience (e.g. 1yr)")
    commits: str = Field(..., description="Github commit count (e.g. 2K+)")
    satisfaction: str = Field(..., description="Client satisfaction rate (e.g. 99%)")

class SocialLinksSchema(BaseModel):
    github: str = Field(..., description="GitHub profile URL")
    linkedin: str = Field(..., description="LinkedIn profile URL")
    email: str = Field(..., description="Contact Email Address")
    phone: str = Field(..., description="Contact Phone Number")
    location: str = Field(..., description="Location Address")

class SettingsResponse(BaseModel):
    hero: HeroStatsSchema
    socials: SocialLinksSchema

    class Config:
        from_attributes = True
