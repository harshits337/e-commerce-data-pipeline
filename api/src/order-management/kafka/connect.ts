import { Kafka, Producer, logLevel } from 'kafkajs';

interface KafkaConfig {
    brokers: string[];
    clientId: string;
}

class KafkaConnection {
    private kafka: Kafka;
    private producer: Producer;
    private isConnected: boolean = false;

    constructor() {
        const config: KafkaConfig = {
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
            clientId: process.env.KAFKA_CLIENT_ID || 'ecommerce-api'
        };

        this.kafka = new Kafka({
            ...config,
            logLevel: logLevel.ERROR, // Only show errors in production
            retry: {
                initialRetryTime: 100,
                retries: 8
            }
        });

        this.producer = this.kafka.producer({
            maxInFlightRequests: 1,
            idempotent: true,
            transactionTimeout: 30000,
        });
    }

    async connect(): Promise<void> {
        try {
            await this.producer.connect();
            this.isConnected = true;
            console.log('✅ Kafka Producer connected successfully');
        } catch (error) {
            console.error('❌ Failed to connect to Kafka:', error);
            this.isConnected = false;
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.producer.disconnect();
            this.isConnected = false;
            console.log('🔌 Kafka Producer disconnected');
        } catch (error) {
            console.error('❌ Error disconnecting from Kafka:', error);
        }
    }

    async publishMessage(topic: string, message: any): Promise<boolean> {
        if (!this.isConnected) {
            console.warn('⚠️ Kafka not connected, skipping message publish');
            return false;
        }

        try {
            const result = await this.producer.send({
                topic,
                messages: [{
                    key: message.userId || message.id || null,
                    value: JSON.stringify({
                        ...message
                    }),
                    headers: {
                        source: 'ecommerce-api',
                        version: '1.0'
                    }
                }]
            });

            // console.log(`📤 Message published to topic ${topic}:`, result);
            return true;
        } catch (error) {
            console.error(`❌ Failed to publish message to topic ${topic}:`, error);
            return false;
        }
    }

    getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

// Create and export singleton instance
const kafkaConnection = new KafkaConnection();

export default kafkaConnection;
export { KafkaConnection };
