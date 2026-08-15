import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import db_connec
from routes import user
from fastapi.middleware.cors import CORSMiddleware
from routes import files

@asynccontextmanager
async def life(app:FastAPI):
	await db_connec()
	yield

app=FastAPI(lifespan=life)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173,https://college-drive.vercel.app")
origins = [
    "https://collegedrive-frontend.onrender.com",
    "http://localhost",
    "http://localhost:80",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:80",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(user.router)
app.include_router(files.router)

@app.get('/')
def home():
	return {'hello'}