import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
      default: null,
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
