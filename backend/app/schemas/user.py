from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=1, le=120)
    preferred_language: str = Field(default="en")
    consent_given: bool = Field(default=True)

class UserResponse(BaseModel):
    id: str
    full_name: str
    age: int
    preferred_language: str
    consent_given: bool
    created_at: str

class LanguageUpdate(BaseModel):
    preferred_language: str
