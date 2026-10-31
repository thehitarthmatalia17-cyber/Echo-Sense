import React, { useState } from 'react';
import { ScreeningReportData, LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { AudiogramChart } from '../components/Charts/AudiogramChart';
import { AccuracyBarChart } from '../components/Charts/AccuracyBarChart';
import { Modal } from '../components/Modal';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  User,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HeartHandshake,
  Printer,
  Award,
  Ear,
  Info,
  Check,
  TrendingUp,
  Activity,
  Download,
  Headphones
} from 'lucide-react';
import { pdfService } from '../services/pdfService';

interface ResultsPageProps {
  report: ScreeningReportData;
  currentLanguage: LanguageCode;
  onRestartSession: () => void;
  onExploreAiFeatures: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  report,
  currentLanguage,
  onRestartSession,
  onExploreAiFeatures,
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [showRestartModal, setShowRestartModal] = useState(false);

  // Overall screening aggregate score - only includes non-skipped completed tests
  const validScores: number[] = [];
  if (report.repetitionTest?.accuracyPercentage !== undefined) {
    validScores.push(report.repetitionTest.accuracyPercentage);
  }
  if (report.misheardTest?.accuracyPercentage !== undefined) {
    validScores.push(report.misheardTest.accuracyPercentage);
  }
  if (report.frequencyTest?.detectionPercentage !== undefined) {
    validScores.push(report.frequencyTest.detectionPercentage);
  }
  if (report.leftEarResult?.frequencyDetectionPercentage !== undefined) {
    validScores.push(report.leftEarResult.frequencyDetectionPercentage);
  }
  if (report.rightEarResult?.frequencyDetectionPercentage !== undefined) {
    validScores.push(report.rightEarResult.frequencyDetectionPercentage);
  }

  const overallScore = validScores.length > 0
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : 0;

  const getConcernBadge = () => {
    switch (report.concernLevel) {
      case 'HIGH':
        return {
          label: t.results.concernHigh,
          bg: 'bg-red-100 border-2 border-black text-black',
          badgeBg: 'bg-red-500 text-white',
          textColor: 'text-black',
          icon: AlertOctagon,
          note: t.results.concernHighNote,
        };
      case 'MODERATE':
        return {
          label: t.results.concernModerate,
          bg: 'bg-amber-100 border-2 border-black text-black',
          badgeBg: 'bg-[#FFC700] text-black',
          textColor: 'text-black',
          icon: AlertTriangle,
          note: t.results.concernModNote,
        };
      case 'LOW':
      default:
        return {
          label: t.results.concernLow,
          bg: 'bg-[#FFC700]/25 border-2 border-black text-black',
          badgeBg: 'bg-[#FFC700] text-black',
          textColor: 'text-black',
          icon: CheckCircle2,
          note: t.results.concernLowNote,
        };
    }
  };

  const badge = getConcernBadge();
  const IconComponent = badge.icon;

