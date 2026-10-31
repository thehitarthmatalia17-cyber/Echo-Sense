import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isActive: boolean;
  color?: string;
  height?: number;
  label?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isActive,
  color = '#FFC700',
  height = 80,
  label = 'Auditory Signal Monitor'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      // Draw high-contrast grid lines
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1;
      for (let y = 14; y < h; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw center dashed baseline
      ctx.strokeStyle = '#121212';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Secondary Shadow Wave
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000000';

      const numPoints = 80;
      const step = width / numPoints;

      for (let i = 0; i <= numPoints; i++) {
        const x = i * step;
        const normalizedX = (i / numPoints) * Math.PI * 4;
        let amplitude = isActive ? (h * 0.32) : (h * 0.08);
        const windowFactor = Math.sin((i / numPoints) * Math.PI);

        const y1 = Math.sin(normalizedX + phase) * amplitude * windowFactor;
        const y2 = Math.sin(normalizedX * 2.2 - phase * 1.4) * (amplitude * 0.35) * windowFactor;
        const y = centerY + y1 + y2 + 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Primary Yellow Wave
      ctx.beginPath();
      ctx.lineWidth = isActive ? 3 : 2;
      ctx.strokeStyle = isActive ? '#FFC700' : '#121212';

      for (let i = 0; i <= numPoints; i++) {
        const x = i * step;
        const normalizedX = (i / numPoints) * Math.PI * 4;
        let amplitude = isActive ? (h * 0.32) : (h * 0.08);
        const windowFactor = Math.sin((i / numPoints) * Math.PI);

        const y1 = Math.sin(normalizedX + phase) * amplitude * windowFactor;
        const y2 = Math.sin(normalizedX * 2.2 - phase * 1.4) * (amplitude * 0.35) * windowFactor;
        const y = centerY + y1 + y2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isActive ? 0.07 : 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, color]);

  return (
    <div className="w-full bg-white rounded-xl p-3 border-2 border-black shadow-brutal-sm">
      <div className="flex items-center justify-between mb-2 text-xs font-black uppercase tracking-wider text-black">
        <span className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-sm border border-black ${isActive ? 'bg-[#FFC700] animate-ping' : 'bg-black'}`} />
          <span>{label}</span>
        </span>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-black bg-[#FFC700] text-black font-bold">
          {isActive ? 'ACTIVE SIGNAL' : 'CALIBRATED'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={height}
        className="w-full rounded-lg bg-[#FAF9F6] block border-2 border-black"
      />
    </div>
  );
};
