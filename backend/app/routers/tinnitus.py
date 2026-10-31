from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.behavioral import TinnitusQuestionnaire, TinnitusLogResponse
from ..database import db

router = APIRouter(prefix="/api/tinnitus", tags=["Tinnitus"])

@router.post("/submit", response_model=TinnitusLogResponse)
def submit_tinnitus_log(payload: TinnitusQuestionnaire):
    user = db.get_user(payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    log_id = db.save_tinnitus_log(payload.dict())
    logs = db.get_user_tinnitus_logs(payload.user_id)
    new_log = next((l for l in logs if l["id"] == log_id), None)
    if not new_log:
        raise HTTPException(status_code=500, detail="Failed to retrieve saved log")
    return new_log

@router.get("/user/{user_id}", response_model=List[TinnitusLogResponse])
def get_user_tinnitus_logs(user_id: str):
    user = db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.get_user_tinnitus_logs(user_id)
