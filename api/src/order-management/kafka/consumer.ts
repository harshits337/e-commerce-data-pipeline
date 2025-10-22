import { Kafka, Consumer, logLevel } from 'kafkajs';
import { KAFKA_TOPICS } from './kafkaService';
import { cartEventOps, orderEventOps, productViewOps } from '../utils/clickhouseUtils';

class KafkaConsumer {
    private kafka: Kafka;
    private consumer: Consumer;

    constructor() {
        this.kafka = new Kafka({
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
            clientId: 'ecommerce-consumer',
            logLevel: logLevel.ERROR
        });

        this.consumer = this.kafka.consumer({
            groupId: 'ecommerce-consumer-group'
        });
    }

    async start(): Promise<void> {
        try {
            console.log('🔄 Connecting Kafka Consumer...');
            await this.consumer.connect();
            console.log('✅ Kafka Consumer connected');

            console.log('📡 Subscribing to topics:', [
                KAFKA_TOPICS.PRODUCT_VIEWS,
                KAFKA_TOPICS.CART_EVENTS,
                KAFKA_TOPICS.ORDER_EVENTS
            ]);

            await this.consumer.subscribe({ 
                topics: [
                    KAFKA_TOPICS.PRODUCT_VIEWS,
                    KAFKA_TOPICS.CART_EVENTS,
                    KAFKA_TOPICS.ORDER_EVENTS
                ],
                fromBeginning: true  
            });

            console.log('👂 Consumer ready, waiting for messages...');

            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    try {
                        const topicName = topic.toString();
                        console.log(`🏷️  Topic: ${topicName}`);
                        const data = JSON.parse(message.value?.toString() || '{}');
                        console.log(JSON.stringify(data, null, 2));
                        if(topicName === KAFKA_TOPICS.PRODUCT_VIEWS) {
                            console.log(`🏷️  Product View: ${data.productId}`);
                            await productViewOps(data);

                        } else if(topicName === KAFKA_TOPICS.CART_EVENTS) {
                            console.log(`🏷️  Cart Event: ${data.productId}`);
                            await cartEventOps(data);
                        } else if(topicName === KAFKA_TOPICS.ORDER_EVENTS) {
                            console.log(`🏷️  Order Event: ${data.orderId}`);
                            await orderEventOps(data);
                        }
                        
                    } catch (error) {
                        console.error('❌ Error parsing message:', error);
                        console.log('Raw message value:', message.value?.toString());
                    }
                }
            });

        } catch (error) {
            console.error('❌ Consumer error:', error);
        }
    }

    async stop(): Promise<void> {
        await this.consumer.disconnect();
        console.log('🛑 Consumer stopped');
    }
}

const consumer = new KafkaConsumer();

// Start consumer if this file is run directly
if (require.main === module) {
    consumer.start();
    
    process.on('SIGINT', async () => {
        await consumer.stop();
        process.exit(0);
    });
}

export default consumer;
