import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { ChartConfig } from '@repo/types';
import { useDataSource } from '../hooks/useDataSource';
import { WidgetWrapper } from './WidgetWrapper';

interface ChartWidgetProps {
  config: ChartConfig;
}

const DEFAULT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export const ChartWidget: React.FC<ChartWidgetProps> = ({ config }) => {
  const { data, loading, error, refetch } = useDataSource<any[]>(config.dataSource);

  const colors = config.colors && config.colors.length > 0 ? config.colors : DEFAULT_COLORS;
  const xAxisKey = config.xAxisKey || 'name';
  const yAxisKey = config.yAxisKey || 'value';

  const isEmpty = !loading && !error && (!data || !Array.isArray(data) || data.length === 0);

  const renderChart = () => {
    if (!data || !Array.isArray(data)) return null;

    if (config.chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '4px' }} />
            <Line type="monotone" dataKey={yAxisKey} stroke={colors[0] || '#3B82F6'} strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (config.chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={65} paddingAngle={4} dataKey={yAxisKey} nameKey={xAxisKey}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
    }

    // Default: Bar chart
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '4px' }} />
          <Bar dataKey={yAxisKey} fill={colors[0] || '#3B82F6'} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <WidgetWrapper loading={loading} error={error} isEmpty={isEmpty} onRetry={refetch}>
      <div className="flex flex-col h-full w-full">
        {config.title && (
          <h3 className="text-sm font-semibold text-gray-800 mb-2 truncate" title={config.title}>
            {config.title}
          </h3>
        )}
        <div className="flex-1 w-full min-h-[120px]">{renderChart()}</div>
      </div>
    </WidgetWrapper>
  );
};
