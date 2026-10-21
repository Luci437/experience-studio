import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { ButtonConfig } from '@repo/types';
import { useDataSource } from '../hooks/useDataSource';
import { WidgetWrapper } from './WidgetWrapper';

interface ButtonWidgetProps {
  config: ButtonConfig;
}

export const ButtonWidget: React.FC<ButtonWidgetProps> = ({ config }) => {
  const { data, loading, error, refetch } = useDataSource<string>(config.dataSource);

  const label = (data !== null && data !== undefined ? String(data) : config.label) || 'Click Here';
  const color = config.color || '#2563EB';
  const variant = config.variant || 'solid';

  const isSolid = variant === 'solid';

  return (
    <WidgetWrapper loading={loading} error={error} onRetry={refetch}>
      <div className="h-full w-full flex items-center justify-center p-2">
        <a
          href={config.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={
            isSolid
              ? { backgroundColor: color, color: '#ffffff' }
              : { borderColor: color, color: color, borderWidth: '2px', borderStyle: 'solid' }
          }
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all hover:opacity-90 active:scale-95 shadow-sm max-w-full truncate"
          onClick={(e) => {
            if (!config.link || config.link === '#') {
              e.preventDefault();
            }
          }}
        >
          <span className="truncate">{label}</span>
          <ExternalLink className="w-4 h-4 shrink-0" />
        </a>
      </div>
    </WidgetWrapper>
  );
};
