from uuid import uuid4

from pydantic import ValidationError

from app.customers.schemas import CustomerCreate, CustomerResponse, CustomerUpdate


def test_customer_create_accepts_name_and_optional_fields():
    customer = CustomerCreate(name="Ana Martínez", email="ana@example.com")

    assert customer.name == "Ana Martínez"
    assert customer.email == "ana@example.com"


def test_customer_create_rejects_invalid_email():
    try:
        CustomerCreate(name="Ana Martínez", email="invalid")
    except ValidationError:
        pass
    else:
        raise AssertionError("Invalid email should fail validation")


def test_customer_update_allows_partial_updates():
    update = CustomerUpdate(phone="+54 9 11 1234-5678", active=False)

    assert update.name is None
    assert update.phone == "+54 9 11 1234-5678"
    assert update.active is False


def test_customer_response_maps_from_model_shape():
    now = "2026-11-19T19:00:00Z"
    customer = CustomerResponse.model_validate(
        {
            "id": uuid4(),
            "workshop_id": uuid4(),
            "name": "Carlos Rodríguez",
            "tax_id": "20-12345678-9",
            "phone": "+54 9 11 1234-5678",
            "email": "carlos@example.com",
            "address": "Av. Corrientes 1234",
            "fiscal_condition": "B",
            "preferred_channel": "email",
            "active": True,
            "created_at": now,
            "updated_at": now,
        }
    )

    assert customer.name == "Carlos Rodríguez"
