from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
import datetime
import uuid
import os
import boto3
from botocore.exceptions import ClientError
from routes.user import oauth2_scheme
from database import files_collection
from bson.objectid import ObjectId

router = APIRouter()

# Initialize Boto3 for Backblaze B2
s3_client = boto3.client(
    's3',
    endpoint_url=os.getenv("B2_ENDPOINT_URL"),
    aws_access_key_id=os.getenv("B2_KEY_ID"),
    aws_secret_access_key=os.getenv("B2_APPLICATION_KEY"),
)
BUCKET_NAME = os.getenv("B2_BUCKET_NAME")

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
        # Generate a unique path for the file
        unique_filename = f"{uuid.uuid4()}_{request.file_name}"
        
        # Generate pre-signed URL for upload (PUT) using boto3
        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': BUCKET_NAME,
                'Key': unique_filename,
                'ContentType': request.content_type
            },
            ExpiresIn=900 # 15 minutes
        )
        
        return {"upload_url": presigned_url, "file_path": unique_filename}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/files')
async def save_file_metadata(request: FileSaveRequest, token: str = Depends(oauth2_scheme)):
    from routes.user import verify_token
    user = verify_token(token)
    if not user:
         raise HTTPException(status_code=401, detail="Invalid token")
         
    file_doc = {
        "user_email": user.get('sub'), 
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
        
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))