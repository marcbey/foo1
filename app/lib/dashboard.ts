import { chartPresets, type ChartId } from "../components/chartRegistry";

export type WidgetConfig = {
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

export type SavedWidget = WidgetConfig;

export const STORAGE_KEY = "dashboard:layout";

export const initialWidgets: WidgetConfig[] = [
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

export const loadSavedWidgets = (): WidgetConfig[] | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw) as SavedWidget[];
    const seen = new Set<string>();
    const valid = saved
      .filter((w) => w.chartId && chartPresets.some((p) => p.id === w.chartId))
      .filter((w) => {
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

export const serializeLayout = (
  nodes: { id?: string; x?: number; y?: number; w?: number; h?: number; minW?: number; minH?: number }[],
  widgets: WidgetConfig[]
): SavedWidget[] => {
  const seen = new Set<string>();
  return nodes
    .map((node) => {
      const widget = widgets.find((w) => w.id === node.id);
      const chartId = widget?.chartId ?? (node.id as ChartId | undefined);
      if (!chartId || seen.has(chartId)) return null;
      seen.add(chartId);
      return {
        id: node.id as string,
        chartId,
        title: widget?.title ?? (node.id as string),
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
};
