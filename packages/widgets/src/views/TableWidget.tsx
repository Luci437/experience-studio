import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TableConfig } from '@repo/types';
import { useDataSource } from '../hooks/useDataSource';
import { WidgetWrapper } from './WidgetWrapper';

interface TableWidgetProps {
  config: TableConfig;
}

export const TableWidget: React.FC<TableWidgetProps> = ({ config }) => {
  const { data, loading, error, refetch } = useDataSource<Record<string, any>[]>(config.dataSource);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const columns = config.columns && config.columns.length > 0 ? config.columns : [];
  const pageSize = Math.max(1, config.pageSize || 5);
  const rows = Array.isArray(data) ? data : [];

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const currentRows = rows.slice(startIndex, startIndex + pageSize);

  const isEmpty = !loading && !error && (rows.length === 0 || columns.length === 0);

  return (
    <WidgetWrapper loading={loading} error={error} isEmpty={isEmpty} onRetry={refetch}>
      <div className="flex flex-col h-full w-full">
        {config.title && (
          <h3 className="text-sm font-semibold text-gray-800 mb-2 truncate" title={config.title}>
            {config.title}
          </h3>
        )}

        <div className="flex-1 overflow-auto rounded border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/75 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2 whitespace-nowrap text-gray-700">
                      {row[col.key] !== undefined && row[col.key] !== null
                        ? String(row[col.key])
                        : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length > pageSize && (
          <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 text-xs text-gray-500">
            <span>
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, rows.length)} of {rows.length}
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validPage === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">
                {validPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validPage === totalPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
};
