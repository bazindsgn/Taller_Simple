from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class WorkshopBase(BaseModel):
    name: str
    reminder_config: dict[str, Any] | None = None
    global_feature_flags: dict[str, Any] | None = None


class WorkshopCreate(WorkshopBase):
    pass


class WorkshopUpdate(BaseModel):
    name: str | None = None
    reminder_config: dict[str, Any] | None = None
    global_feature_flags: dict[str, Any] | None = None
    active: bool | None = None


class WorkshopResponse(WorkshopBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    active: bool
    created_at: datetime
    updated_at: datetime
