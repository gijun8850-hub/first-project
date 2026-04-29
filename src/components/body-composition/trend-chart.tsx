import React from "react";
import type { TrendPoint } from "@/types/body-composition";

type TrendChartProps = {
  points: TrendPoint[];
};

function buildPolyline(values: number[]) {
  if (values.length === 0) {
    return "";
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const spread = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - ((value - min) / spread) * 100;
      return `${x},${y}`;
    })
    .join(" ");
}

export function TrendChart({ points }: TrendChartProps) {
  if (points.length === 0) {
    return <p className="coach-muted">체크인이 쌓이면 4주 추이가 여기에 표시됩니다.</p>;
  }

  return (
    <div className="coach-trend-chart">
      <svg aria-label="4주 추이 차트" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          className="coach-trend-line coach-trend-line-weight"
          fill="none"
          points={buildPolyline(points.map((point) => point.weightKg))}
        />
        <polyline
          className="coach-trend-line coach-trend-line-muscle"
          fill="none"
          points={buildPolyline(points.map((point) => point.skeletalMuscleKg))}
        />
        <polyline
          className="coach-trend-line coach-trend-line-fat"
          fill="none"
          points={buildPolyline(points.map((point) => point.bodyFatPercent))}
        />
      </svg>

      <div className="coach-trend-labels">
        {points.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}
