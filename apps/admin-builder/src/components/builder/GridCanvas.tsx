import React, { useState, useEffect, useRef } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { Trash2 } from 'lucide-react';
import type { Widget, Breakpoints, LayoutItem, WidgetType, ChartType } from '@repo/types';
import { WidgetRenderer } from '@repo/widgets';
import { RGL_BREAKPOINTS, RGL_COLS, RGL_ROW_HEIGHT } from '@repo/layout-renderer';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridCanvasProps {
  widgets: Widget[];
  breakpoints: Breakpoints;
  onLayoutChange: (layouts: Breakpoints) => void;
  onWidgetSelect: (widgetId: string) => void;
  onWidgetDelete: (widgetId: string) => void;
  onDropWidget: (type: WidgetType, layoutItem: LayoutItem, subType?: ChartType) => void;
  selectedWidgetId: string | null;
  isPreview?: boolean;
  breakpoint?: 'lg' | 'md' | 'sm';
}

export const GridCanvas: React.FC<GridCanvasProps> = ({
  widgets,
  breakpoints,
  onLayoutChange,
  onWidgetSelect,
  onWidgetDelete,
  onDropWidget,
  selectedWidgetId,
  isPreview = false,
  breakpoint: explicitBreakpoint,
}) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<'lg' | 'md' | 'sm'>(
    explicitBreakpoint || 'lg'
  );

  const breakpointsRef = useRef<Breakpoints>(breakpoints);
  useEffect(() => {
    breakpointsRef.current = breakpoints;
  }, [breakpoints]);

  useEffect(() => {
    if (explicitBreakpoint) {
      setActiveBreakpoint(explicitBreakpoint);
    }
  }, [explicitBreakpoint]);

  // Ensure each breakpoint has valid arrays
  const rglLayouts = {
    lg: (breakpoints.lg || []).map((l) => ({ ...l })),
    md: (breakpoints.md || []).map((l) => ({ ...l })),
    sm: (breakpoints.sm || []).map((l) => ({ ...l })),
  };

  const handleBreakpointChange = (newBreakpoint: string) => {
    if (newBreakpoint === 'lg' || newBreakpoint === 'md' || newBreakpoint === 'sm') {
      setActiveBreakpoint(newBreakpoint);
    }
  };

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    if (isPreview) return;

    const currentBp = explicitBreakpoint || activeBreakpoint || 'lg';

    const mapLayoutItem = (l: Layout): LayoutItem => ({
      i: l.i,
      x: l.x,
      y: l.y,
      w: l.w,
      h: l.h,
      minW: l.minW,
      minH: l.minH,
    });

    const activeList = (currentLayout || allLayouts[currentBp] || [])
      .filter((l) => l.i !== '__dropping-elem__')
      .map(mapLayoutItem);

    const prev = breakpointsRef.current;
    const prevLgMap = new Map((prev.lg || []).map((item) => [item.i, item]));
    const prevMdMap = new Map((prev.md || []).map((item) => [item.i, item]));
    const prevSmMap = new Map((prev.sm || []).map((item) => [item.i, item]));

    // Synchronize the moved/resized items across all breakpoints
    let nextLg: LayoutItem[] = [];
    let nextMd: LayoutItem[] = [];
    let nextSm: LayoutItem[] = [];

    if (currentBp === 'lg') {
      nextLg = activeList;
      nextMd = activeList.map((item) => {
        const existing = prevMdMap.get(item.i);
        const w = Math.min(item.w, 8);
        const x = Math.min(existing?.x ?? item.x, 8 - w);
        return {
          i: item.i,
          x: Math.max(0, x),
          y: item.y,
          w,
          h: item.h,
          minW: item.minW,
          minH: item.minH,
        };
      });
      nextSm = activeList.map((item) => ({
        i: item.i,
        x: 0,
        y: item.y,
        w: 4,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
      }));
    } else if (currentBp === 'md') {
      nextMd = activeList;
      nextLg = activeList.map((item) => {
        const existing = prevLgMap.get(item.i);
        return {
          i: item.i,
          x: existing ? existing.x : item.x,
          y: item.y,
          w: existing ? existing.w : Math.min(item.w, 12),
          h: item.h,
          minW: item.minW,
          minH: item.minH,
        };
      });
      nextSm = activeList.map((item) => ({
        i: item.i,
        x: 0,
        y: item.y,
        w: 4,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
      }));
    } else {
      nextSm = activeList;
      nextLg = activeList.map((item) => {
        const existing = prevLgMap.get(item.i);
        return {
          i: item.i,
          x: existing ? existing.x : 0,
          y: item.y,
          w: existing ? existing.w : 6,
          h: item.h,
          minW: item.minW,
          minH: item.minH,
        };
      });
      nextMd = activeList.map((item) => {
        const existing = prevMdMap.get(item.i);
        return {
          i: item.i,
          x: existing ? existing.x : 0,
          y: item.y,
          w: existing ? existing.w : 4,
          h: item.h,
          minW: item.minW,
          minH: item.minH,
        };
      });
    }

    onLayoutChange({ lg: nextLg, md: nextMd, sm: nextSm });
  };

  const handleDrop = (_layout: Layout[], layoutItem: Layout, event: DragEvent) => {
    let type: WidgetType = 'chart';
    let subType: ChartType | undefined;
    try {
      const raw =
        event.dataTransfer?.getData('application/json') ||
        event.dataTransfer?.getData('text/plain');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.type) type = parsed.type;
        if (parsed.subType) subType = parsed.subType;
      }
    } catch {
      // Fallback
    }

    onDropWidget(
      type,
      {
        i: layoutItem.i,
        x: layoutItem.x,
        y: layoutItem.y,
        w: layoutItem.w || 4,
        h: layoutItem.h || 4,
      },
      subType
    );
  };

  const currentBpForDataGrid = explicitBreakpoint || activeBreakpoint || 'lg';
  const currentBpItems = breakpoints[currentBpForDataGrid] || breakpoints.lg || [];

  return (
    <div className={`w-full min-h-full ${isPreview ? 'bg-transparent' : 'canvas-dot-grid p-6'} relative`}>
      {widgets.length === 0 && !isPreview && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none select-none text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
            <span className="text-blue-500 font-bold text-2xl">+</span>
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">Canvas is empty</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Drag widgets from the left component panel onto this grid, or click the + button next to any widget to place it here.
          </p>
        </div>
      )}

      <ResponsiveGridLayout
        className="layout"
        layouts={rglLayouts}
        breakpoint={explicitBreakpoint}
        breakpoints={RGL_BREAKPOINTS}
        cols={RGL_COLS}
        rowHeight={RGL_ROW_HEIGHT}
        compactType="vertical"
        preventCollision={false}
        isDroppable={!isPreview}
        isDraggable={!isPreview}
        isResizable={!isPreview}
        draggableCancel=".no-drag"
        droppingItem={{ i: '__dropping-elem__', w: 4, h: 4 }}
        onBreakpointChange={handleBreakpointChange}
        onLayoutChange={handleLayoutChange}
        onDrop={handleDrop}
      >
        {widgets.map((widget) => {
          const isSelected = selectedWidgetId === widget.i;
          const layoutItem = currentBpItems.find((item) => item.i === widget.i);

          return (
            <div
              key={widget.i}
              data-grid={
                layoutItem
                  ? {
                      i: layoutItem.i,
                      x: layoutItem.x,
                      y: layoutItem.y,
                      w: layoutItem.w,
                      h: layoutItem.h,
                      minW: layoutItem.minW,
                      minH: layoutItem.minH,
                    }
                  : undefined
              }
              onClick={() => {
                if (!isPreview) {
                  onWidgetSelect(widget.i);
                }
              }}
              className={`group transition-shadow duration-150 rounded-lg relative ${
                !isPreview ? 'cursor-move' : ''
              } ${
                isSelected && !isPreview
                  ? 'ring-2 ring-blue-600 shadow-md'
                  : 'hover:shadow-md'
              }`}
            >
              {!isPreview && (
                <div className="absolute top-2 right-2 z-20 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onWidgetDelete(widget.i);
                    }}
                    className="no-drag p-1 rounded-md bg-white/90 hover:bg-rose-600 hover:text-white text-gray-400 shadow-sm border border-gray-200 transition"
                    title="Delete widget"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <WidgetRenderer widget={widget} isEditing={!isPreview} />
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};
