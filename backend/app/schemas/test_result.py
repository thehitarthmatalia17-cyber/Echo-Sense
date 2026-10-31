from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class RepetitionStageResult(BaseModel):
    stage_id: int
    stage_name: str
    frequency_range: str
    target_text: str
    user_response: str
    repetitions_count: int
    is_correct: bool

class RepetitionTestResult(BaseModel):
    total_questions: int
    correct_answers: int
    incorrect_answers: int
    total_repetitions: int
    accuracy_percentage: float
    stage_breakdown: List[RepetitionStageResult]

class MisheardItemResult(BaseModel):
    category: str
    word_pair: str
    target_word: str
    recognized_word: str
    attempts_count: int
    is_correct: bool

class MisheardTestResult(BaseModel):
    total_words: int
    correctly_recognized: List[str]
    incorrectly_recognized: List[str]
    total_attempts: int
    accuracy_percentage: float
    category_performance: Dict[str, Dict[str, Any]]
    beneficial_assessment_areas: List[str]

class FrequencyToneResponse(BaseModel):
    frequency_hz: int
    category: str  # low, mid, high
    heard: bool

class FrequencyTestResult(BaseModel):
    total_tones: int
    detected_tones: int
    missed_tones: int
    detection_percentage: float
    responses: List[FrequencyToneResponse]
    category_summary: Dict[str, Dict[str, Any]]

class CompleteScreeningSubmission(BaseModel):
    user_id: str
    repetition_test: RepetitionTestResult
    misheard_test: MisheardTestResult
    frequency_test: FrequencyTestResult

class ScreeningReport(BaseModel):
    id: str
    user_id: str
    user_name: str
    age: int
    preferred_language: str
    timestamp: str
    repetition_test: RepetitionTestResult
    misheard_test: MisheardTestResult
    frequency_test: FrequencyTestResult
    detected_frequency_ranges: List[str]
    missed_frequency_ranges: List[str]
    concern_level: str  # LOW, MODERATE, HIGH
    concern_reason: str
    disclaimer: str
    thank_you_message: str
