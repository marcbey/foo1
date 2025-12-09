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

const initialWidgets: DemoWidget[] = [
  {
    id: "announcements",
    x: 0,
    y: 0,
    w: 4,
    h: 4,
    minW: 4,
    minH: 4,
    title: "Latency trend",
    chartId: "latency",
    body: "Latency and P95 over time.",
  },
  {
    id: "metrics",
    x: 4,
    y: 0,
    w: 4,
    h: 4,
    minW: 4,
    minH: 4,
    title: "Usage growth",
    chartId: "usage",
    body: "Active vs new user growth.",
  },
  {
    id: "timeline",
    x: 8,
    y: 0,
    w: 4,
    h: 4,
    minW: 4,
    minH: 4,
    title: "Regional mix",
    chartId: "region",
    body: "Traffic split across regions.",
  },
  {
    id: "tasks",
    x: 0,
    y: 4,
    w: 4,
    h: 4,
    minW: 4,
    minH: 4,
    title: "Reliability radar",
    chartId: "reliability",
    body: "Reliability signals against targets.",
  },
];

export default function GridStackDemo() {
  const [widgets, setWidgets] = useState<DemoWidget[]>(initialWidgets);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const gridInstance = useRef<GridStackCore | null>(null);
  const newId = useRef<number>(0);

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
      gridInstance.current = undefined;
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

  const addWidget = (chartId: ChartId) => {
    const preset = chartPresets.find((p) => p.id === chartId);
    const id = `widget-${newId.current++}`;
    setWidgets((prev) => [
      ...prev,
      {
        id,
        x: 0,
        y: 0,
        w: 4,
        h: 4,
        minW: 4,
        minH: 4,
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
              {chartPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm text-slate-800 transition hover:bg-slate-100"
                  onClick={() => addWidget(preset.id)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold uppercase text-slate-600">
                    {preset.label.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {preset.label}
                    </p>
                    <p className="text-xs text-slate-600">{preset.summary}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
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
              "gs-min-w": item.minW ?? 4,
              "gs-min-h": item.minH ?? 4,
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
              <div className="mt-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Live widget
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
