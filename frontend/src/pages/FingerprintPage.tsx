import React, { useState, useEffect } from 'react';
import { HearingFingerprintData, AnomalyReportData, LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';
import { FingerprintRadar } from '../components/Charts/FingerprintRadar';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Brain,
  Lightbulb,
  ArrowRight,
  Fingerprint,
  Check
} from 'lucide-react';

interface FingerprintPageProps {
  userId: string;
  currentLanguage: LanguageCode;
}

export const FingerprintPage: React.FC<FingerprintPageProps> = ({
  userId,
  currentLanguage,
}) => {
  const t = translations[currentLanguage] || translations.en;

  const [fingerprint, setFingerprint] = useState<HearingFingerprintData | null>(null);
  const [anomalyReport, setAnomalyReport] = useState<AnomalyReportData | null>(null);
  const [isRunningModel, setIsRunningModel] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const fp = await api.getHearingFingerprint(userId);
      setFingerprint(fp);
    } catch (e) {
      console.warn("Failed to load hearing fingerprint:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAiModel = async () => {
    setIsRunningModel(true);
    try {
      const report = await api.runAnomalyDetection(userId);
      setAnomalyReport(report);
    } catch (e) {
      console.warn("Error running Isolation Forest model:", e);
    } finally {
      setIsRunningModel(false);
    }
  };

  if (loading || !fingerprint) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16 text-center text-black">
        <Cpu className="w-10 h-10 animate-spin mx-auto mb-3 text-black" />
        <p className="text-sm font-black uppercase tracking-wider text-black">Synthesizing 6-Axis Personalized Hearing Fingerprint...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300 space-y-6">
      
      {/* Header Card */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FFC700] border border-black text-black text-[10px] font-black uppercase tracking-wider shadow-brutal-xs mb-3">
          <Fingerprint className="w-3.5 h-3.5" />
          <span>MULTI-AXIS AUDITORY FINGERPRINT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          {t.fingerprint.title}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
          {t.fingerprint.subtitle}
        </p>
      </div>

      {/* Composite Index & Radar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Score & Insights */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Composite Score Card */}
          <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-brutal">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
              {t.fingerprint.compositeScore}
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-5xl font-black text-black">
                {fingerprint.overallIndex}
              </span>
              <span className="text-gray-500 font-bold text-sm">/ 100</span>
            </div>
            <p className="text-xs text-gray-700 mt-2 font-semibold leading-relaxed">
              Calculated across 6 clinical dimensions of speech perception, high-frequency detection, and repetition endurance.
            </p>
          </div>

          {/* Strengths Card */}
          <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-brutal">
            <h4 className="text-xs font-black uppercase tracking-wider text-black mb-2.5 flex items-center space-x-1.5">
              <div className="w-4 h-4 bg-[#FFC700] border border-black rounded flex items-center justify-center">
                <Check className="w-3 h-3 text-black stroke-[3]" />
              </div>
              <span>{t.fingerprint.strengthsTitle}</span>
            </h4>
            <ul className="space-y-1.5">
              {fingerprint.strengths.map((str, i) => (
                <li key={i} className="text-xs text-black font-bold flex items-center space-x-2">
                  <span className="w-2 h-2 bg-black shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vulnerabilities Card */}
          <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-brutal">
            <h4 className="text-xs font-black uppercase tracking-wider text-black mb-2.5 flex items-center space-x-1.5">
              <div className="w-4 h-4 bg-red-400 border border-black rounded flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-black stroke-[2.5]" />
              </div>
              <span>{t.fingerprint.vulnerabilitiesTitle}</span>
            </h4>
            <ul className="space-y-1.5">
              {fingerprint.vulnerabilities.map((vuln, i) => (
                <li key={i} className="text-xs text-black font-bold flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 shrink-0" />
                  <span>{vuln}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Side: Radar Chart */}
        <div className="lg:col-span-7 bg-white border-2 border-black rounded-2xl p-5 sm:p-7 shadow-brutal">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-black">
                AUDITORY RADAR TOPOLOGY
              </h3>
              <p className="text-xs font-bold text-gray-500 uppercase">Personalized Multidimensional Acuity</p>
            </div>
            <span className="text-[10px] font-black uppercase text-black bg-[#FFC700] px-2 py-0.5 border border-black shadow-brutal-xs">
              SCIKIT-LEARN MODEL
            </span>
          </div>

          <FingerprintRadar metrics={fingerprint.metrics} />
        </div>

      </div>

      {/* AI Isolation Forest Drift Trigger Card */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-black text-xs font-black uppercase tracking-wider mb-1">
              <Brain className="w-4 h-4" />
              <span>ISOLATION FOREST AI MODEL</span>
            </div>
            <h3 className="text-lg font-black uppercase text-black">{t.fingerprint.aiReportTitle}</h3>
            <p className="text-xs text-gray-700 font-semibold mt-1 max-w-xl leading-relaxed">
              Isolation Forest machine learning models detect subtle drift from your personalized auditory baseline over time.
            </p>
          </div>
          
          {/* Action Button */}
          <button
            onClick={handleRunAiModel}
            disabled={isRunningModel}
            className="flex items-stretch rounded-xl border-2 border-black shadow-brutal bg-[#FFC700] hover:bg-[#FFD233] disabled:opacity-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs transition-all cursor-pointer overflow-hidden group shrink-0"
          >
            <span className="py-3 px-4 text-center font-black uppercase tracking-wider text-xs text-black flex items-center justify-center">
              {isRunningModel ? "EVALUATING..." : t.fingerprint.runAiAnalysis}
            </span>
            <div className="bg-black text-[#FFC700] px-3.5 flex items-center justify-center border-l-2 border-black group-hover:text-white transition-colors">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>
        </div>

        {/* Anomaly Result Output */}
        {anomalyReport && (
          <div className="mt-5 p-4 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs text-xs space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-black text-black uppercase tracking-wider text-[11px]">
                ALGORITHM VERDICT:
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border border-black ${
                anomalyReport.isAnomaly ? 'bg-red-200 text-black' : 'bg-[#FFC700] text-black'
              }`}>
                {anomalyReport.isAnomaly ? t.fingerprint.anomalyStatus : t.fingerprint.normalStatus}
              </span>
            </div>
            <p className="text-black leading-relaxed font-bold">
              {anomalyReport.explainableFactors?.length > 0 ? anomalyReport.explainableFactors.join('. ') : 'Auditory responses align with normal baseline variance.'}
            </p>
            <div className="text-[10px] text-gray-500 font-mono font-bold pt-1">
              ANOMALY METRIC SCORE: {anomalyReport.anomalyScore} • CONFIDENCE: {Math.round(anomalyReport.confidence * 100)}%
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
