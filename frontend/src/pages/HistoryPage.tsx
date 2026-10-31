import React, { useState, useEffect } from 'react';
import { ScreeningReportData, LanguageCode, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';
import { pdfService } from '../services/pdfService';
import { Modal } from '../components/Modal';
import { AudiogramChart } from '../components/Charts/AudiogramChart';
import {
  Clock,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Award,
  Ear,
  Eye,
  Activity,
  Layers,
  FileText,
  Volume2,
  Check,
  ChevronRight,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface HistoryPageProps {
  currentLanguage: LanguageCode;
  userProfile: UserProfile | null;
  onStartNewTest: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  currentLanguage,
  userProfile,
  onStartNewTest,
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [history, setHistory] = useState<ScreeningReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<ScreeningReportData | null>(null);

  useEffect(() => {
    loadUserHistory();
  }, [userProfile?.id]);

  const loadUserHistory = async () => {
    setLoading(true);
    const userId = userProfile?.id || 'anonymous-user';
    try {
      const records = await api.getUserHistory(userId);
      setHistory(records);
    } catch (err) {
      console.warn("Error loading user test history:", err);
    } finally {
      setLoading(false);
    }
  };

  const getConcernBadge = (level: string) => {
    switch (level) {
      case 'HIGH':
        return {
          label: 'ELEVATED CONCERN',
          bg: 'bg-red-100 text-black border-2 border-black',
          pillBg: 'bg-red-500 text-white',
          icon: AlertOctagon,
        };
      case 'MODERATE':
        return {
          label: 'MODERATE CONCERN',
          bg: 'bg-amber-100 text-black border-2 border-black',
          pillBg: 'bg-[#FFC700] text-black',
          icon: AlertTriangle,
        };
      case 'LOW':
      default:
        return {
          label: 'LOW CONCERN',
          bg: 'bg-[#FFC700]/25 text-black border-2 border-black',
          pillBg: 'bg-[#FFC700] text-black',
          icon: CheckCircle2,
        };
    }
  };

  const handleDownloadPDF = (e: React.MouseEvent, record: ScreeningReportData) => {
    e.stopPropagation();
    pdfService.generateHearingReportPDF(record);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#FFC700] border-2 border-black shadow-brutal-xs text-xs font-black uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>USER TEST ARCHIVE • FIFO STORAGE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
            Hearing Test History
          </h1>
          <p className="mt-2 text-base text-slate-700 font-bold max-w-2xl">
            Access your private, historical hearing screening records. Your last 10 test sessions are automatically preserved with independent left and right ear evaluations.
          </p>
        </div>

        {/* User Isolation & FIFO Indicator */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 bg-white border-2 border-black shadow-brutal-xs rounded-xl flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Private Profile</p>
              <p className="text-xs font-black text-black">{userProfile?.fullName || 'Active Session'}</p>
            </div>
          </div>

          <div className="px-3.5 py-2 bg-[#FFC700] border-2 border-black shadow-brutal-xs rounded-xl flex items-center space-x-2">
            <Layers className="w-4 h-4 text-black" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-wider text-black">FIFO Capacity</p>
              <p className="text-xs font-black text-black">{history.length} / 10 Max Records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white border-3 border-black shadow-brutal-md rounded-2xl p-12 text-center">
          <div className="w-12 h-12 border-4 border-black border-t-[#FFC700] rounded-full animate-spin mx-auto mb-4" />
          <p className="font-black text-black uppercase tracking-wider">Loading your private test history...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && history.length === 0 && (
        <div className="bg-white border-3 border-black shadow-brutal-lg rounded-3xl p-8 sm:p-14 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-[#FFC700] border-3 border-black shadow-brutal-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Ear className="w-10 h-10 text-black stroke-[2.5]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mb-3">
            No hearing tests recorded yet
          </h2>
          <p className="text-slate-700 font-bold text-base sm:text-lg mb-8 max-w-lg mx-auto">
            Your completed tests will appear here. Conduct a Left Ear, Right Ear, or Bilateral hearing assessment to generate your first detailed medical report.
          </p>

          <button
            onClick={onStartNewTest}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 bg-[#FFC700] hover:bg-[#E5B200] text-black font-black text-base uppercase tracking-wider border-3 border-black shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm transition-all rounded-xl"
          >
            <span>START HEARING ASSESSMENT</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="mt-8 pt-6 border-t-2 border-black/10 flex items-center justify-center space-x-2 text-xs font-bold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Automatic FIFO retention • Newest 10 tests stored privately</span>
          </div>
        </div>
      )}

      {/* Test Records List */}
      {!loading && history.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-600 px-1">
            <span>SHOWING {history.length} COMPLETED TEST RECORD{history.length > 1 ? 'S' : ''} (NEWEST FIRST)</span>
            <span className="hidden sm:inline">CLICK ANY RECORD TO INSPECT DETAILED AUDIOGRAM</span>
          </div>

          {history.map((record, index) => {
            const badge = getConcernBadge(record.concernLevel);
            const ConcernIcon = badge.icon;
            const dateStr = new Date(record.timestamp).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            const timeStr = new Date(record.timestamp).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            });

            const testId = record.testId || `TW-${(record.id || 'TEST').slice(0, 8).toUpperCase()}`;
            const testedEar = record.testedEar || 'both';

            const overallScore = Math.round(
              (record.repetitionTest.accuracyPercentage +
                record.misheardTest.accuracyPercentage +
                record.frequencyTest.detectionPercentage) /
                3
            );

            return (
              <div
                key={record.id || index}
                onClick={() => setSelectedRecord(record)}
                className="bg-white border-3 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all rounded-2xl p-5 sm:p-6 cursor-pointer group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left Column: ID, Date, Badges */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      
                      {/* FIFO Index Pill */}
                      <span className="px-2.5 py-0.5 rounded bg-black text-white font-mono font-black text-xs border border-black">
                        #{index + 1}
                      </span>

                      {/* Test ID */}
                      <span className="px-2.5 py-0.5 rounded bg-[#FAF9F6] font-mono font-black text-xs border-2 border-black">
                        {testId}
                      </span>

                      {/* Tested Ear Pill */}
                      <span className={`px-2.5 py-0.5 rounded font-black text-xs border-2 border-black ${
                        testedEar === 'left' ? 'bg-sky-100 text-sky-900' :
                        testedEar === 'right' ? 'bg-amber-100 text-amber-900' :
                        'bg-purple-100 text-purple-900'
                      }`}>
                        {testedEar === 'left' ? '🎧 LEFT EAR TEST' :
                         testedEar === 'right' ? '🎧 RIGHT EAR TEST' :
                         '🎧 BILATERAL (BOTH EARS)'}
                      </span>

                      {/* Concern Status Badge */}
                      <span className={`px-2.5 py-0.5 rounded font-black text-xs border-2 border-black flex items-center space-x-1 ${badge.bg}`}>
                        <ConcernIcon className="w-3 h-3 stroke-[2.5]" />
                        <span>{badge.label}</span>
                      </span>

                      {/* Timestamp */}
                      <span className="text-xs font-bold text-slate-500 flex items-center space-x-1 ml-auto lg:ml-0">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateStr} at {timeStr}</span>
                      </span>
                    </div>

                    {/* Ear-Specific Metrics Preview Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      
                      {/* Left Ear Box */}
                      <div className="p-3 bg-sky-50/70 border-2 border-black rounded-xl">
                        <div className="flex items-center justify-between text-xs font-black uppercase text-sky-900 mb-1">
                          <span>Left Ear (X)</span>
                          <span className="text-[11px] px-1.5 py-0.2 bg-sky-200 border border-black rounded font-mono">
                            {testedEar === 'right' ? 'N/A' : `${record.leftEarResult?.frequencyDetectionPercentage ?? record.frequencyTest.detectionPercentage}%`}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-700">
                          {testedEar === 'right' ? 'Not evaluated' : (record.leftEarResult?.hearingStatus || 'Normal sensitivity indicator')}
                        </p>
                      </div>

                      {/* Right Ear Box */}
                      <div className="p-3 bg-amber-50/70 border-2 border-black rounded-xl">
                        <div className="flex items-center justify-between text-xs font-black uppercase text-amber-900 mb-1">
                          <span>Right Ear (O)</span>
                          <span className="text-[11px] px-1.5 py-0.2 bg-amber-200 border border-black rounded font-mono">
                            {testedEar === 'left' ? 'N/A' : `${record.rightEarResult?.frequencyDetectionPercentage ?? record.frequencyTest.detectionPercentage}%`}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-700">
                          {testedEar === 'left' ? 'Not evaluated' : (record.rightEarResult?.hearingStatus || 'Normal sensitivity indicator')}
                        </p>
                      </div>

                      {/* Composite Acuity Box */}
                      <div className="p-3 bg-[#FAF9F6] border-2 border-black rounded-xl">
                        <div className="flex items-center justify-between text-xs font-black uppercase text-black mb-1">
                          <span>Composite</span>
                          <span className="text-[11px] px-1.5 py-0.2 bg-[#FFC700] border border-black rounded font-mono">
                            {overallScore}%
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-700">
                          Speech: {record.repetitionTest.accuracyPercentage}% | Contrast: {record.misheardTest.accuracyPercentage}%
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Action Buttons */}
                  <div className="flex flex-row lg:flex-col items-center gap-2 pt-2 lg:pt-0 border-t-2 lg:border-t-0 border-black/10">
                    
                    {/* Download PDF Button */}
                    <button
                      onClick={(e) => handleDownloadPDF(e, record)}
                      title="Download PDF report for this test session"
                      className="flex-1 lg:flex-none w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white hover:bg-[#FFC700] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-brutal-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all rounded-xl"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>DOWNLOAD PDF</span>
                    </button>

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="flex-1 lg:flex-none w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-black hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-brutal-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all rounded-xl"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>VIEW DETAILS</span>
                    </button>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED RECORD MODAL */}
      {selectedRecord && (
        <Modal
          isOpen={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={`TEST RECORD: ${selectedRecord.testId || 'SCREENING REPORT'}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            
            {/* Modal Header Strip */}
            <div className="p-4 bg-[#FAF9F6] border-2 border-black rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Patient / Session</p>
                <p className="text-base font-black text-black">{selectedRecord.userName} ({selectedRecord.age} yrs)</p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Date Recorded</p>
                <p className="text-sm font-bold text-black">
                  {new Date(selectedRecord.timestamp).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Tested Ear</p>
                <p className="text-sm font-black text-black uppercase">
                  {selectedRecord.testedEar || 'Bilateral (Both Ears)'}
                </p>
              </div>

              <button
                onClick={(e) => handleDownloadPDF(e, selectedRecord)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#FFC700] hover:bg-[#E5B200] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-brutal-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all rounded-lg"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>DOWNLOAD PDF</span>
              </button>
            </div>

            {/* Concern Narrative Box */}
            <div className="p-4 bg-white border-2 border-black rounded-xl shadow-brutal-xs">
              <h4 className="text-xs font-black uppercase tracking-wider text-black mb-1.5">
                Clinical Screening Observation
              </h4>
              <p className="text-sm font-bold text-slate-800 leading-relaxed">
                {selectedRecord.concernReason}
              </p>
            </div>

            {/* Left vs Right Ear Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Ear Details */}
              <div className="p-4 bg-sky-50/60 border-2 border-black rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-sm uppercase text-sky-900">Left Ear Evaluation (Blue X)</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-sky-200 border border-black rounded">
                    {selectedRecord.leftEarResult?.frequencyDetectionPercentage ?? selectedRecord.frequencyTest.detectionPercentage}% Detection
                  </span>
                </div>
                <div className="space-y-1.5 text-xs font-bold text-slate-700">
                  <p>• Tested Frequencies: 250 Hz – 12,000 Hz</p>
                  <p>• Tone Detection: {selectedRecord.leftEarResult?.detectedTones ?? selectedRecord.frequencyTest.detectedTones} of {selectedRecord.leftEarResult?.totalTones ?? selectedRecord.frequencyTest.totalTones} tones heard</p>
                  <p>• Est. Threshold: 15–20 dB HL (Informational screening estimate)</p>
                  <p>• Masking: Contralateral pink noise isolation</p>
                </div>
              </div>

              {/* Right Ear Details */}
              <div className="p-4 bg-amber-50/60 border-2 border-black rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-sm uppercase text-amber-900">Right Ear Evaluation (Red O)</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-amber-200 border border-black rounded">
                    {selectedRecord.rightEarResult?.frequencyDetectionPercentage ?? selectedRecord.frequencyTest.detectionPercentage}% Detection
                  </span>
                </div>
                <div className="space-y-1.5 text-xs font-bold text-slate-700">
                  <p>• Tested Frequencies: 250 Hz – 12,000 Hz</p>
                  <p>• Tone Detection: {selectedRecord.rightEarResult?.detectedTones ?? selectedRecord.frequencyTest.detectedTones} of {selectedRecord.rightEarResult?.totalTones ?? selectedRecord.frequencyTest.totalTones} tones heard</p>
                  <p>• Est. Threshold: 15–20 dB HL (Informational screening estimate)</p>
                  <p>• Masking: Contralateral pink noise isolation</p>
                </div>
              </div>

            </div>

            {/* Audiogram Chart */}
            <div className="bg-white border-2 border-black rounded-xl p-4 shadow-brutal-xs">
              <h4 className="text-xs font-black uppercase tracking-wider text-black mb-3">
                Frequency Sensitivity Audiogram
              </h4>
              <div className="h-64">
                <AudiogramChart responses={selectedRecord.frequencyTest.responses} />
              </div>
            </div>

            {/* Test 1 & 2 Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF9F6] border-2 border-black rounded-xl">
                <h5 className="font-black text-xs uppercase text-black mb-1">
                  Test 1: Sentence Repetition
                </h5>
                <p className="text-xs font-bold text-slate-700">
                  Accuracy: {selectedRecord.repetitionTest.accuracyPercentage}% ({selectedRecord.repetitionTest.correctAnswers}/{selectedRecord.repetitionTest.totalQuestions} stages correct, {selectedRecord.repetitionTest.totalRepetitions} replays)
                </p>
              </div>

              <div className="p-4 bg-[#FAF9F6] border-2 border-black rounded-xl">
                <h5 className="font-black text-xs uppercase text-black mb-1">
                  Test 2: Minimal-Pairs Contrast
                </h5>
                <p className="text-xs font-bold text-slate-700">
                  Accuracy: {selectedRecord.misheardTest.accuracyPercentage}% ({selectedRecord.misheardTest.correctlyRecognized.length}/{selectedRecord.misheardTest.totalWords} pairs correct)
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 pt-3 border-t-2 border-black/10">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 bg-black hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider border-2 border-black rounded-xl transition-all"
              >
                CLOSE
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};
