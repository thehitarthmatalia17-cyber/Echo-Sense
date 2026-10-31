from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from datetime import datetime
from ..schemas.test_result import (
    CompleteScreeningSubmission,
    ScreeningReport
)
from ..database import db

router = APIRouter(prefix="/api/screening", tags=["Screening"])

THANK_YOU_MESSAGE = (
    "Thank you for choosing EchoSense. Your hearing health matters. "
    "Continue monitoring your hearing and consult a qualified professional if you experience difficulties."
)

MEDICAL_DISCLAIMER = (
    "These tests are experimental and are not medically validated diagnostic procedures. "
    "EchoSense only provides preliminary hearing-related screening observations. "
    "It cannot confirm or rule out hearing loss. For genuine hearing concerns, consult a "
    "qualified audiologist or healthcare professional."
)

def evaluate_hearing_concern(
    repetition_acc: float,
    total_reps: int,
    misheard_acc: float,
    freq_detection_pct: float,
    high_freq_detected_pct: float,
    missed_freq_count: int
) -> tuple[str, str]:
    """
    Transparent rule-based hearing concern calculation.
    Explicitly non-diagnostic: aggregates screening observations across the 3 sequential tests.
    """
    reasons = []

    # Check high concern flags
    high_concern_flags = 0
    if freq_detection_pct < 60.0 or missed_freq_count >= 4:
        high_concern_flags += 1
        reasons.append("Significantly reduced detection across multiple tested frequency ranges.")
    if repetition_acc < 60.0:
        high_concern_flags += 1
        reasons.append("Speech repetition accuracy was below 60%.")
    if total_reps >= 8:
        high_concern_flags += 1
        reasons.append("High number of audio replay requests needed to interpret words/sentences.")
    if high_freq_detected_pct < 40.0:
        high_concern_flags += 1
        reasons.append("Difficulty hearing higher frequency tones (6,000 Hz - 12,000 Hz).")

    # Moderate concern flags
    moderate_concern_flags = 0
    if 60.0 <= freq_detection_pct < 80.0 or missed_freq_count in [2, 3]:
        moderate_concern_flags += 1
        reasons.append("Inconsistent detection of mid or high audio tones.")
    if 60.0 <= repetition_acc < 75.0:
        moderate_concern_flags += 1
        reasons.append("Moderate difficulty recognizing sentences at specific frequency bandwidths.")
    if 4 <= total_reps < 8:
        moderate_concern_flags += 1
        reasons.append("Several repetitions requested during spoken word tests.")
    if misheard_acc < 70.0:
        moderate_concern_flags += 1
        reasons.append("Confusion observed on minimal-pair speech sounds (e.g. ship/sheep, pat/bat).")

    if high_concern_flags >= 2 or (high_concern_flags >= 1 and moderate_concern_flags >= 2):
        level = "HIGH"
        summary = "Multiple concerning screening observations detected across speech and tone tests. " + " ".join(reasons) + " A professional clinical hearing evaluation by an audiologist is strongly recommended."
    elif high_concern_flags >= 1 or moderate_concern_flags >= 1:
        level = "MODERATE"
        summary = "Some inconsistent responses or possible early hearing difficulties observed. " + " ".join(reasons) + " Consider re-testing in a quieter room, or consult an audiologist if communication difficulties persist."
    else:
        level = "LOW"
        summary = "No significant hearing concern identified during this screening session. Your responses were consistent across the tested speech bands and frequency ranges. Please note that a low concern result does not clinically rule out hearing loss."

    return level, summary

@router.post("/submit", response_model=ScreeningReport)
def submit_screening(payload: CompleteScreeningSubmission):
    user = db.get_user(payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Extract metrics
    rep = payload.repetition_test
    mis = payload.misheard_test
    freq = payload.frequency_test

    detected_ranges = []
    missed_ranges = []

    cat_summary = freq.category_summary
    for cat_name, summary in cat_summary.items():
        if summary.get("detected", 0) > 0 and summary.get("missed", 0) == 0:
            detected_ranges.append(f"{cat_name.title()} Frequencies ({summary.get('range_hz', '')})")
        elif summary.get("detected", 0) > 0:
            detected_ranges.append(f"{cat_name.title()} (Partial: {summary.get('detected')}/{summary.get('total')})")
            missed_ranges.append(f"{cat_name.title()} ({summary.get('missed')} missed)")
        else:
            missed_ranges.append(f"{cat_name.title()} Frequencies ({summary.get('range_hz', '')})")

    high_cat = cat_summary.get("high", {})
    high_total = max(high_cat.get("total", 1), 1)
    high_detected_pct = (high_cat.get("detected", high_total) / high_total) * 100.0

    concern_level, concern_reason = evaluate_hearing_concern(
        repetition_acc=rep.accuracy_percentage,
        total_reps=rep.total_repetitions,
        misheard_acc=mis.accuracy_percentage,
        freq_detection_pct=freq.detection_percentage,
        high_freq_detected_pct=high_detected_pct,
        missed_freq_count=freq.missed_tones
    )

    tested_ear = payload.tested_ear or payload.frequency_test.tested_ear or "both"
    left_ear = payload.left_ear_result or payload.frequency_test.left_ear_result
    right_ear = payload.right_ear_result or payload.frequency_test.right_ear_result

    screening_record = {
        "user_id": user["id"],
        "tested_ear": tested_ear,
        "left_ear_result": left_ear.dict() if left_ear else None,
        "right_ear_result": right_ear.dict() if right_ear else None,
        "test_id": payload.test_id,
        "repetition_test": rep.dict(),
        "misheard_test": mis.dict(),
        "frequency_test": freq.dict(),
        "concern_level": concern_level,
        "concern_reason": concern_reason,
        "detected_frequency_ranges": detected_ranges,
        "missed_frequency_ranges": missed_ranges
    }

    screening_id = db.save_screening(screening_record)
    generated_test_id = payload.test_id or f"ES-{screening_id[:8].upper()}"

    return ScreeningReport(
        id=screening_id,
        test_id=generated_test_id,
        user_id=user["id"],
        user_name=user["full_name"],
        age=user["age"],
        preferred_language=user["preferred_language"],
        timestamp=datetime.utcnow().isoformat(),
        tested_ear=tested_ear,
        left_ear_result=left_ear,
        right_ear_result=right_ear,
        repetition_test=rep,
        misheard_test=mis,
        frequency_test=freq,
        detected_frequency_ranges=detected_ranges,
        missed_frequency_ranges=missed_ranges,
        concern_level=concern_level,
        concern_reason=concern_reason,
        disclaimer=MEDICAL_DISCLAIMER,
        thank_you_message=THANK_YOU_MESSAGE
    )

@router.get("/user/{user_id}", response_model=List[Dict[str, Any]])
def get_user_screenings(user_id: str):
    user = db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.get_user_screenings(user_id)

@router.delete("/user/{user_id}/reset")
def reset_user_screening_session(user_id: str):
    user = db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.clear_user_screenings(user_id)
    return {"message": "Current session progress and temporary test responses successfully reset."}
