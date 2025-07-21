import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
print("SQLALCHEMY_DATABASE_URL:", os.getenv("SQLALCHEMY_DATABASE_URL"))
print("DATABASE_URL:", os.getenv("DATABASE_URL"))

SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL") or os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    raise Exception("No database URL found! Please set SQLALCHEMY_DATABASE_URL or DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)