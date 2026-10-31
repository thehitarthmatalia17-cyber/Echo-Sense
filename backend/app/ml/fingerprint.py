from typing import Dict, Any, List
from datetime import datetime

class HearingFingerprintEngine:
    """
    Computes a personalized 6-dimensional Hearing Fingerprint Radar Profile:
    1. Speech Recognition Accuracy (from Repetition Test)
    2. Frequency Detection Breadth (from Frequency Tone Test)
    3. Repetition Resilience (Acoustic Memory / processing ease)
    4. Phonemic Discrimination (Misheard minimal pair sound differentiation)
    5. Environmental Listening Ease (from Behavioral / Post-Call monitoring)
    6. High-Frequency Sensitivity (Acuity across 6kHz, 8kHz, 12kHz)
    """

    @staticmethod
    def generate_fingerprint(
        screening: Dict[str, Any],
        behavioral_logs: List[Dict[str, Any]],
        user_age: int = 35
    ) -> Dict[str, Any]:
        rep_test = screening.get("repetition_test", {})
        misheard_test = screening.get("misheard_test", {})
        freq_test = screening.get("frequency_test", {})

        # 1. Speech Recognition (0-100)
        speech_acc = float(rep_test.get("accuracy_percentage", 85.0))

        # 2. Frequency Detection Breadth (0-100)
        freq_det = float(freq_test.get("detection_percentage", 80.0))

        # 3. Repetition Resilience (0-100): Lower repetitions = higher score
        total_q = max(rep_test.get("total_questions", 6), 1)
        total_rep = rep_test.get("total_repetitions", 0)
        avg_rep = total_rep / total_q
        # 0 reps = 100%, 1 rep avg = 75%, 2 reps avg = 50%, >=4 reps = 20%
        rep_resilience = max(min(100.0 - (avg_rep * 22.0), 100.0), 15.0)

        # 4. Phoneme Discrimination (0-100)
        misheard_acc = float(misheard_test.get("accuracy_percentage", 80.0))

        # 5. Environmental Listening Ease (0-100)
        if behavioral_logs:
            n = len(behavioral_logs)
            vol_boost = sum(1 for log in behavioral_logs if log.get("increased_volume")) / n
            noise_diff = sum(1 for log in behavioral_logs if log.get("noise_made_difficult")) / n
            misunderstood = sum(1 for log in behavioral_logs if log.get("misunderstood_words")) / n
            listening_ease = max(min(100.0 - ((vol_boost * 35.0) + (noise_diff * 40.0) + (misunderstood * 25.0)), 100.0), 20.0)
        else:
            # Default moderate-high ease baseline
            listening_ease = 82.0

        # 6. High-Frequency Sensitivity (0-100)
        # Accounts for natural age-related changes
        cat_summary = freq_test.get("category_summary", {})
        high_cat = cat_summary.get("high", {})
        high_total = max(high_cat.get("total", 3), 1)
        high_detected = high_cat.get("detected", high_total)
        raw_high_pct = (high_detected / high_total) * 100.0

        # Educational age adjustment: presbycusis threshold baseline
        age_factor = 1.0
        if user_age >= 60:
            age_factor = 1.15
        elif user_age >= 45:
            age_factor = 1.08

        high_freq_sensitivity = min(raw_high_pct * age_factor, 100.0)

        metrics = {
            "speech_recognition": round(speech_acc, 1),
            "frequency_detection": round(freq_det, 1),
            "repetition_resilience": round(rep_resilience, 1),
            "phoneme_discrimination": round(misheard_acc, 1),
            "listening_ease": round(listening_ease, 1),
            "high_frequency_sensitivity": round(high_freq_sensitivity, 1),
        }

        # Calculate overall composite hearing index
        overall_index = round(sum(metrics.values()) / len(metrics), 1)

        # Identify strengths & vulnerabilities
        sorted_metrics = sorted(metrics.items(), key=lambda item: item[1], reverse=True)
        metric_labels = {
            "speech_recognition": "Speech Recognition Clarity",
            "frequency_detection": "Auditory Frequency Span",
            "repetition_resilience": "Acoustic Repetition Resilience",
            "phoneme_discrimination": "Consonant & Phoneme Distinction",
            "listening_ease": "Everyday Conversation Comfort",
            "high_frequency_sensitivity": "High-Frequency Tone Sensitivity"
        }

        strengths = [metric_labels[k] for k, v in sorted_metrics if v >= 75][:3]
        vulnerabilities = [metric_labels[k] for k, v in sorted_metrics if v < 70]

        if not strengths:
            strengths.append("Baseline auditory detection present across core speech bandwidths.")

        if not vulnerabilities:
            vulnerabilities.append("No critical vulnerabilities detected in current screening session.")

        # Adaptive recommendations
        adaptive_recommendations = []
        if metrics["phoneme_discrimination"] < 70:
            adaptive_recommendations.append(
                "Minimal pair confusion noted (e.g. Pat/Bat, Ship/Sheep). Practice active listening exercises with high-contrast audio."
            )
        if metrics["high_frequency_sensitivity"] < 65:
            adaptive_recommendations.append(
                "High-frequency detection is lower than speech frequencies. Avoid noisy restaurants without facing conversation partners."
            )
        if metrics["repetition_resilience"] < 60:
            adaptive_recommendations.append(
                "Frequent repetitions needed to parse sentences. Consider a speech-in-noise follow-up assessment."
            )
        if not adaptive_recommendations:
            adaptive_recommendations.append(
                "Your hearing fingerprint shows balanced performance across tested speech and frequency parameters."
            )

        return {
            "user_id": screening.get("user_id", ""),
            "timestamp": datetime.utcnow().isoformat(),
            "overall_index": overall_index,
            "metrics": metrics,
            "strengths": strengths,
            "vulnerabilities": vulnerabilities,
            "adaptive_recommendations": adaptive_recommendations
        }
