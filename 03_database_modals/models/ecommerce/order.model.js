import moongoose from "mongoose";

const orderItemSchema = new moongoose.Schema({
  // MINI SCHEMA TO USE IN ANOTHER SCHEMA
  prductId: {
    type: moongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new moongoose.Schema(
  {
    customer: {
      type: moongoose.Schema.Types.ObjectId,
      required: "User",
    },
    orderPrice: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    orderItems: {
      type: { orderItemSchema },
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "DELIVERED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Order = moongoose.model("Order", orderSchema);
