import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Database, Sliders, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import {
  Widget,
  WidgetConfig,
  ChartConfig,
  TableConfig,
  CardConfig,
  TextConfig,
  ImageConfig,
  ButtonConfig,
  DataSource,
} from '@repo/types';

interface WidgetSettingsProps {
  widget: Widget | null;
  onUpdateWidget: (updatedWidget: Widget) => void;
  onClose: () => void;
}

export const WidgetSettings: React.FC<WidgetSettingsProps> = ({
  widget,
  onUpdateWidget,
  onClose,
}) => {
  if (!widget) return null;

  const [activeTab, setActiveTab] = useState<'settings' | 'data'>('settings');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [rawJson, setRawJson] = useState<string>('');

  useEffect(() => {
    if (widget.config.dataSource?.data !== undefined) {
      setRawJson(JSON.stringify(widget.config.dataSource.data, null, 2));
    } else {
      setRawJson('');
    }
    setJsonError(null);
  }, [widget.i]);

  const updateConfig = (partial: Partial<WidgetConfig>) => {
    const updated: Widget = {
      ...widget,
      config: {
        ...widget.config,
        ...partial,
      } as WidgetConfig,
    };
    onUpdateWidget(updated);
  };

  const updateDataSource = (partial: Partial<DataSource>) => {
    const currentDs = widget.config.dataSource || { type: 'static' };
    const nextDs: DataSource = {
      ...currentDs,
      ...partial,
    };
    updateConfig({ dataSource: nextDs });
  };

  const handleJsonDataChange = (value: string) => {
    setRawJson(value);
    if (!value.trim()) {
      setJsonError(null);
      updateDataSource({ data: null });
      return;
    }
    try {
      const parsed = JSON.parse(value);
      setJsonError(null);
      updateDataSource({ data: parsed });
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON format');
    }
  };

  // Renders specific widget type configuration
  const renderSpecificSettings = () => {
    switch (widget.type) {
      case 'chart': {
        const cfg = widget.config as ChartConfig;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Chart Type</label>
              <select
                value={cfg.chartType || 'bar'}
                onChange={(e) => updateConfig({ chartType: e.target.value as any })}
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={cfg.title || ''}
                onChange={(e) => updateConfig({ title: e.target.value })}
                placeholder="Monthly Performance"
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">X-Axis Key</label>
                <input
                  type="text"
                  value={cfg.xAxisKey || ''}
                  onChange={(e) => updateConfig({ xAxisKey: e.target.value })}
                  placeholder="name"
                  className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Y-Axis Key</label>
                <input
                  type="text"
                  value={cfg.yAxisKey || ''}
                  onChange={(e) => updateConfig({ yAxisKey: e.target.value })}
                  placeholder="value"
                  className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700">Palette Colors</label>
                <button
                  type="button"
                  onClick={() => {
                    const next = [...(cfg.colors || []), '#3B82F6'];
                    updateConfig({ colors: next });
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Color</span>
                </button>
              </div>
              <div className="space-y-2">
                {(cfg.colors || ['#3B82F6']).map((color, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const next = [...(cfg.colors || [])];
                        next[idx] = e.target.value;
                        updateConfig({ colors: next });
                      }}
                      className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => {
                        const next = [...(cfg.colors || [])];
                        next[idx] = e.target.value;
                        updateConfig({ colors: next });
                      }}
                      className="flex-1 text-xs rounded-md border border-gray-300 py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-mono"
                    />
                    {(cfg.colors || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = (cfg.colors || []).filter((_, i) => i !== idx);
                          updateConfig({ colors: next });
                        }}
                        className="text-gray-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'table': {
        const cfg = widget.config as TableConfig;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={cfg.title || ''}
                onChange={(e) => updateConfig({ title: e.target.value })}
                placeholder="User Directory"
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Page Size</label>
              <input
                type="number"
                min={1}
                max={50}
                value={cfg.pageSize || 5}
                onChange={(e) => updateConfig({ pageSize: parseInt(e.target.value, 10) || 5 })}
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-700">Columns</label>
                <button
                  type="button"
                  onClick={() => {
                    const newCols = [...(cfg.columns || []), { key: 'newKey', label: 'New Column' }];
                    updateConfig({ columns: newCols });
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Column</span>
                </button>
              </div>

              <div className="space-y-2">
                {(cfg.columns || []).map((col, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 p-2 bg-gray-50 rounded border border-gray-200">
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={col.label}
                        onChange={(e) => {
                          const updatedCols = [...(cfg.columns || [])];
                          updatedCols[idx] = { ...updatedCols[idx], label: e.target.value };
                          updateConfig({ columns: updatedCols });
                        }}
                        placeholder="Label"
                        className="w-full text-[11px] rounded border border-gray-300 py-1 px-1.5 bg-white"
                      />
                      <input
                        type="text"
                        value={col.key}
                        onChange={(e) => {
                          const updatedCols = [...(cfg.columns || [])];
                          updatedCols[idx] = { ...updatedCols[idx], key: e.target.value };
                          updateConfig({ columns: updatedCols });
                        }}
                        placeholder="dataKey (e.g. name)"
                        className="w-full text-[11px] font-mono rounded border border-gray-300 py-1 px-1.5 bg-white"
                      />
                    </div>
                    {(cfg.columns || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedCols = (cfg.columns || []).filter((_, i) => i !== idx);
                          updateConfig({ columns: updatedCols });
                        }}
                        className="text-gray-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'card': {
        const cfg = widget.config as CardConfig;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={cfg.title || ''}
                onChange={(e) => updateConfig({ title: e.target.value })}
                placeholder="Total Revenue"
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Value</label>
              <input
                type="text"
                value={cfg.value || ''}
                onChange={(e) => updateConfig({ value: e.target.value })}
                placeholder="$45,200"
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Icon Name (Lucide)</label>
              <input
                type="text"
                value={cfg.icon || ''}
                onChange={(e) => updateConfig({ icon: e.target.value })}
                placeholder="DollarSign, Users, Activity, ShoppingBag..."
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Accent Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={cfg.color || '#3B82F6'}
                  onChange={(e) => updateConfig({ color: e.target.value })}
                  className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={cfg.color || '#3B82F6'}
                  onChange={(e) => updateConfig({ color: e.target.value })}
                  className="flex-1 text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
                />
              </div>
            </div>
          </div>
        );
      }

      case 'text': {
        const cfg = widget.config as TextConfig;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Content</label>
              <textarea
                rows={4}
                value={cfg.content || ''}
                onChange={(e) => updateConfig({ content: e.target.value })}
                placeholder="Write announcements, guidelines, or summaries..."
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700">Font Size ({cfg.fontSize || 16}px)</label>
              </div>
              <input
                type="range"
                min={12}
                max={48}
                value={cfg.fontSize || 16}
                onChange={(e) => updateConfig({ fontSize: parseInt(e.target.value, 10) })}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Alignment</label>
              <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-md">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => updateConfig({ alignment: align })}
                    className={`flex items-center justify-center py-1 rounded text-xs transition ${
                      cfg.alignment === align ? 'bg-white shadow-sm font-semibold text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {align === 'left' && <AlignLeft className="w-4 h-4" />}
                    {align === 'center' && <AlignCenter className="w-4 h-4" />}
                    {align === 'right' && <AlignRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'image': {
        const cfg = widget.config as ImageConfig;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={cfg.url || ''}
                onChange={(e) => updateConfig({ url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Alt Text</label>
              <input
                type="text"
                value={cfg.alt || ''}
                onChange={(e) => updateConfig({ alt: e.target.value })}
                placeholder="Dashboard banner"
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Object Fit</label>
              <select
                value={cfg.objectFit || 'cover'}
                onChange={(e) => updateConfig({ objectFit: e.target.value as any })}
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="cover">Cover (crop to fill)</option>
                <option value="contain">Contain (maintain aspect ratio)</option>
                <option value="fill">Fill (stretch)</option>
              </select>
            </div>
          </div>
        );
      }

      case 'button': {
        const cfg = widget.config as ButtonConfig;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Button Label</label>
              <input
                type="text"
                value={cfg.label || ''}
                onChange={(e) => updateConfig({ label: e.target.value })}
                placeholder="Open Reports"
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Destination URL</label>
              <input
                type="url"
                value={cfg.link || ''}
                onChange={(e) => updateConfig({ link: e.target.value })}
                placeholder="https://example.com"
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Variant</label>
              <select
                value={cfg.variant || 'solid'}
                onChange={(e) => updateConfig({ variant: e.target.value as any })}
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="solid">Solid Background</option>
                <option value="outline">Outline Border</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={cfg.color || '#2563EB'}
                  onChange={(e) => updateConfig({ color: e.target.value })}
                  className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={cfg.color || '#2563EB'}
                  onChange={(e) => updateConfig({ color: e.target.value })}
                  className="flex-1 text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
                />
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Renders common Data Source section
  const renderDataSourceSection = () => {
    const ds = widget.config.dataSource || { type: 'static' };
    const isApi = ds.type === 'api';

    return (
      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Data Source Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateDataSource({ type: 'static' })}
              className={`py-1.5 px-3 text-xs font-medium rounded-md border transition ${
                !isApi
                  ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Static Data
            </button>
            <button
              type="button"
              onClick={() => updateDataSource({ type: 'api' })}
              className={`py-1.5 px-3 text-xs font-medium rounded-md border transition flex items-center justify-center space-x-1 ${
                isApi
                  ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>REST API</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-normal">
                Preview
              </span>
            </button>
          </div>
        </div>

        {isApi ? (
          <div className="space-y-3 p-3 bg-amber-50/50 rounded-lg border border-amber-200">
            <div className="text-[11px] text-amber-800 bg-amber-100/70 p-2 rounded">
              REST API integration connects external endpoints to this widget.
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Endpoint URL</label>
              <input
                type="text"
                value={ds.url || ''}
                onChange={(e) => updateDataSource({ url: e.target.value })}
                placeholder="https://api.example.com/v1/metrics"
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">HTTP Method</label>
              <select
                value={ds.method || 'GET'}
                onChange={(e) => updateDataSource({ method: e.target.value as any })}
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Refresh Interval (seconds)</label>
              <input
                type="number"
                min={0}
                value={ds.refreshInterval || 0}
                onChange={(e) => updateDataSource({ refreshInterval: parseInt(e.target.value, 10) || 0 })}
                placeholder="0 (disabled)"
                className="w-full text-xs rounded-md border border-gray-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Static JSON Data</label>
              {jsonError && <span className="text-[10px] text-rose-600 font-medium">Syntax error</span>}
            </div>
            <textarea
              rows={9}
              value={rawJson}
              onChange={(e) => handleJsonDataChange(e.target.value)}
              className={`w-full text-xs font-mono rounded-md border p-2 focus:outline-none ${
                jsonError ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300 focus:ring-1 focus:ring-blue-500'
              }`}
              placeholder="[ { &quot;name&quot;: &quot;Jan&quot;, &quot;value&quot;: 100 } ]"
            />
            {jsonError && <p className="text-[11px] text-rose-500 mt-1">{jsonError}</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg z-20">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900 capitalize">
            {widget.type} Settings
          </h2>
          <p className="text-xs text-gray-400">ID: {widget.i}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center space-x-1.5 border-b-2 transition ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600 bg-blue-50/20'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Appearance</span>
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center space-x-1.5 border-b-2 transition ${
            activeTab === 'data'
              ? 'border-blue-600 text-blue-600 bg-blue-50/20'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data Source</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'settings' ? renderSpecificSettings() : renderDataSourceSection()}
      </div>
    </aside>
  );
};
