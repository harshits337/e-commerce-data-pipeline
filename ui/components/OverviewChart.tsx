import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { BarChart3 } from 'lucide-react';
import { ChartDataPoint } from '@/types/dashboard';
import styles from './MetricChart.module.css';

interface OverviewChartProps {
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
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className={styles.tooltipValue}
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
            {entry.dataKey === 'aov' && entry.value > 0 ? ' $' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const OverviewChart: React.FC<OverviewChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <BarChart3 className={styles.icon} size={20} />
            <h3 className={styles.title}>Combined Analytics Overview</h3>
          </div>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.chartCard} ${styles.overviewChart}`}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <BarChart3 className={styles.icon} size={20} />
          <h3 className={styles.title}>Combined Analytics Overview</h3>
        </div>
        <div className={styles.legendContainer}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#3b82f6' }}></span>
            <span>Orders</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#10b981' }}></span>
            <span>Views</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#f59e0b' }}></span>
            <span>Carts</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#ef4444' }}></span>
            <span>AOV</span>
          </div>
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => format(new Date(value), 'HH:mm')}
            />
            <YAxis
              yAxisId="left"
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="left"
              dataKey="orders"
              fill="#3b82f6"
              opacity={0.8}
              name="Orders"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="views"
              fill="#10b981"
              opacity={0.8}
              name="Product Views"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="carts"
              fill="#f59e0b"
              opacity={0.8}
              name="Cart Events"
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="aov"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              name="Average Order Value"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewChart;
