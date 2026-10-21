import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';

interface WidgetWrapperProps {
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  loading = false,
  error = null,
  isEmpty = false,
  onRetry,
  children,
  className = '',
}) => {
  return (
    <div
      className={`h-full w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col p-4 ${className}`}
    >
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-gray-500">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600 mb-2" />
          <p className="text-xs font-medium">Loading widget data...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
          <p className="text-xs font-semibold text-gray-800 mb-1">Failed to load</p>
          <p className="text-xs text-gray-500 mb-3 max-w-xs">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      ) : isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-gray-400">
          <Inbox className="w-8 h-8 mb-2 stroke-1" />
          <p className="text-xs font-medium text-gray-500">No data available</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
};
