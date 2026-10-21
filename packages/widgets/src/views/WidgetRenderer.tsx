import React from 'react';
import type { Widget, ChartConfig, TableConfig, CardConfig, TextConfig, ImageConfig, ButtonConfig } from '@repo/types';
import { ChartWidget } from './ChartWidget';
import { TableWidget } from './TableWidget';
import { CardWidget } from './CardWidget';
import { TextWidget } from './TextWidget';
import { ImageWidget } from './ImageWidget';
import { ButtonWidget } from './ButtonWidget';

interface WidgetRendererProps {
  widget: Widget;
  isEditing?: boolean;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget, isEditing = false }) => {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'chart':
        return <ChartWidget config={widget.config as ChartConfig} />;
      case 'table':
        return <TableWidget config={widget.config as TableConfig} />;
      case 'card':
        return <CardWidget config={widget.config as CardConfig} />;
      case 'text':
        return <TextWidget config={widget.config as TextConfig} />;
      case 'image':
        return <ImageWidget config={widget.config as ImageConfig} />;
      case 'button':
        return <ButtonWidget config={widget.config as ButtonConfig} />;
      default:
        return (
          <div className="h-full w-full flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
            Unknown widget type: {(widget as any).type}
          </div>
        );
    }
  };

  return (
    <div className={`h-full w-full relative ${isEditing ? 'select-none pointer-events-auto' : ''}`}>
      {renderWidgetContent()}
    </div>
  );
};
