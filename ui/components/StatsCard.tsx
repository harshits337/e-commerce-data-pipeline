import React from 'react';
import { LucideIcon } from 'lucide-react';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  loading = false
}) => {
  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.loadingShimmer}></div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{title}</h3>
        <Icon className={styles.icon} size={24} />
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.value}>{value}</div>
        {change && (
          <div className={`${styles.change} ${styles[changeType]}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
