from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.upload import router as upload_router
from app.query import router as query_router
from app.documents import router as documents_router # New import
from app.utils import setup_logging

app = FastAPI(
    title="Knowledge-Base Search Engine",
    description="A RAG-based search engine for your documents.",
    version="1.0.0",
)

# Set up CORS middleware
origins = [
    "http://localhost:3000",  # The origin of our Next.js frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    setup_logging()

app.include_router(upload_router, prefix="/api")
app.include_router(query_router, prefix="/api")
app.include_router(documents_router, prefix="/api") # New router inclusion

@app.get("/")
async def root():
    return {"message": "Welcome to the Knowledge-Base Search Engine!"}