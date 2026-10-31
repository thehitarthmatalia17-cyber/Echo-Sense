import React, { useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  AlertCircle,
  Activity,
  CheckCircle2,
  Sparkles,
  Check
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoryTrendsPageProps {
  userId: string;
  currentLanguage: LanguageCode;
}

export const HistoryTrendsPage: React.FC<HistoryTrendsPageProps> = ({
  userId,
  currentLanguage,
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrends();
  }, [userId]);

  const loadTrends = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await api.getTrends(userId);
      setTrends(data);
    } catch (e) {
      console.warn("Failed to load hearing trends:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16 text-center text-black">
        <Activity className="w-10 h-10 animate-spin mx-auto mb-3 text-black" />
        <p className="text-sm font-black uppercase tracking-wider text-black">Aggregating Longitudinal Hearing Trends...</p>
      </div>
    );
  }

  const history = trends?.history || [];

  const labels = history.map((item: any, idx: number) => {
    const d = new Date(item.timestamp);
    return `#${idx + 1} (${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`;
  });

  const accuracyData = {
    labels,
    datasets: [
      {
        label: 'Speech Recognition Accuracy (%)',
        data: history.map((h: any) => h.repetition_accuracy),
        borderColor: '#000000',
        backgroundColor: 'rgba(255, 199, 0, 0.25)',
        tension: 0.2,
        fill: true,
        pointBackgroundColor: '#FFC700',
        pointBorderColor: '#000000',
        pointBorderWidth: 2,
        pointRadius: 6,
        borderWidth: 2.5,
      },
      {
        label: 'Pure Tone Detection (%)',
        data: history.map((h: any) => h.frequency_detection),
        borderColor: '#000000',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        tension: 0.2,
        fill: false,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#000000',
        pointBorderWidth: 2,
        pointRadius: 6,
        borderWidth: 2.5,
        borderDash: [5, 5],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value: any) => `${value}%`,
          stepSize: 25,
          color: '#000000',
          font: { size: 10, weight: 'bold' as const },
        },
        grid: {
          color: '#E5E7EB',
        },
      },
      x: {
        ticks: {
          color: '#000000',
          font: { size: 10, weight: 'bold' as const },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#000000',
          font: { size: 11, weight: 'bold' as const },
          usePointStyle: true,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#000000',
        titleFont: { size: 12, weight: 'bold' as const },
        borderColor: '#FFC700',
        borderWidth: 1.5,
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300 space-y-6">
      
      {/* Header Card */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FFC700] border border-black text-black text-[10px] font-black uppercase tracking-wider shadow-brutal-xs mb-3">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>LONGITUDINAL INTELLIGENCE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          {t.trends.title}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
          {t.trends.subtitle}
        </p>
      </div>

      {/* Trajectory Card */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black/10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
              LONGITUDINAL SCREENING PATTERN
            </span>
            <h3 className="text-xl font-black uppercase text-black mt-0.5">
              TRAJECTORY: {trends?.trajectory || 'STABLE'}
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase text-black bg-[#FFC700] px-3 py-1.5 border border-black shadow-brutal-xs">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{trends?.observation || 'Auditory thresholds remain within expected variance'}</span>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="w-full h-64 sm:h-72">
          <Line data={accuracyData} options={chartOptions} />
        </div>
      </div>

      {/* Session History List */}
      <div className="bg-white border-[2.5px] border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-black">
          HISTORICAL SCREENING LOGS ({history.length})
        </h3>
        <div className="space-y-2.5">
          {history.map((h: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#FAF9F6] border-2 border-black shadow-brutal-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFC700] text-black border border-black flex items-center justify-center font-black text-xs">
                  #{idx + 1}
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-black">
                    {new Date(h.timestamp).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </div>
                  <div className="text-[10px] font-bold text-gray-600 uppercase">
                    Concern Assessment: <strong className="text-black">{h.concern_level}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs">
                <div>
                  <span className="text-gray-500 text-[10px] font-black uppercase block">Repetition</span>
                  <span className="font-black text-black">{h.repetition_accuracy}%</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] font-black uppercase block">Word Contrast</span>
                  <span className="font-black text-black">{h.misheard_accuracy}%</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] font-black uppercase block">Pure Tones</span>
                  <span className="font-black text-black">{h.frequency_detection}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
