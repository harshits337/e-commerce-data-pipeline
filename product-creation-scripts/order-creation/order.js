const { Client } = require('pg');
const axios = require('axios');

const uuid = require('uuid')
// PostgreSQL config
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'admin123',
  database: 'ecommerce_db',
});

// Example: 100 cities (can expand to full 100)
const cities = [
  'Mumbai','Delhi','Bengaluru','Hyderabad','Ahmedabad','Chennai','Kolkata','Surat','Pune','Jaipur',
  'Lucknow','Kanpur','Nagpur','Indore','Thane','Bhopal','Visakhapatnam','Pimpri-Chinchwad','Patna','Vadodara',
  // Add remaining cities...
];

// Payment methods
const paymentMethods = ['COD', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'];

// Source
const sources = ['APP', 'WEB', 'Referral'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fetch all users and products
async function fetchData() {
  const usersRes = await client.query('SELECT id FROM users');
  const productsRes = await client.query('SELECT id FROM products');

  const userIds = usersRes.rows.map(u => u.id);
  const productIds = productsRes.rows.map(p => p.id);

  console.log(`Fetched ${userIds.length} users and ${productIds.length} products`);
  return { userIds, productIds };
}

// Random action generator
async function simulateAction(iteration, userIds, productIds) {
  const action = getRandomElement(['view-product', 'add-cart', 'place-order']);
  const userId = getRandomElement(userIds);
  const productId = getRandomElement(productIds);
  const now = Date.now();
  const sevenDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const randomTime = new Date(sevenDaysAgo + Math.random() * (now - sevenDaysAgo)).toISOString();
  const timestamp = randomTime;

  try {
    switch (action) {
      case 'view-product':
        await axios.post('http://localhost:8001/api/v1/order-management/view-product', {
          userId,
          productId,
          timestamp
        });
        console.log(`[${iteration}] ${timestamp} - VIEW PRODUCT -> User: ${userId}, Product: ${productId}`);
        break;

      case 'add-cart':
        const quantity = getRandomInt(1, 5);
        await axios.post('http://localhost:8001/api/v1/order-management/add-cart', {
          userId,
          productId,
          quantity,
          timestamp
        });
        console.log(`[${iteration}] ${timestamp} - ADD TO CART -> User: ${userId}, Product: ${productId}, Quantity: ${quantity}`);
        break;

      case 'place-order':
        const qty = getRandomInt(1, 5);
        const paymentMethod = getRandomElement(paymentMethods);
        const city = getRandomElement(cities);
        const source = getRandomElement(sources);

        await axios.post('http://localhost:8001/api/v1/order-management/place-order', {
          orderId : uuid.v4(),
          userId,
          productId,
          quantity: qty,
          paymentMethod,
          shippingCity: city,
          source,
          timestamp
        });
        console.log(`[${iteration}] ${timestamp} - PLACE ORDER -> User: ${userId}, Product: ${productId}, Quantity: ${qty}, Payment: ${paymentMethod}, City: ${city}, Source: ${source}`);
        break;
    }
  } catch (err) {
    console.error(`[${iteration}] ERROR during ${action} for User: ${userId}, Product: ${productId} -> ${err.message}`);
  }
}

async function main(iterations = 1000) {
  try {
    await client.connect();
    console.log(`[${new Date().toISOString()}] Connected to PostgreSQL`);

    const { userIds, productIds } = await fetchData();

    for (let i = 1; i <= iterations; i++) {
      await simulateAction(i, userIds, productIds);
      await new Promise(r => setTimeout(r, 10)); // small delay
    }

  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error connecting to DB or fetching data: ${err.message}`);
  } finally {
    await client.end();
    console.log(`[${new Date().toISOString()}] Simulation completed, connection closed`);
  }
}

main();
