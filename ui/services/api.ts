import axios from 'axios';
import { DashboardResponse, TimeRange } from '@/types/dashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const dashboardAPI = {
  async getDashboardData(range: TimeRange): Promise<DashboardResponse> {
    try {
      const response = await api.get(`/api/v1/order-management/dashboard?range=${range}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  },

  async getHealthCheck() {
    try {
      const response = await api.get('/api/v1/order-management/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};

export default api;
