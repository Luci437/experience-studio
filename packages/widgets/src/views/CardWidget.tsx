import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { CardConfig } from '@repo/types';
import { useDataSource } from '../hooks/useDataSource';
import { WidgetWrapper } from './WidgetWrapper';

interface CardWidgetProps {
  config: CardConfig;
}

export const CardWidget: React.FC<CardWidgetProps> = ({ config }) => {
  const { data, loading, error, refetch } = useDataSource<any>(config.dataSource);

  // Determine display value: preferentially from data if available, else config.value
  let displayValue = config.value;
  if (data !== null && data !== undefined) {
    if (typeof data === 'object' && data.value !== undefined) {
      displayValue = String(data.value);
    } else if (typeof data === 'string' || typeof data === 'number') {
      displayValue = String(data);
    }
  }

  // Resolve Lucide icon
  const getIcon = (iconName: string) => {
    const icons = LucideIcons as Record<string, any>;
    // Try exact match, or capitalized match
    const resolvedName =
      iconName in icons
        ? iconName
        : iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const IconComponent = icons[resolvedName] || LucideIcons.Activity;
    return <IconComponent className="w-6 h-6" />;
  };

  const accentColor = config.color || '#3B82F6';

  return (
    <WidgetWrapper loading={loading} error={error} onRetry={refetch}>
      <div className="flex flex-col justify-between h-full w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate pr-2">
            {config.title || 'Metric'}
          </span>
          <div
            className="p-2.5 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${accentColor}1A`, // 10% opacity
              color: accentColor,
            }}
          >
            {getIcon(config.icon || 'Activity')}
          </div>
        </div>

        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight truncate">
            {displayValue || '0'}
          </div>
          <div className="h-1 w-12 rounded mt-2" style={{ backgroundColor: accentColor }} />
        </div>
      </div>
    </WidgetWrapper>
  );
};
