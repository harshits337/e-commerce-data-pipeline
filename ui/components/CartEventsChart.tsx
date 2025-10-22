import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { ShoppingCart } from 'lucide-react';
import { ChartDataPoint } from '@/types/dashboard';
import styles from './MetricChart.module.css';

interface CartEventsChartProps {
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
        <p className={styles.tooltipValue} style={{ color: '#f59e0b' }}>
          Cart Events: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const CartEventsChart: React.FC<CartEventsChartProps> = ({ data, loading = false }) => {
  const totalCarts = data.reduce((sum, item) => sum + item.carts, 0);

  if (loading) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <ShoppingCart className={styles.icon} size={20} />
            <h3 className={styles.title}>Cart Events</h3>
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
          <ShoppingCart className={styles.icon} size={20} />
          <h3 className={styles.title}>Cart Events</h3>
        </div>
        <div className={styles.totalValue}>
          {totalCarts.toLocaleString()}
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={10}
              tickFormatter={(value) => format(new Date(value), 'HH:mm')}
            />
            <YAxis stroke="#6b7280" fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="carts"
              fill="#f59e0b"
              opacity={0.8}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CartEventsChart;
