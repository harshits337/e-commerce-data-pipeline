import React from 'react';
import { TimeRange } from '@/types/dashboard';
import styles from './TimeRangeFilter.module.css';

interface TimeRangeFilterProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  loading?: boolean;
}

const timeRangeOptions: { value: TimeRange; label: string; description: string }[] = [
  { value: '15min', label: '15 Minutes', description: 'Last 15 minutes' },
  { value: '1hr', label: '1 Hour', description: 'Last hour' },
  { value: '12hr', label: '12 Hours', description: 'Last 12 hours' },
  { value: '1day', label: '1 Day', description: 'Last 24 hours' },
  { value: '3day', label: '3 Days', description: 'Last 3 days' },
  { value: '7day', label: '7 Days', description: 'Last week' },
  { value: '14day', label: '14 Days', description: 'Last 2 weeks' },
  { value: '1month', label: '1 Month', description: 'Last 30 days' },
];

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({
  selectedRange,
  onRangeChange,
  loading = false
}) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Time Range</h3>
      <div className={styles.filterGrid}>
        {timeRangeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onRangeChange(option.value)}
            disabled={loading}
            className={`
              ${styles.filterButton} 
              ${selectedRange === option.value ? styles.active : ''}
              ${loading ? styles.disabled : ''}
            `}
          >
            <div className={styles.buttonContent}>
              <span className={styles.label}>{option.label}</span>
              <span className={styles.description}>{option.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeRangeFilter;
