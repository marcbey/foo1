"use client";

import { useEffect, useRef, useState } from "react";
import { GridStack as GridStackCore } from "gridstack";
import { ChartId, ChartPreview, chartPresets } from "./chartRegistry";

type DemoWidget = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  title: string;
  body?: string;
  chartId?: ChartId;
};

type SavedWidget = DemoWidget;

const STORAGE_KEY = "dashboard:layout";

const loadSavedWidgets = (): DemoWidget[] | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw) as SavedWidget[];
    const seen = new Set<string>();
    const valid = saved.filter(
      (w) => w.chartId && chartPresets.some((p) => p.id === w.chartId)
    ).filter((w) => {
      const key = w.chartId as string;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (!valid.length) return null;
    return valid.map((w) => ({
      ...w,
      id: w.chartId as string,
      minW: w.minW ?? 3,
      minH: w.minH ?? 3,
      w: w.w ?? 3,
      h: w.h ?? 3,
      x: w.x ?? 0,
      y: w.y ?? 0,
    }));
  } catch (error) {
    console.warn("Failed to load saved dashboard layout", error);
    return null;
  }
};

const initialWidgets: DemoWidget[] = [
  {
    id: "latency",
    x: 0,
    y: 0,
    w: 3,
    h: 3,
    minW: 3,
    minH: 3,
    title: "Latency trend",
    chartId: "latency",
    body: "Latency and P95 over time.",
  },
  {
    id: "usage",
    x: 3,
    y: 0,
    w: 3,
    h: 3,
    minW: 3,
    minH: 3,
    title: "Usage growth",
    chartId: "usage",
    body: "Active vs new user growth.",
  },
  {
    id: "region",
    x: 6,
    y: 0,
    w: 3,
    h: 6,
    minW: 3,
    minH: 3,
    title: "Regional mix",
    chartId: "region",
    body: "Traffic split across regions.",
  },
];

