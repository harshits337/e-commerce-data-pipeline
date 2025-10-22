import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { DollarSign } from 'lucide-react';
import { ChartDataPoint } from '@/types/dashboard';
import styles from './MetricChart.module.css';

interface AOVChartProps {
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
        <p className={styles.tooltipValue} style={{ color: '#ef4444' }}>
          AOV: ${payload[0].value?.toFixed(2) || '0.00'}
        </p>
      </div>
    );
  }
  return null;
};

const AOVChart: React.FC<AOVChartProps> = ({ data, loading = false }) => {
  const avgAOV = data.length > 0 
    ? data.reduce((sum, item) => sum + item.aov, 0) / data.length 
    : 0;

  if (loading) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <DollarSign className={styles.icon} size={20} />
            <h3 className={styles.title}>Average Order Value</h3>
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
          <DollarSign className={styles.icon} size={20} />
          <h3 className={styles.title}>Average Order Value</h3>
        </div>
        <div className={styles.totalValue}>
          ${avgAOV.toFixed(2)}
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={10}
              tickFormatter={(value) => format(new Date(value), 'HH:mm')}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={10}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="aov"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AOVChart;
