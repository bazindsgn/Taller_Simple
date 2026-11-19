from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.vehicles.model import CustomerVehicle, Vehicle
    from app.workshops.model import Workshop


class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = (
        UniqueConstraint("workshop_id", "tax_id", name="uq_customers_workshop_tax_id"),
        UniqueConstraint("workshop_id", "id", name="uq_customers_workshop_id"),
    )

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    workshop_id: Mapped[UUID] = mapped_column(
        ForeignKey("workshops.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    tax_id: Mapped[str | None] = mapped_column(String(32), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address: Mapped[str | None] = mapped_column(String(500), nullable=True)
    fiscal_condition: Mapped[str | None] = mapped_column(String(32), nullable=True)
    preferred_channel: Mapped[str | None] = mapped_column(String(32), nullable=True)
    active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default=text("true")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False
    )

    workshop: Mapped["Workshop"] = relationship(back_populates="customers")
    vehicle_links: Mapped[list["CustomerVehicle"]] = relationship(
        back_populates="customer", cascade="all"
    )
    vehicles: Mapped[list["Vehicle"]] = relationship(
        secondary="customer_vehicle", viewonly=True, back_populates="customers"
    )
