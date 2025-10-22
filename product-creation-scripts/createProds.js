const { Client } = require('pg');

// PostgreSQL connection config
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'admin123',
  database: 'ecommerce_db',
});

// Base categories and companies
const categories = {
  Electronics: ['Smartphone', 'Laptop', 'Headphones', 'Camera', 'Tablet', 'Smartwatch', 'Bluetooth Speaker', 'Gaming Console', 'Monitor', 'Keyboard', 'Mouse', 'Router', 'Printer', 'Drone', 'Projector', 'VR Headset', 'Hard Drive', 'SSD', 'Power Bank', 'Webcam'],
  Clothing: ['T-Shirt', 'Jeans', 'Jacket', 'Shoes', 'Sweater', 'Hoodie', 'Dress', 'Skirt', 'Shorts', 'Socks', 'Cap', 'Belt', 'Gloves', 'Scarf', 'Sneakers', 'Boots', 'Underwear', 'Swimwear', 'Coat', 'Blazer'],
  Books: ['Novel', 'Textbook', 'Biography', 'Comics', 'Magazine', 'Cookbook', 'Poetry', 'Guide', 'Dictionary', 'Journal', 'Thriller', 'Mystery', 'Romance', 'Science', 'History', 'Travel', 'Self-Help', 'Children Book', 'Fantasy', 'Adventure'],
  Furniture: ['Chair', 'Table', 'Sofa', 'Bed', 'Wardrobe', 'Bookshelf', 'Desk', 'Dresser', 'Nightstand', 'Cabinet', 'Coffee Table', 'TV Stand', 'Dining Table', 'Recliner', 'Bench', 'Stool', 'Armchair', 'Ottoman', 'Side Table', 'Shelf'],
  Sports: ['Football', 'Basketball', 'Tennis Racket', 'Cricket Bat', 'Golf Club', 'Yoga Mat', 'Dumbbell', 'Treadmill', 'Helmet', 'Gloves', 'Cycling Bike', 'Running Shoes', 'Swim Goggles', 'Jersey', 'Skateboard', 'Rugby Ball', 'Hockey Stick', 'Punching Bag', 'Jump Rope', 'Fitness Tracker'],
  Beauty: ['Lipstick', 'Foundation', 'Mascara', 'Eyeliner', 'Blush', 'Perfume', 'Shampoo', 'Conditioner', 'Moisturizer', 'Body Lotion', 'Hair Gel', 'Nail Polish', 'Sunscreen', 'Face Mask', 'Hair Dryer', 'Hair Straightener', 'Beard Oil', 'Soap', 'Shaving Cream', 'Hair Spray'],
};

const companies = {
  Electronics: ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 'Google', 'LG', 'OnePlus', 'Xiaomi', 'Canon', 'Nikon', 'Bose', 'JBL', 'Panasonic', 'Fitbit', 'Razer'],
  Clothing: ['Nike', 'Adidas', 'Puma', 'Levi’s', 'Zara', 'H&M', 'Uniqlo', 'Reebok', 'Under Armour', 'Tommy Hilfiger', 'Gucci', 'Louis Vuitton', 'Gap', 'Forever21', 'Abercrombie', 'New Balance', 'Champion', 'Fila', 'Superdry', 'Columbia'],
  Books: ['Penguin', 'HarperCollins', 'Oxford', 'Random House', 'Macmillan', 'Simon & Schuster', 'Hachette', 'Scholastic', 'Bloomsbury', 'Pearson', 'Wiley', 'Cengage', 'McGraw-Hill', 'DK', 'Cambridge', 'Princeton', 'MIT Press', 'Routledge', 'Springer', 'Palgrave'],
  Furniture: ['IKEA', 'Ashley', 'Wayfair', 'Herman Miller', 'La-Z-Boy', 'West Elm', 'CB2', 'Pottery Barn', 'Steelcase', 'FLEXFORM', 'Restoration Hardware', 'Arhaus', 'Muji', 'Crate & Barrel', 'Room & Board', 'Natuzzi', 'BoConcept', 'Kartell', 'Boconcept', 'HNI'],
  Sports: ['Adidas', 'Nike', 'Puma', 'Reebok', 'Under Armour', 'Decathlon', 'Wilson', 'Yonex', 'Head', 'Speedo', 'Asics', 'New Balance', 'Spalding', 'Mitre', 'Slazenger', 'Columbia', 'Easton', 'Rawlings', 'RDX', 'Champion'],
  Beauty: ['L’Oreal', 'Maybelline', 'Nivea', 'Dove', 'Sephora', 'MAC', 'Revlon', 'Clinique', 'Estée Lauder', 'Garnier', 'Neutrogena', 'The Body Shop', 'Olay', 'Pond’s', 'Bioderma', 'Kiehl’s', 'Urban Decay', 'Chanel', 'Lancôme', 'Shiseido'],
};

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function createProducts() {
  let totalProducts = 0;

  while (totalProducts < 500) {
    for (const category of Object.keys(categories)) {
      const productNameBase = getRandomElement(categories[category]);
      const company = getRandomElement(companies[category]);
      const price = (Math.random() * 10000 + 10).toFixed(2);
      // Add a suffix to create variations and reach 500 products
      const suffix = ['Pro', 'XL', 'Plus', 'Max', 'Mini', '2025 Edition', 'Limited', 'Special', 'Eco', 'Lite'];
      const name = `${productNameBase} ${getRandomElement(suffix)}`;

      await client.query(
        'INSERT INTO products (name, category, price, company) VALUES ($1, $2, $3, $4)',
        [name, category, price, company]
      );

      totalProducts++;
      if (totalProducts >= 500) break;
    }
  }

  console.log('500 products generated.');
}

async function main() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    await createUsers();
    // await createProducts();
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

main();
