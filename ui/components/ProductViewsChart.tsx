import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { ChartDataPoint } from '@/types/dashboard';
import styles from './MetricChart.module.css';

interface ProductViewsChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>
          {format(new Date(label), 'MMM dd, HH:mm')}
        </p>
        <p className={styles.tooltipValue} style={{ color: '#10b981' }}>
          Product Views: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const ProductViewsChart: React.FC<ProductViewsChartProps> = ({ data, loading = false }) => {
  const totalViews = data.reduce((sum, item) => sum + item.views, 0);

  if (loading) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Eye className={styles.icon} size={20} />
            <h3 className={styles.title}>Product Views</h3>
          </div>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartCard}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Eye className={styles.icon} size={20} />
          <h3 className={styles.title}>Product Views</h3>
        </div>
        <div className={styles.totalValue}>
          {totalViews.toLocaleString()}
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={10}
              tickFormatter={(value) => format(new Date(value), 'HH:mm')}
            />
            <YAxis stroke="#6b7280" fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#viewsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductViewsChart;
