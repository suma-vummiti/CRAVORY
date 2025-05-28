import dotenv from 'dotenv';
dotenv.config();

import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const frontend_url = "http://localhost:5173";

// 1. PLACE ORDER
// 1. PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100 // ₹200 → 20000 paisa
      },
      quantity: item.quantity
    }));

    // Add delivery charge (e.g., ₹40)
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 40 * 100 // ₹40
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      metadata: { orderId: newOrder._id.toString() },
      payment_intent_data: {
        metadata: { orderId: newOrder._id.toString() }
      }
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};


// 2. VERIFY ORDER UI Redirection Handler
const verifyOrder = async (req, res) => {
  res.json({ success: true, message: "Redirect received, waiting for Stripe confirmation" });
};

// 3. USER ORDERS
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// 4. LIST ORDERS
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error listing orders" });
  }
};

// 5. UPDATE STATUS
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating status" });
  }
};

// 6. STRIPE WEBHOOK HANDLER
const stripeWebhookHandler = async (req, res) => {
  let event;

  try {
    const signature = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    const session = event.data.object;
    const orderId = session?.metadata?.orderId || session?.payment_intent?.metadata?.orderId;

    console.log('Stripe Webhook Event:', event.type);
    console.log('Session Data:', session);

    if (!orderId) {
      console.warn('No orderId found in webhook metadata.');
      return res.status(400).send('Missing orderId');
    }

    switch (event.type) {
      case 'checkout.session.completed':
        if (session.payment_status === 'paid') {
          await orderModel.findByIdAndUpdate(orderId, { payment: true });
          console.log(`✅ Order ${orderId} marked as paid.`);
        }
        break;

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed':
      case 'payment_intent.payment_failed':
        await orderModel.findByIdAndDelete(orderId);
        console.log(`❌ Order ${orderId} deleted due to failed/expired payment.`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};


export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  stripeWebhookHandler
};
