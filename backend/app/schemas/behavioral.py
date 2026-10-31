from pydantic import BaseModel, Field
from typing import Optional, List

class PostCallQuestionnaire(BaseModel):
    user_id: str
    increased_volume: bool = Field(..., description="Did you need to increase the call volume?")
    asked_repetition: bool = Field(..., description="Did you have to ask someone to repeat what they said?")
    misunderstood_words: bool = Field(..., description="Did you misunderstand words during the conversation?")
    noise_made_difficult: bool = Field(..., description="Did background noise make the conversation difficult to follow?")
    notes: Optional[str] = None

class PostCallLogResponse(PostCallQuestionnaire):
    id: str
    timestamp: str

class TinnitusQuestionnaire(BaseModel):
    user_id: str
    ringing: bool
    buzzing: bool
    humming: bool
    whistling: bool
    frequency_occurrence: str  # rarely, sometimes, frequently, constantly
    duration: str  # seconds, minutes, hours, persistent
    affected_ear: str  # left, right, both
    severity_rating: int = Field(..., ge=1, le=10)

class TinnitusLogResponse(TinnitusQuestionnaire):
    id: str
    timestamp: str
