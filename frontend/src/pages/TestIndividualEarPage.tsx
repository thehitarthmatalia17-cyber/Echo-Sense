import React, { useState, useEffect } from 'react';
import {
  ToneItem,
  ToneResponse,
  EarScreeningResult,
  LanguageCode
} from '../types';
import { translations } from '../i18n/translations';
import { audioService } from '../services/audioService';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import { Modal } from '../components/Modal';
import {
  Volume2,
  CheckCircle,
  XCircle,
  Headphones,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  Ear,
  LogOut,
  Info,
  Check,
  X,
  FastForward,
  Activity,
  Layers
} from 'lucide-react';

interface TestIndividualEarPageProps {
  currentLanguage: LanguageCode;
  onComplete: (leftResult?: EarScreeningResult, rightResult?: EarScreeningResult) => void;
  onSkip?: () => void;
  onExitRequest: () => void;
  initialEar?: 'left' | 'right';
  testNumber?: number;
  totalTests?: number;
}

export const TestIndividualEarPage: React.FC<TestIndividualEarPageProps> = ({
  currentLanguage,
  onComplete,
  onSkip,
  onExitRequest,
  initialEar = 'left',
  testNumber = 4,
  totalTests = 4,
}) => {
  const t = translations[currentLanguage] || translations.en;

  const testFrequencies: ToneItem[] = [
    { id: 'ie1', frequencyHz: 250, category: 'low', categoryLabel: 'Low Frequency', durationMs: 1400 },
    { id: 'ie2', frequencyHz: 500, category: 'low', categoryLabel: 'Low Frequency', durationMs: 1400 },
    { id: 'ie3', frequencyHz: 1000, category: 'mid', categoryLabel: 'Mid Speech Band', durationMs: 1400 },
    { id: 'ie4', frequencyHz: 2000, category: 'mid', categoryLabel: 'Mid Speech Band', durationMs: 1400 },
    { id: 'ie5', frequencyHz: 4000, category: 'mid', categoryLabel: 'High Consonant Band', durationMs: 1400 },
    { id: 'ie6', frequencyHz: 6000, category: 'high', categoryLabel: 'High Frequency', durationMs: 1400 },
    { id: 'ie7', frequencyHz: 8000, category: 'high', categoryLabel: 'High Frequency', durationMs: 1400 },
    { id: 'ie8', frequencyHz: 12000, category: 'high', categoryLabel: 'Extended High Frequency', durationMs: 1400 },
  ];

  // Active ear currently being evaluated
  const [activeEar, setActiveEar] = useState<'left' | 'right'>(initialEar);

  // Results for each ear
  const [leftEarResult, setLeftEarResult] = useState<EarScreeningResult | null>(null);
  const [rightEarResult, setRightEarResult] = useState<EarScreeningResult | null>(null);

  // Active testing state for current ear
  const [isTesting, setIsTesting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomizedTones, setRandomizedTones] = useState<ToneItem[]>([]);
  const [currentEarResponses, setCurrentEarResponses] = useState<ToneResponse[]>([]);
  const [isPlayingTone, setIsPlayingTone] = useState(false);

  // Modals
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showSkipConfirmModal, setShowSkipConfirmModal] = useState(false);

  const currentTone = randomizedTones[currentIndex];

  const handleStartEarTest = (ear: 'left' | 'right') => {
    audioService.stopAll();
    setActiveEar(ear);
    const shuffled = [...testFrequencies].sort(() => Math.random() - 0.5);
    setRandomizedTones(shuffled);
    setCurrentIndex(0);
    setCurrentEarResponses([]);
    setIsTesting(true);
  };

  useEffect(() => {
    if (isTesting && currentTone) {
      playToneSound();
    }
  }, [currentIndex, isTesting]);

  const playToneSound = async () => {
    if (isPlayingTone || !currentTone) return;
    setIsPlayingTone(true);
    try {
      // Play pure tone in active ear with contralateral pink noise masking in opposite ear
      await audioService.playPureTone(currentTone.frequencyHz, currentTone.durationMs, 0.22, activeEar, true);
    } catch (err) {
      console.warn("Individual ear tone generation warning:", err);
    } finally {
      setIsPlayingTone(false);
    }
  };

  const handleRecordResponse = (heard: boolean) => {
    if (!currentTone) return;

    const responseItem: ToneResponse = {
      frequencyHz: currentTone.frequencyHz,
      category: currentTone.category,
      heard,
      ear: activeEar,
      estimatedDbHl: heard ? 15 : 40,
    };

    const nextResponses = [...currentEarResponses, responseItem];
    setCurrentEarResponses(nextResponses);

    if (currentIndex < randomizedTones.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed this ear
      completeEarAssessment(activeEar, nextResponses);
    }
  };

  const completeEarAssessment = (ear: 'left' | 'right', responses: ToneResponse[]) => {
    audioService.stopAll();
    setIsTesting(false);

    const totalTones = responses.length;
    const detectedTones = responses.filter(r => r.heard).length;
    const missedTones = totalTones - detectedTones;
    const frequencyDetectionPercentage = Math.round((detectedTones / totalTones) * 100);
    const averageEstimatedDbHl = frequencyDetectionPercentage >= 80 ? 15 : (frequencyDetectionPercentage >= 60 ? 30 : 45);
    const hearingStatus = frequencyDetectionPercentage >= 80 
      ? 'Normal Sensitivity (Screening)' 
      : (frequencyDetectionPercentage >= 60 ? 'Mild Sensitivity Elevation' : 'Elevated Threshold Indicator');

    const result: EarScreeningResult = {
      ear,
      frequencyDetectionPercentage,
      detectedTones,
      missedTones,
      totalTones,
      responses,
      hearingStatus,
      averageEstimatedDbHl,
      frequenciesTested: responses.map(r => r.frequencyHz),
    };

    if (ear === 'left') {
      setLeftEarResult(result);
    } else {
      setRightEarResult(result);
    }
  };

  const handleConfirmReset = () => {
    audioService.stopAll();
    setShowResetConfirmModal(false);
    setIsTesting(false);
    setCurrentIndex(0);
    setCurrentEarResponses([]);
    setIsPlayingTone(false);
    // Restart this ear test from scratch
    handleStartEarTest(activeEar);
  };

  const handleConfirmSkip = () => {
    audioService.stopAll();
    setShowSkipConfirmModal(false);
    setIsTesting(false);
    if (onSkip) {
      onSkip();
    }
  };

  const handleFinalSubmit = () => {
    audioService.stopAll();
    onComplete(
      leftEarResult || undefined,
      rightEarResult || undefined
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300">
      
      {/* Phone-inspired Neo-Brutalist Card Container */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg relative overflow-hidden space-y-5">
        
        {/* Top Header Bar with Reset, Skip, and Exit Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black/10">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-[#FFC700] border border-black rounded-full" />
            <span className="text-[11px] font-black uppercase tracking-wider text-black">
              TEST 0{testNumber} OF 0{totalTests} // EAR ASSESSMENT
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {isTesting && (
              <span className="text-[11px] font-black uppercase text-black bg-[#FFC700] px-2 py-0.5 border border-black shadow-brutal-xs">
                TRIAL {currentIndex + 1}/{randomizedTones.length}
              </span>
            )}

            {/* Reset Test Button (only when testing or results present) */}
            <button
              type="button"
              onClick={() => setShowResetConfirmModal(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-black bg-white hover:bg-amber-100 text-black text-[11px] font-black uppercase tracking-wider shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Restart active ear test from beginning"
            >
              <RotateCcw className="w-3 h-3 stroke-[2.5]" />
              <span className="hidden sm:inline">RESET</span>
            </button>

            {/* Skip This Test Button */}
            <button
              type="button"
              onClick={() => setShowSkipConfirmModal(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-black bg-amber-100 hover:bg-amber-200 text-black text-[11px] font-black uppercase tracking-wider shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Skip this test and move to final report"
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

        {/* ======================================================== */}
        {/* VIEW 1: ACTIVE EAR TESTING IN PROGRESS */}
        {/* ======================================================== */}
        {isTesting && currentTone ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* Active Ear Notification Banner */}
            <div className={`p-3 rounded-2xl border-2 border-black flex items-center justify-between shadow-brutal-xs ${
              activeEar === 'left' ? 'bg-sky-100 text-sky-950' : 'bg-amber-100 text-amber-950'
            }`}>
              <div className="flex items-center space-x-2">
                <Headphones className="w-4 h-4 stroke-[2.5]" />
                <span className="text-xs font-black uppercase tracking-wider">
                  {activeEar === 'left' ? '🎧 ACTIVE: LEFT EAR (RIGHT EAR PINK MASKING)' : '🎧 ACTIVE: RIGHT EAR (LEFT EAR PINK MASKING)'}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white rounded border border-black">
                PAN: {activeEar === 'left' ? '-1.0' : '+1.0'}
              </span>
            </div>

            {/* Frequency Display Box */}
            <div className="bg-[#FAF9F6] border-2 border-black rounded-2xl p-5 text-center shadow-brutal-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                AUDIOMETRIC PURE TONE STIMULUS
              </span>
              <div className="text-4xl sm:text-5xl font-black text-black tracking-tight my-1">
                {currentTone.frequencyHz} <span className="text-xl">Hz</span>
              </div>
              <span className="inline-block mt-1 text-[11px] font-black uppercase px-2.5 py-0.5 bg-[#FFC700] text-black border border-black rounded shadow-brutal-xs">
                {currentTone.categoryLabel}
              </span>

              {/* Waveform Visualization */}
              <div className="mt-4">
                <WaveformVisualizer isActive={isPlayingTone} />
              </div>

              {/* Replay Tone Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={playToneSound}
                  disabled={isPlayingTone}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-black border-2 border-black text-xs font-black uppercase tracking-wider transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>REPLAY TONE</span>
                </button>
              </div>
            </div>

            {/* HEARD / NOT HEARD Response Buttons */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black text-center">
                Did you detect this sound in your {activeEar.toUpperCase()} ear?
              </label>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => handleRecordResponse(true)}
                  className="py-5 px-4 rounded-2xl bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 text-black border-2 border-black font-black uppercase tracking-wider text-sm sm:text-base transition-all shadow-brutal flex flex-col items-center justify-center space-y-1 cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>HEARD</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800">Sound Detected</span>
                </button>

                <button
                  onClick={() => handleRecordResponse(false)}
                  className="py-5 px-4 rounded-2xl bg-white hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 text-black border-2 border-black font-black uppercase tracking-wider text-sm sm:text-base transition-all shadow-brutal flex flex-col items-center justify-center space-y-1 cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <X className="w-5 h-5 stroke-[3]" />
                    <span>NOT HEARD</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Nothing Audible</span>
                </button>
              </div>
            </div>

            {/* In-Test Reset & Skip Bar */}
            <div className="pt-2 flex items-center justify-between gap-3 text-xs font-black uppercase">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(true)}
                className="flex-1 py-2.5 px-3 rounded-xl border-2 border-black bg-white hover:bg-amber-50 text-black shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET {activeEar.toUpperCase()} EAR TEST</span>
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

          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 2: EAR SELECTION & COMPLETED SUMMARY STATUS */
          /* ======================================================== */
          <div className="space-y-6">
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FFC700] border-2 border-black shadow-brutal text-black flex items-center justify-center mx-auto mb-3">
                <Ear className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                Individual Ear Assessment
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-gray-600 max-w-md mx-auto">
                Evaluate each ear independently with audio channel isolation and contralateral acoustic masking.
              </p>
            </div>

            {/* Two Ear Cards: Left & Right */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Left Ear Card */}
              <div className={`p-5 rounded-2xl border-2 border-black shadow-brutal-sm flex flex-col justify-between ${
                leftEarResult ? 'bg-sky-50' : 'bg-white'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-sky-950 flex items-center space-x-1.5">
                      <Ear className="w-4 h-4 text-sky-600" />
                      <span>LEFT EAR</span>
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black ${
                      leftEarResult ? 'bg-[#FFC700] text-black' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {leftEarResult ? 'COMPLETED' : 'PENDING'}
                    </span>
                  </div>

                  {leftEarResult ? (
                    <div className="space-y-1 mb-4 text-xs font-bold text-slate-800">
                      <p className="text-2xl font-black text-black">{leftEarResult.frequencyDetectionPercentage}%</p>
                      <p className="text-[11px] text-slate-600">{leftEarResult.hearingStatus}</p>
                      <p className="text-[10px] text-slate-500">
                        {leftEarResult.detectedTones}/{leftEarResult.totalTones} Tones Detected • ~{leftEarResult.averageEstimatedDbHl} dB HL
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 font-medium mb-4">
                      Evaluates left ear sensitivity. Right ear receives gentle pink masking noise.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleStartEarTest('left')}
                  className="w-full py-2.5 px-3 rounded-xl border-2 border-black bg-sky-200 hover:bg-sky-300 text-black font-black uppercase text-xs tracking-wider shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  {leftEarResult ? 'RE-TEST LEFT EAR' : 'START LEFT EAR TEST'}
                </button>
              </div>

              {/* Right Ear Card */}
              <div className={`p-5 rounded-2xl border-2 border-black shadow-brutal-sm flex flex-col justify-between ${
                rightEarResult ? 'bg-amber-50' : 'bg-white'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center space-x-1.5">
                      <Ear className="w-4 h-4 text-amber-600" />
                      <span>RIGHT EAR</span>
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black ${
                      rightEarResult ? 'bg-[#FFC700] text-black' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rightEarResult ? 'COMPLETED' : 'PENDING'}
                    </span>
                  </div>

                  {rightEarResult ? (
                    <div className="space-y-1 mb-4 text-xs font-bold text-slate-800">
                      <p className="text-2xl font-black text-black">{rightEarResult.frequencyDetectionPercentage}%</p>
                      <p className="text-[11px] text-slate-600">{rightEarResult.hearingStatus}</p>
                      <p className="text-[10px] text-slate-500">
                        {rightEarResult.detectedTones}/{rightEarResult.totalTones} Tones Detected • ~{rightEarResult.averageEstimatedDbHl} dB HL
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 font-medium mb-4">
                      Evaluates right ear sensitivity. Left ear receives gentle pink masking noise.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleStartEarTest('right')}
                  className="w-full py-2.5 px-3 rounded-xl border-2 border-black bg-amber-200 hover:bg-amber-300 text-black font-black uppercase text-xs tracking-wider shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  {rightEarResult ? 'RE-TEST RIGHT EAR' : 'START RIGHT EAR TEST'}
                </button>
              </div>

            </div>

            {/* Primary Action Button */}
            {(leftEarResult || rightEarResult) ? (
              <button
                onClick={handleFinalSubmit}
                className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
              >
                <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-xs sm:text-sm text-black flex items-center justify-center">
                  VIEW CONSOLIDATED FINAL REPORT
                </span>
                <div className="bg-black text-[#FFC700] px-5 sm:px-6 flex items-center justify-center border-l-2 border-black group-hover:text-white transition-colors">
                  <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleStartEarTest('left')}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-black bg-[#FFC700] hover:bg-[#FFD233] text-black font-black uppercase text-xs tracking-wider shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-center"
                >
                  BEGIN WITH LEFT EAR
                </button>

                <button
                  type="button"
                  onClick={() => setShowSkipConfirmModal(true)}
                  className="py-3 px-4 rounded-xl border-2 border-black bg-white hover:bg-amber-50 text-black font-black uppercase text-xs tracking-wider shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  SKIP TEST 4
                </button>
              </div>
            )}

          </div>
        )}

        {/* Hazard Stripe Bottom Accent */}
        <div className="mt-6 -mx-6 -mb-8 sm:-mx-8 sm:-mb-8 h-3.5 bg-hazard-stripes border-t-2 border-black" />

      </div>

      {/* Confirmation Modal for Resetting Test */}
      <Modal
        isOpen={showResetConfirmModal}
        onClose={() => setShowResetConfirmModal(false)}
        onConfirm={handleConfirmReset}
        title={`Reset ${activeEar.toUpperCase()} Ear Test?`}
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
        title="Skip Individual Ear Assessment?"
        description="Are you sure you want to skip this test and move to the final report?"
        confirmText="Skip Test"
        cancelText="Continue Test"
        isDestructive={false}
      />

    </div>
  );
};
export default TestIndividualEarPage;
