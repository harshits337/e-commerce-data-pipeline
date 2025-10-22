import { Request, Response } from 'express';
import kafkaService from '../kafka/kafkaService';


export class OrderAnalyticsController {

    viewProduct = async (req: Request, res: Response) => {
        try {
            const { productId, userId, timestamp } = req.body;
            console.log(`Viewed product ${productId} by user ${userId}`);
            
            // Publish to Kafka (non-blocking)
            kafkaService.publishProductView({
                userId,
                productId,
                timestamp
            }).catch(error => {
                console.error('Failed to publish product view event:', error);
                // Don't throw - API should work even if Kafka fails
            });
            
            return res.status(200).json({ message: 'Product viewed successfully' });
        } catch (error) {
            console.error('Error viewing product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    addToCart = async (req: Request, res: Response) => {
        try {
            const { productId, userId, quantity, timestamp } = req.body;
            console.log(`Added product ${productId} (qty: ${quantity}) to cart by user ${userId}`);
            
            // Publish to Kafka (non-blocking)
            kafkaService.publishCartEvent({
                userId,
                productId,
                quantity: parseInt(quantity),
                timestamp
            }).catch(error => {
                console.error('Failed to publish cart event:', error);
                // Don't throw - API should work even if Kafka fails
            });
            
            return res.status(200).json({ message: 'Product added to cart successfully' });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
 
    placeOrder = async (req: Request, res: Response) => {
        try {
            const { orderId,productId, userId, quantity, paymentMethod, shippingCity, source,timestamp } = req.body;
            console.log(`Placed order for product ${productId} (qty: ${quantity}) by user ${userId}`);
            
            // Publish to Kafka (non-blocking)
            kafkaService.publishOrderEvent({
                orderId,
                userId,
                productId,
                quantity: parseInt(quantity),
                paymentMethod,
                shippingCity,
                source,
                timestamp
            }).catch(error => {
                console.error('Failed to publish order event:', error);
                // Don't throw - API should work even if Kafka fails
            });
            
            return res.status(200).json({ message: 'Order placed successfully' });
        } catch (error) {
            console.error('Error placing order:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new OrderAnalyticsController();