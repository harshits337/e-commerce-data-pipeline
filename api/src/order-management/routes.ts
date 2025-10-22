import express from 'express';
const orderAnalyticsRouter = express.Router();
import OrderAnalyticsController from './controller/controller';
import ClickhouseController from './controller/clickhouse';
import kafkaService from './kafka/kafkaService';

// Health check endpoint
orderAnalyticsRouter.get('/health', async (req, res) => {
    try {
        const kafkaHealth = await kafkaService.healthCheck();
        const response = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                api: {
                    status: 'healthy',
                    uptime: process.uptime()
                },
                kafka: kafkaHealth
            }
        };
        
        const statusCode = kafkaHealth.status === 'healthy' ? 200 : 206; // 206 = Partial Content
        res.status(statusCode).json(response);
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed'
        });
    }
});

// Business endpoints
orderAnalyticsRouter.post('/view-product', OrderAnalyticsController.viewProduct);
orderAnalyticsRouter.post('/add-cart', OrderAnalyticsController.addToCart);
orderAnalyticsRouter.post('/place-order', OrderAnalyticsController.placeOrder);

orderAnalyticsRouter.get('/dashboard', ClickhouseController.getDashboardData);

export default orderAnalyticsRouter;