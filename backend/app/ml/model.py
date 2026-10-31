import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from typing import List, Dict, Any, Optional

class BehavioralAnomalyDetector:
    """
    AI-Based Behavioral Hearing Monitoring using Scikit-Learn Isolation Forest.
    Learns normal personal behavioral patterns over time from repeated test sessions
    and daily/post-call logs to detect statistically unusual deviations from baseline.
    
    Transparent & non-diagnostic: strictly identifies significant changes in listening effort
    and response consistency rather than fabricating medical claims.
    """

    FEATURE_NAMES = [
        "avg_repetitions",
        "speech_accuracy",
        "phoneme_error_rate",
        "high_freq_detection_rate",
        "call_volume_boost_rate",
        "noisy_difficulty_rate",
        "misunderstood_rate"
    ]

    def __init__(self, contamination: float = 0.15, random_state: int = 42):
        self.contamination = contamination
        self.random_state = random_state
        self.model = IsolationForest(
            n_estimators=100,
            contamination=self.contamination,
            random_state=self.random_state
        )
        self.baseline_fitted = False
        self.baseline_stats: Dict[str, Dict[str, float]] = {}

    def extract_features_from_session(
        self,
        screening: Dict[str, Any],
        recent_behavioral_logs: List[Dict[str, Any]]
    ) -> List[float]:
        # Feature 1: avg repetitions from repetition test
        rep_test = screening.get("repetition_test", {})
        total_q = max(rep_test.get("total_questions", 1), 1)
        avg_repetitions = float(rep_test.get("total_repetitions", 0)) / total_q

        # Feature 2: overall speech recognition accuracy
        speech_accuracy = float(rep_test.get("accuracy_percentage", 100.0))

        # Feature 3: phoneme error rate from misheard test
        misheard_test = screening.get("misheard_test", {})
        total_words = max(misheard_test.get("total_words", 1), 1)
        incorrect_words = len(misheard_test.get("incorrectly_recognized", []))
        phoneme_error_rate = (incorrect_words / total_words) * 100.0

        # Feature 4: high frequency detection rate
        freq_test = screening.get("frequency_test", {})
        category_summary = freq_test.get("category_summary", {})
        high_cat = category_summary.get("high", {})
        high_total = max(high_cat.get("total", 1), 1)
        high_detected = high_cat.get("detected", high_total)
        high_freq_detection_rate = (high_detected / high_total) * 100.0

        # Features 5, 6, 7 from behavioral/post-call logs
        if recent_behavioral_logs:
            n_logs = len(recent_behavioral_logs)
            call_volume_boost_rate = (sum(1 for log in recent_behavioral_logs if log.get("increased_volume")) / n_logs) * 100.0
            noisy_difficulty_rate = (sum(1 for log in recent_behavioral_logs if log.get("noise_made_difficult")) / n_logs) * 100.0
            misunderstood_rate = (sum(1 for log in recent_behavioral_logs if log.get("misunderstood_words")) / n_logs) * 100.0
        else:
            # Neutral default if no post-call logs exist yet
            call_volume_boost_rate = 20.0
            noisy_difficulty_rate = 25.0
            misunderstood_rate = 15.0

        return [
            float(avg_repetitions),
            float(speech_accuracy),
            float(phoneme_error_rate),
            float(high_freq_detection_rate),
            float(call_volume_boost_rate),
            float(noisy_difficulty_rate),
            float(misunderstood_rate)
        ]

    def fit_baseline(self, historical_feature_matrix: List[List[float]]) -> None:
        """
        Fits the Isolation Forest on user's past observations to establish their personal baseline.
        """
        if len(historical_feature_matrix) < 2:
            return

        X = np.array(historical_feature_matrix)
        self.model.fit(X)
        self.baseline_fitted = True

        df = pd.DataFrame(X, columns=self.FEATURE_NAMES)
        self.baseline_stats = {}
        for col in self.FEATURE_NAMES:
            self.baseline_stats[col] = {
                "mean": float(df[col].mean()),
                "std": float(df[col].std(ddof=0)) if len(df) > 1 else 1.0,
                "min": float(df[col].min()),
                "max": float(df[col].max())
            }

    def analyze(
        self,
        current_features: List[float],
        historical_feature_matrix: List[List[float]]
    ) -> Dict[str, Any]:
        """
        Compares current session with historical observations,
        runs Isolation Forest, and outputs an explainable anomaly report.
        """
        # If we have at least 2 historical observations, fit the model
        if len(historical_feature_matrix) >= 2:
            self.fit_baseline(historical_feature_matrix)

        current_arr = np.array([current_features])

        if self.baseline_fitted:
            # isolation forest decision_function: higher is normal, negative is anomalous
            raw_score = float(self.model.decision_function(current_arr)[0])
            pred = int(self.model.predict(current_arr)[0])
            is_anomaly = bool(pred == -1)
            # normalize raw_score roughly to [-1.0, 1.0]
            normalized_score = max(min(raw_score * 2.0, 1.0), -1.0)
            confidence = min(0.65 + (len(historical_feature_matrix) * 0.05), 0.95)
        else:
            # Initial baseline run or single test
            is_anomaly = False
            normalized_score = 0.5
            confidence = 0.50

        # Build explainable factors by comparing each feature to baseline mean
        explainable_factors: List[str] = []
        actionable_recommendations: List[str] = []
        comparison_to_baseline: Dict[str, Any] = {}

        for i, name in enumerate(self.FEATURE_NAMES):
            val = current_features[i]
            if name in self.baseline_stats:
                base_mean = self.baseline_stats[name]["mean"]
                base_std = max(self.baseline_stats[name]["std"], 0.1)
                z_score = (val - base_mean) / base_std
                delta_pct = ((val - base_mean) / max(base_mean, 1.0)) * 100.0

                comparison_to_baseline[name] = {
                    "current": round(val, 2),
                    "baseline_mean": round(base_mean, 2),
                    "difference_pct": round(delta_pct, 1),
                    "z_score": round(z_score, 2)
                }

                # Evaluate individual feature shifts
                if name == "avg_repetitions" and delta_pct > 30 and val > 1.2:
                    explainable_factors.append(
                        f"Average repetition requests increased by {round(delta_pct)}% compared to your historical baseline."
                    )
                elif name == "speech_accuracy" and (base_mean - val) > 15:
                    explainable_factors.append(
                        f"Speech recognition accuracy dropped {round(base_mean - val)}% below your historical baseline ({round(base_mean)}% vs {round(val)}%)."
                    )
                elif name == "phoneme_error_rate" and (val - base_mean) > 20:
                    explainable_factors.append(
                        f"Difficulty distinguishing similar-sounding words increased by {round(val - base_mean)}%."
                    )
                elif name == "high_freq_detection_rate" and (base_mean - val) > 25:
                    explainable_factors.append(
                        f"High-frequency tone sensitivity showed a notable drop of {round(base_mean - val)}% from previous screening sessions."
                    )
                elif name == "call_volume_boost_rate" and val > 60:
                    explainable_factors.append(
                        "Self-reported phone call volume increases occurred in over 60% of recent logged calls."
                    )
                elif name == "noisy_difficulty_rate" and val > 50:
                    explainable_factors.append(
                        "Background noise was reported as interfering with speech clarity in majority of recent situations."
                    )
            else:
                # Rule-based observation without prior baseline
                comparison_to_baseline[name] = {
                    "current": round(val, 2),
                    "baseline_mean": round(val, 2),
                    "difference_pct": 0.0,
                    "z_score": 0.0
                }

        # If no significant deviation was flagged
        if not explainable_factors:
            if len(historical_feature_matrix) < 2:
                explainable_factors.append(
                    "This screening session establishes your baseline hearing profile. Future sessions will track longitudinal trends."
                )
            else:
                explainable_factors.append(
                    "All behavioral indicators and test responses align closely with your typical established baseline."
                )

        # Formulate actionable, non-alarmist recommendations
        if is_anomaly or len(explainable_factors) > 2:
            actionable_recommendations.append(
                "An unusual deviation from your listening baseline was observed. Consider retrying the screening in a quieter environment."
            )
            actionable_recommendations.append(
                "If speech recognition and repetition difficulties persist across multiple days, consider scheduling a comprehensive evaluation with an audiologist."
            )
        else:
            actionable_recommendations.append(
                "Continue routine monthly check-ins to monitor long-term auditory wellness."
            )
            actionable_recommendations.append(
                "Protect your hearing in environments exceeding 85 dBA (such as concerts, power tools, or prolonged loud headphone use)."
            )

        return {
            "is_anomaly": is_anomaly,
            "anomaly_score": round(normalized_score, 3),
            "confidence": round(confidence, 2),
            "historical_observations_count": len(historical_feature_matrix),
            "explainable_factors": explainable_factors,
            "comparison_to_baseline": comparison_to_baseline,
            "actionable_recommendations": actionable_recommendations
        }
