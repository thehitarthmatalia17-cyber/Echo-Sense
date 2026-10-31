import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Headphones, 
  Activity, 
  Volume2, 
  ShieldCheck, 
  Waves, 
  BrainCircuit, 
  BarChart3, 
  Clock, 
  Check, 
  PhoneCall,
  Info,
  ChevronDown,
  Layers,
  Award
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface LandingPageProps {
  currentLanguage: LanguageCode;
  onStartAssessment: () => void;
  onExploreFeatures: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentLanguage,
  onStartAssessment,
  onExploreFeatures,
}) => {
  const t = translations[currentLanguage] || translations.en;

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-6 pb-14 sm:pt-12 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Bold Headline and Actions */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Badge with floating neo-brutal pixel squares */}
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#FFC700] border-2 border-black text-black text-xs font-black uppercase tracking-wider shadow-brutal-xs">
                  <span className="w-2 h-2 rounded-xs bg-black" />
                  <span>AI HEARING HEALTH SCREENING</span>
                </span>
                <span className="w-2.5 h-2.5 bg-black" />
                <span className="w-3.5 h-3.5 bg-[#FFC700] border border-black shadow-brutal-xs" />
              </div>

              {/* Primary Headline in Ultra-Bold Uppercase */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight uppercase leading-[1.05]">
                HEAR BEYOND <br className="hidden sm:inline" />
                <span className="inline-block bg-[#FFC700] text-black px-3 py-1 mt-1 border-2 border-black shadow-brutal-sm">
                  WHAT YOU NOTICE.
                </span>
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-base sm:text-lg text-slate-800 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-bold">
                Identify subtle early signs of hearing difficulty through intelligent digital screening. 
                Evaluate speech repetition across frequency filters, discriminate phonemic minimal pairs, 
                and map auditory thresholds in a calm, non-invasive experience.
              </p>

              {/* Neo-Brutalist Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* Yellow Signature Button with Black Arrow Block */}
                <button
                  onClick={onStartAssessment}
                  className="w-full sm:w-auto flex items-stretch rounded-xl border-2 border-black bg-[#FFC700] hover:bg-[#F5B700] shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all overflow-hidden group cursor-pointer"
                >
                  <span className="py-4 px-7 font-black uppercase text-sm sm:text-base text-black flex items-center justify-center">
                    START HEARING ASSESSMENT
                  </span>
                  <span className="bg-black text-white px-5 flex items-center justify-center border-l-2 border-black group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </span>
                </button>

                {/* Secondary Button */}
                <button
                  onClick={scrollToHowItWorks}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl text-black font-black uppercase text-sm sm:text-base bg-white hover:bg-slate-100 border-2 border-black shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  <Activity className="w-4 h-4 mr-2 stroke-[2.5]" />
                  <span>EXPLORE HOW IT WORKS</span>
                </button>
              </div>

              {/* Value Badges */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-black uppercase text-black">
                <span className="px-3 py-1 rounded-lg bg-white border-2 border-black shadow-brutal-xs flex items-center space-x-1.5">
                  <Headphones className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>STANDARD HEADPHONES</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border-2 border-black shadow-brutal-xs flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>4–5 MINUTES</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-[#FFC700] border-2 border-black shadow-brutal-xs flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>ZERO SIGNUP NEEDED</span>
                </span>
              </div>
            </div>

            {/* Right Column: Neo-Brutalist Illustration Card (Phone style inspired by user image) */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Dot Matrix Decoration at top-right */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-brutal-dots opacity-60 pointer-events-none hidden sm:block" />

              <div className="w-full max-w-sm bg-white rounded-2xl p-6 sm:p-7 border-2 border-black shadow-brutal relative">
                
                {/* Floating yellow accent square */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#FFC700] border-2 border-black shadow-brutal-xs" />
                <div className="absolute -bottom-3 -right-3 w-5 h-5 bg-black" />

                {/* Card Top Header */}
                <div className="flex items-center justify-between mb-5 border-b-2 border-black pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FFC700] border-2 border-black flex items-center justify-center text-black shadow-brutal-xs">
                      <Volume2 className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-black">ACOUSTIC SPECTRUM</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">CALIBRATED SIGNAL</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-[#FFC700] text-black border-2 border-black shadow-brutal-xs">
                    ONLINE
                  </span>
                </div>

                {/* Sound Wave Graphical Bars */}
                <div className="h-32 bg-[#FAF9F6] rounded-xl p-3 flex items-end justify-between gap-1 border-2 border-black relative mb-5">
                  {[40, 65, 30, 85, 95, 45, 75, 60, 90, 50, 70, 40, 80, 60, 35, 70].map((h, i) => (
                    <div 
                      key={i} 
                      className={`w-full rounded-xs border border-black ${i % 3 === 0 ? 'bg-[#FFC700]' : 'bg-black'}`}
                      style={{ 
                        height: `${h}%`,
                      }} 
                    />
                  ))}
                  <div className="absolute top-2 left-3 text-[10px] font-black font-mono text-black uppercase bg-white px-1.5 py-0.5 border border-black">
                    250 Hz — 12,000 Hz
                  </div>
                </div>

                {/* Frequency Category Boxes */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center justify-between p-2.5 rounded-lg border-2 border-black bg-[#FAF9F6] shadow-brutal-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded bg-black text-white flex items-center justify-center font-black text-[10px]">1</div>
                      <span className="text-xs font-black uppercase text-black">Low Speech Band (250–500 Hz)</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-black bg-[#FFC700] px-1.5 py-0.5 border border-black">OK</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg border-2 border-black bg-[#FAF9F6] shadow-brutal-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded bg-black text-white flex items-center justify-center font-black text-[10px]">2</div>
                      <span className="text-xs font-black uppercase text-black">Mid Formants (1,000–4,000 Hz)</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-black bg-[#FFC700] px-1.5 py-0.5 border border-black">OK</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg border-2 border-black bg-[#FAF9F6] shadow-brutal-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded bg-black text-white flex items-center justify-center font-black text-[10px]">3</div>
                      <span className="text-xs font-black uppercase text-black">High Clarity (6,000–12,000 Hz)</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-black bg-[#FFC700] px-1.5 py-0.5 border border-black">OK</span>
                  </div>
                </div>

                {/* Quick Start Button with Arrow Block */}
                <button
                  onClick={onStartAssessment}
                  className="w-full flex items-stretch rounded-xl border-2 border-black bg-[#FFC700] hover:bg-[#F5B700] shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all overflow-hidden group cursor-pointer"
                >
                  <span className="flex-1 py-3 px-4 font-black uppercase text-xs text-black flex items-center justify-center">
                    LAUNCH SCREENING SESSION
                  </span>
                  <span className="bg-black text-white px-3.5 flex items-center justify-center border-l-2 border-black">
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </button>

                {/* Hazard Stripe Bar at Card Bottom (as seen in uploaded reference) */}
                <div className="mt-4 h-3 rounded-full bg-hazard-stripes border border-black" />

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How ECHO SENSE Works */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-md bg-[#FFC700] border-2 border-black text-black text-xs font-black uppercase tracking-wider shadow-brutal-xs mb-3">
              SCIENTIFIC SCREENING PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
              HOW ECHOSENSE EVALUATES HEARING
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 font-bold leading-relaxed">
              Unlike arbitrary online beeps, EchoSense evaluates the three core pillars of human auditory comprehension sequentially.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border-2 border-black shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFC700] text-black border-2 border-black shadow-brutal-xs flex items-center justify-center font-black text-xl">
                    01
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black bg-white">
                    STAGE 1
                  </span>
                </div>
                <h3 className="text-lg font-black uppercase text-black mb-2">
                  Acoustic Repetition Screening
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-4">
                  Listen to spoken sentences modulated through 6 distinct frequency ranges. Type what you heard. 
                  Our linguistic stemmer recognizes morphological variants while detecting semantic changes.
                </p>
              </div>
              <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black uppercase text-black">
                <span>6 ACOUSTIC STAGES</span>
                <span className="text-[#FFC700] bg-black px-2 py-0.5 rounded text-[10px]">ACTIVE</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border-2 border-black shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFC700] text-black border-2 border-black shadow-brutal-xs flex items-center justify-center font-black text-xl">
                    02
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black bg-white">
                    STAGE 2
                  </span>
                </div>
                <h3 className="text-lg font-black uppercase text-black mb-2">
                  Word Contrast Discrimination
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-4">
                  Distinguish acoustic minimal pairs (e.g. <em>Ship vs Sheep</em>, <em>Fan vs Van</em>, <em>Pat vs Bat</em>). 
                  Zero microphone friction—simply choose the pair you discerned with high-clarity carrier phrases.
                </p>
              </div>
              <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black uppercase text-black">
                <span>5 MINIMAL PAIRS</span>
                <span className="text-[#FFC700] bg-black px-2 py-0.5 rounded text-[10px]">ACTIVE</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border-2 border-black shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFC700] text-black border-2 border-black shadow-brutal-xs flex items-center justify-center font-black text-xl">
                    03
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black bg-white">
                    STAGE 3
                  </span>
                </div>
                <h3 className="text-lg font-black uppercase text-black mb-2">
                  Pure Sinusoidal Tone Mapping
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-4">
                  Detect calibrated audio frequencies across Low (250–500 Hz), Mid-Speech (1k–4k Hz), and High (6k–12k Hz) registers. 
                  Identify early high-frequency perception changes before they affect everyday conversations.
                </p>
              </div>
              <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black uppercase text-black">
                <span>8 FREQUENCIES</span>
                <span className="text-[#FFC700] bg-black px-2 py-0.5 rounded text-[10px]">ACTIVE</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Cards for the Three Tests */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-[#FFC700] border-2 border-black text-black text-xs font-black uppercase tracking-wider shadow-brutal-xs mb-3">
                SCREENING BATTERY
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
                THREE SEQUENCED CLINICAL TESTS
              </h2>
            </div>
            <p className="mt-2 md:mt-0 text-sm font-bold text-slate-700 max-w-md">
              Designed to simulate real-world listening environments without clinical complexity or medical claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Test 1 Feature Card */}
            <div className="bg-white rounded-2xl p-7 border-2 border-black shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FFC700] text-black border-2 border-black shadow-brutal-xs flex items-center justify-center">
                    <Activity className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded border-2 border-black bg-white shadow-brutal-xs">
                    TEST 1
                  </span>
                </div>
                <h4 className="text-lg font-black uppercase text-black mb-2">
                  Repetition Detection
                </h4>
                <p className="text-xs text-slate-700 font-medium leading-relaxed mb-6">
                  Measures auditory processing speed and speech comprehension across 6 frequency-modulated acoustic stages.
                </p>
                <ul className="space-y-2.5 text-xs font-bold text-black mb-6">
                  <li className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#FFC700] border border-black flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>Multi-stage audio filter modulation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#FFC700] border border-black flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>Linguistic morphological stemmer</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#FFC700] border border-black flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>Instant repetition counts & accuracy %</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t-2 border-black flex items-center justify-between text-xs font-black uppercase text-black">
                <span>DURATION: ~2 MINS</span>
                <span className="bg-[#FFC700] px-2 py-0.5 rounded border border-black">6 STAGES</span>
              </div>
            </div>

            {/* Test 2 Feature Card */}
            <div className="bg-white rounded-2xl p-7 border-2 border-black shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FFC700] text-black border-2 border-black shadow-brutal-xs flex items-center justify-center">
                    <Waves className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded border-2 border-black bg-white shadow-brutal-xs">
                    TEST 2
                  </span>
                </div>
                <h4 className="text-lg font-black uppercase text-black mb-2">
                  Misheard Word Contrast
                </h4>
                <p className="text-xs text-slate-700 font-medium leading-relaxed mb-6">
                  Pinpoints high-frequency consonant confusion where sounds with close acoustic profiles are commonly misheard.
                </p>
                <ul className="space-y-2.5 text-xs font-bold text-black mb-6">
                  <li className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#FFC700] border border-black flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>Acoustic minimal pairs (Ship/Sheep, etc.)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#FFC700] border border-black flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>Carrier phrase & 0.8x slow articulation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#FFC700] border border-black flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>100% microphone-free accuracy</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t-2 border-black flex items-center justify-between text-xs font-black uppercase text-black">
                <span>DURATION: ~1.5 MINS</span>
                <span className="bg-[#FFC700] px-2 py-0.5 rounded border border-black">5 PAIRS</span>
              </div>
            </div>

            {/* Test 3 Feature Card */}
            <div className="bg-white rounded-2xl p-7 border-2 border-black shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FFC700] text-black border-2 border-black shadow-brutal-xs flex items-center justify-center">
                    <Volume2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded border-2 border-black bg-white shadow-brutal-xs">
                    TEST 3
                  </span>
                </div>
                <h4 className="text-lg font-black uppercase text-black mb-2">
                  Frequency Recognition
                </h4>
                <p className="text-xs text-slate-700 font-medium leading-relaxed mb-6">
                  Generates calibrated sinusoidal sound waves to evaluate auditory threshold limits across distinct frequency spectra.
                </p>
                <ul className="space-y-2.5 text-xs font-bold text-black mb-6">
                  <li className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#FFC700] border border-black flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>Low, Mid-Speech, and High Frequency bands</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#FFC700] border border-black flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>Web Audio pure sinusoidal oscillators</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#FFC700] border border-black flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>Detection percentage & audiogram curves</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t-2 border-black flex items-center justify-between text-xs font-black uppercase text-black">
                <span>DURATION: ~1.5 MINS</span>
                <span className="bg-[#FFC700] px-2 py-0.5 rounded border border-black">8 TONES</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* AI-Powered Insights Section */}
      <section className="py-16 sm:py-20 bg-white border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-md bg-black text-[#FFC700] border-2 border-black text-xs font-black uppercase tracking-wider shadow-brutal-xs mb-3">
              MACHINE LEARNING INTELLIGENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
              AI INSIGHTS & LONGITUDINAL TRACKING
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 font-bold">
              Beyond one-off screenings, EchoSense equips you with personalized auditory biometric insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div 
              onClick={() => onExploreFeatures('fingerprint')}
              className="bg-[#FAF9F6] p-7 rounded-2xl border-2 border-black shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFC700] text-black border-2 border-black shadow-brutal-xs flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="text-base font-black uppercase text-black mb-2 flex items-center justify-between">
                <span>Hearing Fingerprint</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Generates a multi-dimensional radar visualization based on speech recognition, high-frequency detection, and repetition endurance.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              onClick={() => onExploreFeatures('behavioral')}
              className="bg-[#FAF9F6] p-7 rounded-2xl border-2 border-black shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFC700] text-black border-2 border-black shadow-brutal-xs flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="text-base font-black uppercase text-black mb-2 flex items-center justify-between">
                <span>Behavioral Call Logs</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Log post-call habits—such as asking others to repeat, increasing volume, or background noise fatigue—without audio recording.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              onClick={() => onExploreFeatures('trends')}
              className="bg-[#FAF9F6] p-7 rounded-2xl border-2 border-black shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFC700] text-black border-2 border-black shadow-brutal-xs flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="text-base font-black uppercase text-black mb-2 flex items-center justify-between">
                <span>ML Anomaly Trends</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Isolation Forest machine learning models highlight drift and anomalous declines across screening sessions over time.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Prominent Medical Disclaimer Banner */}
      <section className="py-12 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-7 rounded-2xl bg-[#FFC700] border-2 border-black shadow-brutal flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
            <div className="w-12 h-12 rounded-xl bg-black border border-black flex items-center justify-center text-[#FFC700] shrink-0 shadow-brutal-xs">
              <Info className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-black uppercase text-black">
                IMPORTANT MEDICAL & SCREENING DISCLAIMER
              </h5>
              <p className="text-xs text-black font-bold leading-relaxed">
                These tests are experimental and are <strong>not medically certified diagnostic procedures</strong>. 
                EchoSense provides preliminary hearing awareness and screening observations only. 
                It cannot confirm or rule out hearing loss. For genuine hearing concerns, always consult a qualified audiologist or healthcare physician.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA with Hazard Stripes */}
      <section className="py-14 bg-white border-t-2 border-black text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-black mb-3">
            READY TO CHECK YOUR HEARING CLARITY?
          </h3>
          <p className="text-sm font-bold text-slate-700 max-w-xl mx-auto mb-8">
            Take the quick 3-part screening today in Hindi, Kannada, English, or Gujarati.
          </p>
          <button
            onClick={onStartAssessment}
            className="inline-flex items-stretch rounded-xl border-2 border-black bg-[#FFC700] hover:bg-[#F5B700] shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 transition-all overflow-hidden cursor-pointer"
          >
            <span className="py-4 px-8 font-black uppercase text-sm sm:text-base text-black flex items-center justify-center">
              BEGIN HEARING ASSESSMENT
            </span>
            <span className="bg-black text-white px-5 flex items-center justify-center border-l-2 border-black">
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </span>
          </button>
        </div>

        {/* Hazard stripe line */}
        <div className="mt-12 h-3 bg-hazard-stripes border-y-2 border-black" />
      </section>
    </div>
  );
};
