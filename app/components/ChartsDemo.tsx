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

const sharedOptions = {
  responsive: true,
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

const lineData = {
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

const barData = {
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

const doughnutData = {
  labels: ["North America", "Europe", "APAC", "LATAM"],
  datasets: [
    {
      data: [38, 27, 25, 10],
      backgroundColor: palette,
      borderWidth: 0,
    },
  ],
};

const pieData = {
  labels: ["Passed", "Warn", "Failed"],
  datasets: [
    {
      data: [68, 22, 10],
      backgroundColor: [palette[1], palette[2], "#ef4444"],
      borderWidth: 0,
    },
  ],
};

const radarData = {
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

export default function ChartsDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Monitoring charts
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            Live-ready chart gallery
          </h2>
          <p className="mt-1 text-slate-600">
            Chart.js via react-chartjs-2. Swap in real metrics to power these visualizations.
          </p>
        </div>
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Demo data
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Latency trend</h3>
          <Line data={lineData} options={sharedOptions} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Usage growth</h3>
          <Bar data={barData} options={sharedOptions} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Regional mix</h3>
          <Doughnut
            data={doughnutData}
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

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Health status</h3>
          <Pie
            data={pieData}
            options={{
              ...sharedOptions,
              plugins: { ...sharedOptions.plugins, legend: { position: "bottom" } },
              scales: {},
            }}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2 xl:col-span-1">
          <h3 className="text-sm font-semibold text-slate-900">Reliability radar</h3>
          <Radar
            data={radarData}
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
      </div>
    </div>
  );
}
