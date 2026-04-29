"use client";

import React, { useState } from "react";
import type { TrendPoint, TrendSeriesKey } from "@/types/body-composition";

type TrendChartProps = {
  points: TrendPoint[];
};

type TrendSeriesConfig = {
  key: TrendSeriesKey;
  label: string;
  unit: string;
  lineClassName: string;
};

const TREND_SERIES: TrendSeriesConfig[] = [
  {
    key: "weightKg",
    label: "체중",
    unit: "kg",
    lineClassName: "coach-trend-line-weight",
  },
  {
    key: "skeletalMuscleKg",
    label: "골격근량",
    unit: "kg",
    lineClassName: "coach-trend-line-muscle",
  },
  {
    key: "bodyFatPercent",
    label: "체지방률",
    unit: "%",
    lineClassName: "coach-trend-line-fat",
  },
];

type SeriesGeometry = {
  key: TrendSeriesKey;
  points: string;
  circles: Array<{ x: number; y: number }>;
  min: number;
  max: number;
};

function formatSigned(value: number, unit: string) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}${unit}`;
}

function buildSeriesGeometry(values: number[], key: TrendSeriesKey): SeriesGeometry {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const spread = max - min || 1;

  const circles = values.map((value, index) => {
    const x = 10 + (index / Math.max(values.length - 1, 1)) * 80;
    const y = 86 - ((value - min) / spread) * 64;
    return { x, y };
  });

  return {
    key,
    circles,
    points: circles.map((point) => `${point.x},${point.y}`).join(" "),
    min,
    max,
  };
}

export function TrendChart({ points }: TrendChartProps) {
  const [activeSeriesKey, setActiveSeriesKey] = useState<TrendSeriesKey>("weightKg");
  const [activePointIndex, setActivePointIndex] = useState(points.length - 1);

  if (points.length === 0) {
    return <p className="coach-muted">체크인이 쌓이면 4주 추이가 여기에 표시됩니다.</p>;
  }

  const activeIndex = Math.min(activePointIndex, points.length - 1);
  const activePoint = points[activeIndex];

  const seriesGeometries = TREND_SERIES.map((series) =>
    buildSeriesGeometry(points.map((point) => point[series.key]), series.key),
  );

  const activeSeries =
    TREND_SERIES.find((series) => series.key === activeSeriesKey) ?? TREND_SERIES[0];
  const activeGeometry =
    seriesGeometries.find((geometry) => geometry.key === activeSeries.key) ??
    seriesGeometries[0];
  const latestPoint = points.at(-1) ?? points[points.length - 1];
  const previousPoint = points.at(-2) ?? null;

  return (
    <div className="coach-trend-chart">
      <div className="coach-trend-legend">
        {TREND_SERIES.map((series) => {
          const latestValue = latestPoint[series.key];
          const previousValue = previousPoint ? previousPoint[series.key] : null;
          const isActive = series.key === activeSeries.key;

          return (
            <button
              aria-pressed={isActive}
              className={`coach-trend-legend-button ${isActive ? "coach-trend-legend-button-active" : ""}`}
              data-trend-series={series.key}
              key={series.key}
              onClick={() => setActiveSeriesKey(series.key)}
              type="button"
            >
              <span>{series.label}</span>
              <strong>
                {latestValue.toFixed(1)}
                {series.unit}
              </strong>
              <small>
                {previousValue === null
                  ? "첫 기록"
                  : `직전 대비 ${formatSigned(latestValue - previousValue, series.unit)}`}
              </small>
            </button>
          );
        })}
      </div>

      <div className="coach-trend-detail" data-trend-detail="true">
        <div>
          <span className="coach-section-label">선택한 체크인</span>
          <strong>{activePoint.label}</strong>
        </div>
        <p>
          체중 {activePoint.weightKg.toFixed(1)}kg · 골격근량{" "}
          {activePoint.skeletalMuscleKg.toFixed(1)}kg · 체지방률{" "}
          {activePoint.bodyFatPercent.toFixed(1)}%
        </p>
      </div>

      <div className="coach-trend-canvas">
        <div className="coach-trend-range">
          <span>
            {activeGeometry.max.toFixed(1)}
            {activeSeries.unit}
          </span>
          <span>
            {activeGeometry.min.toFixed(1)}
            {activeSeries.unit}
          </span>
        </div>

        <svg aria-label="4주 추이 차트" viewBox="0 0 100 100" preserveAspectRatio="none">
          {seriesGeometries.map((geometry) => {
            const series = TREND_SERIES.find((entry) => entry.key === geometry.key);
            const isActive = geometry.key === activeSeries.key;

            return (
              <g
                className={`coach-trend-series ${isActive ? "coach-trend-series-active" : ""}`}
                key={geometry.key}
              >
                <polyline
                  className={`coach-trend-line ${series?.lineClassName ?? ""}`}
                  fill="none"
                  points={geometry.points}
                />
                {geometry.circles.map((circle, index) => (
                  <circle
                    className={`coach-trend-dot ${series?.lineClassName ?? ""}`}
                    cx={circle.x}
                    cy={circle.y}
                    key={`${geometry.key}-${points[index]?.label ?? index}`}
                    r={index === activeIndex && isActive ? 2.5 : 1.6}
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="coach-trend-labels">
        {points.map((point, index) => (
          <button
            className={`coach-trend-label-button ${index === activeIndex ? "coach-trend-label-button-active" : ""}`}
            data-trend-point={point.label}
            key={point.label}
            onClick={() => setActivePointIndex(index)}
            type="button"
          >
            {point.label}
          </button>
        ))}
      </div>

      <p className="coach-muted">
        각 지표는 최근 4회 기준으로 개별 스케일 정규화되어 방향성을 더 읽기 쉽게 보여줍니다.
      </p>
    </div>
  );
}
