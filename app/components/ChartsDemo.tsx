"use client";

import { ChartPreview, chartPresets } from "./chartRegistry";

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
        {chartPresets.map((preset) => (
          <div
            key={preset.id}
            className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${
              preset.id === "reliability" ? "md:col-span-2 xl:col-span-1" : ""
            }`}
          >
            <h3 className="text-sm font-semibold text-slate-900">
              {preset.label}
            </h3>
            <p className="text-xs text-slate-500">{preset.summary}</p>
            <div className="mt-2">
              <ChartPreview presetId={preset.id} heightClass="h-64" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
