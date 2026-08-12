from email.message import EmailMessage
import smtplib
from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from models import User
from dotenv import load_dotenv
import os
import secrets
import requests
from database import users_collection
from pydantic import BaseModel
from routes.user_verfiy_login import auth_user
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt,JWTError
from datetime import datetime,timedelta

load_dotenv()
SECRET_KEY=os.getenv('SECRET_KEY')
ALGORITHM=os.getenv('ALGORITHM')
SENDER_EMAIL=os.getenv('SENDER_EMAIL')
SENDER_PASSWORD=os.getenv("SENDER_PASSWORD")
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
oauth2_scheme=OAuth2PasswordBearer(tokenUrl="auth/login")
router=APIRouter()
class GoogleAuthRequest(BaseModel):
    token:str
pwd_context=CryptContext(schemes=["bcrypt"], deprecated="auto",bcrypt__rounds=9)

@router.post("/register")
async def register(user:User):
    user_exists=await users_collection.find_one({'email':user.email})
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already in use")
    user.password=pwd_context.hash(user.password)
    user_dict=user.model_dump()
    await users_collection.insert_one(user_dict)
    return {'message':'Registered successfully'}

@router.post("/login")
async def login(data:OAuth2PasswordRequestForm=Depends()):
    valid_user=await auth_user(data.username, data.password)   
    if not valid_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token=create_access_token({'sub':data.username})
    return {"access_token": token,'token_type':'bearer','message':'Logged in successfully'}

def create_access_token(data:dict):
    yet_to_encode=data.copy()
    expire=timedelta(minutes=30)
    yet_to_encode.update({'exp':datetime.utcnow()+expire})
    encoded=jwt.encode(yet_to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encoded

async def verify_token(token:str):
    try:
        key=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        email:str=key.get('sub')
        if email is None:
            return None
        return {'email':email}
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")

@router.get("/vault")
async def get_vault(token:str=Depends(oauth2_scheme)):
    email=await verify_token(token)
    if email is None:
        raise HTTPException(status_code=400, detail="Invalid token")
    return {'your_email':email}

@router.post('/auth/google')
async def google_auth(request: GoogleAuthRequest):
    try:
        google_response=requests.get(f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={request.token}")
        if google_response.status_code!=200:
            print(google_response.text)
            raise HTTPException(status_code=400, detail="Invalid Google Token")
        user_data=google_response.json()
        email=user_data.get('email')
        user=await users_collection.find_one({'email': email})
        if not user:
            new_user={
                "email": email,
                "password": "GOOGLE_AUTH_USER",
                "provider": "google"
            }
            await users_collection.insert_one(new_user)
        token=create_access_token({'sub': email})
        return {"access_token": token, 'token_type': 'bearer', 'message': 'Google Login Successful'}
    except Exception as e:
        print("Backend Auth Error:", e)
        raise HTTPException(status_code=400,detail='Server error during Google Auth')

@router.post("/forgot-password")
async def forgot_password(email:str):
    user = await users_collection.find_one({'email':email})
    if not user:
        return {"message": "reset link has been sent."}
    reset_token = secrets.token_urlsafe(32)
    expiration = datetime.utcnow()+timedelta(minutes=15)
    await users_collection.update_one(
        {'email': email},
        {'$set': {'reset_token': reset_token, 'reset_expiration': expiration}}
    )
    reset_link = f"https://neuro-business.vercel.app/reset-password?token={reset_token}"
    resend_api_key = os.getenv("RESEND_API_KEY")
    headers = {
        "Authorization": f"Bearer {resend_api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "from": "onboarding@resend.dev", 
        "to": [email],
        "subject": "NeuroBusiness: Password Reset",
        "html": f"<p>Hello,</p><p>Click <a href='{reset_link}'>here</a> to reset your password.</p><p>This link expires in 15 minutes.</p>"
    }
    try:
        response = requests.post("https://api.resend.com/emails", json=payload, headers=headers)
        response.raise_for_status() 
    except Exception as e:
        print(f"Resend API Error: {e}")
        if 'response' in locals():
            print(f"Resend Details: {response.text}")
        raise HTTPException(status_code=500, detail="Failed to send email")
    return {"message":"reset link has been sent."}


class PasswordReset(BaseModel):
    token: str
    new_password: str

@router.post("/reset-password")
async def reset_password(data:PasswordReset):
    user = await users_collection.find_one({
        'reset_token':data.token,
        'reset_expiration':{'$gt':datetime.utcnow()}
    })
    if not user:
        raise HTTPException(status_code=400,detail="expired token.")
    hashed_password=pwd_context.hash(data.new_password)
    await users_collection.update_one(
        {'_id': user['_id']},
        {
            '$set': {'password': hashed_password},
            '$unset': {'reset_token':"",'reset_expiration':""}
        }
    )
    return {"message": "successfully reset."}