from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class VehicleBase(BaseModel):
    plate: str = Field(min_length=1, max_length=32)
    brand: str = Field(min_length=1, max_length=100)
    model: str = Field(min_length=1, max_length=100)
    year: int | None = Field(default=None, ge=1900, le=2100)
    color: str | None = Field(default=None, max_length=50)
    vin: str | None = Field(default=None, max_length=64)
    green_card_url: str | None = Field(default=None, max_length=1000)


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    plate: str | None = Field(default=None, min_length=1, max_length=32)
    brand: str | None = Field(default=None, min_length=1, max_length=100)
    model: str | None = Field(default=None, min_length=1, max_length=100)
    year: int | None = Field(default=None, ge=1900, le=2100)
    color: str | None = Field(default=None, max_length=50)
    vin: str | None = Field(default=None, max_length=64)
    green_card_url: str | None = Field(default=None, max_length=1000)
    active: bool | None = None


class VehicleResponse(VehicleBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    workshop_id: UUID
    active: bool
    created_at: datetime
    updated_at: datetime


class CustomerVehicleCreate(BaseModel):
    vehicle_id: UUID
    relationship_type: str = Field(default="owner", min_length=1, max_length=32)
    is_primary: bool = False


class CustomerVehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    workshop_id: UUID
    customer_id: UUID
    vehicle_id: UUID
    relationship_type: str
    is_primary: bool
    created_at: datetime
