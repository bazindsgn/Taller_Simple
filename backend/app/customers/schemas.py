from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class CustomerBase(BaseModel):
    name: str
    tax_id: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    address: str | None = None
    fiscal_condition: str | None = None
    preferred_channel: str | None = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: str | None = None
    tax_id: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    address: str | None = None
    fiscal_condition: str | None = None
    preferred_channel: str | None = None
    active: bool | None = None


class CustomerResponse(CustomerBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    workshop_id: UUID
    active: bool
    created_at: datetime
    updated_at: datetime
