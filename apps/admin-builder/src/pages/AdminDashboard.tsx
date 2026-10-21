import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit3,
  Copy,
  Trash2,
  Users,
  Layout,
  Calendar,
  Layers,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import type { LayoutData } from '@repo/types';
import { getLayouts, deleteLayout, duplicateLayout } from '@repo/api-client';

export const AdminDashboard: React.FC = () => {
  const [layouts, setLayouts] = useState<LayoutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const navigate = useNavigate();

  const fetchLayouts = async () => {
    try {
      setLoading(true);
      const data = await getLayouts();
      setLayouts(data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load dashboard layouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  const handleDuplicate = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setActionLoadingId(id);
      const duplicated = await duplicateLayout(id);
      toast.success(`Duplicated layout "${duplicated.name}"`);
      await fetchLayouts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to duplicate layout');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setActionLoadingId(id);
      await deleteLayout(id);
      toast.success('Layout deleted successfully');
      setDeleteConfirmId(null);
      await fetchLayouts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete layout');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Layouts</h1>
            <p className="text-sm text-gray-500 mt-1">
              Design, customize, and assign responsive dashboards for your users
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/builder/new')}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Layout</span>
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100 animate-scale-up">
              <div className="flex items-center space-x-3 text-rose-600 mb-3">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-bold text-gray-900 text-base">Delete Layout</h3>
              </div>
              <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                Are you sure you want to permanently delete this dashboard layout? Users assigned to this layout will lose access.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={actionLoadingId === deleteConfirmId}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition flex items-center space-x-1"
                >
                  {actionLoadingId === deleteConfirmId ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium">Loading layouts...</p>
          </div>
        ) : layouts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center max-w-lg mx-auto mt-6">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Layout className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No dashboard layouts yet</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Start building your first custom dashboard layout with charts, metrics, tables, and more.
            </p>
            <button
              onClick={() => navigate('/admin/builder/new')}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Layout</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layouts.map((item) => {
              const widgetCount = item.widgets?.length || 0;
              const assignedCount = item.assignedUsers?.length || 0;
              const formattedDate = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent';

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/admin/builder/${item.id}`)}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer overflow-hidden"
                >
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition truncate">
                        {item.name}
                      </h3>
                      <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full shrink-0 flex items-center space-x-1">
                        <Layers className="w-3 h-3" />
                        <span>{widgetCount} {widgetCount === 1 ? 'widget' : 'widgets'}</span>
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px] mb-4">
                      {item.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-gray-400 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{assignedCount} {assignedCount === 1 ? 'user' : 'users'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/75 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Layout</span>
                    </span>

                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => item.id && handleDuplicate(item.id, e)}
                        disabled={actionLoadingId === item.id}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-md transition border border-transparent hover:border-gray-200"
                        title="Duplicate layout"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => item.id && setDeleteConfirmId(item.id)}
                        disabled={actionLoadingId === item.id}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-white rounded-md transition border border-transparent hover:border-gray-200"
                        title="Delete layout"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
