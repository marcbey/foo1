"use client";

import { useEffect, useRef, useState } from "react";
import { GridStack as GridStackCore, type GridStackWidget } from "gridstack";
import { ChartPreview, chartPresets, type ChartId } from "./chartRegistry";
import DashboardControls from "./DashboardControls";
import {
  STORAGE_KEY,
  initialWidgets,
  loadSavedWidgets,
  serializeLayout,
  type WidgetConfig,
} from "../lib/dashboard";

export default function GridStackDemo() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(
    () => loadSavedWidgets() ?? initialWidgets
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);
  const [resetFlash, setResetFlash] = useState(false);
  const [detailChartId, setDetailChartId] = useState<ChartId | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const gridInstance = useRef<GridStackCore | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const updateGridHeight = () => {
    const instance = gridInstance.current as
      | (GridStackCore & { _updateContainerHeight?: () => void })
      | null;
    instance?._updateContainerHeight?.();
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
      const widgetEl = el as HTMLElement & { gridstackNode?: unknown };
      if (!widgetEl.gridstackNode) {
        gridInstance.current?.makeWidget(widgetEl);
      }
    });
    gridInstance.current.commit();
    updateGridHeight();
  }, [widgets]);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  const buildWidgetId = (chartId: string) => chartId;

  const addWidget = (chartId: string) => {
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
        chartId: chartId as ChartId,
      },
    ]);
    setIsMenuOpen(false);
  };

  const removeWidget = (id: string) => {
    const el = gridRef.current?.querySelector<HTMLElement>(
      `[data-widget-id="${id}"]`
    );
    if (el && gridInstance.current) {
      gridInstance.current.removeWidget(el, false, false);
    }
    setWidgets((prev) => prev.filter((item) => item.id !== id));
    updateGridHeight();
  };

  return (
    <div className="space-y-4">
      <DashboardControls
        widgetsInUse={widgets.map((w) => w.chartId).filter(Boolean) as ChartId[]}
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((open) => !open)}
        onAddWidget={addWidget}
        onReset={() => {
          if (gridInstance.current) {
            gridInstance.current.removeAll(false);
          }
          setWidgets(initialWidgets);
          localStorage.removeItem(STORAGE_KEY);
          setIsMenuOpen(false);
          setDetailChartId(null);
          setResetFlash(true);
          if (saveTimeout.current) clearTimeout(saveTimeout.current);
          saveTimeout.current = setTimeout(() => setResetFlash(false), 1000);
        }}
        onSave={() => {
          const grid = gridInstance.current;
          if (!grid) return;
          const layout = grid.save(false);
          const nodes: GridStackWidget[] = Array.isArray(layout) ? layout : [];
          const serialized = serializeLayout(nodes, widgets);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
          setSaveFlash(true);
          if (saveTimeout.current) clearTimeout(saveTimeout.current);
          saveTimeout.current = setTimeout(() => setSaveFlash(false), 1000);
        }}
        saveFlash={saveFlash}
        resetFlash={resetFlash}
        selectedChartId={detailChartId}
        onExitDetail={() => setDetailChartId(null)}
      />

      {detailChartId ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Chart detail
              </p>
              <h3 className="text-xl font-semibold text-slate-900">
                {chartPresets.find((p) => p.id === detailChartId)?.label ??
                  "Selected chart"}
              </h3>
            </div>
          </div>
          <div className="mt-4 h-[520px] rounded-lg border border-slate-100 bg-slate-50 p-4">
            <ChartPreview presetId={detailChartId} heightClass="h-full" />
          </div>
        </div>
      ) : null}

      <div
        className={`grid-stack rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${
          detailChartId ? "hidden" : ""
        }`}
        ref={gridRef}
      >
        {widgets.map((item) => (
          <div
            key={item.id}
            className="grid-stack-item"
            {...(() => {
              const attrs: Record<string, string | number> = {
                "gs-id": item.id,
                "gs-x": item.x,
                "gs-y": item.y,
                "gs-w": item.w,
                "gs-h": item.h,
                "gs-min-w": item.minW ?? 3,
                "gs-min-h": item.minH ?? 3,
              };
              const autoPosition = item.x === undefined || item.y === undefined;
              if (autoPosition) {
                attrs["gs-auto-position"] = "true";
              }
              return attrs;
            })()}
            data-widget-id={item.id}
          >
            <div className="group relative grid-stack-item-content flex flex-col rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition hover:shadow">
              <div className="flex items-start justify-between gap-2 pr-6">
                <p className="text-sm font-semibold text-slate-900">
                  {item.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeWidget(item.id)}
                aria-label="Remove widget"
                className="absolute right-2 top-2 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-semibold text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800 group-hover:flex"
              >
                ✕
              </button>
              {item.body ? (
                <p className="mt-1 text-sm text-slate-600">{item.body}</p>
              ) : null}
              {item.chartId ? (
                <button
                  type="button"
                  onClick={() => setDetailChartId(item.chartId as ChartId)}
                  className="mt-3 h-56 rounded-md border border-slate-200 bg-white/60 p-1 transition hover:border-slate-300"
                >
                  <ChartPreview presetId={item.chartId} heightClass="h-full" />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
