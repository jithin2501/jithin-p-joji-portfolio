from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, description="Project Title")
    subtitle: Optional[str] = Field(default="PROJECT DETAILS", description="Project Subtitle")
    description: str = Field(..., min_length=1, description="Short project description")
    long_desc: str = Field(..., min_length=1, description="Detailed project description")
    image: str = Field(..., min_length=1, description="Thumbnail image URL")
    images: List[str] = Field(default=[], description="Full preview image URLs list")
    category: str = Field(..., min_length=1, description="Category of the project (e.g. Web Apps, E-Commerce, etc.)")
    role: str = Field(..., description="Developer role (e.g. Full Stack Developer)")
    duration: str = Field(..., description="Project duration")
    completed: str = Field(..., description="Completion month/year")
    tools: str = Field(..., description="Tools used")
    methodology: str = Field(..., description="Methodology (e.g. Scrum, Agile)")
    features: List[Dict[str, str]] = Field(default=[], description="Key features of the project: list of {'title': str, 'desc': str, 'icon': str}")
    tech_stack: List[Dict[str, str]] = Field(default=[], description="Tech stack tags: list of {'name': str, 'icon': str}")
    learned: str = Field(..., description="What was learned during the project")
    details_tech: Optional[List[Dict[str, str]]] = Field(default=[], description="Extra project details page tech stack: list of {'name': str, 'icon': str}")
    featured: str = Field(default="project", description="Classification tag (feature, project, new, freelancing)")
    live_url: Optional[str] = Field(default="#", description="Live project URL")
    github_url: Optional[str] = Field(default="#", description="GitHub URL")

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    long_desc: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    category: Optional[str] = None
    role: Optional[str] = None
    duration: Optional[str] = None
    completed: Optional[str] = None
    tools: Optional[str] = None
    methodology: Optional[str] = None
    features: Optional[List[Dict[str, str]]] = None
    tech_stack: Optional[List[Dict[str, str]]] = None
    learned: Optional[str] = None
    details_tech: Optional[List[Dict[str, str]]] = None
    featured: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    title: str
    subtitle: str
    description: str
    long_desc: str
    image: str
    images: List[str]
    category: str
    role: str
    duration: str
    completed: str
    tools: str
    methodology: str
    features: List[Dict[str, str]]
    tech_stack: List[Dict[str, str]]
    learned: str
    details_tech: List[Dict[str, str]] = []
    featured: str
    live_url: str
    github_url: str
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
