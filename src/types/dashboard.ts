import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ColoredChartDataPoint extends ChartDataPoint {
  color: string;
}

export interface CancellationReason {
  label: string;
  value: number;
}

export interface DashboardColors {
  primary: string;
  [name: string]: string;
}

export type ChangeType = "up" | "down" | "neutral";

export interface StatCardData {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  change?: ReactNode;
  changeType?: ChangeType | string;
  prefix?: string;
}

export interface DashboardOrder {
  orderNo: string;
  client: string;
  provider: string;
  status: string;
  price: string;
  date: string;
}

export interface RecentActivity {
  title: string;
  description: string;
  time: string;
}

export interface ActivityCategory {
  value: string;
  label: string;
  icon?: LucideIcon;
}

export interface ActivityEntry extends RecentActivity {
  id: number;
  date: string;
  timeAgo: string;
  category: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  dotColor: string;
}
