from typing import List, Optional
from app.repositories.contact_repository import ContactRepository
from app.models.contact import Contact
from app.schemas.contact import ContactCreate

class ContactService:
    def __init__(self, repository: ContactRepository):
        self.repository = repository

    async def create_contact(self, schema: ContactCreate) -> Contact:
        contact = Contact(
            name=schema.name,
            email=schema.email,
            subject=schema.subject,
            message=schema.message
        )
        return await self.repository.create(contact)

    async def get_all_contacts(self) -> List[Contact]:
        return await self.repository.get_all()

    async def get_contact_by_id(self, id: str) -> Optional[Contact]:
        return await self.repository.get_by_id(id)

    async def delete_contact(self, id: str) -> bool:
        return await self.repository.delete(id)
