"use client";

import { useMemo } from "react";
import { chartPresets, type ChartId } from "./chartRegistry";

type Props = {
  widgetsInUse: ChartId[];
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onAddWidget: (chartId: ChartId) => void;
  onReset: () => void;
  onSave: () => void;
  saveFlash: boolean;
  resetFlash: boolean;
  selectedChartId?: ChartId | null;
  onExitDetail?: () => void;
};

export default function DashboardControls({
  widgetsInUse,
  isMenuOpen,
  onToggleMenu,
  onAddWidget,
  onReset,
  onSave,
  saveFlash,
  resetFlash,
  selectedChartId,
  onExitDetail,
}: Props) {
  const usedSet = useMemo(() => new Set(widgetsInUse), [widgetsInUse]);

  if (selectedChartId && onExitDetail) {
    const preset = chartPresets.find((p) => p.id === selectedChartId);
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <button
            type="button"
            onClick={onExitDetail}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-100"
          >
            ← Dashboard
          </button>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-900">
            {preset?.label ?? "Detail"}
          </span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Chart focus
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Interactive dashboard
        </p>
        <h2 className="text-xl font-semibold text-slate-900">
          Drag, drop, and resize widgets
        </h2>
        <p className="mt-1 text-slate-600">
          Powered by gridstack.js, ready for dynamic React-driven dashboards.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
            type="button"
            onClick={onToggleMenu}
          >
            + Add widget
            <span className="text-slate-500">▾</span>
          </button>
          {isMenuOpen ? (
            <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
              {chartPresets.map((preset) => {
                const isUsed = usedSet.has(preset.id);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition ${
                      isUsed
                        ? "cursor-not-allowed bg-slate-50 text-slate-400"
                        : "text-slate-800 hover:bg-slate-100"
                    }`}
                    onClick={() => !isUsed && onAddWidget(preset.id)}
                    disabled={isUsed}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold uppercase text-slate-600">
                      {preset.label.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {preset.label}
                      </p>
                      <p className="text-xs text-slate-600">
                        {isUsed ? "Already on dashboard" : preset.summary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className={`rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 ${
            resetFlash ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white" : ""
          }`}
          onClick={onReset}
        >
          Reset Dashboard
        </button>
        <button
          type="button"
          className={`rounded-lg border border-slate-200 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 ${
            saveFlash ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-white" : ""
          }`}
          onClick={onSave}
        >
          Save Dashboard
        </button>
      </div>
    </div>
  );
}
