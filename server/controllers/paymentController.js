import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const razorpay = getRazorpay();
    const options = {
      amount: Math.round(order.total * 100),
      currency: 'INR',
      receipt: order.orderId,
    };

    const rzpOrder = await razorpay.orders.create(options);
    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    await Payment.create({
      order: order._id,
      user: req.user._id,
      razorpayOrderId: rzpOrder.id,
      amount: order.total,
      status: 'created',
    });

    res.json({ success: true, order: rzpOrder, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const order = await Order.findById(orderId);
    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.status = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', note: 'Payment received' });
    await order.save();

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: 'paid' }
    );

    res.json({ success: true, message: 'Payment verified successfully', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
