import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, X } from 'lucide-react';
import type { Widget, Breakpoints } from '@repo/types';
import { LayoutRenderer } from '@repo/layout-renderer';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: Widget[];
  breakpoints: Breakpoints;
  layoutName: string;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<DeviceMode, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 375,
};

const DEVICE_BREAKPOINTS: Record<DeviceMode, 'lg' | 'md' | 'sm'> = {
  desktop: 'lg',
  tablet: 'md',
  mobile: 'sm',
};

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  widgets,
  breakpoints,
  layoutName,
}) => {
  const [device, setDevice] = useState<DeviceMode>('desktop');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex flex-col animate-fade-in">
      {/* Top control bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-gray-800 text-sm">Preview:</span>
          <span className="text-sm text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md font-medium">
            {layoutName || 'Untitled Layout'}
          </span>
        </div>

        {/* Breakpoint toggles */}
        <div className="flex items-center bg-gray-100 p-1 rounded-lg space-x-1">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              device === 'desktop'
                ? 'bg-white text-blue-600 shadow-sm font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop (1200px)</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              device === 'tablet'
                ? 'bg-white text-blue-600 shadow-sm font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (768px)</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              device === 'mobile'
                ? 'bg-white text-blue-600 shadow-sm font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (375px)</span>
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition"
          title="Exit Preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas container */}
      <div className="flex-1 overflow-auto p-6 flex justify-center bg-gray-100/90">
        <div
          className="bg-white rounded-xl shadow-xl border border-gray-200 transition-all duration-300 h-fit min-h-[500px]"
          style={{
            width: `${DEVICE_WIDTHS[device]}px`,
            maxWidth: '100%',
          }}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>
              Viewport: {DEVICE_WIDTHS[device]}px ({DEVICE_BREAKPOINTS[device].toUpperCase()} - {device === 'desktop' ? 12 : device === 'tablet' ? 8 : 4} columns)
            </span>
            <span>Read-Only Preview</span>
          </div>
          <LayoutRenderer
            key={`preview-${device}`}
            widgets={widgets}
            breakpoints={breakpoints}
            breakpoint={DEVICE_BREAKPOINTS[device]}
          />
        </div>
      </div>
    </div>
  );
};