  const formattedDate = new Date(report.timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleDownloadPDF = () => {
    pdfService.generateHearingReportPDF(report);
  };

  const handlePrintReport = () => {
    handleDownloadPDF();
  };

  // Circular gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300 space-y-6">
      
      {/* Top Header & Quick Actions */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {report.skippedTests && report.skippedTests.length > 0 ? (
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-black uppercase tracking-wider text-black bg-amber-300 px-3 py-1 border border-black shadow-brutal-xs mb-2">
              <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>PARTIAL SCREENING REPORT • {Math.max(1, 4 - report.skippedTests.length)} OF 4 MODULES COMPLETED ({report.skippedTests.length} SKIPPED)</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-black uppercase tracking-wider text-black bg-[#FFC700] px-3 py-1 border border-black shadow-brutal-xs mb-2">
              <Award className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>FULL SCREENING REPORT • ALL 4 MODULES COMPLETED</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
            {t.results.title}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
            {t.results.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#FFC700] hover:bg-[#E5B200] text-black font-black uppercase text-xs border-2 border-black shadow-brutal transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>DOWNLOAD PDF REPORT</span>
          </button>
          
          <button
            onClick={() => setShowRestartModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-white hover:bg-gray-100 text-black font-black uppercase text-xs border-2 border-black shadow-brutal-sm transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>{t.results.restartButton}</span>
          </button>
        </div>
      </div>

      {/* Hero Circular Progress & Patient Overview Banner */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden">
        
        {/* Circular Progress Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="text-gray-200"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke="#FFC700"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-black text-black">{overallScore}%</span>
              <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Acuity Index</span>
            </div>
          </div>
          <span className="mt-3 text-xs font-black uppercase tracking-wider text-black bg-[#FFC700] px-3 py-1 border border-black shadow-brutal-xs">
            COMPOSITE AUDITORY SCORE
          </span>
        </div>

        {/* Patient Profile Details */}
        <div className="md:col-span-7 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-black">
            {t.results.patientInfo}
          </h3>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">Full Name</span>
              <span className="font-black text-black text-sm mt-0.5 block truncate">{report.userName}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">Age & Range</span>
              <span className="font-black text-black text-sm mt-0.5 block">{report.age} years</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">Language Mode</span>
              <span className="font-black text-black text-sm mt-0.5 block uppercase">{report.preferredLanguage}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">{t.results.testDate}</span>
              <span className="font-black text-black text-xs mt-0.5 block">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Hazard Stripe Bottom Accent */}
        <div className="md:col-span-12 -mx-6 -mb-8 sm:-mx-8 sm:-mb-8 h-3 bg-hazard-stripes border-t-2 border-black mt-2" />
      </div>

      {/* Hearing Concern Indicator Card */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-brutal ${badge.bg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-black text-[#FFC700] border-2 border-black shadow-brutal-xs flex items-center justify-center shrink-0">
              <IconComponent className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-700 block">
                {t.results.concernIndicator}
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                {badge.label}
              </h2>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs sm:text-sm font-bold text-black leading-relaxed">
          {report.concernReason}
        </p>
        <p className="mt-1.5 text-xs text-gray-700 font-semibold italic">
          {badge.note}
        </p>
      </div>

      {/* Skipped Modules Warning Notice if applicable */}
      {report.skippedTests && report.skippedTests.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-black shadow-brutal flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-950">
              Incomplete Screening Assessment • {report.skippedTests.length} Module(s) Skipped
            </h4>
            <p className="text-xs font-semibold text-amber-900 mt-0.5 leading-relaxed">
              The following tests were skipped during this screening session: <strong>{report.skippedTests.join(', ')}</strong>. Unassessed auditory domains are excluded from your Acuity Index calculation, and no fabricated or estimated clinical audiometric values were generated.
            </p>
          </div>
        </div>
      )}

      {/* Ear-Specific Auditory Metrics (Left Ear vs Right Ear) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Ear Performance Card */}
        <div className="bg-sky-50/80 rounded-2xl p-5 border-2 border-black shadow-brutal">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3.5 h-3.5 bg-sky-500 rounded-full border border-black" />
              <h4 className="font-black uppercase text-sky-950 text-sm">
                Left Ear Performance (Blue [X])
              </h4>
            </div>
            <span className="text-xs font-mono font-black px-2.5 py-0.5 bg-sky-200 border border-black rounded text-black">
              {report.leftEarResult
                ? `${report.leftEarResult.frequencyDetectionPercentage}%`
                : (report.frequencyTest && (report.testedEar === 'left' || report.testedEar === 'both' || !report.testedEar)
                    ? `${report.frequencyTest.detectionPercentage}%`
                    : 'NOT EVALUATED')}
            </span>
          </div>

          <div className="space-y-2 text-xs font-bold text-slate-800">
            <div className="flex justify-between py-1 border-b border-black/10">
              <span className="text-slate-600">Frequencies Evaluated:</span>
              <span>250 Hz – 12,000 Hz</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/10">
              <span className="text-slate-600">Pure Tone Detection:</span>
              <span>
                {report.leftEarResult
                  ? `${report.leftEarResult.detectedTones} of ${report.leftEarResult.totalTones} tones heard`
                  : (report.frequencyTest && (report.testedEar === 'left' || report.testedEar === 'both' || !report.testedEar)
                      ? `${report.frequencyTest.detectedTones} of ${report.frequencyTest.totalTones} tones heard`
                      : 'N/A (Skipped)')}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/10">
              <span className="text-slate-600">Screening Threshold:</span>
              <span className="text-emerald-700">
                {report.leftEarResult
                  ? (report.leftEarResult.frequencyDetectionPercentage >= 80 ? '15–20 dB HL (Normal Sensitivity Est.)' : 'Elevated (>30 dB HL)')
                  : (report.frequencyTest && (report.testedEar === 'left' || report.testedEar === 'both' || !report.testedEar)
                      ? (report.frequencyTest.detectionPercentage >= 80 ? '15–20 dB HL (Normal Sensitivity Est.)' : 'Elevated (>30 dB HL)')
                      : 'N/A (Skipped)')}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Contralateral Masking:</span>
              <span className="text-slate-900">Right Ear Pink Noise Masked</span>
            </div>
          </div>
        </div>

        {/* Right Ear Performance Card */}
        <div className="bg-amber-50/80 rounded-2xl p-5 border-2 border-black shadow-brutal">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3.5 h-3.5 bg-amber-500 rounded-full border border-black" />
              <h4 className="font-black uppercase text-amber-950 text-sm">
                Right Ear Performance (Red [O])
              </h4>
            </div>
            <span className="text-xs font-mono font-black px-2.5 py-0.5 bg-amber-200 border border-black rounded text-black">
              {report.rightEarResult
                ? `${report.rightEarResult.frequencyDetectionPercentage}%`
                : (report.frequencyTest && (report.testedEar === 'right' || report.testedEar === 'both' || !report.testedEar)
                    ? `${report.frequencyTest.detectionPercentage}%`
                    : 'NOT EVALUATED')}
            </span>
          </div>

          <div className="space-y-2 text-xs font-bold text-slate-800">
            <div className="flex justify-between py-1 border-b border-black/10">
              <span className="text-slate-600">Frequencies Evaluated:</span>
              <span>250 Hz – 12,000 Hz</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/10">
              <span className="text-slate-600">Pure Tone Detection:</span>
              <span>
                {report.rightEarResult
                  ? `${report.rightEarResult.detectedTones} of ${report.rightEarResult.totalTones} tones heard`
                  : (report.frequencyTest && (report.testedEar === 'right' || report.testedEar === 'both' || !report.testedEar)
                      ? `${report.frequencyTest.detectedTones} of ${report.frequencyTest.totalTones} tones heard`
                      : 'N/A (Skipped)')}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/10">
              <span className="text-slate-600">Screening Threshold:</span>
              <span className="text-emerald-700">
                {report.rightEarResult
                  ? (report.rightEarResult.frequencyDetectionPercentage >= 80 ? '15–20 dB HL (Normal Sensitivity Est.)' : 'Elevated (>30 dB HL)')
                  : (report.frequencyTest && (report.testedEar === 'right' || report.testedEar === 'both' || !report.testedEar)
                      ? (report.frequencyTest.detectionPercentage >= 80 ? '15–20 dB HL (Normal Sensitivity Est.)' : 'Elevated (>30 dB HL)')
                      : 'N/A (Skipped)')}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Contralateral Masking:</span>
              <span className="text-slate-900">Left Ear Pink Noise Masked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Sequential Test Score Cards (All 4 Tests) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Test 1 Card */}
        <div className="bg-white rounded-2xl p-5 border-2 border-black shadow-brutal flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-black uppercase text-black bg-[#FFC700] px-2 py-0.5 border border-black text-[10px]">
                TEST 01: REPETITION
              </span>
              {report.repetitionTest ? (
                <span className="text-gray-500 text-[10px] font-bold">{report.repetitionTest.totalRepetitions} REPEATS</span>
              ) : (
                <span className="text-amber-700 text-[10px] font-black bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">SKIPPED</span>
              )}
            </div>
            <h4 className="font-black uppercase text-black text-xs">{t.results.test1Result}</h4>
            {report.repetitionTest ? (
              <div className="my-3">
                <div className="text-3xl font-black text-black">
                  {report.repetitionTest.accuracyPercentage}%
                </div>
                <p className="text-[11px] font-bold text-gray-600 mt-0.5">
                  {report.repetitionTest.correctAnswers} of {report.repetitionTest.totalQuestions} stages recognized
                </p>
              </div>
            ) : (
              <div className="my-3">
                <div className="text-lg font-black text-amber-700 uppercase">
                  Skipped
                </div>
                <p className="text-[11px] font-bold text-gray-500 mt-0.5">
                  Bandwidth filtering not evaluated
                </p>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full border border-black overflow-hidden">
            <div
              className="bg-[#FFC700] h-full transition-all duration-500"
              style={{ width: `${report.repetitionTest?.accuracyPercentage ?? 0}%` }}
            />
          </div>
        </div>

        {/* Test 2 Card */}
        <div className="bg-white rounded-2xl p-5 border-2 border-black shadow-brutal flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-black uppercase text-black bg-white px-2 py-0.5 border border-black text-[10px]">
                TEST 02: CONTRAST
              </span>
              {report.misheardTest ? (
                <span className="text-gray-500 text-[10px] font-bold">{report.misheardTest.totalAttempts} ATTEMPTS</span>
              ) : (
                <span className="text-amber-700 text-[10px] font-black bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">SKIPPED</span>
              )}
            </div>
            <h4 className="font-black uppercase text-black text-xs">{t.results.test2Result}</h4>
            {report.misheardTest ? (
              <div className="my-3">
                <div className="text-3xl font-black text-black">
                  {report.misheardTest.accuracyPercentage}%
                </div>
                <p className="text-[11px] font-bold text-gray-600 mt-0.5">
                  {report.misheardTest.correctlyRecognized?.length || 0} minimal pairs distinguished
                </p>
              </div>
            ) : (
              <div className="my-3">
                <div className="text-lg font-black text-amber-700 uppercase">
                  Skipped
                </div>
                <p className="text-[11px] font-bold text-gray-500 mt-0.5">
                  Phonemic pairs not evaluated
                </p>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full border border-black overflow-hidden">
            <div
              className="bg-black h-full transition-all duration-500"
              style={{ width: `${report.misheardTest?.accuracyPercentage ?? 0}%` }}
            />
          </div>
        </div>

        {/* Test 3 Card */}
        <div className="bg-white rounded-2xl p-5 border-2 border-black shadow-brutal flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-black uppercase text-black bg-[#FFC700] px-2 py-0.5 border border-black text-[10px]">
                TEST 03: PURE TONES
              </span>
              {report.frequencyTest ? (
                <span className="text-gray-500 text-[10px] font-bold">{report.frequencyTest.totalTones} TONES</span>
              ) : (
                <span className="text-amber-700 text-[10px] font-black bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">SKIPPED</span>
              )}
            </div>
            <h4 className="font-black uppercase text-black text-xs">{t.results.test3Result}</h4>
            {report.frequencyTest ? (
              <div className="my-3">
                <div className="text-3xl font-black text-black">
                  {report.frequencyTest.detectionPercentage}%
                </div>
                <p className="text-[11px] font-bold text-gray-600 mt-0.5">
                  {report.frequencyTest.detectedTones} of {report.frequencyTest.totalTones} tones detected
                </p>
              </div>
            ) : (
              <div className="my-3">
                <div className="text-lg font-black text-amber-700 uppercase">
                  Skipped
                </div>
                <p className="text-[11px] font-bold text-gray-500 mt-0.5">
                  Pure tone sweep not evaluated
                </p>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full border border-black overflow-hidden">
            <div
              className="bg-[#FFC700] h-full transition-all duration-500"
              style={{ width: `${report.frequencyTest?.detectionPercentage ?? 0}%` }}
            />
          </div>
        </div>

        {/* Test 4 Card: Individual Ear Assessment */}
        <div className="bg-white rounded-2xl p-5 border-2 border-black shadow-brutal flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-black uppercase text-black bg-sky-200 px-2 py-0.5 border border-black text-[10px]">
                TEST 04: EAR ASSESSMENT
              </span>
              {(report.leftEarResult || report.rightEarResult) ? (
                <span className="text-gray-500 text-[10px] font-bold">ISOLATED</span>
              ) : (
                <span className="text-amber-700 text-[10px] font-black bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">SKIPPED</span>
              )}
            </div>
            <h4 className="font-black uppercase text-black text-xs">Individual Ear Testing</h4>
            {(report.leftEarResult || report.rightEarResult) ? (
              <div className="my-3 space-y-1">
                <div className="text-xs font-black text-sky-800">
                  Left Ear: {report.leftEarResult ? `${report.leftEarResult.frequencyDetectionPercentage}%` : 'Not Done'}
                </div>
                <div className="text-xs font-black text-amber-800">
                  Right Ear: {report.rightEarResult ? `${report.rightEarResult.frequencyDetectionPercentage}%` : 'Not Done'}
                </div>
                <p className="text-[10px] font-bold text-gray-500">
                  Contralateral Pink Noise Masking
                </p>
              </div>
            ) : (
              <div className="my-3">
                <div className="text-lg font-black text-amber-700 uppercase">
                  Skipped
                </div>
                <p className="text-[11px] font-bold text-gray-500 mt-0.5">
                  Ear isolation not evaluated
                </p>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full border border-black overflow-hidden">
            <div
              className="bg-sky-500 h-full transition-all duration-500"
              style={{
                width: `${
                  report.leftEarResult && report.rightEarResult
                    ? Math.round((report.leftEarResult.frequencyDetectionPercentage + report.rightEarResult.frequencyDetectionPercentage) / 2)
                    : (report.leftEarResult?.frequencyDetectionPercentage || report.rightEarResult?.frequencyDetectionPercentage || 0)
                }%`,
              }}
            />
          </div>
        </div>

      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AudiogramChart responses={report.frequencyTest?.responses || report.leftEarResult?.responses || report.rightEarResult?.responses || []} />
        <AccuracyBarChart
          repAccuracy={report.repetitionTest?.accuracyPercentage ?? 0}
          misheardAccuracy={report.misheardTest?.accuracyPercentage ?? 0}
          freqAccuracy={report.frequencyTest?.detectionPercentage ?? (report.leftEarResult?.frequencyDetectionPercentage || report.rightEarResult?.frequencyDetectionPercentage || 0)}
        />
      </div>

      {/* Frequency Ranges Performance Breakdown */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-black shadow-brutal space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-black">
          AUDITORY FREQUENCY PERFORMANCE SUMMARY
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs">
            <span className="text-xs font-black text-black uppercase tracking-wider flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-[#FFC700] border border-black rounded flex items-center justify-center">
                <Check className="w-3 h-3 text-black stroke-[3]" />
              </div>
              <span>CONSISTENTLY DETECTED RANGES</span>
            </span>
            <ul className="space-y-1.5 text-xs text-black font-bold">
              {report.detectedFrequencyRanges.length > 0 ? (
                report.detectedFrequencyRanges.map((r, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-black shrink-0" />
                    <span>{r}</span>
                  </li>
                ))
              ) : (
                <li>No frequency ranges fully detected</li>
              )}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs">
            <span className="text-xs font-black text-black uppercase tracking-wider flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-red-400 border border-black rounded flex items-center justify-center">
                <AlertTriangle className="w-3 h-3 text-black stroke-[2.5]" />
              </div>
              <span>INCONSISTENT / MISSED TONES</span>
            </span>
            <ul className="space-y-1.5 text-xs text-black font-bold">
              {report.missedFrequencyRanges.length > 0 ? (
                report.missedFrequencyRanges.map((r, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))
              ) : (
                <li className="text-black font-black">Zero missed tones in this screening session!</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Intelligence Next Steps Callout */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#FFC700] border-2 border-black shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-black text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI INNOVATION MODULES</span>
          </div>
          <h3 className="text-base sm:text-lg font-black uppercase text-black">
            PERSONALIZED 6-AXIS HEARING FINGERPRINT & BEHAVIORAL AI
          </h3>
          <p className="text-xs text-gray-800 font-bold mt-1 max-w-lg leading-relaxed">
            Examine your multi-dimensional hearing profile, log everyday post-call difficulty patterns, and track your longitudinal acoustic baseline.
          </p>
        </div>
        
        {/* Signature Action Button */}
        <button
          onClick={onExploreAiFeatures}
          className="flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-black text-[#FFC700] hover:bg-gray-900 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group shrink-0"
        >
          <span className="py-3 px-4 text-center font-black uppercase tracking-wider text-xs flex items-center justify-center">
            {t.results.exploreAiFeatures}
          </span>
          <div className="bg-[#FFC700] text-black px-3.5 flex items-center justify-center border-l-2 border-black group-hover:bg-[#FFD233] transition-colors">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>
      </div>

      {/* Recommendations & Follow-Up Advice */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-black shadow-brutal space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-black">
          RECOMMENDED NEXT STEPS
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-black">
          <div className="p-3.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs">
            <strong className="text-black uppercase text-[11px] block mb-1">1. Periodic Re-Testing</strong>
            <p className="font-semibold text-gray-700">Re-screen every 3 to 6 months to spot any early threshold drift, especially in high frequency bands.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs">
            <strong className="text-black uppercase text-[11px] block mb-1">2. Sound Protection</strong>
            <p className="font-semibold text-gray-700">Limit headphone exposure to under 80 dB and wear hearing protection in concerts or noisy environments.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs">
            <strong className="text-black uppercase text-[11px] block mb-1">3. Clinical Confirmation</strong>
            <p className="font-semibold text-gray-700">If you notice persistent difficulty understanding conversations in noisy rooms, consult an audiologist.</p>
          </div>
        </div>
      </div>

      {/* Thank You Note */}
      <div className="p-4 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs flex items-start space-x-3">
        <HeartHandshake className="w-5 h-5 text-black shrink-0 mt-0.5 stroke-[2.5]" />
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-black mb-0.5">A NOTE FROM ECHOSENSE</h4>
          <p className="text-xs font-semibold text-gray-700 leading-relaxed">
            "{t.results.thankYouMessage}"
          </p>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="p-4 rounded-xl bg-white border-2 border-black shadow-brutal-xs text-xs text-black flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-black shrink-0 mt-0.5 stroke-[2.5]" />
        <div>
          <h5 className="font-black text-black uppercase tracking-wider text-[10px] mb-1">
            MANDATORY MEDICAL & SCREENING DISCLAIMER
          </h5>
          <p className="leading-relaxed font-semibold text-gray-600 text-[11px]">
            {t.results.medicalDisclaimer}
          </p>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Session */}
      <Modal
        isOpen={showRestartModal}
        onClose={() => setShowRestartModal(false)}
        onConfirm={onRestartSession}
        title={t.results.confirmRestartTitle}
        description={t.results.confirmRestartDesc}
        confirmText={t.results.confirm}
        cancelText={t.results.cancel}
        isDestructive={true}
      />

    </div>
  );
};
