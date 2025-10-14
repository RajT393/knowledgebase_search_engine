
from fastapi import FastAPI
from app.upload import router as upload_router
from app.query import router as query_router
from app.utils import setup_environment, setup_logging

app = FastAPI(
    title="Knowledge-Base Search Engine",
    description="A RAG-based search engine for your documents.",
    version="1.0.0",
)

@app.on_event("startup")
async def startup_event():
    setup_environment()
    setup_logging()

app.include_router(upload_router, prefix="/api")
app.include_router(query_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the Knowledge-Base Search Engine!"}

