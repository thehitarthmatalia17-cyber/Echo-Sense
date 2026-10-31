import os
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "EchoSense Backend"
    version: str = "1.0.0"
    debug: bool = True
    firebase_credentials_path: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "")
    use_firestore: bool = bool(os.getenv("USE_FIRESTORE", "false").lower() == "true")
    database_file: str = os.path.join(os.path.dirname(__file__), "..", "echosense.db")

settings = Settings()
