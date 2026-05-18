const mongoose = require('mongoose');
require('dotenv').config();

const adminSeeder = require('./adminSeeder');
const categorySeeder = require('./categorySeeder');
const userSeeder = require('./userSeeder');
const productSeeder = require('./productSeeder');

// This function now safely runs using the existing connection from server.js
const seedDatabase = async () => {
  try {
    console.log('\nStarting database seeding...\n');

    await categorySeeder();
    await adminSeeder();
    await userSeeder();
    await productSeeder();

    console.log('\nDatabase seeding completed successfully!\n');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;

// --- STANDALONE RUNNER ---
// This block ONLY executes if you run 'node seeders/index.js' directly in your terminal.
// It is completely ignored when imported into server.js.
if (require.main === module) {
  const runStandalone = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    try {
      console.log('Running seeder independently...');
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB');

      await seedDatabase();

      await mongoose.disconnect();
      console.log('Disconnected from MongoDB safely.');
      process.exit(0);
    } catch (err) {
      console.error('Standalone seeder connection failed:', err);
      process.exit(1);
    }
  };
  runStandalone();
}