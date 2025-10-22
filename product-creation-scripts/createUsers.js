const { Client } = require('pg');
const { faker } = require('@faker-js/faker');

// PostgreSQL connection config
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'admin123',
  database: 'ecommerce_db',
});

async function createUsers(n = 10000) {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    for (let i = 0; i < n; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      await client.query(
        'INSERT INTO users (first_name, last_name) VALUES ($1, $2)',
        [firstName, lastName]
      );

      if ((i + 1) % 1000 === 0) {
        console.log(`${i + 1} users inserted...`);
      }
    }

    console.log(`Successfully inserted ${n} users.`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

createUsers();
