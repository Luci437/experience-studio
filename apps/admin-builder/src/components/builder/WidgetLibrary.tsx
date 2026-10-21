import React from 'react';
import {
  BarChart2,
  LineChart,
  PieChart,
  Table,
  CreditCard,
  Type,
  Image as ImageIcon,
  MousePointerClick,
  Plus,
} from 'lucide-react';
import type { WidgetType, ChartType } from '@repo/types';

export interface WidgetLibraryItem {
  id: string;
  type: WidgetType;
  subType?: ChartType;
  title: string;
  description: string;
  icon: React.ReactNode;
  defaultW: number;
  defaultH: number;
}

const WIDGET_TEMPLATES: WidgetLibraryItem[] = [
  {
    id: 'bar-chart',
    type: 'chart',
    subType: 'bar',
    title: 'Bar Chart',
    description: 'Compare categorical quantities',
    icon: <BarChart2 className="w-5 h-5 text-blue-600" />,
    defaultW: 6,
    defaultH: 5,
  },
  {
    id: 'line-chart',
    type: 'chart',
    subType: 'line',
    title: 'Line Chart',
    description: 'Visualize continuous trends',
    icon: <LineChart className="w-5 h-5 text-indigo-600" />,
    defaultW: 6,
    defaultH: 5,
  },
  {
    id: 'pie-chart',
    type: 'chart',
    subType: 'pie',
    title: 'Pie Chart',
    description: 'Show proportional distributions',
    icon: <PieChart className="w-5 h-5 text-emerald-600" />,
    defaultW: 4,
    defaultH: 5,
  },
  {
    id: 'data-table',
    type: 'table',
    title: 'Data Table',
    description: 'Structured records with pages',
    icon: <Table className="w-5 h-5 text-amber-600" />,
    defaultW: 6,
    defaultH: 5,
  },
  {
    id: 'stat-card',
    type: 'card',
    title: 'Stat Card',
    description: 'Key metric with icon & value',
    icon: <CreditCard className="w-5 h-5 text-rose-600" />,
    defaultW: 3,
    defaultH: 3,
  },
  {
    id: 'text-block',
    type: 'text',
    title: 'Text Block',
    description: 'Custom notes or instructions',
    icon: <Type className="w-5 h-5 text-purple-600" />,
    defaultW: 4,
    defaultH: 3,
  },
  {
    id: 'image-block',
    type: 'image',
    title: 'Image',
    description: 'Photos, banners, or graphics',
    icon: <ImageIcon className="w-5 h-5 text-teal-600" />,
    defaultW: 4,
    defaultH: 4,
  },
  {
    id: 'button-block',
    type: 'button',
    title: 'Button',
    description: 'Link or external call-to-action',
    icon: <MousePointerClick className="w-5 h-5 text-sky-600" />,
    defaultW: 3,
    defaultH: 2,
  },
];

interface WidgetLibraryProps {
  onAddWidget?: (type: WidgetType, subType?: ChartType) => void;
}

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ onAddWidget }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: WidgetLibraryItem) => {
    const payload = JSON.stringify({
      type: item.type,
      subType: item.subType,
      w: item.defaultW,
      h: item.defaultH,
    });
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.setData('application/json', payload);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full select-none">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Components</h2>
        <p className="text-xs text-gray-500 mt-1">Drag onto canvas or click to add</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {WIDGET_TEMPLATES.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="group relative flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all duration-150"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2 rounded-md bg-gray-50 group-hover:bg-blue-50 transition-colors">
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-800 truncate">{item.title}</div>
                <div className="text-[11px] text-gray-400 truncate">{item.description}</div>
              </div>
            </div>

            {onAddWidget && (
              <button
                type="button"
                onClick={() => onAddWidget(item.type, item.subType)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 transition"
                title={`Add ${item.title}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
