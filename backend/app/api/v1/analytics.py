from fastapi import APIRouter, Depends, status, Request
from typing import List
from app.core.database import get_database
from app.repositories.analytics_repository import AnalyticsRepository
from app.models.analytics import AnalyticsVisit
from app.schemas.analytics import AnalyticsVisitCreate, AnalyticsVisitResponse

router = APIRouter()

def get_analytics_repository(db = Depends(get_database)) -> AnalyticsRepository:
    return AnalyticsRepository(db)

@router.post("/track", response_model=AnalyticsVisitResponse, status_code=status.HTTP_201_CREATED)
async def track_visit(visit_in: AnalyticsVisitCreate, request: Request, repo: AnalyticsRepository = Depends(get_analytics_repository)):
    # Fallback to resolver IP if not provided
    client_ip = visit_in.ip or request.client.host or "127.0.0.1"
    user_agent = visit_in.userAgent or request.headers.get("user-agent") or "Unknown"

    visit = AnalyticsVisit(
        user_id=visit_in.userId,
        path=visit_in.path,
        ip=client_ip,
        city=visit_in.city,
        country=visit_in.country,
        latitude=visit_in.latitude,
        longitude=visit_in.longitude,
        user_agent=user_agent
    )
    
    saved = await repo.create(visit)
    return AnalyticsVisitResponse(
        id=saved.id,
        userId=saved.user_id,
        path=saved.path,
        ip=saved.ip,
        city=saved.city,
        country=saved.country,
        latitude=saved.latitude,
        longitude=saved.longitude,
        userAgent=saved.user_agent,
        createdAt=saved.created_at
    )

@router.get("/", response_model=List[AnalyticsVisitResponse])
async def get_all_visits(repo: AnalyticsRepository = Depends(get_analytics_repository)):
    visits = await repo.get_all()
    return [
        AnalyticsVisitResponse(
            id=v.id,
            userId=v.user_id,
            path=v.path,
            ip=v.ip,
            city=v.city,
            country=v.country,
            latitude=v.latitude,
            longitude=v.longitude,
            userAgent=v.user_agent,
            createdAt=v.created_at
        ) for v in visits
    ]

@router.get("/stats")
async def get_visit_stats(repo: AnalyticsRepository = Depends(get_analytics_repository)):
    return await repo.get_stats()

@router.delete("/clear")
async def clear_all_visits(repo: AnalyticsRepository = Depends(get_analytics_repository)):
    await repo.delete_all()
    return {"message": "All analytics logs cleared successfully"}