export default function GridStackDemo() {
  const [widgets, setWidgets] = useState<DemoWidget[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);
  const [resetFlash, setResetFlash] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const gridInstance = useRef<GridStackCore | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const updateGridHeight = () => {
    if (gridInstance.current && (gridInstance.current as any)._updateContainerHeight) {
      (gridInstance.current as any)._updateContainerHeight();
    }
  };

  useEffect(() => {
    if (!gridRef.current || gridInstance.current) return;

    const grid = GridStackCore.init(
      {
        float: true,
        cellHeight: "auto",
        margin: 12,
        resizable: { handles: "se" },
        draggable: { handle: ".grid-stack-item-content" },
      },
      gridRef.current
    );

    grid.margin(12);
    gridInstance.current = grid;
    updateGridHeight();

    return () => {
      gridInstance.current?.destroy(false);
      gridInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!gridRef.current || !gridInstance.current) return;

    const elements = Array.from(
      gridRef.current.querySelectorAll<HTMLElement>(".grid-stack-item")
    );

    gridInstance.current.batchUpdate();
    elements.forEach((el) => {
      if (!(el as any).gridstackNode) {
        gridInstance.current?.makeWidget(el);
      }
    });
    gridInstance.current.commit();
    updateGridHeight();
  }, [widgets]);

  useEffect(() => {
    const saved = loadSavedWidgets();
    setWidgets(saved && saved.length ? saved : initialWidgets);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  const buildWidgetId = (chartId: ChartId) => chartId;

  const addWidget = (chartId: ChartId) => {
    if (widgets.some((w) => w.chartId === chartId)) {
      setIsMenuOpen(false);
      return;
    }
    const preset = chartPresets.find((p) => p.id === chartId);
    const id = buildWidgetId(chartId);
    setWidgets((prev) => [
      ...prev,
      {
        id,
        x: 0,
        y: 0,
        w: 3,
        h: 3,
        minW: 3,
        minH: 3,
        title: preset?.label ?? `Widget ${prev.length + 1}`,
        body: preset?.summary ?? "New draggable and resizable panel.",
        chartId,
      },
    ]);
    setIsMenuOpen(false);
  };

  const removeWidget = (id: string) => {
    const el = gridRef.current?.querySelector<HTMLElement>(
      `[data-widget-id="${id}"]`
    );
    if (el && gridInstance.current) {
      // Let React handle DOM removal; only detach from Gridstack.
      gridInstance.current.removeWidget(el, false, false);
    }
    setWidgets((prev) => prev.filter((item) => item.id !== id));
    updateGridHeight();
  };

  return (
    <div className="space-y-4">
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
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              + Add widget
              <span className="text-slate-500">▾</span>
            </button>
            {isMenuOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                {chartPresets.map((preset) => {
                  const isUsed = widgets.some((w) => w.chartId === preset.id);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className={`flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition ${
                        isUsed
                          ? "cursor-not-allowed bg-slate-50 text-slate-400"
                          : "text-slate-800 hover:bg-slate-100"
                      }`}
                      onClick={() => !isUsed && addWidget(preset.id)}
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
            onClick={() => {
              if (gridInstance.current) {
                gridInstance.current.removeAll(false);
              }
              setWidgets([]);
              localStorage.removeItem(STORAGE_KEY);
              setIsMenuOpen(false);
              setResetFlash(true);
              if (saveTimeout.current) clearTimeout(saveTimeout.current);
              saveTimeout.current = setTimeout(() => setResetFlash(false), 1000);
            }}
          >
            Reset Dashboard
          </button>
          <button
            type="button"
            className={`rounded-lg border border-slate-200 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 ${
              saveFlash ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-white" : ""
            }`}
          onClick={() => {
            const grid = gridInstance.current;
            if (!grid) return;
            const layout = grid.save(false) || [];
            const seen = new Set<string>();
            const serialized: SavedWidget[] = layout
              .map((node: any) => {
                const widget = widgets.find((w) => w.id === node.id);
                const chartId = widget?.chartId ?? (node.id as ChartId | undefined);
                if (!chartId) return null;
                if (seen.has(chartId)) return null;
                seen.add(chartId);
                return {
                  id: node.id,
                  chartId,
                  title: widget?.title ?? node.id,
                  body: widget?.body,
                    x: node.x ?? 0,
                    y: node.y ?? 0,
                  w: node.w ?? 3,
                  h: node.h ?? 3,
                  minW: node.minW ?? widget?.minW ?? 3,
                  minH: node.minH ?? widget?.minH ?? 3,
                } as SavedWidget;
              })
                .filter(Boolean) as SavedWidget[];

              localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
              console.log("Dashboard layout saved", serialized);

              setSaveFlash(true);
              if (saveTimeout.current) clearTimeout(saveTimeout.current);
              saveTimeout.current = setTimeout(() => setSaveFlash(false), 1000);
            }}
          >
            Save Dashboard
          </button>
        </div>
      </div>

      <div
        className="grid-stack rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        ref={gridRef}
      >
        {widgets.map((item) => (
          <div
            key={item.id}
            className="grid-stack-item"
            {...{
              "gs-id": item.id,
              "gs-x": item.x,
              "gs-y": item.y,
              "gs-w": item.w,
              "gs-h": item.h,
              "gs-min-w": item.minW ?? 3,
              "gs-min-h": item.minH ?? 3,
              "gs-auto-position": "true",
            }}
            data-widget-id={item.id}
          >
            <div className="grid-stack-item-content flex flex-col rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition hover:shadow">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {item.title}
                </p>
                <button
                  type="button"
                  onClick={() => removeWidget(item.id)}
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 hover:text-slate-800"
                >
                  x
                </button>
              </div>
              {item.body ? (
                <p className="mt-1 text-sm text-slate-600">{item.body}</p>
              ) : null}
              {item.chartId ? (
                <div className="mt-3 h-56">
                  <ChartPreview presetId={item.chartId} heightClass="h-full" />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
