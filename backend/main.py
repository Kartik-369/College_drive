import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import db_connec
from routes import user
from routes import files
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# DB connection
@asynccontextmanager
async def life(app: FastAPI):
    await db_connec()
    print("Database connected")
    yield

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)

# Pass the lifespan to FastAPI
app = FastAPI(lifespan=life)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Secure CORS (No wildcard regex, strictly defined origins)
origins = [
    "https://collegedrive-frontend.onrender.com",
    "https://lab-zip.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(user.router)
app.include_router(files.router)

@app.get('/')
def home():
    return {'message': 'LabZip running!'}
