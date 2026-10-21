import type { WidgetType, ChartType, WidgetConfig } from '@repo/types';

export const createDefaultConfig = (type: WidgetType, subType?: ChartType): WidgetConfig => {
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
