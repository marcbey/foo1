"use client";

import {
  Bar,
  Doughnut,
  Line,
  Pie,
  Radar,
} from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

export type ChartId = "latency" | "usage" | "region" | "health" | "reliability";

type ChartPreset = {
  id: ChartId;
  label: string;
  summary: string;
  render: (heightClass?: string) => React.ReactNode;
};

const sharedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom" as const,
      labels: { boxWidth: 12, boxHeight: 12, color: "#334155" },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      titleColor: "#e2e8f0",
      bodyColor: "#cbd5e1",
      borderColor: "#1e293b",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { display: false, drawBorder: false },
      ticks: { color: "#475569", font: { size: 11 } },
    },
    y: {
      grid: { color: "rgba(148, 163, 184, 0.25)", drawBorder: false },
      ticks: { color: "#475569", font: { size: 11 }, beginAtZero: true },
    },
  },
};

const palette = [
  "#6366F1",
  "#22C55E",
  "#F97316",
  "#EC4899",
  "#14B8A6",
  "#0EA5E9",
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const latencyData = {
  labels: months,
  datasets: [
    {
      label: "API Latency (ms)",
      data: [120, 130, 110, 140, 125, 118, 112, 119],
      borderColor: palette[0],
      backgroundColor: "rgba(99, 102, 241, 0.18)",
      fill: true,
      tension: 0.35,
      pointRadius: 3,
    },
    {
      label: "P95 (ms)",
      data: [220, 240, 210, 260, 230, 215, 205, 218],
      borderColor: palette[2],
      backgroundColor: "rgba(249, 115, 22, 0.18)",
      fill: true,
      tension: 0.35,
      pointRadius: 3,
    },
  ],
};

const usageData = {
  labels: months,
  datasets: [
    {
      label: "Active Users (k)",
      data: [32, 36, 34, 39, 42, 46, 45, 49],
      backgroundColor: palette[1],
      borderRadius: 8,
      maxBarThickness: 24,
    },
    {
      label: "New Users (k)",
      data: [8, 9, 7, 9, 10, 11, 10, 12],
      backgroundColor: palette[5],
      borderRadius: 8,
      maxBarThickness: 24,
    },
  ],
};

const regionData = {
  labels: ["North America", "Europe", "APAC", "LATAM"],
  datasets: [
    {
      data: [38, 27, 25, 10],
      backgroundColor: palette,
      borderWidth: 0,
    },
  ],
};

const healthData = {
  labels: ["Passed", "Warn", "Failed"],
  datasets: [
    {
      data: [68, 22, 10],
      backgroundColor: [palette[1], palette[2], "#ef4444"],
      borderWidth: 0,
    },
  ],
};

const reliabilityData = {
  labels: ["Throughput", "Latency", "Cost", "Coverage", "Stability"],
  datasets: [
    {
      label: "Current",
      data: [78, 64, 58, 80, 72],
      backgroundColor: "rgba(99, 102, 241, 0.25)",
      borderColor: palette[0],
      pointBackgroundColor: palette[0],
      pointRadius: 3,
    },
    {
      label: "Target",
      data: [88, 78, 70, 85, 82],
      backgroundColor: "rgba(14, 165, 233, 0.18)",
      borderColor: palette[5],
      pointBackgroundColor: palette[5],
      pointRadius: 3,
    },
  ],
};

export const chartPresets: ChartPreset[] = [
  {
    id: "latency",
    label: "Latency trend",
    summary: "Latency and P95 view",
    render: (heightClass = "h-64") => (
      <div className={heightClass}>
        <Line data={latencyData} options={sharedOptions} />
      </div>
    ),
  },
  {
    id: "usage",
    label: "Usage growth",
    summary: "Active and new users",
    render: (heightClass = "h-64") => (
      <div className={heightClass}>
        <Bar data={usageData} options={sharedOptions} />
      </div>
    ),
  },
  {
    id: "region",
    label: "Regional mix",
    summary: "Traffic by region",
    render: (heightClass = "h-64") => (
      <div className={heightClass}>
        <Doughnut
          data={regionData}
          options={{
            ...sharedOptions,
            cutout: "65%",
            plugins: {
              ...sharedOptions.plugins,
              legend: { display: true, position: "bottom" },
            },
          }}
        />
      </div>
    ),
  },
  {
    id: "health",
    label: "Health status",
    summary: "Pass / warn / fail",
    render: (heightClass = "h-64") => (
      <div className={heightClass}>
        <Pie
          data={healthData}
          options={{
            ...sharedOptions,
            plugins: { ...sharedOptions.plugins, legend: { position: "bottom" } },
            scales: {},
          }}
        />
      </div>
    ),
  },
  {
    id: "reliability",
    label: "Reliability radar",
    summary: "Reliability dimensions",
    render: (heightClass = "h-64") => (
      <div className={heightClass}>
        <Radar
          data={reliabilityData}
          options={{
            ...sharedOptions,
            scales: {
              r: {
                angleLines: { color: "rgba(148, 163, 184, 0.25)" },
                grid: { color: "rgba(148, 163, 184, 0.25)" },
                pointLabels: { color: "#475569", font: { size: 11 } },
                ticks: {
                  display: false,
                  maxTicksLimit: 4,
                },
              },
            },
          }}
        />
      </div>
    ),
  },
];

export function ChartPreview({
  presetId,
  heightClass = "h-64",
}: {
  presetId: ChartId;
  heightClass?: string;
}) {
  const preset = chartPresets.find((p) => p.id === presetId);
  if (!preset) return null;
  return preset.render(heightClass) as JSX.Element;
}
