export interface TimeSeriesData {
  time_bucket: string;
  total_orders?: string;
  total_product_views?: string;
  total_carts?: string;
  average_order_value?: number;
}

export interface DashboardData {
  orderData: TimeSeriesData[];
  productViewData: TimeSeriesData[];
  cartData: TimeSeriesData[];
  aovData: TimeSeriesData[];
}

export interface StatsItem {
  city?: string;
  payment_method?: string;
  company?: string;
  category?: string;
  source?: string;
  total_orders: string;
}

export interface StatsData {
  topCities: StatsItem[];
  topPaymentMethods: StatsItem[];
  topCompanies: StatsItem[];
  topCategories: StatsItem[];
  topSources: StatsItem[];
}

export interface DashboardResponse {
  message: string;
  data: DashboardData;
  stats: StatsData;
  summary: {
    orderCount: number;
    productViewCount: number;
    cartCount: number;
    totalDataPoints: number;
  };
}

export type TimeRange = '15min' | '1hr' | '12hr' | '1day' | '3day' | '7day' | '14day' | '1month';

export interface ChartDataPoint {
  time: string;
  orders: number;
  views: number;
  carts: number;
  aov: number;
}
