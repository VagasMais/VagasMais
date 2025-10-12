from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
	raise RuntimeError("MONGO_URI não está definido no arquivo .env")

client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())
db = client["VagasPlus"]
vagas_collection = db["vagas"]
