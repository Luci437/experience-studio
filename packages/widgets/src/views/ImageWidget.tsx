import React, { useState } from 'react';
import { Image as ImageIcon, ImageOff } from 'lucide-react';
import type { ImageConfig } from '@repo/types';
import { useDataSource } from '../hooks/useDataSource';
import { WidgetWrapper } from './WidgetWrapper';

interface ImageWidgetProps {
  config: ImageConfig;
}

export const ImageWidget: React.FC<ImageWidgetProps> = ({ config }) => {
  const { data, loading, error, refetch } = useDataSource<string>(config.dataSource);
  const [imgError, setImgError] = useState(false);

  const imageUrl = (data !== null && data !== undefined ? String(data) : config.url) || '';
  const objectFit = config.objectFit || 'cover';

  return (
    <WidgetWrapper loading={loading} error={error} onRetry={refetch}>
      <div className="h-full w-full flex items-center justify-center overflow-hidden rounded bg-gray-50">
        {!imageUrl ? (
          <div className="flex flex-col items-center justify-center text-gray-400 p-4">
            <ImageIcon className="w-10 h-10 mb-1 stroke-1" />
            <span className="text-xs">No image URL configured</span>
          </div>
        ) : imgError ? (
          <div className="flex flex-col items-center justify-center text-gray-400 p-4">
            <ImageOff className="w-10 h-10 mb-1 stroke-1 text-rose-400" />
            <span className="text-xs text-gray-500">Failed to load image</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={config.alt || 'Widget Image'}
            onError={() => setImgError(true)}
            className="w-full h-full"
            style={{ objectFit }}
          />
        )}
      </div>
    </WidgetWrapper>
  );
};
