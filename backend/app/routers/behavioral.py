from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.behavioral import PostCallQuestionnaire, PostCallLogResponse
from ..database import db

router = APIRouter(prefix="/api/behavioral", tags=["Behavioral"])

@router.post("/submit", response_model=PostCallLogResponse)
def submit_post_call_log(payload: PostCallQuestionnaire):
    user = db.get_user(payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    log_id = db.save_behavioral_log(payload.dict())
    logs = db.get_user_behavioral_logs(payload.user_id)
    new_log = next((l for l in logs if l["id"] == log_id), None)
    if not new_log:
        raise HTTPException(status_code=500, detail="Failed to retrieve saved log")
    return new_log

@router.get("/user/{user_id}", response_model=List[PostCallLogResponse])
def get_user_behavioral_logs(user_id: str):
    user = db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.get_user_behavioral_logs(user_id)
