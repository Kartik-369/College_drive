import os
import motor.motor_asyncio
from dotenv import load_dotenv

load_dotenv()

MONGO_URL=os.getenv("MONGODB_URL")
DB_NAME=os.getenv("DB_NAME")

client=motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)


database=client[DB_NAME]

users_collection=database.get_collection("users")
folders_collection = database.get_collection("folders")
files_collection = database.get_collection("files")
async def db_connec():
	try:
		await client.admin.command('ping')
		print('true')
	except Exception as e:
		print('false',e)