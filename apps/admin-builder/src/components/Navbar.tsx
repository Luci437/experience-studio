import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-6">
            <Link to="/admin" className="flex items-center space-x-2 text-blue-600 font-bold text-xl hover:text-blue-700 transition">
              <LayoutDashboard className="w-6 h-6" />
              <span>Admin Builder</span>
            </Link>

            {isAdmin && (
              <nav className="flex space-x-4">
                <Link
                  to="/admin"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
                >
                  Layouts
                </Link>
              </nav>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">{user.username}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    user.role === 'ADMIN'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-sm font-medium text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition border border-transparent hover:border-red-100"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
