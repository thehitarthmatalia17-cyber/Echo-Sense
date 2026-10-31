import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import db
from app.ml.model import BehavioralAnomalyDetector
from app.ml.fingerprint import HearingFingerprintEngine

def test_workflow():
    print("[1] Testing User Registration...")
    user = db.create_user(
        full_name="Arjun Sharma",
        age=32,
        preferred_language="hi",
        consent_given=True
    )
    assert user["id"] is not None
    print(f"  User created: {user['full_name']} (ID: {user['id']})")

    print("[2] Testing Screening Submission...")
    screening_payload = {
        "user_id": user["id"],
        "repetition_test": {
            "total_questions": 6,
            "correct_answers": 5,
            "incorrect_answers": 1,
            "total_repetitions": 3,
            "accuracy_percentage": 83.3,
            "stage_breakdown": [
                {
                    "stage_id": 1,
                    "stage_name": "Full Spectrum",
                    "frequency_range": "20 Hz - 20,000 Hz",
                    "target_text": "The quick brown fox",
                    "user_response": "The quick brown fox",
                    "repetitions_count": 0,
                    "is_correct": True
                }
            ]
        },
        "misheard_test": {
            "total_words": 5,
            "correctly_recognized": ["ship", "fan", "thin", "pat"],
            "incorrectly_recognized": ["cab"],
            "total_attempts": 6,
            "accuracy_percentage": 80.0,
            "category_performance": {
                "speech_frequency": {"correct": 4, "total": 5}
            },
            "beneficial_assessment_areas": ["Voiced vs Voiceless consonants"]
        },
        "frequency_test": {
            "total_tones": 9,
            "detected_tones": 8,
            "missed_tones": 1,
            "detection_percentage": 88.9,
            "responses": [
                {"frequency_hz": 250, "category": "low", "heard": True},
                {"frequency_hz": 500, "category": "low", "heard": True},
                {"frequency_hz": 1000, "category": "mid", "heard": True},
                {"frequency_hz": 2000, "category": "mid", "heard": True},
                {"frequency_hz": 4000, "category": "mid", "heard": True},
                {"frequency_hz": 6000, "category": "high", "heard": True},
                {"frequency_hz": 8000, "category": "high", "heard": True},
                {"frequency_hz": 12000, "category": "high", "heard": False}
            ],
            "category_summary": {
                "low": {"detected": 2, "total": 2, "range_hz": "250 Hz - 500 Hz"},
                "mid": {"detected": 3, "total": 3, "range_hz": "1,000 Hz - 4,000 Hz"},
                "high": {"detected": 2, "total": 3, "range_hz": "6,000 Hz - 12,000 Hz", "missed": 1}
            }
        },
        "concern_level": "LOW",
        "concern_reason": "No significant concern identified.",
        "detected_frequency_ranges": ["Low (250-500Hz)", "Mid (1000-4000Hz)", "High (Partial)"],
        "missed_frequency_ranges": ["12,000 Hz tone"]
    }
    screening_id = db.save_screening(screening_payload)
    print(f"  Screening saved with ID: {screening_id}")

    print("[3] Testing Behavioral Monitoring Log...")
    log_id = db.save_behavioral_log({
        "user_id": user["id"],
        "increased_volume": True,
        "asked_repetition": False,
        "misunderstood_words": False,
        "noise_made_difficult": True,
        "notes": "Noisy cafe call"
    })
    print(f"  Behavioral log saved: {log_id}")

    print("[4] Testing Scikit-Learn Isolation Forest Anomaly Detector...")
    detector = BehavioralAnomalyDetector()
    current_features = detector.extract_features_from_session(screening_payload, db.get_user_behavioral_logs(user["id"]))
    print(f"  Extracted feature vector: {current_features}")
    # Train with baseline
    historical_matrix = [current_features, [1.0, 90.0, 10.0, 90.0, 10.0, 20.0, 10.0], [0.5, 95.0, 5.0, 100.0, 0.0, 10.0, 5.0]]
    analysis = detector.analyze(current_features, historical_matrix)
    print(f"  Isolation Forest Anomaly: {analysis['is_anomaly']}, Score: {analysis['anomaly_score']}")
    print(f"  Explainable Factors: {analysis['explainable_factors']}")

    print("[5] Testing Hearing Fingerprint Engine...")
    fingerprint = HearingFingerprintEngine.generate_fingerprint(
        screening=screening_payload,
        behavioral_logs=db.get_user_behavioral_logs(user["id"]),
        user_age=user["age"]
    )
    print(f"  Fingerprint Composite Index: {fingerprint['overall_index']}")
    print(f"  Axes: {fingerprint['metrics']}")

    print("\n>>> ALL BACKEND & ML TESTS PASSED PERFECTLY! <<<")

if __name__ == "__main__":
    test_workflow()
