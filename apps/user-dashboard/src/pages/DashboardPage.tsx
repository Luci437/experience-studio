import React, { useState, useEffect } from 'react';
import { Layout, Loader2, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import type { LayoutData } from '@repo/types';
import { getMyDashboard } from '@repo/api-client';
import { LayoutRenderer } from '@repo/layout-renderer';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const [layout, setLayout] = useState<LayoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyDashboard();
      setLayout(data);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setLayout(null);
      } else {
        setError(err.response?.data?.message || 'Failed to load your assigned dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Show admin warning
  if (user?.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Admin Account Detected</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            This application is for regular users to view their assigned dashboard. Please use the{' '}
            <strong>Admin Builder</strong> application (http://localhost:5173) to manage and preview layouts.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium">Loading your dashboard...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">Unable to Load Dashboard</h3>
            <p className="text-xs text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchDashboard}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : !layout ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Layout className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">No Dashboard Assigned</h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              No dashboard assigned yet. Please contact your administrator to set up your personal view.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{layout.name}</h1>
                {layout.description && (
                  <p className="text-xs text-gray-500 mt-1">{layout.description}</p>
                )}
              </div>
              {layout.createdAt && (
                <div className="flex items-center space-x-1 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 self-start sm:self-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Updated {new Date(layout.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-hidden">
              <LayoutRenderer
                widgets={layout.widgets || []}
                breakpoints={layout.breakpoints || { lg: [], md: [], sm: [] }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
