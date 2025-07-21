from sqlalchemy import Column, Integer, String, Date, Time, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class OrderDetails(Base):
    __tablename__ = "order_details"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    caterer = Column(String, nullable=False)
    delivery_location = Column(String, nullable=False)
    delivery_date = Column(String, nullable=False)
    delivery_time = Column(String, nullable=True)  # Add this line
    status = Column(String, default="order received")

class OrderFull(Base):
    __tablename__ = "order_full"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    caterer = Column(String, nullable=False)
    delivery_location = Column(String, nullable=False)
    delivery_date = Column(String, nullable=False)
    delivery_time = Column(String, nullable=True)  # Add this line
    status = Column(String, default="order")
    delivery_details = Column(String)
    contact = Column(String)
    flavors = Column(JSON)  # Store the flavors array as JSON

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    caterer = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    address = Column(String, nullable=False)