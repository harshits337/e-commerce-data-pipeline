import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import orderAnalyticsRouter from './order-management/routes';
import kafkaConnection from './order-management/kafka/connect';
import consumer from './order-management/kafka/consumer';
import { Client } from 'pg';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8001;

app.use('/api/v1/order-management', orderAnalyticsRouter);

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'admin123',
    database: 'ecommerce_db',
  });


let users: any[] = [];
let products: any[] = [];



const startServer = async () => {
    try {
        // Initialize Kafka connection
        try {
            await kafkaConnection.connect();
            console.log('✅ Kafka Producer connected');
            
            // Start consumer to see messages
            consumer.start();
            console.log('👂 Kafka Consumer listening for messages');
            await client.connect();

            const usersRes = await client.query('SELECT * FROM users');
            const productsRes = await client.query('SELECT * FROM products');
          
            users = usersRes.rows.map(u => u);
            products = productsRes.rows.map(p => p);
            console.log(products.slice(0, 10));
            console.log('✅ PostgreSQL connected');
        } catch (kafkaError) {
            console.warn('⚠️ Failed to connect to Kafka - API will run without Kafka functionality:', kafkaError);
        }

        // Start HTTP server
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/api/v1/order-management/health`);
        });

        // Graceful shutdown handling
        const gracefulShutdown = async (signal: string) => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);
            
            server.close(async () => {
                console.log('🔌 HTTP server closed');
                
                try {
                    await consumer.stop();
                    await kafkaConnection.disconnect();
                    console.log('✅ Kafka disconnected successfully');
                } catch (error) {
                    console.error('❌ Error disconnecting from Kafka:', error);
                }
                
                console.log('👋 Graceful shutdown completed');
                process.exit(0);
            });

            // Force close after 10 seconds
            setTimeout(() => {
                console.error('⚠️ Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();


export { client, users, products };