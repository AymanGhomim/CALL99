export interface UserRecord {
  id: string | number;
  name: string;
  phone: string;
  role: string;
  ordersCount: number;
  createdAt: string;
  status: string;
}

export interface OrderRecord {
  id: number;
  orderNo: string;
  customerName: string;
  providerName: string;
  customerPhone: string;
  providerPhone: string;
  service: string;
  role: string;
  status: string;
  price: number;
  date: string;
}

export interface UserOrder {
  id: number;
  orderNo: string;
  service: string;
  provider: string;
  status: string;
  price: string;
  date: string;
}

export interface ProviderOrder {
  id: number;
  orderNo: string;
  customer: string;
  service: string;
  status: string;
  price: string;
  date: string;
}

export interface ProviderBasicInfo {
  label: string;
  value: string;
}

export interface ProviderDocumentInfo {
  label: string;
  status: string;
  url?: string;
  fileName?: string;
  mimeType?: string;
}

export interface ProviderServiceInfo {
  name: string;
  price: string;
  status: string;
}

export interface ProviderPackageInfo {
  name: string;
  price: number | string;
  startDate: string;
  endDate: string;
  status: string;
  description?: string;
  maxImages?: number;
  maxVideos?: number;
  maxServices?: number;
  maxServiceListings?: number;
}

export interface ProviderReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface OrderStats {
  cancelledOrders: number;
  completedOrders: number;
  totalOrders: number;
  scheduledOrders: number;
  activeOrders?: number;
}
