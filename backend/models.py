from pydantic import BaseModel, EmailStr

class User(BaseModel):
    email: EmailStr
    password: str

class PreSignRequest(BaseModel):
    file_name: str
    content_type: str
    size: int
    folder_name: str

class FileSaveRequest(BaseModel):
    file_name: str
    size: int
    cloud_storage_url: str
    subject_folder: str
    object_key: str

