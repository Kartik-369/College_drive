from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import datetime
import uuid
import os
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from routes.user import oauth2_scheme
from database import files_collection
from bson.objectid import ObjectId
import urllib.parse

router = APIRouter()

# Initialize Boto3 for Backblaze B2
s3_client = boto3.client(
    's3',
    endpoint_url=os.getenv("B2_ENDPOINT_URL"),
    aws_access_key_id=os.getenv("B2_KEY_ID"),
    aws_secret_access_key=os.getenv("B2_APPLICATION_KEY"),
    region_name='eu-central-003',
    config=Config(signature_version='s3v4')
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
    subject_folder: str
    object_key: str

@router.post('/files/presign')
async def generate_presigned_url(request: PreSignRequest, token: str = Depends(oauth2_scheme)):
    try:
        unique_filename = f"{uuid.uuid4()}_{request.file_name}"

        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': BUCKET_NAME,
                'Key': unique_filename,
                'ContentType': request.content_type
            },
            ExpiresIn=900 
        )

        return {"upload_url": presigned_url, "file_path": unique_filename}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/files')
async def save_file_metadata(request: FileSaveRequest, token: str = Depends(oauth2_scheme)):
    from routes.user import verify_token
    user = await verify_token(token)
    if not user:
         raise HTTPException(status_code=401, detail="Invalid token")

    file_doc = {
        "user_email": user.get('email'),
        "file_name": request.file_name,
        "size": request.size,
        "cloud_storage_url": request.cloud_storage_url,
        "subject_folder": request.subject_folder,
        "object_key": request.object_key,
        "uploaded_at": datetime.datetime.utcnow()
    }

    result = await files_collection.insert_one(file_doc)
    file_doc["_id"] = str(result.inserted_id)
    return file_doc

@router.get('/files')
async def list_files(token: str = Depends(oauth2_scheme)):
    from routes.user import verify_token
    user = await verify_token(token)
    if not user:
         raise HTTPException(status_code=401, detail="Invalid token")

    user_email = user.get('email')
    cursor = files_collection.find({"user_email": user_email}).sort("uploaded_at", -1)
    files = await cursor.to_list(length=100)

    for f in files:
        f["_id"] = str(f["_id"])
        
        obj_key = f.get("object_key")
        if not obj_key and f.get("cloud_storage_url"):
            obj_key = urllib.parse.unquote(f["cloud_storage_url"].split('/')[-1])
            
        if obj_key:
            try:
                # Ensure safe filename
                raw_name = f.get("file_name", "submission")
                if not raw_name.endswith(".zip"):
                    raw_name += ".zip"
                safe_filename = urllib.parse.quote(raw_name)

                # Attach explicit binary headers to the download URL
                secure_url = s3_client.generate_presigned_url(
                    'get_object',
                    Params={
                        'Bucket': BUCKET_NAME,
                        'Key': obj_key,
                        'ResponseContentType': 'application/zip',
                        'ResponseContentDisposition': f'attachment; filename="{safe_filename}"'
                    },
                    ExpiresIn=3600
                )
                f["secure_download_url"] = secure_url
            except Exception as e:
                print("Presign Error:", e)
                f["secure_download_url"] = f.get("cloud_storage_url")
        else:
            f["secure_download_url"] = f.get("cloud_storage_url")

    return files

