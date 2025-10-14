
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os

router = APIRouter()

UPLOAD_DIR = "documents"

@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Upload a list of files to the server.

    Args:
        files (List[UploadFile], optional): A list of files to upload. Defaults to File(...).

    Returns:
        dict: A message indicating that the files were uploaded successfully.
    """
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        try:
            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    return {"message": f"Successfully uploaded {[file.filename for file in files]}"}

