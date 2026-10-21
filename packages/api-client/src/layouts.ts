import { api } from './axios';
import type { LayoutData, Widget, Breakpoints } from '@repo/types';

interface BackendLayoutData {
  id?: number;
  name: string;
  description: string;
  widgets: string | Widget[] | null;
  breakpoints: string | Breakpoints | null;
  createdByUsername?: string;
  createdAt?: string;
  assignedUsers?: any[];
}

function parseLayout(raw: BackendLayoutData): LayoutData {
  let widgets: Widget[] = [];
  if (raw.widgets) {
    if (typeof raw.widgets === 'string') {
      try { widgets = JSON.parse(raw.widgets); } catch { widgets = []; }
    } else if (Array.isArray(raw.widgets)) {
      widgets = raw.widgets;
    }
  }

  const defaultBp: Breakpoints = { lg: [], md: [], sm: [] };
  let breakpoints: Breakpoints = defaultBp;
  if (raw.breakpoints) {
    if (typeof raw.breakpoints === 'string') {
      try { breakpoints = { ...defaultBp, ...JSON.parse(raw.breakpoints) }; } catch { breakpoints = defaultBp; }
    } else if (typeof raw.breakpoints === 'object') {
      breakpoints = { ...defaultBp, ...(raw.breakpoints as Breakpoints) };
    }
  }

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    widgets,
    breakpoints,
    createdByUsername: raw.createdByUsername,
    createdAt: raw.createdAt,
    assignedUsers: raw.assignedUsers,
  };
}

function serializeLayout(data: LayoutData): BackendLayoutData {
  return {
    ...data,
    widgets: JSON.stringify(data.widgets || []),
    breakpoints: JSON.stringify(data.breakpoints || { lg: [], md: [], sm: [] }),
  };
}

export const getLayouts = async (): Promise<LayoutData[]> => {
  const response = await api.get<BackendLayoutData[]>('/layouts');
  return (response.data || []).map(parseLayout);
};

export const getLayout = async (id: number): Promise<LayoutData> => {
  const response = await api.get<BackendLayoutData>(`/layouts/${id}`);
  return parseLayout(response.data);
};

export const createLayout = async (data: LayoutData): Promise<LayoutData> => {
  const response = await api.post<BackendLayoutData>('/layouts', serializeLayout(data));
  return parseLayout(response.data);
};

export const updateLayout = async (id: number, data: LayoutData): Promise<LayoutData> => {
  const response = await api.put<BackendLayoutData>(`/layouts/${id}`, serializeLayout(data));
  return parseLayout(response.data);
};

export const deleteLayout = async (id: number): Promise<void> => {
  await api.delete(`/layouts/${id}`);
};

export const duplicateLayout = async (id: number): Promise<LayoutData> => {
  const response = await api.post<BackendLayoutData>(`/layouts/${id}/duplicate`);
  return parseLayout(response.data);
};

export const getMyDashboard = async (): Promise<LayoutData | null> => {
  const response = await api.get<BackendLayoutData | null>('/dashboard/my');
  if (!response.data) return null;
  return parseLayout(response.data);
};
