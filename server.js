const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. Import the cors package
require('dotenv').config();

const seedDatabase = require('./seeders/index');

// Import all routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// Middleware
// 2. Allow origins from ALL sites (Current Setup)
app.use(cors());
app.use(express.json());


/* 
======================================================================
💡 HOW TO RESTRICT ORIGINS IN THE FUTURE (Instead of using app.use(cors()))
======================================================================

👉 OPTION A: Allow specific domains (Localhost + Your Live Domain)
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-actual-domain.com']
}));

👉 OPTION B: Dynamic / Environment-based setup (Recommended for production)
const allowedOrigins = [
  'http://localhost:3000',                  // Your frontend React/Vue/NextJS local server
  'http://localhost:5173',                  // Your frontend Vite local server (if using Vite)
  'https://www.your-actual-domain.com',     // Your production frontend domain
  'https://your-actual-domain.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Allow cookies/headers if your app needs them later
}));
======================================================================
*/

// Connect to MongoDB first, then seed the database
mongoose.connect(mongoUri)
  .then(async () => {
    console.log('MongoDB Connected Successfully.');

    // Triggering the database seed safely now that the connection is alive
    await seedDatabase();
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
  });

// ═══════════════════════════════════════════════════════════
// Register all API routes with /api prefix
// ═══════════════════════════════════════════════════════════
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/admin', adminRoutes);

// Start the Express Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});