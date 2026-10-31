import React, { useState } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { languages, translations } from '../i18n/translations';
import { ShieldCheck, User, Calendar, Volume2, ArrowRight, Sparkles, Check, Globe, Camera, ArrowLeft } from 'lucide-react';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

interface RegistrationPageProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onComplete: (profile: UserProfile) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  currentLanguage,
  onLanguageChange,
  onComplete,
}) => {
  const t = translations[currentLanguage] || translations.en;

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError(t.registration.validationName);
      return;
    }
    const numAge = Number(age);
    if (!numAge || numAge < 5 || numAge > 120) {
      setError(t.registration.validationAge);
      return;
    }

    setError(null);
    onComplete({
      fullName: fullName.trim(),
      age: numAge,
      preferredLanguage: currentLanguage,
      consentGiven,
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300">
      
      {/* Phone-inspired Neo-Brutalist Card Container */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-9 shadow-brutal-lg relative overflow-hidden">
        
        {/* Top Header Bar with Back and Skip Navigation */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black/10">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-black rounded-full" />
            <span className="text-[11px] font-black uppercase tracking-wider text-black">
              EchoSense // SETUP
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-black bg-[#FFC700] px-2 py-0.5 border border-black shadow-brutal-xs">
              STEP 01/04
            </span>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-tight">
            CREATE YOUR PROFILE
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed">
            Let's calibrate your profile for an accurate, AI-powered hearing assessment.
          </p>
        </div>

        {/* Centerpiece Avatar Box (Matching Phone 1 in theme reference) */}
        <div className="relative flex items-center justify-center my-6">
          {/* Decorative Dot Matrix on the left */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-16 bg-brutal-dots opacity-40 pointer-events-none hidden sm:block" />
          
          {/* Floating Yellow & Black Accent Pixels */}
          <div className="absolute right-12 top-2 w-4 h-4 bg-[#FFC700] border-2 border-black shadow-brutal-xs pointer-events-none" />
          <div className="absolute right-8 top-10 w-3 h-3 bg-black pointer-events-none" />

          {/* Avatar Container */}
          <div className="relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-[#FFC700] border-[2.5px] border-black shadow-brutal flex items-center justify-center rounded-2xl overflow-hidden relative">
              <User className="w-16 h-16 sm:w-20 sm:h-20 text-black stroke-[2.2]" />
            </div>

            {/* Camera / Audio Icon Badge */}
            <div className="absolute -bottom-2 -right-2 bg-black text-[#FFC700] p-2 rounded-xl border-2 border-black shadow-brutal-xs flex items-center justify-center">
              <Camera className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-100 border-2 border-black text-black text-xs font-bold shadow-brutal-xs flex items-center space-x-2.5">
              <span className="w-3 h-3 bg-red-500 border border-black shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name Input Box */}
          <div className="border-2 border-black rounded-xl p-2.5 bg-[#FAF9F6] shadow-brutal-sm focus-within:bg-white focus-within:border-black transition-all">
            <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">
              FULL NAME <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white border border-black rounded-lg text-black">
                <User className="w-4 h-4 stroke-[2.5]" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-transparent text-sm font-bold text-black placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Age Input Box */}
          <div className="border-2 border-black rounded-xl p-2.5 bg-[#FAF9F6] shadow-brutal-sm focus-within:bg-white focus-within:border-black transition-all">
            <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">
              AGE (YEARS) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white border border-black rounded-lg text-black">
                <Calendar className="w-4 h-4 stroke-[2.5]" />
              </div>
              <input
                type="number"
                min={5}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="e.g. 28"
                className="w-full bg-transparent text-sm font-bold text-black placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Preferred Language Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-black uppercase tracking-wider text-black">
                AUDIO SCREENING LANGUAGE
              </label>
              <span className="text-[10px] font-bold text-black bg-[#FFC700] px-1.5 py-0.5 border border-black">
                4 LANGUAGES
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {languages.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => onLanguageChange(lang.code)}
                    className={`p-2.5 rounded-xl border-2 border-black text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#FFC700] shadow-brutal-sm'
                        : 'bg-white hover:bg-gray-100 shadow-brutal-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-black uppercase text-black">
                        {lang.nativeName}
                      </span>
                      {isSelected && (
                        <div className="w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-[#FFC700] stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 truncate">
                      {lang.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="p-3.5 rounded-xl bg-white border-2 border-black shadow-brutal-xs space-y-1.5">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 h-4 w-4 border-2 border-black text-black rounded accent-black cursor-pointer"
                required
              />
              <span className="text-xs font-black uppercase tracking-tight text-black leading-snug">
                {t.registration.consentText}
              </span>
            </label>
            <div className="flex items-start space-x-2 text-[10px] font-bold text-gray-600 pl-7">
              <ShieldCheck className="w-3.5 h-3.5 text-black shrink-0" />
              <span>Calibrated baseline screening only. Private & local to device.</span>
            </div>
          </div>

          {/* Signature Action Button: Yellow bar + Attached Black Arrow Square */}
          <button
            type="submit"
            className="w-full flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group"
          >
            <span className="flex-1 py-4 text-center font-black uppercase tracking-wider text-sm sm:text-base text-black flex items-center justify-center">
              CONTINUE & START ASSESSMENT
            </span>
            <div className="bg-black text-[#FFC700] px-5 sm:px-6 flex items-center justify-center border-l-2 border-black group-hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

        </form>

        {/* Hazard Stripe Bottom Bar Accent */}
        <div className="mt-6 -mx-6 -mb-9 sm:-mx-9 sm:-mb-9 h-3.5 bg-hazard-stripes border-t-2 border-black" />

      </div>

      {/* Headphone Advice Note */}
      <div className="mt-6 flex items-center justify-center space-x-2 text-xs font-black uppercase tracking-wider text-black">
        <Volume2 className="w-4 h-4 text-black stroke-[2.5]" />
        <span>HEADPHONES RECOMMENDED FOR MAXIMUM ACCURACY</span>
      </div>

    </div>
  );
};
