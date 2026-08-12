from database import users_collection
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_user(plain_pass:str,hash_pass:str):
    return pwd_context.verify(plain_pass, hash_pass)

async def auth_user(email:str,password:str):
    user_exists=await users_collection.find_one({"email": email})
    if user_exists and verify_user(password, user_exists["password"]):
        return True
    return False