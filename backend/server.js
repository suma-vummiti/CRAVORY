import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhookHandler } from './controllers/orderController.js';

const app = express();
const port = 4000;

// CORS Middleware
app.use(cors());

// ⚠️ Stripe Webhook Endpoint - must come BEFORE express.json()
app.post('/api/order/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

// General Middleware
app.use(express.json()); // parse application/json

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter); // includes placeOrder, verifyOrder, etc.
app.use('/images', express.static('uploads')); // serve uploaded images

// Root Route
app.get('/', (req, res) => {
  res.send('API working');
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
