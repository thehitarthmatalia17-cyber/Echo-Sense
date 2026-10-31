import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface FingerprintRadarProps {
  metrics: {
    speech_recognition: number;
    frequency_detection: number;
    repetition_resilience: number;
    phoneme_discrimination: number;
    listening_ease: number;
    high_frequency_sensitivity: number;
  };
}

export const FingerprintRadar: React.FC<FingerprintRadarProps> = ({ metrics }) => {
  const labels = [
    'Speech Clarity',
    'Frequency Span',
    'Repetition Resilience',
    'Phoneme Distinction',
    'Conversation Ease',
    'High-Frequency Acuity',
  ];

  const values = [
    metrics.speech_recognition,
    metrics.frequency_detection,
    metrics.repetition_resilience,
    metrics.phoneme_discrimination,
    metrics.listening_ease,
    metrics.high_frequency_sensitivity,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Current Hearing Profile',
        data: values,
        backgroundColor: 'rgba(255, 199, 0, 0.35)',
        borderColor: '#000000',
        borderWidth: 3,
        pointBackgroundColor: '#FFC700',
        pointBorderColor: '#000000',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#000000',
        pointHoverBorderColor: '#FFC700',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Healthy Reference Baseline',
        data: [90, 90, 85, 90, 85, 85],
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderColor: '#000000',
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: '#000000',
          lineWidth: 1,
        },
        grid: {
          color: '#D1D5DB',
        },
        pointLabels: {
          color: '#000000',
          font: {
            size: 11,
            weight: 'bold' as const,
          },
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#6B7280',
          stepSize: 20,
          font: { size: 9 },
        },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
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
    <div className="w-full h-80 sm:h-96">
      <Radar data={data} options={options} />
    </div>
  );
};
