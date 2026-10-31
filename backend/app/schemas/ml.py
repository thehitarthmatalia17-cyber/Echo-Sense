from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class HearingFingerprint(BaseModel):
    user_id: str
    timestamp: str
    overall_index: float  # 0 to 100
    metrics: Dict[str, float]  # axes: speech_recognition, frequency_detection, repetition_resilience, phoneme_discrimination, listening_ease, high_frequency_sensitivity
    strengths: List[str]
    vulnerabilities: List[str]
    adaptive_recommendations: List[str]

class AnomalyDetectionReport(BaseModel):
    user_id: str
    is_anomaly: bool
    anomaly_score: float  # -1 (outlier) to 1 (normal)
    confidence: float
    historical_observations_count: int
    explainable_factors: List[str]
    comparison_to_baseline: Dict[str, Any]
    actionable_recommendations: List[str]
