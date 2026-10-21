import React, { useState, useEffect } from 'react';
import { X, Search, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { UserDto } from '@repo/types';
import { getUsers, assignLayout } from '@repo/api-client';

interface AssignUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  layoutId?: number;
  layoutName: string;
  onAssigned?: () => void;
}

export const AssignUserModal: React.FC<AssignUserModalProps> = ({
  isOpen,
  onClose,
  layoutId,
  layoutName,
  onAssigned,
}) => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assigningUserId, setAssigningUserId] = useState<number | null>(null);
  const [confirmUser, setConfirmUser] = useState<UserDto | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    } else {
      setConfirmUser(null);
      setSearchTerm('');
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAssign = async () => {
    if (!confirmUser || !layoutId) return;

    try {
      setAssigningUserId(confirmUser.id);
      await assignLayout(confirmUser.id, layoutId);
      toast.success(`Assigned "${layoutName}" to ${confirmUser.username}`);
      setConfirmUser(null);
      await loadUsers();
      if (onAssigned) onAssigned();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to assign layout');
    } finally {
      setAssigningUserId(null);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden max-h-[85vh] animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Assign Layout to User</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Assign <span className="font-semibold text-blue-600">{layoutName}</span> as the user's default dashboard.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Banner */}
        {confirmUser && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Assign <strong>{layoutName}</strong> to <strong>{confirmUser.username}</strong>?
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setConfirmUser(null)}
                className="px-2 py-1 text-xs text-gray-600 hover:bg-amber-100/50 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssign}
                disabled={assigningUserId !== null}
                className="px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm disabled:opacity-50 flex items-center space-x-1"
              >
                {assigningUserId === confirmUser.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Confirm</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-3 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-gray-100">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
              <p className="text-xs">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-xs">
              No users found matching your search.
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isCurrentlyAssigned = user.assignedLayoutId === layoutId;

              return (
                <div
                  key={user.id}
                  className="py-3 px-2 flex items-center justify-between hover:bg-gray-50/80 rounded-lg transition"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-800 truncate">{user.username}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium uppercase">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {user.assignedLayoutName ? (
                        <>
                          Current:{' '}
                          <span className={isCurrentlyAssigned ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                            {user.assignedLayoutName}
                          </span>
                        </>
                      ) : (
                        'No layout assigned'
                      )}
                    </p>
                  </div>

                  <div>
                    {isCurrentlyAssigned ? (
                      <span className="inline-flex items-center space-x-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Assigned</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmUser(user)}
                        disabled={!layoutId || assigningUserId !== null}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200 transition disabled:opacity-50"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
