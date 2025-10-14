
from fastapi import APIRouter
import os

router = APIRouter()

DOCUMENTS_DIR = "documents"

@router.get("/documents")
async def list_documents():
    """
    List all currently uploaded document filenames.

    Returns:
        dict: A dictionary containing a list of filenames.
    """
    if not os.path.exists(DOCUMENTS_DIR):
        return {"files": []}
    
    files = [f for f in os.listdir(DOCUMENTS_DIR) if os.path.isfile(os.path.join(DOCUMENTS_DIR, f))]
    return {"files": files}

