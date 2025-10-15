from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    """
    Upload multiple files to the knowledge base
    """
    uploaded_files = []
    errors = []
    
    logger.info(f"Received upload request for {len(files)} files")
    
    for file in files:
        try:
            logger.info(f"Processing file: {file.filename}")
            
            # Validate file type
            allowed_extensions = {'.pdf', '.txt', '.doc', '.docx'}
            file_extension = Path(file.filename).suffix.lower()
            
            if file_extension not in allowed_extensions:
                errors.append(f"File type {file_extension} not allowed for {file.filename}")
                continue
            
            # Read file content for size validation
            file_content = await file.read()
            file_size = len(file_content)
            
            # Validate file size (10MB max)
            max_size = 10 * 1024 * 1024
            if file_size > max_size:
                errors.append(f"File {file.filename} is too large. Maximum size is 10MB.")
                continue
            
            # Reset file pointer
            await file.seek(0)
            
            # Create unique filename if exists
            file_path = UPLOAD_DIR / file.filename
            counter = 1
            original_stem = Path(file.filename).stem
            original_extension = Path(file.filename).suffix
            
            while file_path.exists():
                new_filename = f"{original_stem}_{counter}{original_extension}"
                file_path = UPLOAD_DIR / new_filename
                counter += 1
            
            # Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            logger.info(f"File saved successfully to: {file_path}")
            
            uploaded_files.append({
                "filename": file_path.name,
                "original_name": file.filename,
                "size": file_size,
                "path": str(file_path)
            })
            
            logger.info(f"Successfully uploaded file: {file.filename} as {file_path.name}")
            
        except Exception as e:
            error_msg = f"Error uploading {file.filename}: {str(e)}"
            errors.append(error_msg)
            logger.error(error_msg, exc_info=True)
    
    # Return response
    if uploaded_files:
        return JSONResponse(
            status_code=200,
            content={
                "message": f"Successfully uploaded {len(uploaded_files)} file(s)",
                "uploaded_files": uploaded_files,
                "errors": errors
            }
        )
    else:
        raise HTTPException(
            status_code=400,
            detail={"message": "No files were uploaded successfully", "errors": errors}
        )

@router.get("/files")
async def get_uploaded_files():
    """
    Get list of all uploaded files
    """
    try:
        files = []
        if UPLOAD_DIR.exists():
            for file_path in UPLOAD_DIR.iterdir():
                if file_path.is_file():
                    files.append(file_path.name)
        
        return {"files": files}
    except Exception as e:
        logger.error(f"Error fetching files: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching files: {str(e)}")

@router.delete("/files/{filename}")
async def delete_file(filename: str):
    """
    Delete a specific file
    """
    try:
        # Security check
        if '..' in filename or '/' in filename or '\\' in filename:
            raise HTTPException(status_code=400, detail="Invalid filename")
            
        file_path = UPLOAD_DIR / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        file_path.unlink()
        logger.info(f"Deleted file: {filename}")
        
        return {"message": f"File {filename} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting file {filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")