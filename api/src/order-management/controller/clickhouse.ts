import { clickhouse } from '../utils/clickhouseUtils';
import { Request, Response } from 'express';

class ClickhouseController {
   
    getDashboardData = async (req: Request, res: Response) => {
        try {
            let { range } = req.query;

            console.log('range', range);
            if (!range) {
                return res.status(400).json({ 
                    message: 'Range parameter is required',
                    example: '?range=7day',
                    supportedRanges: ['15min', '1hr', '12hr', '1day', '3day', '7day','14day','1month']
                });
            }
            
            const now = new Date();
            let fromDate: Date;
            let interval: string;
            
            // Determine time range and interval based on range parameter
            switch (range) {
                case '15min':
                    fromDate = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago
                    interval = '30 second';
                    break;
                case '1hr':
                    fromDate = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
                    interval = '15 minute';
                    break;
                case '12hr':
                    fromDate = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 hours ago
                    interval = '30 minute';
                    break;
                case '1day':
                    fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
                    interval = '1 hour';
                    break;
                case '3day':
                    fromDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
                    interval = '6 hour';
                    break;
                case '7day':
                    fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
                    interval = '1 day';
                    break;
                case '14day':
                    fromDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 7 days ago
                    interval = '1 day';
                    break;
                case '1month':
                    fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 7 days ago
                    interval = '1 day';
                    break;
                default:
                    return res.status(400).json({
                        message: 'Invalid range parameter',
                        supportedRanges: ['15min', '1hr', '12hr', '1day', '3day', '7day','14day','1month']
                    });
            }
            
            const fromFormatted = fromDate.toISOString().slice(0, 19).replace('T', ' ');
            const toFormatted = now.toISOString().slice(0, 19).replace('T', ' ');
            
            console.log(`📊 Dashboard query - Range: ${range}, Interval: ${interval}`);
            


               let orderQuery = `SELECT
                toStartOfInterval(event_time, INTERVAL ${interval}) AS time_bucket,
                countIf(event_type = 3) AS total_orders
            FROM orders_fact
            WHERE event_time BETWEEN '${fromFormatted}' AND '${toFormatted}'
            GROUP BY time_bucket
            ORDER BY time_bucket`;

            let productViewQuery = `SELECT
                toStartOfInterval(event_time, INTERVAL ${interval}) AS time_bucket,
                countIf(event_type = 1) AS total_product_views
            FROM orders_fact
            WHERE event_time BETWEEN '${fromFormatted}' AND '${toFormatted}'
            GROUP BY time_bucket
            ORDER BY time_bucket`;

            let cartQuery = `SELECT
                toStartOfInterval(event_time, INTERVAL ${interval}) AS time_bucket,
                countIf(event_type = 2) AS total_carts
            FROM orders_fact
            WHERE event_time BETWEEN '${fromFormatted}' AND '${toFormatted}'
            GROUP BY time_bucket
            ORDER BY time_bucket`;

        console.log(orderQuery);

        let aovQuery = `SELECT
            toStartOfInterval(event_time, INTERVAL ${interval}) AS time_bucket,
            avg(total_amount) AS average_order_value
        FROM orders_fact
        WHERE event_time BETWEEN '${fromFormatted}' AND '${toFormatted}'
        GROUP BY time_bucket
        ORDER BY time_bucket`;

        console.log(aovQuery);

        // Debug queries to understand data
       

        let topCities = `SELECT
            city,
            count(*) AS total_orders
        FROM orders_fact
        WHERE event_time BETWEEN '${fromFormatted}' AND '${toFormatted}'
            AND city != '' 
            AND city IS NOT NULL
            AND event_type = 3
        GROUP BY city
        ORDER BY total_orders DESC
        LIMIT 10`;

        let topPaymentMethods = `SELECT
            payment_method,
            count(*) AS total_orders
        FROM orders_fact
        WHERE event_time BETWEEN '${fromFormatted}' AND '${toFormatted}'
            AND payment_method != '' 
            AND payment_method IS NOT NULL
            AND event_type = 3
        GROUP BY payment_method
        ORDER BY total_orders DESC
        LIMIT 10`;

        let topCompanies = `SELECT
            company,
            count(*) AS total_orders
        FROM orders_fact
        WHERE event_time BETWEEN '${fromFormatted}' AND '${toFormatted}'
            AND company != '' 
            AND company IS NOT NULL
            AND event_type = 3
        GROUP BY company
        ORDER BY total_orders DESC
        LIMIT 10`;

        let topCategories = `SELECT
            category,
            count(*) AS total_orders
        FROM orders_fact
        WHERE event_time BETWEEN '${fromFormatted}' AND '${toFormatted}'
            AND category != '' 
            AND category IS NOT NULL
            AND event_type = 3
        GROUP BY category
        ORDER BY total_orders DESC
        LIMIT 10`;

        let topSources = `SELECT
            source,
            count(*) AS total_orders
        FROM orders_fact
        WHERE event_time BETWEEN '${fromFormatted}' AND '${toFormatted}'
            AND source != '' 
            AND source IS NOT NULL
            AND event_type = 3
        GROUP BY source
        ORDER BY total_orders DESC
        LIMIT 5`;


            const [
                orderResult,
                productViewResult,
                cartResult,
                aovResult,
                topCitiesResult,
                topPaymentMethodsResult,
                topCompaniesResult,
                topCategoriesResult,
                topSourcesResult
            ] = await Promise.all([
                clickhouse.query({ query: orderQuery }),
                clickhouse.query({ query: productViewQuery }),
                clickhouse.query({ query: cartQuery }),
                clickhouse.query({ query: aovQuery }),
                clickhouse.query({ query: topCities }),
                clickhouse.query({ query: topPaymentMethods }),
                clickhouse.query({ query: topCompanies }),
                clickhouse.query({ query: topCategories }),
                clickhouse.query({ query: topSources }),
            ]);

            
           
            // Extract the actual data from ClickHouse result
            const orderData = await orderResult.json();
            const productViewData = await productViewResult.json();
            const cartData = await cartResult.json();
            const aovData = await aovResult.json();
            const topCitiesData = await topCitiesResult.json();
            const topPaymentMethodsData = await topPaymentMethodsResult.json();
            const topCompaniesData = await topCompaniesResult.json();
            const topCategoriesData = await topCategoriesResult.json();
            const topSourcesData = await topSourcesResult.json();

            // Log debug information
            return res.status(200).json({ 
                message: 'Dashboard data fetched successfully',
                data: {
                    orderData: orderData?.data,
                    productViewData: productViewData?.data,
                    cartData: cartData?.data,
                    aovData: aovData?.data,
                },
                stats : {
                    topCities: topCitiesData?.data,
                    topPaymentMethods: topPaymentMethodsData?.data,
                    topCompanies: topCompaniesData?.data,
                    topCategories: topCategoriesData?.data,
                    topSources: topSourcesData?.data,
                },
              
                summary: {
                    orderCount: orderData?.data?.length || 0,
                    productViewCount: productViewData?.data?.length || 0,
                    cartCount: cartData?.data?.length || 0,
                    totalDataPoints: (orderData?.data?.length || 0) + (productViewData?.data?.length || 0) + (cartData?.data?.length || 0)
                }
            });  
        } catch (error) {
            console.error('Error getting dashboard data:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new ClickhouseController();