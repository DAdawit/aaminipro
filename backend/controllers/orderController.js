const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
module.exports.index = async (req, res) => {
  await Order.find()
    .populate("user", " name email isAdmin")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log("error =>", err);
      return res.status(500).send({ err: err.Error });
    });
};

module.exports.view = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email isAdmin")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
  res.send(order);
};

module.exports.store = async (req, res) => {
  // putting order items id in to an array
  const orderItemsIds = Promise.all(
    req.body.OrderItems.map(async (Item) => {
      let newOrderItem = new OrderItem({
        quantity: Item.quantity,
        product: Item.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  // order items list saved in orderItem collection
  const orderItemsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsResolved.map(async (orderItemId) => {
      // fetch orderitem with the product
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      // calculate price of product whit quantity
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  // calculate totalPrice of all orderd itmes
  const totalPrice = (await totalPrices).reduce((a, b) => a + b, 0);

  // create order
  const order = new Order({
    orderItems: orderItemsResolved,
    shippingAddress1: req.body.shippingAddress1,
    country: req.body.country,
    city: req.body.city,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  console.log("order", order);
  await order
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports.update = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) {
    return res.status(400).send({ error: "order not found" });
  }
  return res.send(order);
};

module.exports.destroy = (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        // loop and delete order items
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res.send(order);
      } else {
        return res.status(404).send({ error: "order not found" });
      }
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
};

module.exports.getTotalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    return res
      .status(404)
      .send({ message: "order sale can not bet generated" });
  } else {
    res.send({ totalSales: totalSales.pop().totalSales });
  }
};

module.exports.orderCount = async (req, res) => {
  const orderCount = await Order.countDocuments();
  if (!orderCount) {
    res.status(500).send({ success: false });
  }
  res.send({ orderCount: orderCount });
};

module.exports.getUserOrderedList = async (req, res) => {
  const userOrderedList = await Order.find({ user: req.params.id }).populate({
    path: "orderItems",
    populate: {
      path: "product",
      populate: "category",
    },
  });
  if (!userOrderedList) {
    res.status(500).send({ success: false });
  }
  res.send({ orderCount: userOrderedList });
};
