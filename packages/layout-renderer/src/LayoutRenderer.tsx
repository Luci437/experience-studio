import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Widget, Breakpoints } from '@repo/types';
import { WidgetRenderer } from '@repo/widgets';
import { RGL_BREAKPOINTS, RGL_COLS, RGL_ROW_HEIGHT } from './constants';

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface LayoutRendererProps {
  widgets: Widget[];
  breakpoints: Breakpoints;
  breakpoint?: 'lg' | 'md' | 'sm';
  className?: string;
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  widgets,
  breakpoints,
  breakpoint,
  className = '',
}) => {
  const rglLayouts = {
    lg: (breakpoints?.lg || []).map((l) => ({ ...l })),
    md: (breakpoints?.md || []).map((l) => ({ ...l })),
    sm: (breakpoints?.sm || []).map((l) => ({ ...l })),
  };

  const currentBp = breakpoint || 'lg';
  const currentBpItems = (breakpoints && breakpoints[currentBp]) || breakpoints?.lg || [];

  return (
    <div className={`w-full min-h-full ${className}`}>
      <ResponsiveGridLayout
        className="layout"
        layouts={rglLayouts}
        breakpoint={breakpoint}
        breakpoints={RGL_BREAKPOINTS}
        cols={RGL_COLS}
        rowHeight={RGL_ROW_HEIGHT}
        compactType="vertical"
        preventCollision={false}
        isDraggable={false}
        isResizable={false}
        isDroppable={false}
        onLayoutChange={() => {}}
      >
        {widgets.map((widget) => {
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
              className="rounded-lg overflow-hidden"
            >
              <WidgetRenderer widget={widget} isEditing={false} />
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};
