export type Role = 'ADMIN' | 'USER';

export interface AuthUser {
  userId: number;
  username: string;
  role: Role;
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: Role;
  userId: number;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: Role;
  assignedLayoutId: number | null;
  assignedLayoutName: string | null;
}

export type WidgetType = 'chart' | 'table' | 'card' | 'text' | 'image' | 'button';
export type ChartType = 'bar' | 'line' | 'pie';

export interface DataSource {
  type: 'static' | 'api';
  data?: any;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  refreshInterval?: number;
  mapping?: Record<string, string>;
}

export interface ChartConfig {
  chartType: ChartType;
  title: string;
  colors: string[];
  xAxisKey?: string;
  yAxisKey?: string;
  dataSource: DataSource;
}

export interface TableConfig {
  title: string;
  columns: { key: string; label: string }[];
  pageSize: number;
  dataSource: DataSource;
}

export interface CardConfig {
  title: string;
  value: string;
  icon: string;
  color: string;
  dataSource: DataSource;
}

export interface TextConfig {
  content: string;
  fontSize: number;
  alignment: 'left' | 'center' | 'right';
  dataSource: DataSource;
}

export interface ImageConfig {
  url: string;
  alt: string;
  objectFit: 'cover' | 'contain' | 'fill';
  dataSource: DataSource;
}

export interface ButtonConfig {
  label: string;
  link: string;
  color: string;
  variant: 'solid' | 'outline';
  dataSource: DataSource;
}

export type WidgetConfig =
  | ChartConfig
  | TableConfig
  | CardConfig
  | TextConfig
  | ImageConfig
  | ButtonConfig;

export interface Widget {
  i: string;
  type: WidgetType;
  config: WidgetConfig;
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface Breakpoints {
  lg: LayoutItem[];
  md: LayoutItem[];
  sm: LayoutItem[];
}

export interface LayoutData {
  id?: number;
  name: string;
  description: string;
  widgets: Widget[];
  breakpoints: Breakpoints;
  createdByUsername?: string;
  createdAt?: string;
  assignedUsers?: UserDto[];
}
