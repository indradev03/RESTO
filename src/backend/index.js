import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/adminRoute.js';
import tableRoutes from './routes/table/tableRoute.js';
import productRoutes from './routes/products/productRoute.js'; // ✅ NEW: import product routes

dotenv.config();

const app = express();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to log each request (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static serving for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/products', productRoutes); // ✅ NEW: register product routes

// 404 - Not Found
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unexpected server error:', err);

  if (err.name === 'MulterError') {
    return res.status(400).json({ error: 'File upload error', detail: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error', detail: err.message });
});

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
