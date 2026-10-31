import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AccuracyBarChartProps {
  repAccuracy: number;
  misheardAccuracy: number;
  freqAccuracy: number;
}

export const AccuracyBarChart: React.FC<AccuracyBarChartProps> = ({
  repAccuracy,
  misheardAccuracy,
  freqAccuracy,
}) => {
  const data = {
    labels: [
      'Repetition Test',
      'Word Contrast',
      'Pure Tones',
    ],
    datasets: [
      {
        label: 'Accuracy Score (%)',
        data: [repAccuracy, misheardAccuracy, freqAccuracy],
        backgroundColor: [
          '#FFC700',
          '#FFFFFF',
          '#121212',
        ],
        borderColor: '#000000',
        borderWidth: 2.5,
        borderRadius: 6,
        barThickness: 32,
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
          label: (context: any) => `Acuity: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <div className="w-full h-72 sm:h-80 bg-white rounded-2xl p-4 sm:p-5 border-2 border-black shadow-brutal flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-black">
            SCREENING ACCURACY BY DOMAIN
          </h4>
          <p className="text-[10px] font-bold text-gray-500 uppercase">
            Comparative performance across 3 screening modalities
          </p>
        </div>
      </div>
      <div className="flex-1 w-full relative">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
