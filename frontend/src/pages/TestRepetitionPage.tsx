import React, { useState, useEffect } from 'react';
import { LanguageCode, RepetitionTestSummary, RepetitionStageAnswer } from '../types';
import { translations } from '../i18n/translations';
import { audioService } from '../services/audioService';
import { speechService } from '../services/speechService';
import { 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Info, 
  Sparkles, 
  LogOut, 
  Award,
  ChevronRight,
  Headphones,
  Check
} from 'lucide-react';

interface TestRepetitionPageProps {
  currentLanguage: LanguageCode;
  onComplete: (summary: RepetitionTestSummary) => void;
  onExitRequest: () => void;
  activeEar?: 'left' | 'right' | 'both';
}

interface RepetitionStage {
  id: number;
  name: string;
  frequencyRange: string;
  categoryDesc: string;
  filterType: 'allpass' | 'lowpass' | 'highpass' | 'bandpass';
  filterFreq: number;
  text: string;
}

// Levenshtein distance for typo checking
function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// English morphological stemmer to check if two words share the same root meaning
function getWordStem(w: string): string {
  let s = w.toLowerCase().trim();
  if (s.endsWith('ies') && s.length > 4) return s.slice(0, -3) + 'y';
  if (s.endsWith('ing') && s.length > 5) return s.slice(0, -3);
  if (s.endsWith('ed') && s.length > 4) return s.slice(0, -2);
  if (s.endsWith('es') && s.length > 4) return s.slice(0, -2);
  if (s.endsWith('s') && !s.endsWith('ss') && s.length > 3) return s.slice(0, -1);
  return s;
}

// Checks if a word is an acceptable minor inflectional or typo variant that preserves meaning
function isMinorVariantOrInflection(targetWord: string, userWord: string): boolean {
  const t = targetWord.toLowerCase().trim();
  const u = userWord.toLowerCase().trim();

  if (t === u) return true;

  // 1. Stem matching (inflection / tense / plural, e.g. "become" vs "becomes", "feels" vs "feel")
  const stemT = getWordStem(t);
  const stemU = getWordStem(u);
  if (stemT === stemU) return true;

  // 2. Prefix similarity where one has a trailing 'e', 's', or 'r'
  if (t.startsWith(u) && t.length - u.length <= 2) return true;
  if (u.startsWith(t) && u.length - t.length <= 2) return true;

  // 3. Minor 1-character typo in word of length >= 3
  const dist = getLevenshteinDistance(t, u);
  if (dist === 1 && Math.max(t.length, u.length) >= 3) {
    return true;
  }

  // 4. Minor 2-character edit distance in longer words (length >= 6)
  if (dist <= 2 && Math.min(t.length, u.length) >= 6) {
    return true;
  }

  return false;
}

interface EvaluationResult {
  status: 'CORRECT' | 'INCORRECT';
  message: string;
  hasMinorVariant?: boolean;
  minorVariants?: Array<{ expected: string; typed: string }>;
  meaningChangedWords?: Array<{ expected: string; typed: string }>;
}

