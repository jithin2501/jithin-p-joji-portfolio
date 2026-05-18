from typing import Optional

class HeroStats:
    def __init__(self, projects: str, experience: str, commits: str, satisfaction: str):
        self.projects = projects
        self.experience = experience
        self.commits = commits
        self.satisfaction = satisfaction

    def to_mongo(self) -> dict:
        return {
            "projects": self.projects,
            "experience": self.experience,
            "commits": self.commits,
            "satisfaction": self.satisfaction
        }

    @staticmethod
    def from_mongo(data: dict) -> "HeroStats":
        if not data:
            return HeroStats("15+", "1yr", "2K+", "99%")
        return HeroStats(
            projects=data.get("projects", "15+"),
            experience=data.get("experience", "1yr"),
            commits=data.get("commits", "2K+"),
            satisfaction=data.get("satisfaction", "99%")
        )

class SocialLinks:
    def __init__(self, github: str, linkedin: str, email: str, phone: str, location: str):
        self.github = github
        self.linkedin = linkedin
        self.email = email
        self.phone = phone
        self.location = location

    def to_mongo(self) -> dict:
        return {
            "github": self.github,
            "linkedin": self.linkedin,
            "email": self.email,
            "phone": self.phone,
            "location": self.location
        }

    @staticmethod
    def from_mongo(data: dict) -> "SocialLinks":
        if not data:
            return SocialLinks(
                github="https://github.com/jithin2501",
                linkedin="https://www.linkedin.com/in/jithin05/",
                email="jithinpjoji@gmail.com",
                phone="+91 9061058123",
                location="Bengaluru, Kerala, India"
            )
        return SocialLinks(
            github=data.get("github", "https://github.com/jithin2501"),
            linkedin=data.get("linkedin", "https://www.linkedin.com/in/jithin05/"),
            email=data.get("email", "jithinpjoji@gmail.com"),
            phone=data.get("phone", "+91 9061058123"),
            location=data.get("location", "Bengaluru, Kerala, India")
        )

class PortfolioSettings:
    def __init__(self, hero: HeroStats, socials: SocialLinks, id: Optional[str] = "global"):
        self.id = id
        self.hero = hero
        self.socials = socials

    def to_mongo(self) -> dict:
        return {
            "_id": self.id,
            "hero": self.hero.to_mongo(),
            "socials": self.socials.to_mongo()
        }

    @staticmethod
    def from_mongo(data: dict) -> "PortfolioSettings":
        if not data:
            return PortfolioSettings(
                hero=HeroStats.from_mongo(None),
                socials=SocialLinks.from_mongo(None)
            )
        return PortfolioSettings(
            id=data.get("_id", "global"),
            hero=HeroStats.from_mongo(data.get("hero")),
            socials=SocialLinks.from_mongo(data.get("socials"))
        )
