from pydantic import BaseModel
from typing import List, Optional

class QuantitySchema(BaseModel):
    size: str
    qty: str

class FlavorSchema(BaseModel):
    flavor: str
    quantities: List[QuantitySchema]
    

class OrderCreateSchema(BaseModel):
    name: str
    caterer: str
    deliveryDetails: str
    contact: str
    deliveryDate: str
    deliveryTime: str
    deliveryLocation: str
    flavors: List[FlavorSchema]

class OrderListSchema(BaseModel):
    id: int
    name: str
    caterer: str
    delivery_location: str
    delivery_date: str
    delivery_time: Optional[str]  # Allow None for delivery_time
    status: str

    class Config:
        orm_mode = True

class CustomerCreateSchema(BaseModel):
    name: str
    caterer: str
    contact: str
    address: str

class CustomerListSchema(BaseModel):
    id: int
    name: str
    caterer: str
    contact: str
    address: str
    class Config:
        orm_mode = True

class OrderStatusUpdateSchema(BaseModel):
    status: str