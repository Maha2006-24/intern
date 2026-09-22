import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
    },

    customerEmail: {
      type: String,
      required: true,
    },

    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    /* ==========================
       PAYMENT DETAILS
    ========================== */

    paymentMethod: {
      type: String,
      enum: ["Cash On Delivery", "Online Payment"],
      default: "Cash On Delivery",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    transactionId: {
      type: String,
      default: "",
    },

    /* ==========================
       ORDER STATUS
    ========================== */

    status: {
      type: String,
      default: "Processing",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);