import React, { useState, useEffect } from 'react';
import { TinnitusLog, LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';
import { audioService } from '../services/audioService';
import {
  BellRing,
  Info,
  Clock,
  Calendar,
  Send,
  CheckCircle2,
  Ear,
  Volume2,
  Sparkles,
  Sliders,
  ShieldCheck,
  Check,
  ArrowRight
} from 'lucide-react';

interface TinnitusTrackerPageProps {
  userId: string;
  currentLanguage: LanguageCode;
}

export const TinnitusTrackerPage: React.FC<TinnitusTrackerPageProps> = ({
  userId,
  currentLanguage,
}) => {
  const t = translations[currentLanguage] || translations.en;

  const [ringing, setRinging] = useState(false);
  const [buzzing, setBuzzing] = useState(false);
  const [humming, setHumming] = useState(false);
  const [whistling, setWhistling] = useState(false);
  const [frequencyOccurrence, setFrequencyOccurrence] = useState('sometimes');
  const [duration, setDuration] = useState('minutes');
  const [affectedEar, setAffectedEar] = useState('both');
  const [severityRating, setSeverityRating] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [history, setHistory] = useState<TinnitusLog[]>([]);

  // Soundscape Masker State
  const [maskerFreq, setMaskerFreq] = useState(4000);
  const [isPlayingMasker, setIsPlayingMasker] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const loadHistory = async () => {
    if (!userId) return;
    try {
      const logs = await api.getTinnitusLogs(userId);
      setHistory(logs);
    } catch (e) {
      console.warn("Failed to load tinnitus history:", e);
    }
  };

  const handleToggleMasker = async () => {
    if (isPlayingMasker) {
      setIsPlayingMasker(false);
    } else {
      setIsPlayingMasker(true);
      try {
        await audioService.playPureTone(maskerFreq, 3000, 0.12);
      } catch (e) {
        console.warn("Error playing masker:", e);
      } finally {
        setIsPlayingMasker(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSavedSuccess(false);

    try {
      const newLog = await api.submitTinnitusLog({
        userId,
        ringing,
        buzzing,
        humming,
        whistling,
        frequencyOccurrence,
        duration,
        affectedEar,
        severityRating,
      });

      setHistory([newLog, ...history]);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.warn("Error submitting tinnitus record:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300 space-y-6">
      
      {/* Header Card */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FFC700] border border-black text-black text-[10px] font-black uppercase tracking-wider shadow-brutal-xs mb-3">
          <BellRing className="w-3.5 h-3.5" />
          <span>AUDITORY SENSATION LOGGING</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          {t.tinnitus.title}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
          {t.tinnitus.subtitle}
        </p>
      </div>

      {/* Sound Matcher & Calming Pure Tone Box */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              ACOUSTIC PITCH MATCHER
            </span>
            <h3 className="text-base font-black uppercase text-black">
              MATCH YOUR PERCEIVED TONE FREQUENCY
            </h3>
          </div>
          <span className="text-xs font-black font-mono text-black bg-[#FFC700] px-2.5 py-1 border border-black shadow-brutal-xs">
            {maskerFreq} HZ
          </span>
        </div>

        <div>
          <input
            type="range"
            min={1000}
            max={12000}
            step={250}
            value={maskerFreq}
            onChange={(e) => setMaskerFreq(parseInt(e.target.value, 10))}
            className="w-full h-3 bg-gray-200 border border-black rounded-lg appearance-none cursor-pointer accent-black"
          />
          <div className="flex justify-between text-[10px] font-black text-black font-mono mt-1">
            <span>1,000 HZ</span>
            <span>4,000 HZ</span>
            <span>8,000 HZ</span>
            <span>12,000 HZ</span>
          </div>
        </div>

        <button
          onClick={handleToggleMasker}
          disabled={isPlayingMasker}
          className="w-full py-3.5 rounded-xl bg-white hover:bg-gray-100 border-2 border-black text-xs font-black uppercase tracking-wider text-black transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5"
        >
          <Volume2 className={`w-4 h-4 text-black stroke-[2.5] ${isPlayingMasker ? 'animate-bounce' : ''}`} />
          <span>{isPlayingMasker ? "PLAYING TONE..." : `TEST ${maskerFreq} HZ REFERENCE TONE`}</span>
        </button>
      </div>

      {/* Tinnitus Symptom Logging Card */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-black">
            {t.tinnitus.soundTypes}
          </h3>

          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-[#FFC700]/30 border-2 border-black text-black text-xs font-bold shadow-brutal-xs flex items-center space-x-2">
              <Check className="w-4 h-4 text-black stroke-[3] shrink-0" />
              <span>Record saved successfully.</span>
            </div>
          )}

          {/* Sound Types Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: t.tinnitus.ringing, state: ringing, setter: setRinging },
              { label: t.tinnitus.buzzing, state: buzzing, setter: setBuzzing },
              { label: t.tinnitus.humming, state: humming, setter: setHumming },
              { label: t.tinnitus.whistling, state: whistling, setter: setWhistling },
            ].map((snd, idx) => (
              <label
                key={idx}
                className={`p-3 rounded-xl border-2 border-black text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  snd.state
                    ? 'bg-[#FFC700] shadow-brutal-sm text-black'
                    : 'bg-[#FAF9F6] hover:bg-white text-black shadow-brutal-xs'
                }`}
              >
                <input
                  type="checkbox"
                  checked={snd.state}
                  onChange={(e) => snd.setter(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-xs font-black uppercase text-black">
                  {snd.label}
                </span>
                <span className="text-[10px] font-bold text-gray-600">
                  {snd.state ? 'SELECTED' : 'TAP TO SELECT'}
                </span>
              </label>
            ))}
          </div>

          {/* Occurrence & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
                {t.tinnitus.frequencyLabel}
              </label>
              <select
                value={frequencyOccurrence}
                onChange={(e) => setFrequencyOccurrence(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-black bg-[#FAF9F6] text-xs font-bold text-black focus:bg-white focus:outline-none shadow-brutal-xs"
              >
                <option value="rarely">Rarely / Occasional</option>
                <option value="sometimes">Sometimes / Several times a week</option>
                <option value="daily">Daily</option>
                <option value="constant">Constant / Continuous</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
                {t.tinnitus.earLabel}
              </label>
              <select
                value={affectedEar}
                onChange={(e) => setAffectedEar(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-black bg-[#FAF9F6] text-xs font-bold text-black focus:bg-white focus:outline-none shadow-brutal-xs"
              >
                <option value="left">Left Ear Only</option>
                <option value="right">Right Ear Only</option>
                <option value="both">Both Ears / Centered in Head</option>
              </select>
            </div>
          </div>

          {/* Severity Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-black">
                {t.tinnitus.severityLabel}
              </label>
              <span className="text-xs font-black font-mono text-black bg-[#FFC700] px-2 py-0.5 border border-black">
                {severityRating} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={severityRating}
              onChange={(e) => setSeverityRating(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-gray-200 border border-black rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] disabled:opacity-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
          >
            <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-sm sm:text-base text-black flex items-center justify-center">
              {isSubmitting ? "SAVING..." : t.tinnitus.submitButton}
            </span>
            <div className="bg-black text-[#FFC700] px-5 sm:px-6 flex items-center justify-center border-l-2 border-black group-hover:text-white transition-colors">
              <Send className="w-5 h-5 stroke-[2.5]" />
            </div>
          </button>
        </form>

        {/* Hazard Stripe Bottom Accent */}
        <div className="mt-6 -mx-6 -mb-8 sm:-mx-8 sm:-mb-8 h-3.5 bg-hazard-stripes border-t-2 border-black" />
      </div>

      {/* Medical Note */}
      <div className="p-3.5 rounded-xl bg-white border-2 border-black shadow-brutal-xs text-xs text-black flex items-start space-x-3">
        <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5 stroke-[2.5]" />
        <span className="font-semibold text-gray-700 leading-relaxed text-[11px]">
          {t.tinnitus.educationalNotice}
        </span>
      </div>

    </div>
  );
};
