const mongoose = require("mongoose");

const OrderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
module.exports = OrderItem;
