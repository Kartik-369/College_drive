from database import users_collection
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_user(plain_pass:str,hash_pass:str):
    return pwd_context.verify(plain_pass, hash_pass)

async def auth_user(email:str,password:str):
    user_exists=await users_collection.find_one({"email": email})
    if not user_exists:
        return "NOT_FOUND"
    if not verify_user(password, user_exists["password"]):
        return "INVALID_PASSWORD"
    return "SUCCESS"