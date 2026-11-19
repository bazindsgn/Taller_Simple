from app.customers.model import Customer
from app.database import Base
from app.vehicles.model import CustomerVehicle, Vehicle
from app.workshops.model import Workshop


def test_core_models_are_registered():
    assert Workshop.__table__.name == "workshops"
    assert Customer.__table__.name == "customers"
    assert Vehicle.__table__.name == "vehicles"
    assert CustomerVehicle.__table__.name == "customer_vehicle"
    assert {"workshops", "customers", "vehicles", "customer_vehicle"} <= set(Base.metadata.tables)


def test_vehicle_plate_is_not_unique():
    plate = Vehicle.__table__.c.plate

    assert plate.unique is not True
    assert not plate.primary_key
