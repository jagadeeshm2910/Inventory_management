from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import new_order
from app import models, database

app = FastAPI()

origins = ["http://localhost:5175"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(new_order.router, prefix="/orders", tags=["orders"])

@app.on_event("startup")
def startup():
    models.Base.metadata.create_all(bind=database.engine)