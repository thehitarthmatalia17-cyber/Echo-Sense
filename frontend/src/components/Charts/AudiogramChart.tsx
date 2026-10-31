import React from 'react';
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
import { ToneResponse } from '../../types';

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

interface AudiogramChartProps {
  responses: ToneResponse[];
}

export const AudiogramChart: React.FC<AudiogramChartProps> = ({ responses = [] }) => {
  const safeResponses = Array.isArray(responses) ? responses : [];
  const sorted = [...safeResponses].sort((a, b) => a.frequencyHz - b.frequencyHz);

  const labels = sorted.map((r) => `${r.frequencyHz} Hz`);
  const dataPoints = sorted.map((r) => (r.heard ? 95 : 20));

  const data = {
    labels,
    datasets: [
      {
        label: 'Detection Acuity (%)',
        data: dataPoints,
        borderColor: '#000000',
        borderWidth: 3,
        backgroundColor: 'rgba(255, 199, 0, 0.25)',
        pointBackgroundColor: sorted.map((r) => (r.heard ? '#FFC700' : '#FF6B6B')),
        pointBorderColor: '#000000',
        pointBorderWidth: 2,
        pointRadius: 7,
        pointHoverRadius: 9,
        tension: 0.25,
        fill: true,
      },
    ],
  };

  const options = {
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
        title: {
          display: true,
          text: 'Auditory Sensitivity Index',
          color: '#000000',
          font: { size: 11, weight: 'bold' as const },
        },
      },
      x: {
        ticks: {
          color: '#000000',
          font: { size: 10, weight: 'bold' as const },
        },
        grid: {
          color: '#F3F4F6',
        },
        title: {
          display: true,
          text: 'Test Tone Frequency (Hertz)',
          color: '#000000',
          font: { size: 11, weight: 'bold' as const },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#000000',
        titleFont: { size: 12, weight: 'bold' as const },
        bodyFont: { size: 11 },
        borderColor: '#FFC700',
        borderWidth: 1.5,
        padding: 10,
        callbacks: {
          label: (context: any) => {
            const val = context.raw;
            return val > 50 ? 'Heard (Detected)' : 'Missed (Sub-threshold)';
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-72 sm:h-80 bg-white rounded-2xl p-4 sm:p-5 border-2 border-black shadow-brutal flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-black">
            FREQUENCY ACUITY PROFILE
          </h4>
          <p className="text-[10px] font-bold text-gray-500 uppercase">
            Pure Tone Audiogram Curve (250 Hz – 12,000 Hz)
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-[#FFC700] border border-black rounded-full" />
            <span>Detected</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-[#FF6B6B] border border-black rounded-full" />
            <span>Missed</span>
          </span>
        </div>
      </div>
      <div className="flex-1 w-full relative">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
