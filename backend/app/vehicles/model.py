from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    ForeignKeyConstraint,
    Integer,
    String,
    UniqueConstraint,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.customers.model import Customer
    from app.workshops.model import Workshop


class Vehicle(Base):
    __tablename__ = "vehicles"
    __table_args__ = (UniqueConstraint("workshop_id", "id", name="uq_vehicles_workshop_id"),)

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    workshop_id: Mapped[UUID] = mapped_column(
        ForeignKey("workshops.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    plate: Mapped[str] = mapped_column(String(32), nullable=False)
    brand: Mapped[str] = mapped_column(String(100), nullable=False)
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    color: Mapped[str | None] = mapped_column(String(50), nullable=True)
    vin: Mapped[str | None] = mapped_column(String(64), nullable=True)
    green_card_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default=text("true")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False
    )

    workshop: Mapped["Workshop"] = relationship(back_populates="vehicles")
    customer_links: Mapped[list["CustomerVehicle"]] = relationship(
        back_populates="vehicle", cascade="all"
    )
    customers: Mapped[list["Customer"]] = relationship(
        secondary="customer_vehicle", viewonly=True, back_populates="vehicles"
    )


class CustomerVehicle(Base):
    __tablename__ = "customer_vehicle"
    __table_args__ = (
        UniqueConstraint(
            "workshop_id",
            "customer_id",
            "vehicle_id",
            name="uq_customer_vehicle",
        ),
        ForeignKeyConstraint(
            ["workshop_id", "customer_id"],
            ["customers.workshop_id", "customers.id"],
            ondelete="CASCADE",
        ),
        ForeignKeyConstraint(
            ["workshop_id", "vehicle_id"],
            ["vehicles.workshop_id", "vehicles.id"],
            ondelete="CASCADE",
        ),
    )

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    workshop_id: Mapped[UUID] = mapped_column(
        ForeignKey("workshops.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    customer_id: Mapped[UUID] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"), nullable=False
    )
    vehicle_id: Mapped[UUID] = mapped_column(
        ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False
    )
    relationship_type: Mapped[str] = mapped_column(String(32), nullable=False, default="owner")
    is_primary: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default=text("false")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False
    )

    customer: Mapped["Customer"] = relationship(back_populates="vehicle_links")
    vehicle: Mapped["Vehicle"] = relationship(back_populates="customer_links")
