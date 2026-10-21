import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  Eye,
  UserPlus,
  ArrowLeft,
  Loader2,
  CheckCircle,
  HelpCircle,
  Monitor,
  Tablet,
  Smartphone,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Widget,
  Breakpoints,
  LayoutItem,
  WidgetType,
  ChartType,
  LayoutData,
  WidgetConfig,
} from '@repo/types';
import { getLayout, createLayout, updateLayout } from '@repo/api-client';
import { WidgetLibrary } from '../components/builder/WidgetLibrary';
import { GridCanvas } from '../components/builder/GridCanvas';
import { WidgetSettings } from '@repo/widgets/editor';
import { PreviewModal } from '../components/builder/PreviewModal';
import { AssignUserModal } from '../components/builder/AssignUserModal';

export const LayoutBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [layoutId, setLayoutId] = useState<number | undefined>(
    id && id !== 'new' && !isNaN(Number(id)) ? Number(id) : undefined
  );
  const [layoutName, setLayoutName] = useState<string>('Untitled Dashboard');
  const [layoutDescription, setLayoutDescription] = useState<string>('');
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    lg: [],
    md: [],
    sm: [],
  });
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [builderDevice, setBuilderDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Load layout if editing existing
  useEffect(() => {
    const loadLayout = async () => {
      if (id && id !== 'new' && !isNaN(Number(id))) {
        try {
          setLoading(true);
          const data = await getLayout(Number(id));
          setLayoutId(data.id);
          setLayoutName(data.name || 'Untitled Dashboard');
          setLayoutDescription(data.description || '');
          setWidgets(data.widgets || []);
          setBreakpoints({
            lg: data.breakpoints?.lg || [],
            md: data.breakpoints?.md || [],
            sm: data.breakpoints?.sm || [],
          });
          setIsDirty(false);
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Failed to load layout');
          navigate('/admin');
        } finally {
          setLoading(false);
        }
      } else {
        // New layout
        setLayoutName('My Custom Dashboard');
        setLayoutDescription('');
        setWidgets([]);
        setBreakpoints({ lg: [], md: [], sm: [] });
        setIsDirty(false);
        setLoading(false);
      }
    };

    loadLayout();
  }, [id, navigate]);

  // Create default widget configuration
  const createDefaultConfig = (type: WidgetType, subType?: ChartType): WidgetConfig => {
    switch (type) {
      case 'chart': {
        const chartType = subType || 'bar';
        if (chartType === 'line') {
          return {
            chartType: 'line',
            title: 'Website Traffic Trends',
            colors: ['#6366F1'],
            xAxisKey: 'name',
            yAxisKey: 'value',
            dataSource: {
              type: 'static',
              data: [
                { name: 'Mon', value: 120 },
                { name: 'Tue', value: 210 },
                { name: 'Wed', value: 190 },
                { name: 'Thu', value: 340 },
                { name: 'Fri', value: 480 },
                { name: 'Sat', value: 520 },
                { name: 'Sun', value: 410 },
              ],
            },
          };
        }
        if (chartType === 'pie') {
          return {
            chartType: 'pie',
            title: 'Distribution',
            colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
            xAxisKey: 'name',
            yAxisKey: 'value',
            dataSource: {
              type: 'static',
              data: [
                { name: 'Enterprise', value: 45 },
                { name: 'Mid-Market', value: 30 },
                { name: 'Startup', value: 15 },
                { name: 'Individual', value: 10 },
              ],
            },
          };
        }
        return {
          chartType: 'bar',
          title: 'Monthly Revenue',
          colors: ['#3B82F6'],
          xAxisKey: 'name',
          yAxisKey: 'value',
          dataSource: {
            type: 'static',
            data: [
              { name: 'Jan', value: 400 },
              { name: 'Feb', value: 300 },
              { name: 'Mar', value: 600 },
              { name: 'Apr', value: 800 },
              { name: 'May', value: 500 },
              { name: 'Jun', value: 700 },
            ],
          },
        };
      }

      case 'table':
        return {
          title: 'Recent Activity',
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'customer', label: 'Customer' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
          ],
          pageSize: 5,
          dataSource: {
            type: 'static',
            data: [
              { id: '#1001', customer: 'Alice Smith', amount: '$120.00', status: 'Completed' },
              { id: '#1002', customer: 'Bob Jones', amount: '$85.50', status: 'Pending' },
              { id: '#1003', customer: 'Charlie Brown', amount: '$240.00', status: 'Completed' },
              { id: '#1004', customer: 'Dana Scully', amount: '$310.20', status: 'Processing' },
              { id: '#1005', customer: 'Fox Mulder', amount: '$99.90', status: 'Completed' },
            ],
          },
        };

      case 'card':
        return {
          title: 'Active Users',
          value: '2,845',
          icon: 'Users',
          color: '#3B82F6',
          dataSource: {
            type: 'static',
            data: { value: '2,845' },
          },
        };

      case 'text':
        return {
          content: 'Welcome to your custom dashboard!\nTrack real-time metrics and overall team performance.',
          fontSize: 15,
          alignment: 'left',
          dataSource: {
            type: 'static',
            data: null,
          },
        };

      case 'image':
        return {
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          alt: 'Dashboard analytics visualization',
          objectFit: 'cover',
          dataSource: {
            type: 'static',
            data: null,
          },
        };

      case 'button':
        return {
          label: 'View Detailed Documentation',
          link: 'https://example.com',
          color: '#2563EB',
          variant: 'solid',
          dataSource: {
            type: 'static',
            data: null,
          },
        };

      default:
        throw new Error(`Unsupported widget type: ${type}`);
    }
  };

  // Add widget dropped or clicked
  const handleDropWidget = useCallback(
    (type: WidgetType, layoutItem: LayoutItem, subType?: ChartType) => {
      const widgetId = `widget-${Date.now()}`;
      const newConfig = createDefaultConfig(type, subType);

      const newWidget: Widget = {
        i: widgetId,
        type,
        config: newConfig,
      };

      const w = layoutItem.w || 4;
      const h = layoutItem.h || 4;
      const x = layoutItem.x ?? 0;
      const y = layoutItem.y ?? 0;

      const newLgItem: LayoutItem = { i: widgetId, x, y, w, h };
      const newMdItem: LayoutItem = { i: widgetId, x: x % 8, y, w: Math.min(w, 8), h };
      const newSmItem: LayoutItem = { i: widgetId, x: 0, y, w: 4, h };

      setWidgets((prev) => [...prev, newWidget]);
      setBreakpoints((prev) => ({
        lg: [...prev.lg, newLgItem],
        md: [...prev.md, newMdItem],
        sm: [...prev.sm, newSmItem],
      }));

      setSelectedWidgetId(widgetId);
      setIsDirty(true);
    },
    []
  );

  const handleAddWidgetFromSidebar = (type: WidgetType, subType?: ChartType) => {
    // Find bottom-most Y coordinate in current lg layout
    const maxY = breakpoints.lg.reduce((max, item) => Math.max(max, item.y + item.h), 0);
    const defaultW = type === 'card' || type === 'button' ? 3 : type === 'chart' || type === 'table' ? 6 : 4;
    const defaultH = type === 'button' ? 2 : type === 'card' ? 3 : 5;

    handleDropWidget(
      type,
      {
        i: '',
        x: 0,
        y: maxY,
        w: defaultW,
        h: defaultH,
      },
      subType
    );
  };

  const handleDeleteWidget = useCallback(
    (widgetId: string) => {
      setWidgets((prev) => prev.filter((w) => w.i !== widgetId));
      setBreakpoints((prev) => ({
        lg: prev.lg.filter((item) => item.i !== widgetId),
        md: prev.md.filter((item) => item.i !== widgetId),
        sm: prev.sm.filter((item) => item.i !== widgetId),
      }));

      if (selectedWidgetId === widgetId) {
        setSelectedWidgetId(null);
      }
      setIsDirty(true);
    },
    [selectedWidgetId]
  );

  const handleUpdateWidget = (updated: Widget) => {
    setWidgets((prev) => prev.map((w) => (w.i === updated.i ? updated : w)));
    setIsDirty(true);
  };

  const handleLayoutChange = useCallback((newBreakpoints: Breakpoints) => {
    setBreakpoints(newBreakpoints);
    setIsDirty(true);
  }, []);

  const handleSave = async () => {
    if (!layoutName.trim()) {
      toast.error('Please enter a layout name');
      return;
    }

    try {
      setSaving(true);
      const payload: LayoutData = {
        name: layoutName.trim(),
        description: layoutDescription.trim(),
        widgets,
        breakpoints,
      };

      if (layoutId) {
        await updateLayout(layoutId, payload);
        toast.success('Layout saved successfully!');
        setIsDirty(false);
      } else {
        const created = await createLayout(payload);
        toast.success('Layout created successfully!');
        setLayoutId(created.id);
        setIsDirty(false);
        if (created.id) {
          navigate(`/admin/builder/${created.id}`, { replace: true });
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save layout');
    } finally {
      setSaving(false);
    }
  };

  const selectedWidget = widgets.find((w) => w.i === selectedWidgetId) || null;

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-gray-500">
        <Loader2 className="w-9 h-9 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium">Loading layout editor...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm z-30">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <Link
            to="/admin"
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition shrink-0"
            title="Back to Layouts"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex flex-col min-w-0 max-w-md">
            <input
              type="text"
              value={layoutName}
              onChange={(e) => {
                setLayoutName(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Layout Name"
              className="text-base font-bold text-gray-900 border border-transparent hover:border-gray-300 focus:border-blue-500 rounded px-1.5 py-0.5 focus:outline-none bg-transparent"
            />
            <input
              type="text"
              value={layoutDescription}
              onChange={(e) => {
                setLayoutDescription(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Add optional description..."
              className="text-xs text-gray-500 border border-transparent hover:border-gray-300 focus:border-blue-500 rounded px-1.5 py-0.5 focus:outline-none bg-transparent truncate"
            />
          </div>

          {isDirty ? (
            <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200 shrink-0">
              Unsaved changes
            </span>
          ) : (
            <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200 flex items-center space-x-1 shrink-0">
              <CheckCircle className="w-3 h-3" />
              <span>Saved</span>
            </span>
          )}
        </div>

        {/* Viewport Device Mode Controls */}
        <div className="hidden lg:flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 mx-3">
          <button
            type="button"
            onClick={() => setBuilderDevice('desktop')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs rounded-md transition ${
              builderDevice === 'desktop'
                ? 'bg-white text-blue-600 shadow-xs font-semibold'
                : 'text-gray-500 hover:text-gray-900 font-medium'
            }`}
            title="Desktop Layout (12 columns)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setBuilderDevice('tablet')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs rounded-md transition ${
              builderDevice === 'tablet'
                ? 'bg-white text-blue-600 shadow-xs font-semibold'
                : 'text-gray-500 hover:text-gray-900 font-medium'
            }`}
            title="Tablet Layout (8 columns)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setBuilderDevice('mobile')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs rounded-md transition ${
              builderDevice === 'mobile'
                ? 'bg-white text-blue-600 shadow-xs font-semibold'
                : 'text-gray-500 hover:text-gray-900 font-medium'
            }`}
            title="Mobile Layout (4 columns)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition"
          >
            <Eye className="w-3.5 h-3.5 text-gray-500" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!layoutId) {
                toast.error('Please save this layout before assigning it to users.');
                return;
              }
              setShowAssignModal(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition"
          >
            <UserPlus className="w-3.5 h-3.5 text-gray-500" />
            <span>Assign to User</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Widget Library */}
        <WidgetLibrary onAddWidget={handleAddWidgetFromSidebar} />

        {/* Center Grid Canvas */}
        <div className="flex-1 overflow-auto bg-slate-100 relative p-4 flex justify-center">
          <div
            className={`transition-all duration-200 h-full ${
              builderDevice === 'desktop'
                ? 'w-full'
                : builderDevice === 'tablet'
                ? 'w-[768px] max-w-full bg-white rounded-xl shadow-sm border border-gray-200'
                : 'w-[380px] max-w-full bg-white rounded-xl shadow-sm border border-gray-200'
            }`}
          >
            <GridCanvas
              key={`builder-${builderDevice}`}
              widgets={widgets}
              breakpoints={breakpoints}
              breakpoint={builderDevice === 'desktop' ? 'lg' : builderDevice === 'tablet' ? 'md' : 'sm'}
              onLayoutChange={handleLayoutChange}
              onWidgetSelect={(id) => setSelectedWidgetId(id)}
              onWidgetDelete={handleDeleteWidget}
              onDropWidget={handleDropWidget}
              selectedWidgetId={selectedWidgetId}
              isPreview={false}
            />
          </div>
        </div>

        {/* Right Widget Settings Panel */}
        {selectedWidget && (
          <WidgetSettings
            widget={selectedWidget}
            onUpdateWidget={handleUpdateWidget}
            onClose={() => setSelectedWidgetId(null)}
          />
        )}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        widgets={widgets}
        breakpoints={breakpoints}
        layoutName={layoutName}
      />

      {/* Assign User Modal */}
      <AssignUserModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        layoutId={layoutId}
        layoutName={layoutName}
      />
    </div>
  );
};
