from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app import schemas, models, database
from typing import List

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()



@router.post("/")
def create_order(order: schemas.OrderCreateSchema, db: Session = Depends(get_db)):
    # Insert into order_details
    order_details = models.OrderDetails(
        name=order.name,
        caterer=order.caterer,
        delivery_location=order.deliveryLocation,
        delivery_date=order.deliveryDate,
        delivery_time=order.deliveryTime,  # Store delivery time
        status="order received"
    )
    db.add(order_details)
    db.commit()
    db.refresh(order_details)

    # Convert Pydantic models to dict for JSON storage
    flavors_as_dict = [flavor.dict() for flavor in order.flavors]

    order_full = models.OrderFull(
        name=order.name,
        caterer=order.caterer,
        delivery_location=order.deliveryLocation,
        delivery_date=order.deliveryDate,
        delivery_time=order.deliveryTime,  # Store delivery time
        status="order",
        delivery_details=order.deliveryDetails,
        contact=order.contact,
        flavors=flavors_as_dict  # Now a list of dicts, JSON serializable
    )
    db.add(order_full)
    db.commit()
    db.refresh(order_full)

    return {"order_details_id": order_details.id, "order_full_id": order_full.id}

@router.get("/", response_model=List[schemas.OrderListSchema])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(models.OrderDetails).all()
    return orders

@router.patch("/{order_id}")
def update_order(order_id: int, order: schemas.OrderCreateSchema, db: Session = Depends(get_db)):
    order_full = db.query(models.OrderFull).filter(models.OrderFull.id == order_id).first()
    if not order_full:
        raise HTTPException(status_code=404, detail="Order not found")
    order_full.name = order.name
    order_full.caterer = order.caterer
    order_full.delivery_location = order.deliveryLocation
    order_full.delivery_date = order.deliveryDate
    order_full.status = order_full.status  # Keep status as is, or update if needed
    order_full.delivery_details = order.deliveryDetails
    order_full.contact = order.contact
    order_full.flavors = [flavor.dict() for flavor in order.flavors]
    db.commit()
    db.refresh(order_full)
    return {"message": "Order updated", "order": order_full.id}

@router.post("/details")
def get_order_details(order_id: int = Body(..., embed=True), db: Session = Depends(get_db)):
    order_full = db.query(models.OrderFull).filter(models.OrderFull.id == order_id).first()
    if not order_full:
        raise HTTPException(status_code=404, detail="Order not found")
    return {
        "id": order_full.id,
        "name": order_full.name,
        "caterer": order_full.caterer,
        "deliveryDetails": order_full.delivery_details,
        "contact": order_full.contact,
        "deliveryDate": order_full.delivery_date,
        "deliveryLocation": order_full.delivery_location,
        "status": order_full.status,
        "flavors": order_full.flavors
    }

@router.post("/summary")
def get_order_summary(date: dict = Body(...), db: Session = Depends(get_db)):
    selected_date = date.get("date")
    if not selected_date:
        raise HTTPException(status_code=400, detail="Date is required")
    orders = db.query(models.OrderDetails).filter(models.OrderDetails.delivery_date == selected_date).all()
    total = len(orders)
    order_received = sum(1 for o in orders if o.status.strip().lower() == "order received")
    yet_to_be_packed = sum(1 for o in orders if o.status.strip().lower() == "yet to be packed")
    dispatched = sum(1 for o in orders if o.status.strip().lower() == "dispatched")
    return {
        "total": total,
        "order_received": order_received,
        "yet_to_be_packed": yet_to_be_packed,
        "dispatched": dispatched
    }

@router.post("/by-date", response_model=List[schemas.OrderListSchema])
def get_orders_by_date(date: dict = Body(...), db: Session = Depends(get_db)):
    selected_date = date.get("date")
    if not selected_date:
        raise HTTPException(status_code=400, detail="Date is required")
    orders = db.query(models.OrderDetails).filter(models.OrderDetails.delivery_date == selected_date).all()
    return orders

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order_full = db.query(models.OrderFull).filter(models.OrderFull.id == order_id).first()
    order_details = db.query(models.OrderDetails).filter(models.OrderDetails.id == order_id).first()
    if not order_full and not order_details:
        raise HTTPException(status_code=404, detail="Order not found")
    if order_full:
        db.delete(order_full)
    if order_details:
        db.delete(order_details)
    db.commit()
    return {"message": f"Order {order_id} deleted"}

@router.post("/customers")
def create_customer(customer: schemas.CustomerCreateSchema, db: Session = Depends(get_db)):
    db_customer = models.Customer(
        name=customer.name,
        caterer=customer.caterer,
        contact=customer.contact,
        address=customer.address
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return {"message": "Customer created", "customer_id": db_customer.id}

@router.get("/customers", response_model=List[schemas.CustomerListSchema])
def get_customers(db: Session = Depends(get_db)):
    customers = db.query(models.Customer).all()
    return customers

@router.get("/all-customers")
def get_all_customers(db: Session = Depends(get_db)):
    customers = db.query(models.Customer).all()
    customer_list = [
        {
            "id": c.id,
            "name": c.name,
            "caterer": c.caterer,
            "contact": c.contact,
            "address": c.address
        }
        for c in customers
    ]
    return {"customers": customer_list}

@router.patch("/{order_id}/status")
def update_order_status(order_id: int, status_update: schemas.OrderStatusUpdateSchema, db: Session = Depends(get_db)):
    order_details = db.query(models.OrderDetails).filter(models.OrderDetails.id == order_id).first()
    if not order_details:
        raise HTTPException(status_code=404, detail="Order not found")
    order_details.status = status_update.status
    db.commit()
    db.refresh(order_details)
    return {"message": "Order status updated", "order_id": order_id, "status": order_details.status}

@router.post("/flavour-summary-details")
def get_flavour_summary(date: dict = Body(...), db: Session = Depends(get_db)):
    selected_date = date.get("date")
    if not selected_date:
        raise HTTPException(status_code=400, detail="Date is required")
    orders = db.query(models.OrderFull).filter(models.OrderFull.delivery_date == selected_date).all()
    summary = {}
    for order in orders:
        for flavor in order.flavors:
            flavor_name = flavor.get("flavor")
            for qty in flavor.get("quantities", []):
                size = qty.get("size")
                qty_value = qty.get("qty", "0")
                try:
                    quantity = int(qty_value) if qty_value else 0
                except ValueError:
                    quantity = 0
                key = (flavor_name, size)
                if key not in summary:
                    summary[key] = 0
                summary[key] += quantity
    result = []
    for (flavor_name, size), total_qty in summary.items():
        if total_qty > 0:
            result.append({
                "flavor": flavor_name,
                "size": size,
                "quantity": total_qty
            })
    return {"summary": result}

@router.get("/caterers")
def get_caterers(db: Session = Depends(get_db)):
    customers = db.query(models.Customer).all()
    customer_list = [
        {
            "id": c.id,
            "name": c.name,
            "caterer": c.caterer,
            "contact": c.contact,
            "address": c.address
        }
        for c in customers
    ]
    return {"customers": customer_list}