export const TestRepetitionPage: React.FC<TestRepetitionPageProps> = ({
  currentLanguage,
  onComplete,
  onExitRequest,
  activeEar = 'both',
}) => {
  const t = translations[currentLanguage] || translations.en;

  // Multilingual test sentences for the 4 calibrated stages
  const getSentencesForLanguage = (lang: LanguageCode): string[] => {
    switch (lang) {
      case 'hi':
        return [
          "सूरज पूरब से निकलता है",
          "नीला आसमान बहुत साफ दिखाई दे रहा है",
          "बच्चों ने पार्क में गेंद खेली",
          "समय बहुत मूल्यवान और अनमोल है"
        ];
      case 'kn':
        return [
          "ಬೆಳಗಿನ ಸೂರ್ಯ ತಂಪಾಗಿದ್ದಾನೆ",
          "ಹಕ್ಕಿಗಳು ಆಕಾಶದಲ್ಲಿ ಹಾರುತ್ತಿವೆ",
          "ಮಕ್ಕಳು ಮೈದಾನದಲ್ಲಿ ಆಟವಾಡುತ್ತಿದ್ದಾರೆ",
          "ಸಮಯವು ಅತ್ಯಂತ ಬೆಲೆಯುಳ್ಳದ್ದಾಗಿದೆ"
        ];
      case 'gu':
        return [
          "સવારે સૂર્ય પૂર્વમાં ઊગે છે",
          "આજે આકાશ એકદમ સ્વચ્છ છે",
          "બાળકો મેદાનમાં રમી રહ્યા છે",
          "સમય ખૂબ જ કિંમતી છે"
        ];
      default:
        return [
          "The early morning breeze feels refreshing",
          "Blue skies appeared after the spring rain",
          "Children laughed and played around the park",
          "Gentle whispers become softer over time"
        ];
    }
  };

  const sentences = getSentencesForLanguage(currentLanguage);

  // 4 Calibrated Frequency Range Questions
  const stages: RepetitionStage[] = [
    {
      id: 1,
      name: "Stage 1: Average Auditory Spectrum",
      frequencyRange: "250 Hz to 12,000–14,000 Hz",
      categoryDesc: "Average adult daily listening bandwidth evaluation.",
      filterType: "lowpass",
      filterFreq: 13000,
      text: sentences[0],
    },
    {
      id: 2,
      name: "Stage 2: High-Frequency Hearing Loss Band",
      frequencyRange: "2,000 Hz to 8,000 Hz",
      categoryDesc: "High-frequency loss screening: speech clarity and consonant perception (s, f, th, sh).",
      filterType: "bandpass",
      filterFreq: 4500,
      text: sentences[1],
    },
    {
      id: 3,
      name: "Stage 3: Core Speech Frequencies",
      frequencyRange: "250 Hz to 2,000 Hz",
      categoryDesc: "Fundamental human speech formants and primary vowel comprehension.",
      filterType: "bandpass",
      filterFreq: 1100,
      text: sentences[2],
    },
    {
      id: 4,
      name: "Stage 4: Age-Related Sensitivity Threshold",
      frequencyRange: "Natural Aging Decline Band",
      categoryDesc: "Natural aging decline: dropping below 15,000–17,000 Hz by young adulthood and down to 12,000 Hz or lower by middle age.",
      filterType: "lowpass",
      filterFreq: 8000,
      text: sentences[3],
    },
  ];

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [repetitionsCount, setRepetitionsCount] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [recordedAnswers, setRecordedAnswers] = useState<RepetitionStageAnswer[]>([]);
  const [showTestSummary, setShowTestSummary] = useState(false);

  const currentStage = stages[currentStageIndex];

  useEffect(() => {
    setUserInput('');
    setIsFinalSubmitted(false);
    setEvalResult(null);
    setRepetitionsCount(0);
    playStageAudio();
  }, [currentStageIndex]);

  const playStageAudio = async () => {
    if (isAudioPlaying) return;
    setIsAudioPlaying(true);

    try {
      await audioService.playFilteredToneBeep(
        currentStage.filterType === 'allpass' ? 'lowpass' : (currentStage.filterType as BiquadFilterType),
        currentStage.filterFreq,
        250,
        activeEar
      );
      await speechService.speakText(currentStage.text, currentLanguage, 0.9);
    } catch (err) {
      console.warn("Audio playback error:", err);
    } finally {
      setIsAudioPlaying(false);
    }
  };

  const handleRepeatClick = () => {
    setRepetitionsCount(prev => prev + 1);
    playStageAudio();
  };

  const checkTranscription = (input: string, target: string): EvaluationResult => {
    const normalize = (str: string) =>
      str
        .trim()
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, '')
        .replace(/\s+/g, ' ');

    const cleanInput = normalize(input);
    const cleanTarget = normalize(target);

    // Exact Match
    if (cleanInput === cleanTarget) {
      return {
        status: 'CORRECT',
        message: 'Perfect match! Every word matches the spoken sentence.'
      };
    }

    const targetWords = cleanTarget.split(' ').filter(Boolean);
    const userWords = cleanInput.split(' ').filter(Boolean);

    // Word count gap check
    if (Math.abs(targetWords.length - userWords.length) > 1 || userWords.length < targetWords.length - 1) {
      return {
        status: 'INCORRECT',
        message: 'Statement incomplete: One or more entire words are missing from what was spoken.'
      };
    }

    const minorVariants: Array<{ expected: string; typed: string }> = [];
    const meaningChangedWords: Array<{ expected: string; typed: string }> = [];

    if (targetWords.length === userWords.length) {
      for (let i = 0; i < targetWords.length; i++) {
        const tw = targetWords[i];
        const uw = userWords[i];

        if (tw === uw) continue;

        if (isMinorVariantOrInflection(tw, uw)) {
          minorVariants.push({ expected: tw, typed: uw });
        } else {
          meaningChangedWords.push({ expected: tw, typed: uw });
        }
      }
    } else {
      return {
        status: 'INCORRECT',
        message: 'Statement mismatch: Word count does not match the spoken sentence.'
      };
    }

    // Meaning altered -> INCORRECT
    if (meaningChangedWords.length > 0) {
      return {
        status: 'INCORRECT',
        message: `Word meaning changed: "${meaningChangedWords[0].typed}" changes the sentence meaning (Expected: "${meaningChangedWords[0].expected}").`,
        meaningChangedWords
      };
    }

    // Minor grammatical/inflection change -> CORRECT
    if (minorVariants.length > 0) {
      return {
        status: 'CORRECT',
        hasMinorVariant: true,
        minorVariants,
        message: `Statement accepted! Minor inflection recognized ("${minorVariants[0].typed}" for "${minorVariants[0].expected}"). Meaning preserved.`
      };
    }

    return {
      status: 'CORRECT',
      message: 'Sentence recognized correctly!'
    };
  };

  const handleVerifyAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const evaluation = checkTranscription(userInput, currentStage.text);
    setEvalResult(evaluation);

    const isCorrect = evaluation.status === 'CORRECT';

    const answerRecord: RepetitionStageAnswer = {
      stageId: currentStage.id,
      stageName: currentStage.name,
      frequencyRange: currentStage.frequencyRange,
      targetText: currentStage.text,
      userResponse: userInput.trim(),
      repetitionsCount: repetitionsCount,
      isCorrect: isCorrect,
    };

    setRecordedAnswers(prev => [...prev, answerRecord]);
    setIsFinalSubmitted(true);
  };

  const handleNextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    } else {
      setShowTestSummary(true);
    }
  };

  const handleProceedToTest2 = () => {
    const totalQuestions = stages.length;
    const correctAnswers = recordedAnswers.filter(a => a.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const totalRepetitions = recordedAnswers.reduce((acc, curr) => acc + curr.repetitionsCount, 0);
    const accuracyPercentage = Math.round((correctAnswers / totalQuestions) * 100);

    const summary: RepetitionTestSummary = {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      totalRepetitions,
      accuracyPercentage,
      stageBreakdown: recordedAnswers
    };

    onComplete(summary);
  };

  const wordCount = userInput.trim() ? userInput.trim().split(/\s+/).length : 0;

  // Summary View
  if (showTestSummary) {
    const totalQuestions = stages.length;
    const correctCount = recordedAnswers.filter(a => a.isCorrect).length;
    const totalReps = recordedAnswers.reduce((acc, curr) => acc + curr.repetitionsCount, 0);
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300">
        <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-9 shadow-brutal-lg text-center relative overflow-hidden">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-black/10">
            <span className="text-[11px] font-black uppercase tracking-wider text-black">
              TEST 01 COMPLETE
            </span>
            <span className="text-[11px] font-black uppercase text-black bg-[#FFC700] px-2 py-0.5 border border-black shadow-brutal-xs">
              STAGE 0{totalQuestions}/0{totalQuestions}
            </span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-[#FFC700] border-2 border-black shadow-brutal text-black flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            {t.test1.summaryTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-gray-600">
            All 4 frequency-modulated acoustic stages evaluated.
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6">
            <div className="bg-[#FAF9F6] p-3 rounded-xl border-2 border-black shadow-brutal-xs text-center">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{t.test1.totalQuestions}</span>
              <p className="text-2xl font-black text-black mt-0.5">{totalQuestions}</p>
            </div>
            <div className="bg-[#FAF9F6] p-3 rounded-xl border-2 border-black shadow-brutal-xs text-center">
              <span className="text-[10px] font-black text-black uppercase tracking-wider">{t.test1.correctAnswers}</span>
              <p className="text-2xl font-black text-black mt-0.5">{correctCount}</p>
            </div>
            <div className="bg-[#FFC700] p-3 rounded-xl border-2 border-black shadow-brutal-xs text-center">
              <span className="text-[10px] font-black text-black uppercase tracking-wider">{t.test1.accuracy}</span>
              <p className="text-2xl font-black text-black mt-0.5">{accuracy}%</p>
            </div>
            <div className="bg-[#FAF9F6] p-3 rounded-xl border-2 border-black shadow-brutal-xs text-center">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{t.test1.totalRepeats}</span>
              <p className="text-2xl font-black text-black mt-0.5">{totalReps}</p>
            </div>
          </div>

          {/* Stage by stage breakdown table */}
          <div className="text-left mb-6">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-black mb-2">
              PERFORMANCE BY ACOUSTIC STAGE
            </h4>
            <div className="space-y-2">
              {recordedAnswers.map((ans, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs text-xs">
                  <div className="flex items-center space-x-2.5">
                    {ans.isCorrect ? (
                      <div className="w-5 h-5 bg-[#FFC700] border border-black rounded-md flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-red-400 border border-black rounded-md flex items-center justify-center shrink-0">
                        <XCircle className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                      </div>
                    )}
                    <div>
                      <span className="font-black text-black uppercase text-[11px]">{ans.stageName}</span>
                      <span className="text-gray-500 ml-2 font-mono text-[10px]">{ans.frequencyRange}</span>
                    </div>
                  </div>
                  <span className={`font-black uppercase px-2 py-0.5 rounded text-[10px] border border-black ${
                    ans.isCorrect ? 'bg-[#FFC700] text-black' : 'bg-red-200 text-black'
                  }`}>
                    {ans.isCorrect ? 'Recognized' : 'Missed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature Action Button */}
          <button
            onClick={handleProceedToTest2}
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
          >
            <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-sm sm:text-base text-black flex items-center justify-center">
              PROCEED TO TEST 2: WORD CONTRAST
            </span>
            <div className="bg-black text-[#FFC700] px-5 sm:px-6 flex items-center justify-center border-l-2 border-black group-hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Hazard Stripe Bottom Bar */}
          <div className="mt-6 -mx-6 -mb-9 sm:-mx-9 sm:-mb-9 h-3.5 bg-hazard-stripes border-t-2 border-black" />
        </div>
      </div>
    );
  }

  // Active Stage View
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300">
      
      {/* Phone-inspired Neo-Brutalist Card Container */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg relative overflow-hidden space-y-5">
        
        {/* Top Header Bar with Exit Control */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-[#FFC700] border border-black rounded-full" />
            <span className="text-[11px] font-black uppercase tracking-wider text-black">
              TEST 01 // REPETITION
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase text-black bg-[#FFC700] px-2 py-0.5 border border-black shadow-brutal-xs">
              STAGE {currentStageIndex + 1}/{stages.length}
            </span>
            <button
              onClick={onExitRequest}
              className="p-1.5 rounded-lg border border-black bg-white hover:bg-gray-100 text-black transition-colors cursor-pointer"
              title="Exit Screening Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Ear Identification Banner */}
        <div className={`p-2.5 rounded-xl border-2 border-black flex items-center justify-between shadow-brutal-xs ${
          activeEar === 'left' ? 'bg-sky-100 text-sky-950' :
          activeEar === 'right' ? 'bg-amber-100 text-amber-950' :
          'bg-purple-100 text-purple-950'
        }`}>
          <div className="flex items-center space-x-2">
            <Headphones className="w-4 h-4 stroke-[2.5]" />
            <span className="text-xs font-black uppercase tracking-wider">
              {activeEar === 'left' ? '🎧 ACTIVE: LEFT EAR TEST (RIGHT EAR MASKED)' :
               activeEar === 'right' ? '🎧 ACTIVE: RIGHT EAR TEST (LEFT EAR MASKED)' :
               '🎧 BILATERAL TEST (BOTH EARS ACTIVE)'}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white rounded border border-black">
            {activeEar === 'both' ? 'STEREO' : 'ISOLATED'}
          </span>
        </div>

        {/* Stage Title and Frequency Badge */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
            {currentStage.name}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-black text-[#FFC700] rounded">
              BAND: {currentStage.frequencyRange}
            </span>
            <span className="text-xs font-semibold text-gray-600">
              {currentStage.categoryDesc}
            </span>
          </div>
        </div>

        {/* Stage Progress Pills */}
        <div className="flex items-center space-x-1.5 py-1">
          {stages.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full border border-black transition-all ${
                i === currentStageIndex
                  ? 'flex-1 bg-[#FFC700]'
                  : i < currentStageIndex
                  ? 'w-4 bg-black'
                  : 'w-4 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Audio Playback & Repeat Controls Box */}
        <div className="p-5 rounded-2xl bg-[#FAF9F6] border-2 border-black shadow-brutal-sm text-center space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-black">
            {isAudioPlaying ? "BROADCASTING FILTERED SENTENCE..." : "PRESS PLAY TO HEAR ACOUSTIC SENTENCE"}
          </div>

          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={playStageAudio}
              disabled={isAudioPlaying}
              className={`px-5 py-3 rounded-xl border-2 border-black font-black uppercase text-xs sm:text-sm tracking-wider transition-all flex items-center space-x-2 shadow-brutal cursor-pointer ${
                isAudioPlaying 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : 'bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs text-black'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isAudioPlaying ? 'animate-bounce' : ''}`} />
              <span>{isAudioPlaying ? "PLAYING..." : "PLAY SENTENCE"}</span>
            </button>

            <button
              onClick={handleRepeatClick}
              disabled={isAudioPlaying}
              className="px-4 py-3 rounded-xl bg-white hover:bg-gray-100 text-black border-2 border-black text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center space-x-2 shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>REPEAT</span>
              {repetitionsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-black text-[#FFC700] font-black">
                  {repetitionsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Transcription Input Console */}
        <form onSubmit={handleVerifyAnswer} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black">
                TYPE THE SENTENCE YOU HEARD:
              </label>
              <span className="text-[10px] font-mono font-bold text-gray-500 bg-[#FAF9F6] px-2 py-0.5 border border-black rounded">
                {wordCount} WORDS
              </span>
            </div>

            <textarea
              rows={3}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isFinalSubmitted}
              placeholder="Type each word clearly as you heard it..."
              className="w-full p-3.5 rounded-xl border-2 border-black bg-[#FAF9F6] text-black placeholder-gray-400 text-sm font-bold focus:bg-white focus:outline-none shadow-brutal-sm transition-all disabled:opacity-60 resize-none"
              required
            />
          </div>

          {/* Verification Feedback Banner */}
          {evalResult && (
            <div
              className={`p-3.5 rounded-xl border-2 border-black text-xs font-bold animate-in fade-in duration-200 shadow-brutal-xs ${
                evalResult.status === 'CORRECT'
                  ? 'bg-[#FFC700]/25 text-black'
                  : 'bg-red-100 text-black'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                {evalResult.status === 'CORRECT' ? (
                  <div className="w-5 h-5 bg-[#FFC700] border border-black rounded flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-red-400 border border-black rounded flex items-center justify-center shrink-0 mt-0.5">
                    <XCircle className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  </div>
                )}
                <div>
                  <p className="font-black uppercase tracking-tight">{evalResult.message}</p>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Spoken Script: <em>"{currentStage.text}"</em>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button: Yellow bar + Attached Black Arrow Square */}
          {!isFinalSubmitted ? (
            <button
              type="submit"
              disabled={!userInput.trim() || isAudioPlaying}
              className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] disabled:opacity-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
            >
              <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-sm sm:text-base text-black flex items-center justify-center">
                VERIFY SENTENCE
              </span>
              <div className="bg-black text-[#FFC700] px-5 sm:px-6 flex items-center justify-center border-l-2 border-black group-hover:text-white transition-colors">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextStage}
              className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
            >
              <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-sm sm:text-base text-black flex items-center justify-center">
                {currentStageIndex < stages.length - 1 ? "NEXT ACOUSTIC STAGE" : "VIEW TEST 1 SUMMARY"}
              </span>
              <div className="bg-black text-[#FFC700] px-5 sm:px-6 flex items-center justify-center border-l-2 border-black group-hover:text-white transition-colors">
                <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          )}

        </form>

        {/* Hazard Stripe Bottom Accent */}
        <div className="mt-6 -mx-6 -mb-8 sm:-mx-8 sm:-mb-8 h-3.5 bg-hazard-stripes border-t-2 border-black" />

      </div>

    </div>
  );
};