@router.delete('/files/{file_id}')
async def delete_file(file_id: str, token: str = Depends(oauth2_scheme)):
    from routes.user import verify_token
    user = await verify_token(token)
    if not user:
         raise HTTPException(status_code=401, detail="Invalid token")

    try:
        file_doc = await files_collection.find_one({"_id": ObjectId(file_id), "user_email": user.get('email')})
        if not file_doc:
             raise HTTPException(status_code=404, detail="File not found")
        
        obj_key = file_doc.get("object_key")
        if not obj_key and file_doc.get("cloud_storage_url"):
             obj_key = urllib.parse.unquote(file_doc["cloud_storage_url"].split('/')[-1])
        
        if obj_key:
             try:
                 s3_client.delete_object(Bucket=BUCKET_NAME, Key=obj_key)
             except ClientError as e:
                 print(f"Failed to delete {obj_key} from B2:", e)

        result = await files_collection.delete_one({"_id": ObjectId(file_id), "user_email": user.get('email')})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="File not found")

        return {"message": "File completely deleted from cloud and database"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/files/{file_id}/download')
async def download_file_stream(file_id: str, token: str = Depends(oauth2_scheme)):
    from routes.user import verify_token
    from fastapi import Response

    user = await verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if not file_id or file_id == "undefined" or not ObjectId.is_valid(file_id):
        raise HTTPException(status_code=400, detail="Invalid file ID")

    file_doc = await files_collection.find_one({
        "_id": ObjectId(file_id),
        "user_email": user.get('email')
    })
    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")

    obj_key = file_doc.get("object_key")
    if not obj_key and file_doc.get("cloud_storage_url"):
        obj_key = urllib.parse.unquote(file_doc["cloud_storage_url"].split('/')[-1])

    try:
        s3_response = s3_client.get_object(Bucket=BUCKET_NAME, Key=obj_key)
        # Read entire file into memory — safe because uploads are capped at 15MB
        file_bytes = s3_response['Body'].read()

        safe_name = file_doc.get("file_name", "download.zip")
        if not safe_name.endswith(".zip"):
            safe_name += ".zip"

        # Fix existing ZIPs that have "./" prefixed paths (Windows Explorer rejects these)
        import zipfile
        import io
        try:
            zip_buffer = io.BytesIO(file_bytes)
            with zipfile.ZipFile(zip_buffer, 'r') as zin:
                needs_repack = any(name.startswith('./') or name.startswith('/') for name in zin.namelist())
                if needs_repack:
                    clean_buffer = io.BytesIO()
                    with zipfile.ZipFile(clean_buffer, 'w', zipfile.ZIP_DEFLATED) as zout:
                        for item in zin.namelist():
                            clean_name = item.lstrip('./')
                            if not clean_name:
                                continue
                            zout.writestr(clean_name, zin.read(item))
                    file_bytes = clean_buffer.getvalue()
        except zipfile.BadZipFile:
            pass  # Not a zip or already clean, serve as-is

        return Response(
            content=file_bytes,
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": f'attachment; filename="{safe_name}"',
                "Content-Length": str(len(file_bytes)),
                "Content-Type": "application/octet-stream",
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"S3 Retrieval Error: {str(e)}")


# ============================================================
# TEMPORARY DEBUG ENDPOINT — remove after testing
# Visit http://localhost:8000/test-download directly in browser
# This bypasses ALL JavaScript, ALL CORS, ALL auth
# ============================================================
@router.get('/test-download')
async def test_download():
    from fastapi import Response
    import zipfile as zf_module
    import io as io_module

    # Dynamically find the latest object in B2
    try:
        listing = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
        if 'Contents' not in listing or len(listing['Contents']) == 0:
            return {"error": "Bucket is empty"}
        test_key = listing['Contents'][-1]['Key']
    except Exception as e:
        return {"error": f"Failed to list bucket: {str(e)}"}

    try:
        s3_response = s3_client.get_object(Bucket=BUCKET_NAME, Key=test_key)
        file_bytes = s3_response['Body'].read()

        # Repack to strip ./ prefixes
        try:
            buf = io_module.BytesIO(file_bytes)
            with zf_module.ZipFile(buf, 'r') as zin:
                if any(n.startswith('./') for n in zin.namelist()):
                    clean_buf = io_module.BytesIO()
                    with zf_module.ZipFile(clean_buf, 'w', zf_module.ZIP_DEFLATED) as zout:
                        for item in zin.namelist():
                            clean_name = item.lstrip('./')
                            if not clean_name:
                                continue
                            zout.writestr(clean_name, zin.read(item))
                    file_bytes = clean_buf.getvalue()
        except zf_module.BadZipFile:
            pass

        return Response(
            content=file_bytes,
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": f'attachment; filename="test_download.zip"',
                "Content-Length": str(len(file_bytes)),
            }
        )
    except Exception as e:
        return {"error": str(e)}
