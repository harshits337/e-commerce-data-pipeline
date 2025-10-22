import kafkaConnection from './connect';

// Topic constants
export const KAFKA_TOPICS = {
    PRODUCT_VIEWS: 'product-views',
    CART_EVENTS: 'cart-events',
    ORDER_EVENTS: 'order-events'
} as const;

// Message interfaces
export interface BaseKafkaMessage {
    userId: string;
    timestamp?: string;
    metadata?: Record<string, any>;
}

export interface ProductViewMessage extends BaseKafkaMessage {
    productId: string;
}

export interface CartEventMessage extends BaseKafkaMessage {
    productId: string;
    quantity: number;
}

export interface OrderEventMessage extends BaseKafkaMessage {
    orderId?: string;
    productId: string;
    quantity: number;
    paymentMethod: string;
    shippingCity: string;
    source: string;
}

class KafkaService {
    
    /**
     * Publish a product view event
     */
    async publishProductView(data: ProductViewMessage): Promise<boolean> {
        try {
            const message: ProductViewMessage = {
                ...data,
               
            };

            return await kafkaConnection.publishMessage(KAFKA_TOPICS.PRODUCT_VIEWS, message);
        } catch (error) {
            console.error('Failed to publish product view event:', error);
            return false;
        }
    }

    /**
     * Publish a cart event (add, remove, update)
     */
    async publishCartEvent(data: CartEventMessage): Promise<boolean> {
        try {
            const message: CartEventMessage = {
                ...data,
               
            };

            return await kafkaConnection.publishMessage(KAFKA_TOPICS.CART_EVENTS, message);
        } catch (error) {
            console.error('Failed to publish cart event:', error);
            return false;
        }
    }

    /**
     * Publish an order event
     */
    async publishOrderEvent(data: OrderEventMessage): Promise<boolean> {
        try {
            const message: OrderEventMessage = {
                ...data,
            };

            return await kafkaConnection.publishMessage(KAFKA_TOPICS.ORDER_EVENTS, message);
        } catch (error) {
            console.error('Failed to publish order event:', error);
            return false;
        }
    }

    /**
     * Publish multiple events in batch (for complex operations)
     */
    async publishBatchEvents(events: Array<{
        type: 'product_view' | 'cart_event' | 'order_event';
        data: ProductViewMessage | CartEventMessage | OrderEventMessage;
    }>): Promise<boolean[]> {
        const results = await Promise.allSettled(
            events.map(event => {
                switch (event.type) {
                    case 'product_view':
                        return this.publishProductView(event.data as ProductViewMessage);
                    case 'cart_event':
                        return this.publishCartEvent(event.data as CartEventMessage);
                    case 'order_event':
                        return this.publishOrderEvent(event.data as OrderEventMessage);
                    default:
                        return Promise.resolve(false);
                }
            })
        );

        return results.map(result => 
            result.status === 'fulfilled' ? result.value : false
        );
    }

    /**
     * Get Kafka connection status
     */
    getConnectionStatus(): boolean {
        return kafkaConnection.getConnectionStatus();
    }

    /**
     * Health check for Kafka service
     */
    async healthCheck(): Promise<{
        status: 'healthy' | 'unhealthy';
        connected: boolean;
        timestamp: string;
    }> {
        const connected = this.getConnectionStatus();
        
        return {
            status: connected ? 'healthy' : 'unhealthy',
            connected,
            timestamp: new Date().toISOString()
        };
    }
}

// Create and export singleton instance
const kafkaService = new KafkaService();

export default kafkaService;
export { KafkaService };
