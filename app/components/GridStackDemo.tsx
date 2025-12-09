"use client";

import { useEffect, useRef, useState } from "react";
import { GridStack as GridStackCore } from "gridstack";

type DemoWidget = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  body: string;
};

const initialWidgets: DemoWidget[] = [
  {
    id: "announcements",
    x: 0,
    y: 0,
    w: 4,
    h: 2,
    title: "Announcements",
    body: "Team sync today at 2:00 PM. Add notes from last sprint review.",
  },
  {
    id: "metrics",
    x: 4,
    y: 0,
    w: 4,
    h: 2,
    title: "Metrics",
    body: "Weekly active users up 8%. Keep an eye on latency spikes in EU.",
  },
  {
    id: "timeline",
    x: 8,
    y: 0,
    w: 4,
    h: 2,
    title: "Timeline",
    body: "Release candidate build is scheduled for Friday. QA signoff pending.",
  },
  {
    id: "tasks",
    x: 0,
    y: 2,
    w: 6,
    h: 2,
    title: "Tasks",
    body: "Track ownership and unblockers for the dashboard release train.",
  },
];

export default function GridStackDemo() {
  const [widgets, setWidgets] = useState<DemoWidget[]>(initialWidgets);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const gridInstance = useRef<GridStackCore>();
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
        resizable: { handles: "all" },
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

  const addWidget = () => {
    const id = `widget-${newId.current++}`;
    setWidgets((prev) => [
      ...prev,
      {
        id,
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        title: `Widget ${prev.length + 1}`,
        body: "New draggable and resizable panel.",
      },
    ]);
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
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <button
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
            type="button"
            onClick={addWidget}
          >
            + Add widget
          </button>
          <span className="hidden h-9 items-center rounded-full border border-slate-200 px-3 sm:inline-flex">
            Drag to move
          </span>
          <span className="hidden h-9 items-center rounded-full border border-slate-200 px-3 sm:inline-flex">
            Resize from corners
          </span>
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
                  Remove
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.body}</p>
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
