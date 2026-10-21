import React from 'react';
import type { TextConfig } from '@repo/types';
import { useDataSource } from '../hooks/useDataSource';
import { WidgetWrapper } from './WidgetWrapper';

interface TextWidgetProps {
  config: TextConfig;
}

export const TextWidget: React.FC<TextWidgetProps> = ({ config }) => {
  const { data, loading, error, refetch } = useDataSource<string>(config.dataSource);

  const displayContent = (data !== null && data !== undefined ? String(data) : config.content) || '';
  const fontSize = config.fontSize || 16;
  const alignment = config.alignment || 'left';

  const alignClass =
    alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left';

  return (
    <WidgetWrapper loading={loading} error={error} onRetry={refetch}>
      <div className={`h-full w-full flex flex-col justify-center overflow-auto ${alignClass}`}>
        <div
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}
          className="text-gray-800 whitespace-pre-wrap font-normal"
        >
          {displayContent || <span className="text-gray-400 italic">No content</span>}
        </div>
      </div>
    </WidgetWrapper>
  );
};
