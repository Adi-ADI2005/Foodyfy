import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';

export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, couponCode, notes, customerPhone } = req.body;

    if (!customerPhone || customerPhone.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Mobile number is required to place an order. Please update your profile.' });
    }
    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zip) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required to place an order.' });
    }

    let subtotal = items.reduce((acc, item) => {
      const addonTotal = (item.addons || []).reduce((a, b) => a + b.price, 0);
      return acc + (item.price + addonTotal) * item.quantity;
    }, 0);

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.expiryDate > new Date() && coupon.usedCount < coupon.usageLimit && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount);
        } else {
          discount = Math.min(coupon.discountValue, coupon.maxDiscount);
        }
        coupon.usedCount++;
        await coupon.save();
      }
    }

    const deliveryFee = subtotal >= 500 ? 0 : 30;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal - discount + deliveryFee + tax;

    const order = await Order.create({
      user: req.user._id,
      items,
      deliveryAddress,
      customerPhone,
      paymentMethod,
      couponCode,
      notes,
      subtotal,
      discount,
      deliveryFee,
      tax,
      total,
      statusHistory: [{ status: 'placed', note: 'Order placed successfully' }],
    });

    if (['upi_phonepe', 'upi_googlepay', 'upi_paytm', 'upi_navi', 'upi_other', 'upi_qr'].includes(paymentMethod)) {
      order.paymentStatus = 'paid';
      await order.save();
    }

    await Notification.create({
      user: req.user._id,
      title: 'Order Placed!',
      message: `Your order ${order.orderId} has been placed successfully.`,
      type: 'order',
      orderId: order._id,
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (['delivered', 'on_the_way'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    }
    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Order cancelled by user' });
    await order.save();
    res.json({ success: true, message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
    if (status === 'delivered') order.paymentStatus = 'paid';
    await order.save();

    await Notification.create({
      user: order.user._id,
      title: 'Order Update',
      message: `Your order ${order.orderId} is now ${status.replace('_', ' ')}.`,
      type: 'order',
      orderId: order._id,
    });

    res.json({ success: true, message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: { $in: ['placed', 'confirmed', 'preparing'] } });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const revenueAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const recentOrders = await Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(10);

    const salesData = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: { totalOrders, pendingOrders, deliveredOrders, totalRevenue },
      recentOrders,
      salesData,
      ordersByStatus,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    if (coupon.expiryDate < new Date()) return res.status(400).json({ success: false, message: 'Coupon expired' });
    if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, message: 'Coupon limit reached' });
    if (orderAmount < coupon.minOrderAmount) return res.status(400).json({ success: false, message: `Minimum order amount is ₹${coupon.minOrderAmount}` });

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.min((orderAmount * coupon.discountValue) / 100, coupon.maxDiscount);
    } else {
      discount = Math.min(coupon.discountValue, coupon.maxDiscount);
    }

    res.json({ success: true, message: 'Coupon applied!', discount, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
