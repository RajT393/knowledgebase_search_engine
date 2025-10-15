from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.upload import router as upload_router
from app.query import router as query_router
from app.utils import setup_logging

app = FastAPI(
    title="Knowledge-Base Search Engine",
    description="A RAG-based search engine for your documents.",
    version="1.0.0",
)

# Set up CORS middleware
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory and mount it
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.on_event("startup")
async def startup_event():
    setup_logging()

# Include routers
app.include_router(upload_router, prefix="/api")
app.include_router(query_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the Knowledge-Base Search Engine!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Server is running"}