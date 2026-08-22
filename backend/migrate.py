import os
import boto3
import urllib.parse
from botocore.config import Config
from dotenv import load_dotenv
from pymongo import MongoClient

# Load your existing credentials from .env
load_dotenv()

# Connect to Backblaze
s3_client = boto3.client(
    's3',
    endpoint_url=os.getenv("B2_ENDPOINT_URL"),
    aws_access_key_id=os.getenv("B2_KEY_ID"),
    aws_secret_access_key=os.getenv("B2_APPLICATION_KEY"),
    region_name='eu-central-003',
    config=Config(signature_version='s3v4')
)
BUCKET_NAME = os.getenv("B2_BUCKET_NAME")

# Connect to MongoDB
mongo_client = MongoClient(os.getenv("MONGODB_URL"))
# Make sure "CollegeDrive" is the exact name of your database in Atlas
db = mongo_client["CollegeDrive"] 
files_collection = db["files"]

# Fetch every file record in the database
all_files = files_collection.find({})

migrated_count = 0

print("🚀 Starting Migration for Old Files...\n")

for file_doc in all_files:
    email = file_doc.get("user_email")
    old_key = file_doc.get("object_key")
    
    # Check if the file is using the old format (it DOES NOT start with the email)
    if email and old_key and not old_key.startswith(email):
        print(f"🔍 Found old file: {old_key} for {email}")
        
        # 1. Construct the new key (e.g., student@gmail.com/JAVA/lab11.zip)
        new_key = f"{email}/{old_key}"
        
        try:
            # 2. Tell Backblaze to physically copy the file to the new folder
            s3_client.copy_object(
                Bucket=BUCKET_NAME,
                CopySource={'Bucket': BUCKET_NAME, 'Key': old_key},
                Key=new_key
            )
            
            # 3. Delete the original old file so it doesn't waste your 10GB limit
            s3_client.delete_object(Bucket=BUCKET_NAME, Key=old_key)
            
            # 4. Generate the new valid download URL
            encoded_key = urllib.parse.quote(new_key)
            new_url = f"https://s3.eu-central-003.backblazeb2.com/CollegeDrive/{encoded_key}"
            
            # 5. Update the MongoDB document permanently
            files_collection.update_one(
                {"_id": file_doc["_id"]},
                {"$set": {
                    "object_key": new_key,
                    "cloud_storage_url": new_url
                }}
            )
            
            print(f"   ✅ Successfully migrated to: {new_key}\n")
            migrated_count += 1
            
        except Exception as e:
            print(f"   ❌ Failed to migrate {old_key}: {e}\n")

print(f"🎉 Migration complete! {migrated_count} old files successfully updated.")