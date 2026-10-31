export type LanguageCode = 'en' | 'hi' | 'kn' | 'gu' | 'ta' | 'te' | 'bn' | 'mr' | 'es' | 'fr';

export interface UserProfile {
  id?: string;
  fullName: string;
  age: number;
  preferredLanguage: LanguageCode;
  consentGiven: boolean;
}

export interface RepetitionStage {
  id: number;
  name: string;
  frequencyRange: string;
  filterType: 'allpass' | 'lowpass' | 'highpass' | 'bandpass';
  filterFreq: number;
  filterQ?: number;
  text: string;
  educationalNote?: string;
}

export interface RepetitionStageAnswer {
  stageId: number;
  stageName: string;
  frequencyRange: string;
  targetText: string;
  userResponse: string;
  repetitionsCount: number;
  isCorrect: boolean;
}

export interface RepetitionTestSummary {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalRepetitions: number;
  accuracyPercentage: number;
  stageBreakdown: RepetitionStageAnswer[];
}

export interface MisheardWordPair {
  id: string;
  category: string;
  word1: string;
  word2: string;
  targetWord: string;
  phonemeDifference: string;
}

export interface MisheardWordAttempt {
  pairId: string;
  category: string;
  targetWord: string;
  recognizedWord: string;
  attemptsCount: number;
  isCorrect: boolean;
}

export interface MisheardTestSummary {
  totalWords: number;
  correctlyRecognized: string[];
  incorrectlyRecognized: string[];
  totalAttempts: number;
  accuracyPercentage: number;
  categoryPerformance: Record<string, { correct: number; total: number; accuracy: number }>;
  beneficialAssessmentAreas: string[];
}

export interface ToneItem {
  id: string;
  frequencyHz: number;
  category: 'low' | 'mid' | 'high';
  categoryLabel: string;
  durationMs: number;
}

export interface ToneResponse {
  frequencyHz: number;
  category: 'low' | 'mid' | 'high';
  heard: boolean;
}

export interface FrequencyTestSummary {
  totalTones: number;
  detectedTones: number;
  missedTones: number;
  detectionPercentage: number;
  responses: ToneResponse[];
  categorySummary: Record<string, { detected: number; missed: number; total: number; rangeHz: string }>;
}

export interface ScreeningReportData {
  id?: string;
  userId: string;
  userName: string;
  age: number;
  preferredLanguage: LanguageCode;
  timestamp: string;
  repetitionTest: RepetitionTestSummary;
  misheardTest: MisheardTestSummary;
  frequencyTest: FrequencyTestSummary;
  detectedFrequencyRanges: string[];
  missedFrequencyRanges: string[];
  concernLevel: 'LOW' | 'MODERATE' | 'HIGH';
  concernReason: string;
  disclaimer: string;
  thankYouMessage: string;
}

export interface PostCallLog {
  id?: string;
  userId: string;
  timestamp: string;
  increasedVolume: boolean;
  askedRepetition: boolean;
  misunderstoodWords: boolean;
  noiseMadeDifficult: boolean;
  notes?: string;
}

export interface TinnitusLog {
  id?: string;
  userId: string;
  timestamp: string;
  ringing: boolean;
  buzzing: boolean;
  humming: boolean;
  whistling: boolean;
  frequencyOccurrence: string;
  duration: string;
  affectedEar: string;
  severityRating: number;
}

export interface HearingFingerprintData {
  userId: string;
  timestamp: string;
  overallIndex: number;
  metrics: {
    speech_recognition: number;
    frequency_detection: number;
    repetition_resilience: number;
    phoneme_discrimination: number;
    listening_ease: number;
    high_frequency_sensitivity: number;
  };
  strengths: string[];
  vulnerabilities: string[];
  adaptiveRecommendations: string[];
}

export interface AnomalyReportData {
  userId: string;
  isAnomaly: boolean;
  anomalyScore: number;
  confidence: number;
  historicalObservationsCount: number;
  explainableFactors: string[];
  comparisonToBaseline: Record<string, any>;
  actionableRecommendations: string[];
}
