import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# Connect to MongoDB
mongo_client = MongoClient(os.getenv("MONGODB_URL"))

print("🔍 Scanning MongoDB for your data...\n")

# List all databases (ignoring the default system ones)
for db_name in mongo_client.list_database_names():
    if db_name in ['admin', 'local', 'config']:
        continue
        
    print(f"📁 Database Name: '{db_name}'")
    db = mongo_client[db_name]
    
    # List all collections inside that database
    for coll_name in db.list_collection_names():
        count = db[coll_name].count_documents({})
        print(f"   📄 Collection Name: '{coll_name}' -> contains {count} files/users")