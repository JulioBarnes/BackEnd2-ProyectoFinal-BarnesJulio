import mongoose from "mongoose";

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
  ticket: {
    type: {
      orderNumber: { type: Number, required: true },
      date: { type: Date, required: true, default: Date.now }, // Fecha automática
    },
    default: null, // Un solo ticket por carrito
  },
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: Number,
      },
    ],
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "cancelled", "completed"],
    default: "pending",
  },
  totalPrice: {
    type: Number,
    //required: true,
  },
});

cartSchema.pre("find", function () {
  this.populate("products");
  this.populate("user");
});

cartSchema.pre("findOne", function () {
  this.populate("products");
  this.populate("user");
});

export const cartModel = mongoose.model(cartsCollection, cartSchema);
