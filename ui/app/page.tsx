'use client'

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Eye, 
  Package, 
  DollarSign,
  Activity,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

import StatsCard from '@/components/StatsCard';
import TimeRangeFilter from '@/components/TimeRangeFilter';
import OrdersChart from '@/components/OrdersChart';
import ProductViewsChart from '@/components/ProductViewsChart';
import CartEventsChart from '@/components/CartEventsChart';
import AOVChart from '@/components/AOVChart';
import OverviewChart from '@/components/OverviewChart';
import StatsGrid from '@/components/StatsGrid';
import { dashboardAPI } from '@/services/api';
import { DashboardResponse, TimeRange, ChartDataPoint } from '@/types/dashboard';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<TimeRange>('7day');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showOverview, setShowOverview] = useState(false);

  const fetchData = async (range: TimeRange) => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardAPI.getDashboardData(range);
      setData(response);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedRange);
  }, [selectedRange]);

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
  };

  const handleRefresh = () => {
    fetchData(selectedRange);
  };

  // Transform data for chart
  const chartData: ChartDataPoint[] = React.useMemo(() => {
    if (!data) return [];

    const timePoints = new Set<string>();
    
    // Collect all time points
    data.data.orderData?.forEach(item => timePoints.add(item.time_bucket));
    data.data.productViewData?.forEach(item => timePoints.add(item.time_bucket));
    data.data.cartData?.forEach(item => timePoints.add(item.time_bucket));
    data.data.aovData?.forEach(item => timePoints.add(item.time_bucket));

    const sortedTimePoints = Array.from(timePoints).sort();

    return sortedTimePoints.map(time => {
      const orderItem = data.data.orderData?.find(item => item.time_bucket === time);
      const viewItem = data.data.productViewData?.find(item => item.time_bucket === time);
      const cartItem = data.data.cartData?.find(item => item.time_bucket === time);
      const aovItem = data.data.aovData?.find(item => item.time_bucket === time);

      return {
        time,
        orders: parseInt(orderItem?.total_orders || '0'),
        views: parseInt(viewItem?.total_product_views || '0'),
        carts: parseInt(cartItem?.total_carts || '0'),
        aov: aovItem?.average_order_value || 0,
      };
    });
  }, [data]);

  // Calculate summary statistics
  const summaryStats = React.useMemo(() => {
    if (!chartData.length) return { totalOrders: 0, totalViews: 0, totalCarts: 0, avgAOV: 0 };

    const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
    const totalViews = chartData.reduce((sum, item) => sum + item.views, 0);
    const totalCarts = chartData.reduce((sum, item) => sum + item.carts, 0);
    const avgAOV = chartData.length > 0 
      ? chartData.reduce((sum, item) => sum + item.aov, 0) / chartData.length 
      : 0;

    return { totalOrders, totalViews, totalCarts, avgAOV };
  }, [chartData]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorCard}>
            <h2>⚠️ Error Loading Dashboard</h2>
            <p>{error}</p>
            <button onClick={() => fetchData(selectedRange)} className={styles.retryButton}>
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              <Activity className={styles.titleIcon} />
              Analytics Dashboard
            </h1>
            <p className={styles.subtitle}>
              Real-time e-commerce analytics and insights
            </p>
          </div>
          
          <div className={styles.headerActions}>
            <div className={styles.lastUpdated}>
              Last updated: {format(lastUpdated, 'MMM dd, HH:mm:ss')}
            </div>
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className={styles.refreshButton}
            >
              <RefreshCw className={loading ? styles.spinning : ''} size={16} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Time Range Filter */}
        <section className={styles.filterSection}>
          <TimeRangeFilter
            selectedRange={selectedRange}
            onRangeChange={handleRangeChange}
            loading={loading}
          />
        </section>

        {/* Stats Cards */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <StatsCard
              title="Total Orders"
              value={summaryStats.totalOrders.toLocaleString()}
              icon={Package}
              loading={loading}
            />
            <StatsCard
              title="Product Views"
              value={summaryStats.totalViews.toLocaleString()}
              icon={Eye}
              loading={loading}
            />
            <StatsCard
              title="Cart Events"
              value={summaryStats.totalCarts.toLocaleString()}
              icon={ShoppingCart}
              loading={loading}
            />
            <StatsCard
              title="Average Order Value"
              value={`$${summaryStats.avgAOV.toFixed(2)}`}
              icon={DollarSign}
              loading={loading}
            />
          </div>
        </section>

        {/* Charts Toggle */}
        <section className={styles.chartsToggleSection}>
          <div className={styles.toggleButtons}>
            <button 
              className={`${styles.toggleButton} ${!showOverview ? styles.active : ''}`}
              onClick={() => setShowOverview(false)}
            >
              Individual Charts
            </button>
            <button 
              className={`${styles.toggleButton} ${showOverview ? styles.active : ''}`}
              onClick={() => setShowOverview(true)}
            >
              Combined Overview
            </button>
          </div>
        </section>

        {/* Charts Display */}
        <section className={styles.chartsGridSection}>
          {showOverview ? (
            <OverviewChart
              data={chartData}
              loading={loading}
            />
          ) : (
            <div className={styles.chartsGrid}>
              <OrdersChart
                data={chartData}
                loading={loading}
              />
              <ProductViewsChart
                data={chartData}
                loading={loading}
              />
              <CartEventsChart
                data={chartData}
                loading={loading}
              />
              <AOVChart
                data={chartData}
                loading={loading}
              />
            </div>
          )}
        </section>

        {/* Stats Grid */}
        <section className={styles.statsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Analytics Breakdown</h2>
            <p className={styles.sectionDescription}>
              Top performing categories, locations, and trends
            </p>
          </div>
          <StatsGrid 
            stats={data?.stats || null}
            loading={loading}
          />
        </section>

        {/* Additional Metrics */}
        {!loading && data && (
          <section className={styles.metricsSection}>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <h3>Conversion Metrics</h3>
                <div className={styles.metricRow}>
                  <span>View to Cart Rate:</span>
                  <span className={styles.metricValue}>
                    {summaryStats.totalViews > 0 
                      ? ((summaryStats.totalCarts / summaryStats.totalViews) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className={styles.metricRow}>
                  <span>Cart to Order Rate:</span>
                  <span className={styles.metricValue}>
                    {summaryStats.totalCarts > 0 
                      ? ((summaryStats.totalOrders / summaryStats.totalCarts) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
              
              <div className={styles.metricCard}>
                <h3>Data Summary</h3>
                <div className={styles.metricRow}>
                  <span>Time Buckets:</span>
                  <span className={styles.metricValue}>{chartData.length}</span>
                </div>
                <div className={styles.metricRow}>
                  <span>Selected Range:</span>
                  <span className={styles.metricValue}>{selectedRange}</span>
                </div>
                <div className={styles.metricRow}>
                  <span>Total Stats:</span>
                  <span className={styles.metricValue}>
                    {data?.stats ? Object.values(data.stats).reduce((sum, arr) => sum + arr.length, 0) : 0}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2024 E-commerce Analytics Dashboard. Real-time data powered by Kafka & ClickHouse.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
