import { createClient } from '@clickhouse/client';
import {users, products} from '../../index';

export const clickhouse = createClient({
  host: 'http://localhost:8123',
  username: 'default',
  password: '',  // if you set a password, put it here
  database: 'ecommerce_db',
});

export const productViewOps = async (data : any) => {
    try {
       let user = users.find((u: any) => u.id === data.userId);  
       let product = products.find((p: any) => p.id === data.productId);

        const result = await clickhouse.insert({
          table: 'orders_fact',
          values: [
            {
              order_id : '',
              product_id : data.productId,
              user_id : data.userId,
              event_time: new Date(data.timestamp).toISOString().slice(0, 19).replace('T', ' '),
              quantity : 1,
              price: product.price,
              totalAmount : product.price,
              payment_method : '',
              city : '',
              source : data.source,
              event_type : 1

            }
          ],
          format: 'JSONEachRow',
        })
        console.log('🔄 Inserted product view:');
        return result;
    } catch (error) {
        console.error('Error inserting product view:', error);
        throw error;
    }
}

export const cartEventOps = async (data : any) => {
    try {
        let user = users.find((u: any) => u.id === data.userId);  
        let product = products.find((p: any) => p.id === data.productId);

        const   result = await clickhouse.insert({
          table: 'orders_fact',
          values: [
            {
              order_id : '',
              product_id : data.productId,
              user_id : data.userId,
              event_time: new Date(data.timestamp).toISOString().slice(0, 19).replace('T', ' '),
              quantity : data.quantity,
              totalAmount : product.price * data.quantity,
              price : product.price,
              city : '',
              source : data.source,
              paymentMethod : '',
              event_type : 2,
            }
          ],
          format: 'JSONEachRow',
        })
        console.log('🔄 Inserted cart event:');
        return result;
        
    } catch (error) {
        console.error('Error inserting cart event:', error);
        throw error;
    }
}

export const orderEventOps = async (data : any) => {
    try {
        let user = users.find((u: any) => u.id === data.userId);  
        let product = products.find((p: any) => p.id === data.productId);
        console.log(product);
        product.price = parseFloat(product.price);
        const totalPrice = product.price * data.quantity;
        console.log(totalPrice);
        let result = await clickhouse.insert({
          table: 'orders_fact',
          values: [
            {
              order_id : data.orderId,
              product_id : data.productId,
              user_id : data.userId,
              event_time: new Date(data.timestamp).toISOString().slice(0, 19).replace('T', ' '),
              quantity : data.quantity,
              total_amount :totalPrice,
              price : product.price,
              city : data.shippingCity || 'Gwalior',
              source : data.source,
              payment_method : data.paymentMethod,
              event_type : 3,
              category : product.category || 'Electronics',
              company : product.company || 'JBL',

            }
          ],
          format: 'JSONEachRow',
        })
        console.log('🔄 Inserted order event:');
        return result;
    } catch (error) {
        console.error('Error inserting order event:', error);
        throw error;
    }
}


