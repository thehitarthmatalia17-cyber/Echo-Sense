import React, { useState, useEffect } from 'react';
import { PostCallLog, LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';
import {
  PhoneCall,
  Volume2,
  RotateCcw,
  HelpCircle,
  Ear,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Send,
  Sparkles,
  Info,
  ArrowRight,
  Check
} from 'lucide-react';

interface BehavioralMonitoringPageProps {
  userId: string;
  currentLanguage: LanguageCode;
}

export const BehavioralMonitoringPage: React.FC<BehavioralMonitoringPageProps> = ({
  userId,
  currentLanguage,
}) => {
  const t = translations[currentLanguage] || translations.en;

  const [increasedVolume, setIncreasedVolume] = useState(false);
  const [askedRepetition, setAskedRepetition] = useState(false);
  const [misunderstoodWords, setMisunderstoodWords] = useState(false);
  const [noiseMadeDifficult, setNoiseMadeDifficult] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [logs, setLogs] = useState<PostCallLog[]>([]);

  useEffect(() => {
    loadLogs();
  }, [userId]);

  const loadLogs = async () => {
    if (!userId) return;
    try {
      const past = await api.getPostCallLogs(userId);
      setLogs(past);
    } catch (e) {
      console.warn("Failed to load past behavioral logs:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(false);

    try {
      const newLog = await api.submitPostCallLog({
        userId,
        increasedVolume,
        askedRepetition,
        misunderstoodWords,
        noiseMadeDifficult,
        notes: notes.trim(),
      });
      setLogs([newLog, ...logs]);
      setSuccessMsg(true);
      setIncreasedVolume(false);
      setAskedRepetition(false);
      setMisunderstoodWords(false);
      setNoiseMadeDifficult(false);
      setNotes('');
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      console.warn("Error saving log:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300 space-y-6">
      
      {/* Header Card */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FFC700] border border-black text-black text-[10px] font-black uppercase tracking-wider shadow-brutal-xs mb-3">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>CONVERSATIONAL HABIT MONITORING</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          {t.behavioral.title}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
          {t.behavioral.subtitle}
        </p>
      </div>

      {/* Survey Form Card (Matching Phone 3 in reference image with benefit-like cards) */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-black">
            POST-CONVERSATION SELF-REPORT
          </h3>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-[#FFC700]/30 border-2 border-black text-black text-xs font-bold shadow-brutal-xs flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-black stroke-[3] shrink-0" />
              <span>{t.behavioral.submittedSuccess}</span>
            </div>
          )}

          {/* Question 1: Call Volume */}
          <label className={`flex items-center justify-between p-3.5 rounded-xl border-2 border-black transition-all cursor-pointer ${
            increasedVolume 
              ? 'bg-[#FFC700] shadow-brutal' 
              : 'bg-[#FAF9F6] hover:bg-white shadow-brutal-xs'
          }`}>
            <div className="flex items-center space-x-3 pr-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-black text-black flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-black">
                {t.behavioral.q1}
              </span>
            </div>
            <input
              type="checkbox"
              checked={increasedVolume}
              onChange={(e) => setIncreasedVolume(e.target.checked)}
              className="w-4 h-4 border-2 border-black rounded accent-black cursor-pointer"
            />
          </label>

          {/* Question 2: Asked Repetition */}
          <label className={`flex items-center justify-between p-3.5 rounded-xl border-2 border-black transition-all cursor-pointer ${
            askedRepetition 
              ? 'bg-[#FFC700] shadow-brutal' 
              : 'bg-[#FAF9F6] hover:bg-white shadow-brutal-xs'
          }`}>
            <div className="flex items-center space-x-3 pr-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-black text-black flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-black">
                {t.behavioral.q2}
              </span>
            </div>
            <input
              type="checkbox"
              checked={askedRepetition}
              onChange={(e) => setAskedRepetition(e.target.checked)}
              className="w-4 h-4 border-2 border-black rounded accent-black cursor-pointer"
            />
          </label>

          {/* Question 3: Misunderstood Words */}
          <label className={`flex items-center justify-between p-3.5 rounded-xl border-2 border-black transition-all cursor-pointer ${
            misunderstoodWords 
              ? 'bg-[#FFC700] shadow-brutal' 
              : 'bg-[#FAF9F6] hover:bg-white shadow-brutal-xs'
          }`}>
            <div className="flex items-center space-x-3 pr-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-black text-black flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-black">
                {t.behavioral.q3}
              </span>
            </div>
            <input
              type="checkbox"
              checked={misunderstoodWords}
              onChange={(e) => setMisunderstoodWords(e.target.checked)}
              className="w-4 h-4 border-2 border-black rounded accent-black cursor-pointer"
            />
          </label>

          {/* Question 4: Noise Difficulty */}
          <label className={`flex items-center justify-between p-3.5 rounded-xl border-2 border-black transition-all cursor-pointer ${
            noiseMadeDifficult 
              ? 'bg-[#FFC700] shadow-brutal' 
              : 'bg-[#FAF9F6] hover:bg-white shadow-brutal-xs'
          }`}>
            <div className="flex items-center space-x-3 pr-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-black text-black flex items-center justify-center shrink-0">
                <Ear className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-black">
                {t.behavioral.q4}
              </span>
            </div>
            <input
              type="checkbox"
              checked={noiseMadeDifficult}
              onChange={(e) => setNoiseMadeDifficult(e.target.checked)}
              className="w-4 h-4 border-2 border-black rounded accent-black cursor-pointer"
            />
          </label>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1.5">
              {t.behavioral.notesLabel}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.behavioral.notesPlaceholder}
              className="w-full p-3.5 rounded-xl border-2 border-black bg-[#FAF9F6] text-xs sm:text-sm text-black placeholder-gray-400 font-bold focus:bg-white focus:outline-none shadow-brutal-xs resize-none transition-all"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] disabled:opacity-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
          >
            <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-sm sm:text-base text-black flex items-center justify-center">
              {isSubmitting ? "RECORDING..." : t.behavioral.submitButton}
            </span>
            <div className="bg-black text-[#FFC700] px-5 sm:px-6 flex items-center justify-center border-l-2 border-black group-hover:text-white transition-colors">
              <Send className="w-5 h-5 stroke-[2.5]" />
            </div>
          </button>
        </form>

        {/* Hazard Stripe Bottom Accent */}
        <div className="mt-6 -mx-6 -mb-8 sm:-mx-8 sm:-mb-8 h-3.5 bg-hazard-stripes border-t-2 border-black" />
      </div>

      {/* Privacy Notice */}
      <div className="p-3.5 rounded-xl bg-white border-2 border-black shadow-brutal-xs text-xs text-black flex items-start space-x-3">
        <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5 stroke-[2.5]" />
        <span className="font-semibold text-gray-700 leading-relaxed text-[11px]">
          {t.behavioral.disclaimer}
        </span>
      </div>

      {/* Past Logs */}
      {logs.length > 0 && (
        <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-black">
            {t.behavioral.recentLogs} ({logs.length})
          </h3>
          <div className="space-y-2.5">
            {logs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center space-x-1.5 font-black text-black">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                  </span>
                  <span className="font-black text-[10px] uppercase bg-black text-[#FFC700] px-1.5 py-0.5 rounded">
                    SELF-REPORT
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {log.increasedVolume && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-black border border-black">
                      Increased Volume
                    </span>
                  )}
                  {log.askedRepetition && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#FFC700] text-black border border-black">
                      Asked Repetition
                    </span>
                  )}
                  {log.misunderstoodWords && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-black border border-black">
                      Misunderstood Words
                    </span>
                  )}
                  {log.noiseMadeDifficult && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-black border border-black">
                      Background Noise
                    </span>
                  )}
                </div>
                {log.notes && (
                  <p className="text-xs text-gray-700 font-semibold italic pt-0.5">
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
