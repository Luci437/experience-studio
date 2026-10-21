import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">404</h1>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-xs text-gray-500 max-w-sm mb-6">
        The page you are looking for doesn't exist or has been moved to another location.
      </p>
      <Link
        to="/admin"
        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Admin</span>
      </Link>
    </div>
  );
};
