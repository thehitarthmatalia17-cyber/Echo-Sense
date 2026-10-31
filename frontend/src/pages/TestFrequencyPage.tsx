import React, { useState, useEffect } from 'react';
import {
  ToneItem,
  ToneResponse,
  FrequencyTestSummary,
  LanguageCode
} from '../types';
import { translations } from '../i18n/translations';
import { audioService } from '../services/audioService';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
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
  X
} from 'lucide-react';

interface TestFrequencyPageProps {
  currentLanguage: LanguageCode;
  onComplete: (summary: FrequencyTestSummary) => void;
  onExitRequest: () => void;
  activeEar?: 'left' | 'right' | 'both';
}

export const TestFrequencyPage: React.FC<TestFrequencyPageProps> = ({
  currentLanguage,
  onComplete,
  onExitRequest,
  activeEar = 'both',
}) => {
  const t = translations[currentLanguage] || translations.en;

  const initialTones: ToneItem[] = [
    { id: 't1', frequencyHz: 250, category: 'low', categoryLabel: 'Low Frequency', durationMs: 1400 },
    { id: 't2', frequencyHz: 500, category: 'low', categoryLabel: 'Low Frequency', durationMs: 1400 },
    { id: 't3', frequencyHz: 1000, category: 'mid', categoryLabel: 'Mid Speech Band', durationMs: 1400 },
    { id: 't4', frequencyHz: 2000, category: 'mid', categoryLabel: 'Mid Speech Band', durationMs: 1400 },
    { id: 't5', frequencyHz: 4000, category: 'mid', categoryLabel: 'High Consonant Band', durationMs: 1400 },
    { id: 't6', frequencyHz: 6000, category: 'high', categoryLabel: 'High Frequency', durationMs: 1400 },
    { id: 't7', frequencyHz: 8000, category: 'high', categoryLabel: 'High Frequency', durationMs: 1400 },
    { id: 't8', frequencyHz: 12000, category: 'high', categoryLabel: 'Extended High Frequency', durationMs: 1400 },
  ];

  const [hasStarted, setHasStarted] = useState(false);
  const [randomizedTones, setRandomizedTones] = useState<ToneItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [responses, setResponses] = useState<ToneResponse[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const handleStartTest = () => {
    const shuffled = [...initialTones].sort(() => Math.random() - 0.5);
    setRandomizedTones(shuffled);
    setCurrentIndex(0);
    setResponses([]);
    setHasStarted(true);
  };

  const currentTone = randomizedTones[currentIndex];

  useEffect(() => {
    if (hasStarted && currentTone && !showSummary) {
      playToneSound();
    }
  }, [currentIndex, hasStarted]);

  const playToneSound = async () => {
    if (isPlayingTone || !currentTone) return;
    setIsPlayingTone(true);
    try {
      await audioService.playPureTone(currentTone.frequencyHz, currentTone.durationMs, 0.22, activeEar, true);
    } catch (err) {
      console.warn("Tone generation error:", err);
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
      estimatedDbHl: heard ? 15 : 60,
    };

    const nextResponses = [...responses, responseItem];
    setResponses(nextResponses);

    if (currentIndex < randomizedTones.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleProceedToFinalReport = () => {
    const totalTones = responses.length;
    const detectedTones = responses.filter(r => r.heard).length;
    const missedTones = totalTones - detectedTones;
    const detectionPercentage = Math.round((detectedTones / totalTones) * 100);

    const summary: FrequencyTestSummary = {
      totalTones,
      detectedTones,
      missedTones,
      detectionPercentage,
      responses,
      testedEar: activeEar,
      categorySummary: {
        low: {
          detected: responses.filter(r => r.category === 'low' && r.heard).length,
          missed: responses.filter(r => r.category === 'low' && !r.heard).length,
          total: responses.filter(r => r.category === 'low').length,
          rangeHz: '250–500 Hz',
        },
        mid: {
          detected: responses.filter(r => r.category === 'mid' && r.heard).length,
          missed: responses.filter(r => r.category === 'mid' && !r.heard).length,
          total: responses.filter(r => r.category === 'mid').length,
          rangeHz: '1,000–4,000 Hz',
        },
        high: {
          detected: responses.filter(r => r.category === 'high' && r.heard).length,
          missed: responses.filter(r => r.category === 'high' && !r.heard).length,
          total: responses.filter(r => r.category === 'high').length,
          rangeHz: '6,000–12,000 Hz',
        },
      },
    };

    onComplete(summary);
  };

  // Welcome / Pre-test Instructions
  if (!hasStarted) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300">
        <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-9 shadow-brutal-lg text-center relative overflow-hidden">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-black/10">
            <span className="text-[11px] font-black uppercase tracking-wider text-black">
              TEST 03 // SETUP
            </span>
            <span className="text-[11px] font-black uppercase text-black bg-[#FFC700] px-2 py-0.5 border border-black shadow-brutal-xs">
              STEP 03/04
            </span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-[#FFC700] border-2 border-black shadow-brutal text-black flex items-center justify-center mx-auto mb-4">
            <Volume2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-black bg-[#FFC700] px-3 py-1 border border-black shadow-brutal-xs mb-2">
            PURE SINE WAVE SCREENING
          </span>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            {t.test3.title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-gray-600 max-w-md mx-auto leading-relaxed">
            {t.test3.subtitle}
          </p>

          <div className="my-6 space-y-3 text-left">
            {/* Ear Testing Indicator */}
            <div className={`p-3.5 rounded-xl border-2 border-black shadow-brutal-xs flex items-center justify-between ${
              activeEar === 'left' ? 'bg-sky-100 text-sky-950' :
              activeEar === 'right' ? 'bg-amber-100 text-amber-950' :
              'bg-purple-100 text-purple-950'
            }`}>
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-black text-white border border-black rounded-lg">
                  <Headphones className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider">Active Ear Under Test</p>
                  <p className="text-xs font-black uppercase">
                    {activeEar === 'left' ? '🎧 LEFT EAR ONLY (Right Ear Masked)' :
                     activeEar === 'right' ? '🎧 RIGHT EAR ONLY (Left Ear Masked)' :
                     '🎧 BILATERAL (Both Ears Active)'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white rounded border border-black">
                {activeEar.toUpperCase()}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs flex items-start space-x-3">
              <div className="p-1.5 bg-[#FFC700] border border-black rounded-lg text-black shrink-0 mt-0.5">
                <Headphones className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-xs text-black leading-relaxed font-bold">
                {t.test3.headphoneNotice}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs flex items-start space-x-3">
              <div className="p-1.5 bg-black text-[#FFC700] border border-black rounded-lg shrink-0 mt-0.5">
                <Info className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-xs text-black leading-relaxed font-bold">
                {t.test3.quietNotice}
              </div>
            </div>
          </div>

          {/* Signature Action Button */}
          <button
            onClick={handleStartTest}
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
          >
            <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-sm sm:text-base text-black flex items-center justify-center">
              {t.test3.startToneTest}
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

  // Summary View
  if (showSummary) {
    const totalCount = responses.length;
    const detectedCount = responses.filter(r => r.heard).length;
    const detectionPct = Math.round((detectedCount / totalCount) * 100);

    return (
      <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300">
        <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-9 shadow-brutal-lg text-center relative overflow-hidden">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-black/10">
            <span className="text-[11px] font-black uppercase tracking-wider text-black">
              TEST 03 COMPLETE
            </span>
            <span className="text-[11px] font-black uppercase text-black bg-[#FFC700] px-2 py-0.5 border border-black shadow-brutal-xs">
              {totalCount}/{totalCount} TONES
            </span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-[#FFC700] border-2 border-black shadow-brutal text-black flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            {t.test3.summaryTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-gray-600">
            Pure sinusoidal tone threshold trials mapped across 3 frequency bands.
          </p>

          <div className="grid grid-cols-3 gap-2.5 my-6">
            <div className="bg-[#FAF9F6] p-3 rounded-xl border-2 border-black shadow-brutal-xs text-center">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Tones Tested</span>
              <p className="text-2xl font-black text-black mt-0.5">{totalCount}</p>
            </div>
            <div className="bg-[#FAF9F6] p-3 rounded-xl border-2 border-black shadow-brutal-xs text-center">
              <span className="text-[10px] font-black text-black uppercase tracking-wider">Detected</span>
              <p className="text-2xl font-black text-black mt-0.5">{detectedCount}</p>
            </div>
            <div className="bg-[#FFC700] p-3 rounded-xl border-2 border-black shadow-brutal-xs text-center">
              <span className="text-[10px] font-black text-black uppercase tracking-wider">Detection Rate</span>
              <p className="text-2xl font-black text-black mt-0.5">{detectionPct}%</p>
            </div>
          </div>

          {/* Breakdown by frequency register */}
          <div className="text-left mb-6">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-black mb-2">
              FREQUENCY BAND RESPONSES
            </h4>
            <div className="space-y-2">
              {responses.map((resp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs text-xs">
                  <div className="flex items-center space-x-2.5">
                    {resp.heard ? (
                      <div className="w-5 h-5 bg-[#FFC700] border border-black rounded flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-gray-200 border border-black rounded flex items-center justify-center shrink-0">
                        <X className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                      </div>
                    )}
                    <div>
                      <span className="font-black text-black uppercase text-[11px]">{resp.frequencyHz} HZ</span>
                      <span className="text-gray-500 ml-2 uppercase text-[10px] font-bold">({resp.category} BAND)</span>
                    </div>
                  </div>
                  <span className={`font-black uppercase px-2 py-0.5 rounded text-[10px] border border-black ${
                    resp.heard ? 'bg-[#FFC700] text-black' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {resp.heard ? 'Detected' : 'Not Detected'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleProceedToFinalReport}
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
          >
            <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-sm sm:text-base text-black flex items-center justify-center">
              {t.test3.viewFinalReport}
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

  // Active Testing View
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300">
      
      {/* Phone-inspired Neo-Brutalist Card Container */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg relative overflow-hidden space-y-5">
        
        {/* Top Header Bar with Exit Control */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-[#FFC700] border border-black rounded-full" />
            <span className="text-[11px] font-black uppercase tracking-wider text-black">
              TEST 03 // PURE TONES
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase text-black bg-[#FFC700] px-2 py-0.5 border border-black shadow-brutal-xs">
              TRIAL {currentIndex + 1}/{randomizedTones.length}
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

        {/* Title and Register Band */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
            TRIAL {currentIndex + 1} OF {randomizedTones.length}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-black text-[#FFC700] rounded">
              BAND: {currentTone.categoryLabel}
            </span>
          </div>
        </div>

        {/* Progress Category Pills */}
        <div className="flex items-center space-x-1.5 py-1">
          {randomizedTones.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full border border-black transition-all ${
                i === currentIndex
                  ? 'flex-1 bg-[#FFC700]'
                  : i < currentIndex
                  ? 'w-3 bg-black'
                  : 'w-3 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Tone Generator Audio Box */}
        <div className="p-6 rounded-2xl bg-[#FAF9F6] border-2 border-black shadow-brutal-sm text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#FFC700] border-2 border-black mx-auto flex items-center justify-center shadow-brutal-sm">
            <Volume2 className={`w-8 h-8 text-black stroke-[2.5] ${isPlayingTone ? 'animate-bounce' : ''}`} />
          </div>

          <div>
            <div className="text-sm font-black uppercase tracking-tight text-black">
              {isPlayingTone ? "PLAYING CALIBRATED AUDIO TONE..." : "DID YOU HEAR THE SOUND?"}
            </div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
              Randomized sequence • {currentTone.categoryLabel}
            </p>
          </div>

          <button
            onClick={playToneSound}
            disabled={isPlayingTone}
            className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-black border-2 border-black text-xs font-black uppercase tracking-wider transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>REPLAY TONE</span>
          </button>
        </div>

        {/* High-Contrast HEARD / NOT HEARD Tactile Neo-Brutalist Buttons */}
        <div className="space-y-2">
          <label className="block text-[11px] font-black uppercase tracking-wider text-black text-center">
            {t.test3.questionText}
          </label>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            
            {/* HEARD Button */}
            <button
              onClick={() => handleRecordResponse(true)}
              className="py-5 px-4 rounded-2xl bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs text-black border-2 border-black font-black uppercase tracking-wider text-sm sm:text-base transition-all shadow-brutal flex flex-col items-center justify-center space-y-1 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 stroke-[3]" />
                <span>{t.test3.heardButton}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800">Sound Detected</span>
            </button>

            {/* NOT HEARD Button */}
            <button
              onClick={() => handleRecordResponse(false)}
              className="py-5 px-4 rounded-2xl bg-white hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs text-black border-2 border-black font-black uppercase tracking-wider text-sm sm:text-base transition-all shadow-brutal flex flex-col items-center justify-center space-y-1 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <X className="w-5 h-5 stroke-[3]" />
                <span>{t.test3.notHeardButton}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Nothing Audible</span>
            </button>

          </div>
        </div>

        {/* Hazard Stripe Bottom Accent */}
        <div className="mt-6 -mx-6 -mb-8 sm:-mx-8 sm:-mb-8 h-3.5 bg-hazard-stripes border-t-2 border-black" />

      </div>

    </div>
  );
};
