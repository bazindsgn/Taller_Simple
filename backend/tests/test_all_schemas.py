from uuid import uuid4

from pydantic import ValidationError

from app.vehicles.schemas import (
    CustomerVehicleCreate,
    VehicleCreate,
    VehicleUpdate,
)
from app.workshops.schemas import WorkshopCreate, WorkshopUpdate


def test_workshop_create_and_partial_update():
    workshop = WorkshopCreate(name="Taller Tomalino")
    update = WorkshopUpdate(active=False)

    assert workshop.name == "Taller Tomalino"
    assert update.name is None
    assert update.active is False


def test_vehicle_create_accepts_existing_contract_fields():
    vehicle = VehicleCreate(
        plate="AB123CD",
        brand="Toyota",
        model="Corolla",
        year=2018,
        color="Gris",
        vin="1HGBH41JXMN109186",
    )

    assert vehicle.plate == "AB123CD"
    assert vehicle.year == 2018


def test_vehicle_rejects_invalid_year():
    try:
        VehicleCreate(
            plate="AB123CD",
            brand="Toyota",
            model="Corolla",
            year=1800,
        )
    except ValidationError:
        pass
    else:
        raise AssertionError("Year outside supported range should fail")


def test_vehicle_update_allows_partial_updates():
    update = VehicleUpdate(year=2020, active=False)

    assert update.brand is None
    assert update.year == 2020
    assert update.active is False


def test_customer_vehicle_create_accepts_relationship():
    link = CustomerVehicleCreate(
        vehicle_id=uuid4(),
        relationship_type="authorized",
        is_primary=True,
    )

    assert link.relationship_type == "authorized"
    assert link.is_primary is True
