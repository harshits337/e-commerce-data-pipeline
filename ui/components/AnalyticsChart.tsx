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
import { ChartDataPoint } from '@/types/dashboard';
import styles from './AnalyticsChart.module.css';

interface AnalyticsChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
  height?: number;
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
            className={styles.tooltipItem}
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

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  data,
  loading = false,
  height = 400
}) => {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Analytics Overview</h3>
        </div>
        <div className={styles.loadingContainer} style={{ height }}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Analytics Overview</h3>
        <div className={styles.legendInfo}>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: '#3b82f6' }}></span>
            Orders
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: '#10b981' }}></span>
            Product Views
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: '#f59e0b' }}></span>
            Cart Events
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: '#ef4444' }}></span>
            AOV
          </span>
        </div>
      </div>
      
      <div className={styles.chartContainer} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
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

export default AnalyticsChart;
