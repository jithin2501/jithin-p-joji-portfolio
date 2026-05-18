from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.core.database import get_database
from app.repositories.contact_repository import ContactRepository
from app.services.contact_service import ContactService
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter()

def get_contact_service(db = Depends(get_database)) -> ContactService:
    repository = ContactRepository(db)
    return ContactService(repository)

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(contact_in: ContactCreate, service: ContactService = Depends(get_contact_service)):
    contact = await service.create_contact(contact_in)
    return ContactResponse(
        id=contact.id,
        name=contact.name,
        email=contact.email,
        subject=contact.subject,
        message=contact.message,
        createdAt=contact.created_at
    )

@router.get("/", response_model=List[ContactResponse])
async def get_contacts(service: ContactService = Depends(get_contact_service)):
    contacts = await service.get_all_contacts()
    return [
        ContactResponse(
            id=c.id,
            name=c.name,
            email=c.email,
            subject=c.subject,
            message=c.message,
            createdAt=c.created_at
        ) for c in contacts
    ]

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(contact_id: str, service: ContactService = Depends(get_contact_service)):
    success = await service.delete_contact(contact_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found or invalid ID"
        )
