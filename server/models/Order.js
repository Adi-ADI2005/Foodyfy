import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    addons: [{ name: String, price: Number }],
  }],
  deliveryAddress: {
    label: String,
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  customerPhone: { type: String, default: '' },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 30 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  couponCode: { type: String, default: '' },
  paymentMethod: {
    type: String,
    enum: ['upi_phonepe', 'upi_googlepay', 'upi_paytm', 'upi_navi', 'upi_other', 'upi_qr', 'cod'],
    default: 'cod'
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
    default: 'placed'
  },
  statusHistory: [{
    status: String,
    time: { type: Date, default: Date.now },
    note: String,
  }],
  deliveryTime: { type: Date },
  notes: { type: String, default: '' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = '#FH' + Math.floor(10000 + Math.random() * 90000);
  }
  next();
});

export default mongoose.model('Order', orderSchema);
