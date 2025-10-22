import React from 'react';
import { 
  MapPin, 
  CreditCard, 
  Building2, 
  Tag, 
  Globe,
  TrendingUp 
} from 'lucide-react';
import { StatsData } from '@/types/dashboard';
import styles from './StatsGrid.module.css';

interface StatsGridProps {
  stats: StatsData | null;
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  loading: boolean;
  valueKey: string;
  labelKey: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  icon, 
  data, 
  loading, 
  valueKey, 
  labelKey,
  color 
}) => {
  if (loading) {
    return (
      <div className={styles.statCard}>
        <div className={styles.cardHeader}>
          <div className={styles.titleSection}>
            {icon}
            <h3 className={styles.title}>{title}</h3>
          </div>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingShimmer}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.statCard}>
      <div className={styles.cardHeader}>
        <div className={styles.titleSection}>
          {icon}
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.totalBadge} style={{ backgroundColor: color }}>
          {data.length}
        </div>
      </div>
      
      <div className={styles.statsList}>
        {data.map((item, index) => {
          const percentage = data.length > 0 
            ? (parseInt(item.total_orders) / parseInt(data[0].total_orders)) * 100 
            : 0;
          
          return (
            <div key={index} className={styles.statItem}>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{item[labelKey]}</span>
                <span className={styles.statValue}>{parseInt(item.total_orders).toLocaleString()}</span>
              </div>
              <div className={styles.statBar}>
                <div 
                  className={styles.statBarFill}
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: color
                  }}
                />
              </div>
            </div>
          );
        })}
        
        {data.length === 0 && (
          <div className={styles.noData}>
            <span>No data available</span>
          </div>
        )}
      </div>
    </div>
  );
};

const StatsGrid: React.FC<StatsGridProps> = ({ stats, loading = false }) => {
  return (
    <div className={styles.statsGrid}>
      <StatCard
        title="Top Cities"
        icon={<MapPin className={styles.icon} size={18} />}
        data={stats?.topCities || []}
        loading={loading}
        valueKey="total_orders"
        labelKey="city"
        color="#3b82f6"
      />
      
      <StatCard
        title="Payment Methods"
        icon={<CreditCard className={styles.icon} size={18} />}
        data={stats?.topPaymentMethods || []}
        loading={loading}
        valueKey="total_orders"
        labelKey="payment_method"
        color="#10b981"
      />
      
      <StatCard
        title="Top Companies"
        icon={<Building2 className={styles.icon} size={18} />}
        data={stats?.topCompanies || []}
        loading={loading}
        valueKey="total_orders"
        labelKey="company"
        color="#f59e0b"
      />
      
      <StatCard
        title="Categories"
        icon={<Tag className={styles.icon} size={18} />}
        data={stats?.topCategories || []}
        loading={loading}
        valueKey="total_orders"
        labelKey="category"
        color="#ef4444"
      />
      
      <StatCard
        title="Traffic Sources"
        icon={<Globe className={styles.icon} size={18} />}
        data={stats?.topSources || []}
        loading={loading}
        valueKey="total_orders"
        labelKey="source"
        color="#8b5cf6"
      />
    </div>
  );
};

export default StatsGrid;
