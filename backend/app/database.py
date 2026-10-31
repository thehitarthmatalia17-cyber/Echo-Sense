import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
import os
from .config import settings

# Optional Firebase Firestore integration
firestore_client = None
if settings.use_firestore and settings.firebase_credentials_path and os.path.exists(settings.firebase_credentials_path):
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore
        cred = credentials.Certificate(settings.firebase_credentials_path)
        firebase_admin.initialize_app(cred)
        firestore_client = firestore.client()
        print("Successfully connected to Firebase Firestore.")
    except Exception as e:
        print(f"Firebase Firestore initialization warning: {e}. Falling back to persistent SQLite.")

class Database:
    def __init__(self, db_path: str = settings.database_file):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        os.makedirs(os.path.dirname(os.path.abspath(self.db_path)), exist_ok=True)
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    full_name TEXT NOT NULL,
                    age INTEGER NOT NULL,
                    preferred_language TEXT NOT NULL,
                    consent_given INTEGER NOT NULL,
                    created_at TEXT NOT NULL
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS screenings (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    repetition_data TEXT NOT NULL,
                    misheard_data TEXT NOT NULL,
                    frequency_data TEXT NOT NULL,
                    concern_level TEXT NOT NULL,
                    concern_reason TEXT NOT NULL,
                    detected_ranges TEXT NOT NULL,
                    missed_ranges TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS behavioral_logs (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    increased_volume INTEGER NOT NULL,
                    asked_repetition INTEGER NOT NULL,
                    misunderstood_words INTEGER NOT NULL,
                    noise_made_difficult INTEGER NOT NULL,
                    notes TEXT,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS tinnitus_logs (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    ringing INTEGER NOT NULL,
                    buzzing INTEGER NOT NULL,
                    humming INTEGER NOT NULL,
                    whistling INTEGER NOT NULL,
                    frequency_occurrence TEXT NOT NULL,
                    duration TEXT NOT NULL,
                    affected_ear TEXT NOT NULL,
                    severity_rating INTEGER NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            ''')
            conn.commit()

    def create_user(self, full_name: str, age: int, preferred_language: str, consent_given: bool) -> Dict[str, Any]:
        user_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO users (id, full_name, age, preferred_language, consent_given, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (user_id, full_name, age, preferred_language, 1 if consent_given else 0, created_at))
            conn.commit()

        user_data = {
            "id": user_id,
            "full_name": full_name,
            "age": age,
            "preferred_language": preferred_language,
            "consent_given": consent_given,
            "created_at": created_at
        }

        # Sync to Firestore if available
        if firestore_client:
            try:
                firestore_client.collection("users").document(user_id).set(user_data)
            except Exception as e:
                print(f"Firestore user sync error: {e}")

        return user_data

    def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            if row:
                return {
                    "id": row["id"],
                    "full_name": row["full_name"],
                    "age": row["age"],
                    "preferred_language": row["preferred_language"],
                    "consent_given": bool(row["consent_given"]),
                    "created_at": row["created_at"]
                }
        return None

    def update_user_language(self, user_id: str, new_language: str) -> bool:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE users SET preferred_language = ? WHERE id = ?", (new_language, user_id))
            conn.commit()
            updated = cursor.rowcount > 0

        if updated and firestore_client:
            try:
                firestore_client.collection("users").document(user_id).update({"preferred_language": new_language})
            except Exception as e:
                print(f"Firestore language update error: {e}")

        return updated

    def save_screening(self, screening_data: Dict[str, Any]) -> str:
        screening_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        user_id = screening_data["user_id"]
        
        # Package ear details into frequency_data for robust backward-compatible serialization
        freq_dict = dict(screening_data["frequency_test"])
        if "tested_ear" in screening_data:
            freq_dict["tested_ear"] = screening_data["tested_ear"]
        if "left_ear_result" in screening_data:
            freq_dict["left_ear_result"] = screening_data["left_ear_result"]
        if "right_ear_result" in screening_data:
            freq_dict["right_ear_result"] = screening_data["right_ear_result"]
        if "test_id" in screening_data:
            freq_dict["test_id"] = screening_data["test_id"]
        else:
            freq_dict["test_id"] = f"ES-{screening_id[:8].upper()}"

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO screenings (
                    id, user_id, timestamp, repetition_data, misheard_data, frequency_data,
                    concern_level, concern_reason, detected_ranges, missed_ranges
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                screening_id,
                user_id,
                timestamp,
                json.dumps(screening_data["repetition_test"]),
                json.dumps(screening_data["misheard_test"]),
                json.dumps(freq_dict),
                screening_data["concern_level"],
                screening_data["concern_reason"],
                json.dumps(screening_data["detected_frequency_ranges"]),
                json.dumps(screening_data["missed_frequency_ranges"])
            ))

            # STRICT FIFO SYSTEM: Maximum 10-record limitation per user
            # Automatically delete oldest records when new test is saved
            cursor.execute('''
                DELETE FROM screenings
                WHERE user_id = ?
                AND id NOT IN (
                    SELECT id FROM screenings
                    WHERE user_id = ?
                    ORDER BY timestamp DESC
                    LIMIT 10
                )
            ''', (user_id, user_id))
            conn.commit()

        if firestore_client:
            try:
                screening_copy = dict(screening_data)
                screening_copy["id"] = screening_id
                screening_copy["timestamp"] = timestamp
                screening_copy["test_id"] = freq_dict["test_id"]
                firestore_client.collection("screenings").document(screening_id).set(screening_copy)
            except Exception as e:
                print(f"Firestore screening sync error: {e}")

        return screening_id

    def get_user_screenings(self, user_id: str) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM screenings WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10", (user_id,))
            rows = cursor.fetchall()
            results = []
            for r in rows:
                freq_json = json.loads(r["frequency_data"])
                tested_ear = freq_json.get("tested_ear", "both")
                left_ear_result = freq_json.get("left_ear_result")
                right_ear_result = freq_json.get("right_ear_result")
                test_id = freq_json.get("test_id", f"ES-{r['id'][:8].upper()}")

                results.append({
                    "id": r["id"],
                    "test_id": test_id,
                    "user_id": r["user_id"],
                    "timestamp": r["timestamp"],
                    "tested_ear": tested_ear,
                    "left_ear_result": left_ear_result,
                    "right_ear_result": right_ear_result,
                    "repetition_test": json.loads(r["repetition_data"]),
                    "misheard_test": json.loads(r["misheard_data"]),
                    "frequency_test": freq_json,
                    "concern_level": r["concern_level"],
                    "concern_reason": r["concern_reason"],
                    "detected_frequency_ranges": json.loads(r["detected_ranges"]),
                    "missed_frequency_ranges": json.loads(r["missed_ranges"])
                })
            return results

    def save_behavioral_log(self, data: Dict[str, Any]) -> str:
        log_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO behavioral_logs (
                    id, user_id, timestamp, increased_volume, asked_repetition,
                    misunderstood_words, noise_made_difficult, notes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                log_id,
                data["user_id"],
                timestamp,
                1 if data["increased_volume"] else 0,
                1 if data["asked_repetition"] else 0,
                1 if data["misunderstood_words"] else 0,
                1 if data["noise_made_difficult"] else 0,
                data.get("notes") or ""
            ))
            conn.commit()

        if firestore_client:
            try:
                payload = dict(data)
                payload["id"] = log_id
                payload["timestamp"] = timestamp
                firestore_client.collection("behavioral_logs").document(log_id).set(payload)
            except Exception as e:
                print(f"Firestore behavioral sync error: {e}")

        return log_id

    def get_user_behavioral_logs(self, user_id: str) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM behavioral_logs WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
            rows = cursor.fetchall()
            return [{
                "id": r["id"],
                "user_id": r["user_id"],
                "timestamp": r["timestamp"],
                "increased_volume": bool(r["increased_volume"]),
                "asked_repetition": bool(r["asked_repetition"]),
                "misunderstood_words": bool(r["misunderstood_words"]),
                "noise_made_difficult": bool(r["noise_made_difficult"]),
                "notes": r["notes"]
            } for r in rows]

    def save_tinnitus_log(self, data: Dict[str, Any]) -> str:
        log_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO tinnitus_logs (
                    id, user_id, timestamp, ringing, buzzing, humming, whistling,
                    frequency_occurrence, duration, affected_ear, severity_rating
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                log_id,
                data["user_id"],
                timestamp,
                1 if data["ringing"] else 0,
                1 if data["buzzing"] else 0,
                1 if data["humming"] else 0,
                1 if data["whistling"] else 0,
                data["frequency_occurrence"],
                data["duration"],
                data["affected_ear"],
                data["severity_rating"]
            ))
            conn.commit()

        if firestore_client:
            try:
                payload = dict(data)
                payload["id"] = log_id
                payload["timestamp"] = timestamp
                firestore_client.collection("tinnitus_logs").document(log_id).set(payload)
            except Exception as e:
                print(f"Firestore tinnitus sync error: {e}")

        return log_id

    def get_user_tinnitus_logs(self, user_id: str) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM tinnitus_logs WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
            rows = cursor.fetchall()
            return [{
                "id": r["id"],
                "user_id": r["user_id"],
                "timestamp": r["timestamp"],
                "ringing": bool(r["ringing"]),
                "buzzing": bool(r["buzzing"]),
                "humming": bool(r["humming"]),
                "whistling": bool(r["whistling"]),
                "frequency_occurrence": r["frequency_occurrence"],
                "duration": r["duration"],
                "affected_ear": r["affected_ear"],
                "severity_rating": r["severity_rating"]
            } for r in rows]

    def clear_user_screenings(self, user_id: str) -> bool:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM screenings WHERE user_id = ?", (user_id,))
            conn.commit()
        return True

db = Database()
