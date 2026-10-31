import React, { useState } from 'react';
import { EarMode, LanguageCode, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import {
  Volume2,
  Sliders,
  Activity,
  Headphones,
  Ear,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

interface HearingTestsPageProps {
  currentLanguage: LanguageCode;
  userProfile: UserProfile | null;
  onLaunchTest: (testType: 'test1' | 'test2' | 'test3' | 'ear_assessment' | 'full_sequence', earMode?: EarMode) => void;
}

export const HearingTestsPage: React.FC<HearingTestsPageProps> = ({
  currentLanguage,
  userProfile,
  onLaunchTest,
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [selectedIndividualEar, setSelectedIndividualEar] = useState<EarMode>('left');
  const [showEarModal, setShowEarModal] = useState<boolean>(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Banner Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#FFC700] border-2 border-black shadow-brutal-xs text-xs font-black uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>ECHOSENSE AUDITORY SUITE • 4 TESTING MODULES AVAILABLE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
          Hearing Tests
        </h1>
        <p className="mt-3 text-sm sm:text-base font-bold text-slate-700 leading-relaxed">
          Select from our four specialized auditory screening modules. Test specific speech formants, minimal phonemic contrasts, pure tone thresholds, or evaluate your left and right ears individually.
        </p>
      </div>

      {/* 4 Available Test Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* ======================================================== */}
        {/* OPTION 1: Sentence Repetition Detection */}
        {/* ======================================================== */}
        <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFC700] border-2 border-black shadow-brutal-xs flex items-center justify-center text-black">
                <Volume2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-black text-[#FFC700] rounded-md border border-black shadow-brutal-xs">
                MODULE 01
              </span>
            </div>

            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-black uppercase px-2 py-0.5 bg-[#FAF9F6] border border-black rounded text-slate-800">
                SPEECH BANDWIDTH FILTERING
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight mt-1 mb-2">
              Sentence Repetition Detection
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed mb-4">
              Evaluates auditory speech processing through 4 calibrated frequency bandwidths: Average Auditory Spectrum, High-Frequency Loss (2,000–8,000 Hz), Core Speech Formants, and Natural Aging Decline.
            </p>

            <div className="p-3 bg-[#FAF9F6] border-2 border-black rounded-xl mb-6 text-xs font-bold text-slate-700 space-y-1">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>4 Calibrated Frequency Band Stages</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Linguistic stemmer with morphological tolerance</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Audio repetition counting & resilience scoring</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onLaunchTest('test1')}
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#E5B200] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group/btn"
          >
            <span className="flex-1 py-3.5 text-center font-black uppercase tracking-wider text-xs sm:text-sm text-black flex items-center justify-center">
              START TEST 01: REPETITION
            </span>
            <div className="bg-black text-[#FFC700] px-4 flex items-center justify-center border-l-2 border-black group-hover/btn:text-white transition-colors">
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>

        {/* ======================================================== */}
        {/* OPTION 2: Word Contrast & Misheard Detection */}
        {/* ======================================================== */}
        <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-200 border-2 border-black shadow-brutal-xs flex items-center justify-center text-black">
                <Sliders className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-black text-sky-200 rounded-md border border-black shadow-brutal-xs">
                MODULE 02
              </span>
            </div>

            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-black uppercase px-2 py-0.5 bg-[#FAF9F6] border border-black rounded text-slate-800">
                PHONEMIC CONTRAST DISCRIMINATION
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight mt-1 mb-2">
              Word Contrast & Misheard Pairs
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed mb-4">
              Detects early auditory decay through minimal phonetic word pairs. Distinguishes vowel formants (ship/sheep), voiceless/voiced fricatives (fan/van), and dental consonants.
            </p>

            <div className="p-3 bg-[#FAF9F6] border-2 border-black rounded-xl mb-6 text-xs font-bold text-slate-700 space-y-1">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>5 Auditory Phoneme Contrast Categories</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Acoustic decay & consonant confusion analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Optional carrier phrase trial simulation</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onLaunchTest('test2')}
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-sky-200 hover:bg-sky-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group/btn"
          >
            <span className="flex-1 py-3.5 text-center font-black uppercase tracking-wider text-xs sm:text-sm text-black flex items-center justify-center">
              START TEST 02: WORD CONTRAST
            </span>
            <div className="bg-black text-sky-200 px-4 flex items-center justify-center border-l-2 border-black group-hover/btn:text-white transition-colors">
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>

        {/* ======================================================== */}
        {/* OPTION 3: Pure Tone Frequency Recognition */}
        {/* ======================================================== */}
        <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-200 border-2 border-black shadow-brutal-xs flex items-center justify-center text-black">
                <Activity className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-black text-emerald-200 rounded-md border border-black shadow-brutal-xs">
                MODULE 03
              </span>
            </div>

            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-black uppercase px-2 py-0.5 bg-[#FAF9F6] border border-black rounded text-slate-800">
                PURE SINE TONE AUDIOMETRY
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight mt-1 mb-2">
              Pure Tone Frequency Sweep
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed mb-4">
              Calibrated pure tone threshold trials across 8 key audiometric frequencies (250 Hz, 500 Hz, 1 kHz, 2 kHz, 4 kHz, 6 kHz, 8 kHz, 12 kHz) with soft-attack sinusoidal envelopes.
            </p>

            <div className="p-3 bg-[#FAF9F6] border-2 border-black rounded-xl mb-6 text-xs font-bold text-slate-700 space-y-1">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>8 Audiometric pure tone frequencies tested</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Soft attack & decay envelope prevents click artifacts</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Generates frequency sensitivity audiogram curve</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onLaunchTest('test3')}
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-emerald-200 hover:bg-emerald-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group/btn"
          >
            <span className="flex-1 py-3.5 text-center font-black uppercase tracking-wider text-xs sm:text-sm text-black flex items-center justify-center">
              START TEST 03: PURE TONES
            </span>
            <div className="bg-black text-emerald-200 px-4 flex items-center justify-center border-l-2 border-black group-hover/btn:text-white transition-colors">
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>

        {/* ======================================================== */}
        {/* OPTION 4: Individual Ear Assessment (NEW 4TH TEST) */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-amber-50 to-sky-50 border-3 border-black rounded-3xl p-6 sm:p-8 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#FFC700] text-black font-black text-[10px] uppercase px-3 py-1 border-b-2 border-l-2 border-black">
            NEW FEATURE
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-black text-[#FFC700] border-2 border-black shadow-brutal-xs flex items-center justify-center">
                <Headphones className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-black text-[#FFC700] rounded-md border border-black shadow-brutal-xs mr-16 sm:mr-20">
                MODULE 04
              </span>
            </div>

            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-black uppercase px-2 py-0.5 bg-black text-white rounded">
                UNILATERAL AUDIOMETRIC ISOLATION
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight mt-1 mb-2">
              Individual Ear Assessment
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed mb-4">
              Independently evaluates your Left Ear or Right Ear. Uses Web Audio API stereo panning to isolate sound to one ear while streaming soft contralateral pink noise to mask the opposite ear.
            </p>

            {/* Sub-Choices: Left Ear vs Right Ear Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              
              {/* Left Ear Choice */}
              <div
                onClick={() => setSelectedIndividualEar('left')}
                className={`p-3.5 rounded-xl border-2 border-black cursor-pointer transition-all ${
                  selectedIndividualEar === 'left'
                    ? 'bg-sky-200 shadow-brutal-xs font-black'
                    : 'bg-white hover:bg-sky-50 font-bold'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs uppercase text-sky-950 mb-1">
                  <Ear className="w-4 h-4 text-sky-700" />
                  <span>1. Left Ear Test</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-tight">
                  Evaluates left ear; right ear receives acoustic pink masking.
                </p>
              </div>

              {/* Right Ear Choice */}
              <div
                onClick={() => setSelectedIndividualEar('right')}
                className={`p-3.5 rounded-xl border-2 border-black cursor-pointer transition-all ${
                  selectedIndividualEar === 'right'
                    ? 'bg-amber-200 shadow-brutal-xs font-black'
                    : 'bg-white hover:bg-amber-50 font-bold'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs uppercase text-amber-950 mb-1">
                  <Ear className="w-4 h-4 text-amber-700" />
                  <span>2. Right Ear Test</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-tight">
                  Evaluates right ear; left ear receives acoustic pink masking.
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={() => onLaunchTest('ear_assessment', selectedIndividualEar)}
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#E5B200] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group/btn"
          >
            <span className="flex-1 py-3.5 text-center font-black uppercase tracking-wider text-xs sm:text-sm text-black flex items-center justify-center">
              START {selectedIndividualEar === 'left' ? 'LEFT' : 'RIGHT'} EAR ASSESSMENT
            </span>
            <div className="bg-black text-[#FFC700] px-4 flex items-center justify-center border-l-2 border-black group-hover/btn:text-white transition-colors">
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>

      </div>

      {/* Comprehensive Sequential Screening Option Banner */}
      <div className="mt-10 sm:mt-12 bg-white border-3 border-black shadow-brutal-md rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider text-black bg-[#FFC700] px-2.5 py-0.5 border border-black rounded mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FULL AUDITORY CHECK-UP</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">
            Complete Comprehensive Screening
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 max-w-xl">
            Want the full picture? Run all sequential hearing tests in one smooth session to generate a comprehensive AI-analyzed audiogram and download your medical screening PDF report.
          </p>
        </div>

        <button
          onClick={() => onLaunchTest('full_sequence')}
          className="w-full md:w-auto px-8 py-4 bg-black hover:bg-slate-800 text-white font-black uppercase text-xs sm:text-sm tracking-wider border-2 border-black shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl shrink-0 flex items-center justify-center space-x-2"
        >
          <span>START FULL SCREENING</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
};
