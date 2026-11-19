"""Create initial workshop, customer, and vehicle models.

Revision ID: 20261119_1515
Revises:
Create Date: 2026-11-19 15:15:00
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "20261119_1515"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | None = None


def upgrade() -> None:
    op.create_table(
        "workshops",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("reminder_config", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column(
            "global_feature_flags",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "customers",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("workshop_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("tax_id", sa.String(length=32), nullable=True),
        sa.Column("phone", sa.String(length=32), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("address", sa.String(length=500), nullable=True),
        sa.Column("fiscal_condition", sa.String(length=32), nullable=True),
        sa.Column("preferred_channel", sa.String(length=32), nullable=True),
        sa.Column("active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["workshop_id"], ["workshops.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("workshop_id", "tax_id", name="uq_customers_workshop_tax_id"),
        sa.UniqueConstraint("workshop_id", "id", name="uq_customers_workshop_id"),
    )
    op.create_index("ix_customers_workshop_id", "customers", ["workshop_id"], unique=False)

    op.create_table(
        "vehicles",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("workshop_id", sa.Uuid(), nullable=False),
        sa.Column("plate", sa.String(length=32), nullable=False),
        sa.Column("brand", sa.String(length=100), nullable=False),
        sa.Column("model", sa.String(length=100), nullable=False),
        sa.Column("year", sa.Integer(), nullable=True),
        sa.Column("color", sa.String(length=50), nullable=True),
        sa.Column("vin", sa.String(length=64), nullable=True),
        sa.Column("green_card_url", sa.String(length=1000), nullable=True),
        sa.Column("active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["workshop_id"], ["workshops.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("workshop_id", "id", name="uq_vehicles_workshop_id"),
    )
    op.create_index("ix_vehicles_workshop_id", "vehicles", ["workshop_id"], unique=False)

    op.create_table(
        "customer_vehicle",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("workshop_id", sa.Uuid(), nullable=False),
        sa.Column("customer_id", sa.Uuid(), nullable=False),
        sa.Column("vehicle_id", sa.Uuid(), nullable=False),
        sa.Column("relationship_type", sa.String(length=32), nullable=False),
        sa.Column("is_primary", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["workshop_id"], ["workshops.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(
            ["workshop_id", "customer_id"],
            ["customers.workshop_id", "customers.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["workshop_id", "vehicle_id"],
            ["vehicles.workshop_id", "vehicles.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "workshop_id",
            "customer_id",
            "vehicle_id",
            name="uq_customer_vehicle",
        ),
    )
    op.create_index(
        "ix_customer_vehicle_workshop_id",
        "customer_vehicle",
        ["workshop_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_customer_vehicle_workshop_id",
        table_name="customer_vehicle",
    )
    op.drop_table("customer_vehicle")
    op.drop_index("ix_vehicles_workshop_id", table_name="vehicles")
    op.drop_table("vehicles")
    op.drop_index("ix_customers_workshop_id", table_name="customers")
    op.drop_table("customers")
    op.drop_table("workshops")
