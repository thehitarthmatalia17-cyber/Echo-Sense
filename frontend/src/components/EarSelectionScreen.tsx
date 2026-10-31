import React from 'react';
import { EarMode } from '../types';
import { Headphones, Ear, ArrowRight, ShieldCheck, Volume2, Check } from 'lucide-react';

interface EarSelectionScreenProps {
  selectedEar: EarMode;
  onSelectEar: (ear: EarMode) => void;
  onConfirm: () => void;
  userName?: string;
}

export const EarSelectionScreen: React.FC<EarSelectionScreenProps> = ({
  selectedEar,
  onSelectEar,
  onConfirm,
  userName,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300">
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-9 shadow-brutal-lg space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FFC700] border-2 border-black rounded-md text-xs font-black uppercase tracking-wider shadow-brutal-xs">
            <Headphones className="w-3.5 h-3.5" />
            <span>EAR-SPECIFIC TESTING MODE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
            Select Ear to Test
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-lg mx-auto">
            {userName ? `Welcome, ${userName}. ` : ''}
            Choose which ear you want to evaluate. You can test your Left Ear, Right Ear, or Both Ears independently.
          </p>
        </div>

        {/* 3 Interactive Ear Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* Option 1: Left Ear */}
          <div
            onClick={() => onSelectEar('left')}
            className={`p-5 rounded-2xl border-3 border-black cursor-pointer transition-all relative flex flex-col justify-between ${
              selectedEar === 'left'
                ? 'bg-sky-100 shadow-brutal-md -translate-y-1'
                : 'bg-[#FAF9F6] shadow-brutal-xs hover:bg-sky-50'
            }`}
          >
            {selectedEar === 'left' && (
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-black text-[#FFC700] rounded-full border-2 border-black flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            <div>
              <div className="w-12 h-12 bg-sky-500 text-white rounded-xl border-2 border-black shadow-brutal-xs flex items-center justify-center mb-3">
                <Ear className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-sky-200 border border-black rounded text-sky-950">
                UNILATERAL
              </span>
              <h3 className="text-base font-black uppercase text-black mt-1.5 mb-1">
                Left Ear Test
              </h3>
              <p className="text-[11px] font-bold text-slate-600 leading-snug">
                Tests left ear only. Right ear receives soft pink-noise acoustic masking.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-black uppercase">
              <span className="text-sky-950">Blue [X]</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedEar === 'left' ? 'bg-black text-white' : 'text-slate-500'}`}>
                {selectedEar === 'left' ? 'SELECTED' : 'SELECT'}
              </span>
            </div>
          </div>

          {/* Option 2: Right Ear */}
          <div
            onClick={() => onSelectEar('right')}
            className={`p-5 rounded-2xl border-3 border-black cursor-pointer transition-all relative flex flex-col justify-between ${
              selectedEar === 'right'
                ? 'bg-amber-100 shadow-brutal-md -translate-y-1'
                : 'bg-[#FAF9F6] shadow-brutal-xs hover:bg-amber-50'
            }`}
          >
            {selectedEar === 'right' && (
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-black text-[#FFC700] rounded-full border-2 border-black flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            <div>
              <div className="w-12 h-12 bg-amber-500 text-white rounded-xl border-2 border-black shadow-brutal-xs flex items-center justify-center mb-3">
                <Ear className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-200 border border-black rounded text-amber-950">
                UNILATERAL
              </span>
              <h3 className="text-base font-black uppercase text-black mt-1.5 mb-1">
                Right Ear Test
              </h3>
              <p className="text-[11px] font-bold text-slate-600 leading-snug">
                Tests right ear only. Left ear receives soft pink-noise acoustic masking.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-black uppercase">
              <span className="text-amber-950">Red [O]</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedEar === 'right' ? 'bg-black text-white' : 'text-slate-500'}`}>
                {selectedEar === 'right' ? 'SELECTED' : 'SELECT'}
              </span>
            </div>
          </div>

          {/* Option 3: Both Ears */}
          <div
            onClick={() => onSelectEar('both')}
            className={`p-5 rounded-2xl border-3 border-black cursor-pointer transition-all relative flex flex-col justify-between ${
              selectedEar === 'both'
                ? 'bg-[#FFC700]/30 shadow-brutal-md -translate-y-1'
                : 'bg-[#FAF9F6] shadow-brutal-xs hover:bg-yellow-50'
            }`}
          >
            {selectedEar === 'both' && (
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-black text-[#FFC700] rounded-full border-2 border-black flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            <div>
              <div className="w-12 h-12 bg-black text-[#FFC700] rounded-xl border-2 border-black shadow-brutal-xs flex items-center justify-center mb-3">
                <Headphones className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFC700] border border-black rounded text-black">
                BILATERAL
              </span>
              <h3 className="text-base font-black uppercase text-black mt-1.5 mb-1">
                Both Ears Test
              </h3>
              <p className="text-[11px] font-bold text-slate-600 leading-snug">
                Evaluates both ears in balanced stereo across all calibrated test frequencies.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-black uppercase">
              <span className="text-black">Stereo Mode</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedEar === 'both' ? 'bg-black text-white' : 'text-slate-500'}`}>
                {selectedEar === 'both' ? 'SELECTED' : 'SELECT'}
              </span>
            </div>
          </div>

        </div>

        {/* Headphone Masking Advisory */}
        <div className="p-4 bg-[#FAF9F6] border-2 border-black shadow-brutal-xs rounded-xl flex items-start space-x-3 text-xs font-bold text-slate-700 leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-black uppercase">Audiometric Isolation:</strong> Please wear headphones or earbuds with Left and Right correctly aligned. During unilateral tests, Web Audio stereo panning routes pure tones exclusively to your selected ear with contralateral masking.
          </p>
        </div>

        {/* Continue Action Button */}
        <button
          onClick={onConfirm}
          className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#E5B200] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
        >
          <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-sm sm:text-base text-black flex items-center justify-center">
            PROCEED WITH {selectedEar === 'both' ? 'BILATERAL' : selectedEar.toUpperCase() + ' EAR'} ASSESSMENT
          </span>
          <div className="bg-black text-[#FFC700] px-5 sm:px-6 flex items-center justify-center border-l-2 border-black group-hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

      </div>
    </div>
  );
};
