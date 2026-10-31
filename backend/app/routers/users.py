from fastapi import APIRouter, HTTPException
from ..schemas.user import UserCreate, UserResponse, LanguageUpdate
from ..database import db

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.post("/register", response_model=UserResponse)
def register_user(payload: UserCreate):
    try:
        user = db.create_user(
            full_name=payload.full_name,
            age=payload.age,
            preferred_language=payload.preferred_language,
            consent_given=payload.consent_given
        )
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register user: {str(e)}")

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str):
    user = db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}/language")
def update_language(user_id: str, payload: LanguageUpdate):
    user = db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    success = db.update_user_language(user_id, payload.preferred_language)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update language")
    return {"message": "Language updated successfully", "preferred_language": payload.preferred_language}
