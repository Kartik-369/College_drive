from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
import datetime
import uuid
import os
import firebase_admin
from firebase_admin import credentials, storage
from routes.user import oauth2_scheme
from database import files_collection
from bson.objectid import ObjectId

router = APIRouter()

# Initialize Firebase Admin (Ensure you have FIREBASE_CREDENTIALS_JSON or set it up via env vars)
# For now, we assume it's initialized in main.py or here if not initialized.
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate("firebase_credentials.json") # Default placeholder
        firebase_admin.initialize_app(cred, {
            'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET", "your-app.appspot.com")
        })
    except Exception as e:
        print("Firebase initialization failed:", e)

class PreSignRequest(BaseModel):
    file_name: str
    content_type: str
    size: int

class FileSaveRequest(BaseModel):
    file_name: str
    size: int
    cloud_storage_url: str

@router.post('/files/presign')
async def generate_presigned_url(request: PreSignRequest, token: str = Depends(oauth2_scheme)):
    try:
        bucket = storage.bucket()
        # Generate a unique path for the file
        unique_filename = f"{uuid.uuid4()}_{request.file_name}"
        blob = bucket.blob(unique_filename)
        
        # Generate pre-signed URL for upload (PUT)
        url = blob.generate_signed_url(
            version="v4",
            expiration=datetime.timedelta(minutes=15),
            method="PUT",
            content_type=request.content_type
        )
        
        # We also generate the public download URL that we will save later
        # However, for Firebase storage, usually the format is:
        # https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?alt=media
        
        return {"upload_url": url, "file_path": unique_filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/files')
async def save_file_metadata(request: FileSaveRequest, token: str = Depends(oauth2_scheme)):
    # Decoding token to get user id would be ideal, but for now we just save the file
    from routes.user import verify_token
    user = verify_token(token)
    if not user:
         raise HTTPException(status_code=401, detail="Invalid token")
         
    file_doc = {
        "user_email": user.get('sub'), # Assuming 'sub' has email
        "file_name": request.file_name,
        "size": request.size,
        "cloud_storage_url": request.cloud_storage_url,
        "uploaded_at": datetime.datetime.utcnow()
    }
    
    result = await files_collection.insert_one(file_doc)
    file_doc["_id"] = str(result.inserted_id)
    return file_doc

@router.get('/files')
async def list_files(token: str = Depends(oauth2_scheme)):
    from routes.user import verify_token
    user = verify_token(token)
    if not user:
         raise HTTPException(status_code=401, detail="Invalid token")
         
    user_email = user.get('sub')
    cursor = files_collection.find({"user_email": user_email}).sort("uploaded_at", -1)
    files = await cursor.to_list(length=100)
    
    for f in files:
        f["_id"] = str(f["_id"])
        
    return files

@router.delete('/files/{file_id}')
async def delete_file(file_id: str, token: str = Depends(oauth2_scheme)):
    from routes.user import verify_token
    user = verify_token(token)
    if not user:
         raise HTTPException(status_code=401, detail="Invalid token")
         
    try:
        # Delete from MongoDB
        result = await files_collection.delete_one({"_id": ObjectId(file_id), "user_email": user.get('sub')})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="File not found")
            
        # Note: You should ideally also delete from Firebase Storage here using Admin SDK
        # blob = bucket.blob(file_path)
        # blob.delete()
        
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))