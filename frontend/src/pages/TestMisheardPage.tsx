import React, { useState, useEffect } from 'react';
import {
  MisheardWordPair,
  MisheardWordAttempt,
  MisheardTestSummary,
  LanguageCode
} from '../types';
import { translations } from '../i18n/translations';
import { speechService } from '../services/speechService';
import { audioService } from '../services/audioService';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import { Modal } from '../components/Modal';
import {
  RotateCcw,
  Volume2,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Info,
  Sparkles,
  Award,
  Ear,
  Sliders,
  LogOut,
  ChevronRight,
  Check,
  FastForward
} from 'lucide-react';

interface TestMisheardPageProps {
  currentLanguage: LanguageCode;
  onComplete: (summary: MisheardTestSummary) => void;
  onSkip?: () => void;
  onExitRequest: () => void;
  activeEar?: 'left' | 'right' | 'both';
  testNumber?: number;
  totalTests?: number;
  onNextTest?: () => void;
}

export const TestMisheardPage: React.FC<TestMisheardPageProps> = ({
  currentLanguage,
  onComplete,
  onSkip,
  onExitRequest,
  activeEar = 'both',
  testNumber = 2,
  totalTests = 4,
  onNextTest,
}) => {
  const t = translations[currentLanguage] || translations.en;

  const wordPairsByCategory: Record<string, MisheardWordPair[]> = {
    "Vowel Formant Distinction (250 Hz – 2,000 Hz)": [
      { id: 'v1', category: 'Vowel Formant Distinction (250 Hz – 2,000 Hz)', word1: 'Ship', word2: 'Sheep', targetWord: 'Ship', phonemeDifference: 'Short vowel /ɪ/ vs Long vowel /iː/' },
      { id: 'v2', category: 'Vowel Formant Distinction (250 Hz – 2,000 Hz)', word1: 'Fit', word2: 'Feet', targetWord: 'Feet', phonemeDifference: 'Short vowel /ɪ/ vs Long vowel /iː/' },
      { id: 'v3', category: 'Vowel Formant Distinction (250 Hz – 2,000 Hz)', word1: 'Bit', word2: 'Beat', targetWord: 'Beat', phonemeDifference: 'Short vowel /ɪ/ vs Long vowel /iː/' },
    ],
    "Voiced vs Voiceless Fricatives (2,000 Hz – 6,000 Hz)": [
      { id: 'f1', category: 'Voiced vs Voiceless Fricatives (2,000 Hz – 6,000 Hz)', word1: 'Fan', word2: 'Van', targetWord: 'Van', phonemeDifference: 'Voiceless /f/ vs Voiced /v/' },
      { id: 'f2', category: 'Voiced vs Voiceless Fricatives (2,000 Hz – 6,000 Hz)', word1: 'Fine', word2: 'Vine', targetWord: 'Fine', phonemeDifference: 'Voiceless /f/ vs Voiced /v/' },
      { id: 'f3', category: 'Voiced vs Voiceless Fricatives (2,000 Hz – 6,000 Hz)', word1: 'Fast', word2: 'Vast', targetWord: 'Vast', phonemeDifference: 'Voiceless /f/ vs Voiced /v/' },
    ],
    "Dental Fricative vs Alveolar Plosive (2,000 Hz – 8,000 Hz)": [
      { id: 'd1', category: 'Dental Fricative vs Alveolar Plosive (2,000 Hz – 8,000 Hz)', word1: 'Thin', word2: 'Tin', targetWord: 'Thin', phonemeDifference: 'Dental /θ/ vs Alveolar /t/' },
      { id: 'd2', category: 'Dental Fricative vs Alveolar Plosive (2,000 Hz – 8,000 Hz)', word1: 'Three', word2: 'Tree', targetWord: 'Tree', phonemeDifference: 'Dental /θ/ vs Alveolar /t/' },
      { id: 'd3', category: 'Dental Fricative vs Alveolar Plosive (2,000 Hz – 8,000 Hz)', word1: 'Thank', word2: 'Tank', targetWord: 'Tank', phonemeDifference: 'Dental /θ/ vs Alveolar /t/' },
    ],
    "Bilabial Plosive Voicing (250 Hz – 1,500 Hz)": [
      { id: 'b1', category: 'Bilabial Plosive Voicing (250 Hz – 1,500 Hz)', word1: 'Pat', word2: 'Bat', targetWord: 'Bat', phonemeDifference: 'Voiceless /p/ with aspiration vs Voiced /b/' },
      { id: 'b2', category: 'Bilabial Plosive Voicing (250 Hz – 1,500 Hz)', word1: 'Pin', word2: 'Bin', targetWord: 'Pin', phonemeDifference: 'Voiceless /p/ with aspiration vs Voiced /b/' },
      { id: 'b3', category: 'Bilabial Plosive Voicing (250 Hz – 1,500 Hz)', word1: 'Pig', word2: 'Big', targetWord: 'Big', phonemeDifference: 'Voiceless /p/ with aspiration vs Voiced /b/' },
    ],
    "Final Consonant Voicing & Decay (1,000 Hz – 4,000 Hz)": [
      { id: 'c1', category: 'Final Consonant Voicing & Decay (1,000 Hz – 4,000 Hz)', word1: 'Cap', word2: 'Cab', targetWord: 'Cab', phonemeDifference: 'Final voiceless /p/ vs voiced /b/' },
      { id: 'c2', category: 'Final Consonant Voicing & Decay (1,000 Hz – 4,000 Hz)', word1: 'Rope', word2: 'Robe', targetWord: 'Rope', phonemeDifference: 'Final voiceless /p/ vs voiced /b/' },
      { id: 'c3', category: 'Final Consonant Voicing & Decay (1,000 Hz – 4,000 Hz)', word1: 'Lap', word2: 'Lab', targetWord: 'Lab', phonemeDifference: 'Final voiceless /p/ vs voiced /b/' },
    ],
  };

  const categories = Object.keys(wordPairsByCategory);

  const [categoryIndex, setCategoryIndex] = useState(0);
  const [itemIndexInCategory, setItemIndexInCategory] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isMatch: boolean; message: string; target: string; chosen: string } | null>(null);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [historyAttempts, setHistoryAttempts] = useState<MisheardWordAttempt[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showSkipConfirmModal, setShowSkipConfirmModal] = useState(false);

  const handleConfirmReset = () => {
    speechService.stopAll();
    audioService.stopAll();
    setCategoryIndex(0);
    setItemIndexInCategory(0);
    setIsPlayingAudio(false);
    setSelectedWord(null);
    setFeedback(null);
    setAttemptsCount(0);
    setHistoryAttempts([]);
    setShowSummary(false);
    setShowResetConfirmModal(false);
  };

  const handleConfirmSkip = () => {
    speechService.stopAll();
    audioService.stopAll();
    setShowSkipConfirmModal(false);
    if (onSkip) {
      onSkip();
    }
  };

  const [currentTargetWord, setCurrentTargetWord] = useState<string>('');
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [useCarrierPhrase, setUseCarrierPhrase] = useState(true);

  const currentCategory = categories[categoryIndex];
  const currentPair = wordPairsByCategory[currentCategory][itemIndexInCategory];

  useEffect(() => {
    if (!currentPair) return;

    // 50/50 randomized target selection
    const randomTarget = Math.random() < 0.5 ? currentPair.word1 : currentPair.word2;
    setCurrentTargetWord(randomTarget);

    const options = Math.random() < 0.5 
      ? [currentPair.word1, currentPair.word2] 
      : [currentPair.word2, currentPair.word1];
    setShuffledOptions(options);

    setFeedback(null);
    setSelectedWord(null);
    setAttemptsCount(0);

    playAudioForWord(randomTarget, 0.95, useCarrierPhrase);
  }, [categoryIndex, itemIndexInCategory]);

  const playAudioForWord = async (wordToPlay: string, rate: number = 0.95, withCarrier: boolean = false) => {
    if (isPlayingAudio || !wordToPlay) return;
    setIsPlayingAudio(true);
    try {
      if (withCarrier) {
        await speechService.speakText(`The word is... ${wordToPlay}`, 'en', rate, 1.0);
      } else {
        await speechService.speakText(wordToPlay, 'en', rate, 1.0);
      }
    } catch (err) {
      console.warn("Speech playback error:", err);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleReplay = (slow: boolean = false) => {
    if (!currentTargetWord) return;
    playAudioForWord(currentTargetWord, slow ? 0.78 : 0.95, useCarrierPhrase);
  };

  const handleSelectWord = (chosenWord: string) => {
    if (feedback || isPlayingAudio) return;

    setSelectedWord(chosenWord);
    const newAttempts = attemptsCount + 1;
    setAttemptsCount(newAttempts);

    const isCorrect = chosenWord.trim().toLowerCase() === currentTargetWord.trim().toLowerCase();

    const attemptRecord: MisheardWordAttempt = {
      pairId: currentPair.id,
      category: currentCategory,
      targetWord: currentTargetWord,
      recognizedWord: chosenWord,
      attemptsCount: newAttempts,
      isCorrect: isCorrect,
    };

    setHistoryAttempts(prev => [...prev, attemptRecord]);

    if (isCorrect) {
      setFeedback({
        isMatch: true,
        message: "Accurate! You correctly distinguished the minimal phonemic sound.",
        target: currentTargetWord,
        chosen: chosenWord
      });
    } else {
      setFeedback({
        isMatch: false,
        message: `Acoustic phoneme confusion noted. You selected "${chosenWord}", but the audio played was "${currentTargetWord}".`,
        target: currentTargetWord,
        chosen: chosenWord
      });
    }
  };

  const handleNextWordOrRetry = () => {
    if (feedback?.isMatch) {
      if (categoryIndex < categories.length - 1) {
        setCategoryIndex(prev => prev + 1);
        setItemIndexInCategory(0);
      } else {
        setShowSummary(true);
      }
    } else {
      const catList = wordPairsByCategory[currentCategory];
      if (itemIndexInCategory < catList.length - 1) {
        setItemIndexInCategory(prev => prev + 1);
      } else {
        if (categoryIndex < categories.length - 1) {
          setCategoryIndex(prev => prev + 1);
          setItemIndexInCategory(0);
        } else {
          setShowSummary(true);
        }
      }
    }
  };

  const handleProceedToTest3 = () => {
    const totalWords = historyAttempts.length;
    const correctItems = historyAttempts.filter(a => a.isCorrect).map(a => a.targetWord);
    const incorrectItems = historyAttempts.filter(a => !a.isCorrect).map(a => a.targetWord);
    const totalAttempts = historyAttempts.reduce((acc, curr) => acc + curr.attemptsCount, 0);
    const accuracyPercentage = totalWords > 0 
      ? Math.round((correctItems.length / totalWords) * 100) 
      : 80;

    const catPerf: Record<string, { correct: number; total: number; accuracy: number }> = {};
    categories.forEach(cat => {
      const items = historyAttempts.filter(a => a.category === cat);
      const correct = items.filter(a => a.isCorrect).length;
      const total = items.length;
      catPerf[cat] = {
        correct,
        total,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 100
      };
    });

    const areas: string[] = [];
    if (historyAttempts.some(a => !a.isCorrect && a.category.includes('Dental'))) {
      areas.push("Dental fricative vs alveolar plosives (/θ/ vs /t/ - 2kHz to 8kHz consonant band)");
    }
    if (historyAttempts.some(a => !a.isCorrect && a.category.includes('Fricatives'))) {
      areas.push("Voiced vs voiceless fricatives (/f/ vs /v/ - 2kHz to 6kHz speech clarity)");
    }
    if (historyAttempts.some(a => !a.isCorrect && a.category.includes('Final Consonant'))) {
      areas.push("Final consonant voicing and sound decay (/p/ vs /b/ - 1kHz to 4kHz band)");
    }

    const summary: MisheardTestSummary = {
      totalWords,
      correctlyRecognized: correctItems,
      incorrectlyRecognized: incorrectItems,
      totalAttempts,
      accuracyPercentage,
      categoryPerformance: catPerf,
      beneficialAssessmentAreas: areas.length > 0 ? areas : ["All core phonetic consonant pairs distinguished successfully"],
    };

    onComplete(summary);
    if (onNextTest) {
      onNextTest();
    }
  };

  // Summary View
  if (showSummary) {
    const totalCount = historyAttempts.length;
    const correctCount = historyAttempts.filter(a => a.isCorrect).length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;

    return (
      <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300">
        <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-9 shadow-brutal-lg text-center relative overflow-hidden">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-black/10">
            <span className="text-[11px] font-black uppercase tracking-wider text-black">
              TEST 02 COMPLETE
            </span>
            <span className="text-[11px] font-black uppercase text-black bg-[#FFC700] px-2 py-0.5 border border-black shadow-brutal-xs">
              {totalCount}/{totalCount} PAIRS
            </span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-[#FFC700] border-2 border-black shadow-brutal text-black flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            {t.test2.summaryTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-gray-600">
            Acoustic minimal pair phonemic distinction analysis.
          </p>

          <div className="grid grid-cols-3 gap-2.5 my-6">
            <div className="bg-[#FAF9F6] p-3 rounded-xl border-2 border-black shadow-brutal-xs text-center">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Words Evaluated</span>
              <p className="text-2xl font-black text-black mt-0.5">{totalCount}</p>
            </div>
            <div className="bg-[#FAF9F6] p-3 rounded-xl border-2 border-black shadow-brutal-xs text-center">
              <span className="text-[10px] font-black text-black uppercase tracking-wider">Correct Pairs</span>
              <p className="text-2xl font-black text-black mt-0.5">{correctCount}</p>
            </div>
            <div className="bg-[#FFC700] p-3 rounded-xl border-2 border-black shadow-brutal-xs text-center">
              <span className="text-[10px] font-black text-black uppercase tracking-wider">Recognition %</span>
              <p className="text-2xl font-black text-black mt-0.5">{accuracy}%</p>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="text-left mb-6">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-black mb-2">
              PHONEMIC PAIR DISTINCTIONS
            </h4>
            <div className="space-y-2">
              {historyAttempts.map((att, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs text-xs">
                  <div className="flex items-center space-x-2.5">
                    {att.isCorrect ? (
                      <div className="w-5 h-5 bg-[#FFC700] border border-black rounded flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-red-400 border border-black rounded flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                      </div>
                    )}
                    <div>
                      <span className="font-black text-black uppercase text-[11px]">Target: "{att.targetWord}"</span>
                      <span className="text-gray-600 ml-2 text-[10px] font-semibold">Selected: "{att.recognizedWord}"</span>
                    </div>
                  </div>
                  <span className={`font-black uppercase px-2 py-0.5 rounded text-[10px] border border-black ${
                    att.isCorrect ? 'bg-[#FFC700] text-black' : 'bg-red-200 text-black'
                  }`}>
                    {att.isCorrect ? 'Accurate' : 'Confused'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleProceedToTest3}
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
          >
            <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-xs sm:text-sm text-black flex items-center justify-center">
              NEXT TEST: PURE TONE FREQUENCY SWEEP (TEST 3 OF 4)
            </span>
            <div className="bg-black text-[#FFC700] px-5 sm:px-6 flex items-center justify-center border-l-2 border-black group-hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Hazard Stripe Bottom Accent */}
          <div className="mt-6 -mx-6 -mb-9 sm:-mx-9 sm:-mb-9 h-3.5 bg-hazard-stripes border-t-2 border-black" />
        </div>
      </div>
    );
  }

  // Active Test View
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300">
      
      {/* Phone-inspired Neo-Brutalist Card Container */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg relative overflow-hidden space-y-5">
        
        {/* Top Header Bar with Reset, Skip, and Exit Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black/10">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-[#FFC700] border border-black rounded-full" />
            <span className="text-[11px] font-black uppercase tracking-wider text-black">
              TEST 0{testNumber} OF 0{totalTests} // WORD CONTRAST
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase text-black bg-[#FFC700] px-2 py-0.5 border border-black shadow-brutal-xs">
              CATEGORY {categoryIndex + 1}/{categories.length}
            </span>

            {/* Reset Test Button */}
            <button
              type="button"
              onClick={() => setShowResetConfirmModal(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-black bg-white hover:bg-amber-100 text-black text-[11px] font-black uppercase tracking-wider shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Restart Word Contrast test from beginning"
            >
              <RotateCcw className="w-3 h-3 stroke-[2.5]" />
              <span className="hidden sm:inline">RESET</span>
            </button>

            {/* Skip This Test Button */}
            <button
              type="button"
              onClick={() => setShowSkipConfirmModal(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-black bg-amber-100 hover:bg-amber-200 text-black text-[11px] font-black uppercase tracking-wider shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Skip this test and move to next test"
            >
              <FastForward className="w-3 h-3 stroke-[2.5]" />
              <span className="hidden sm:inline">SKIP</span>
            </button>

            <button
              onClick={onExitRequest}
              className="p-1 rounded-lg border border-black bg-white hover:bg-gray-100 text-black transition-colors cursor-pointer"
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
            <Ear className="w-4 h-4 stroke-[2.5]" />
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

        {/* Title and Phonemic Contrast */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
            {currentCategory}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-black text-[#FFC700] rounded">
              CONTRAST: {currentPair.phonemeDifference}
            </span>
          </div>
        </div>

        {/* Progress Category Pills */}
        <div className="flex items-center space-x-1.5 py-1">
          {categories.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full border border-black transition-all ${
                i === categoryIndex
                  ? 'flex-1 bg-[#FFC700]'
                  : i < categoryIndex
                  ? 'w-4 bg-black'
                  : 'w-4 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Audio Player and Articulation Controls */}
        <div className="p-5 rounded-2xl bg-[#FAF9F6] border-2 border-black shadow-brutal-sm text-center space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-black">
            {isPlayingAudio ? "BROADCASTING TARGET WORD..." : "LISTEN CAREFULLY AND CHOOSE THE SPOKEN WORD"}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleReplay(false)}
              disabled={isPlayingAudio}
              className={`px-5 py-3 rounded-xl border-2 border-black font-black uppercase text-xs sm:text-sm tracking-wider transition-all flex items-center space-x-2 shadow-brutal cursor-pointer ${
                isPlayingAudio 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : 'bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs text-black'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? "PLAYING..." : "PLAY WORD"}</span>
            </button>

            <button
              onClick={() => handleReplay(true)}
              disabled={isPlayingAudio}
              className="px-4 py-3 rounded-xl bg-white hover:bg-gray-100 text-black border-2 border-black text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs cursor-pointer disabled:opacity-50"
              title="Slow articulation playback"
            >
              <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>SLOW (0.8x)</span>
            </button>
          </div>

          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
            {useCarrierPhrase ? 'With Rhyme carrier phrase: "The word is..."' : 'Direct single-word articulation'}
          </div>
        </div>

        {/* Word Selection Option Cards (Clean tactile Neo-Brutalist cards) */}
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-2 text-center">
            WHICH WORD DID YOU HEAR?
          </label>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {shuffledOptions.map((word) => {
              const isSelected = selectedWord === word;
              return (
                <button
                  key={word}
                  onClick={() => handleSelectWord(word)}
                  disabled={Boolean(feedback) || isPlayingAudio}
                  className={`p-5 sm:p-6 rounded-2xl border-2 border-black text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                    isSelected
                      ? feedback?.isMatch
                        ? 'bg-[#FFC700] shadow-brutal'
                        : 'bg-red-200 shadow-brutal'
                      : feedback && word.toLowerCase() === currentTargetWord.toLowerCase()
                      ? 'bg-[#FFC700]/30 shadow-brutal-xs'
                      : 'bg-white hover:bg-[#FAF9F6] shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs text-black'
                  } disabled:cursor-default`}
                >
                  <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                    {word}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {word === currentPair.word1 ? 'OPTION A' : 'OPTION B'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl border-2 border-black text-xs font-bold animate-in fade-in duration-200 shadow-brutal-xs ${
              feedback.isMatch
                ? 'bg-[#FFC700]/25 text-black'
                : 'bg-red-100 text-black'
            }`}
          >
            <div className="flex items-start space-x-2.5">
              {feedback.isMatch ? (
                <div className="w-5 h-5 bg-[#FFC700] border border-black rounded flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                </div>
              ) : (
                <div className="w-5 h-5 bg-red-400 border border-black rounded flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                </div>
              )}
              <div>
                <p className="font-black uppercase tracking-tight">{feedback.message}</p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Acoustic contrast distinction: {currentPair.phonemeDifference}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Continue Action: Yellow bar + Attached Black Arrow Square */}
        {feedback && (
          <button
            onClick={handleNextWordOrRetry}
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
          >
            <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-sm sm:text-base text-black flex items-center justify-center">
              {categoryIndex < categories.length - 1 ? "NEXT WORD CATEGORY" : "VIEW TEST 2 SUMMARY"}
            </span>
            <div className="bg-black text-[#FFC700] px-5 sm:px-6 flex items-center justify-center border-l-2 border-black group-hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        )}

        {/* Secondary In-Test Action Row: Reset & Skip */}
        <div className="pt-2 flex items-center justify-between gap-3 text-xs font-black uppercase">
          <button
            type="button"
            onClick={() => setShowResetConfirmModal(true)}
            className="flex-1 py-2.5 px-3 rounded-xl border-2 border-black bg-white hover:bg-amber-50 text-black shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TEST</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSkipConfirmModal(true)}
            className="flex-1 py-2.5 px-3 rounded-xl border-2 border-black bg-amber-50 hover:bg-amber-100 text-black shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>SKIP THIS TEST</span>
          </button>
        </div>

        {/* Hazard Stripe Bottom Accent */}
        <div className="mt-6 -mx-6 -mb-8 sm:-mx-8 sm:-mb-8 h-3.5 bg-hazard-stripes border-t-2 border-black" />

      </div>

      {/* Confirmation Modal for Resetting Test */}
      <Modal
        isOpen={showResetConfirmModal}
        onClose={() => setShowResetConfirmModal(false)}
        onConfirm={handleConfirmReset}
        title="Reset Word Contrast Test?"
        description="Are you sure you want to restart this test? Your current test progress will be lost."
        confirmText="Restart Test"
        cancelText="Continue Test"
        isDestructive={true}
      />

      {/* Confirmation Modal for Skipping Test */}
      <Modal
        isOpen={showSkipConfirmModal}
        onClose={() => setShowSkipConfirmModal(false)}
        onConfirm={handleConfirmSkip}
        title="Skip Word Contrast Test?"
        description="Are you sure you want to skip this test and move to the next one?"
        confirmText="Skip Test"
        cancelText="Continue Test"
        isDestructive={false}
      />

    </div>
  );
};
