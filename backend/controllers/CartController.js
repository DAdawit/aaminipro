const Cart = require("../models/Cart");
const { getUserId } = require("../controllers/userController");
module.exports.index = async (req, res) => {
  const cartItems = await Cart.find().populate("product");
  if (!cartItems) {
    return res.status(404).send({ message: "not found" });
  }
  res.send(cartItems);
};
module.exports.view = async (req, res) => {
  await Cart.findById(req.params.id)
    .populate("product")
    .then((result) => {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(404).send({ success: false, message: "item not found" });
      }
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
};
module.exports.store = async (req, res) => {
  const result = await Cart.findOne({
    user: req.body.user,
    product: req.body.product,
  });

  if (result) {
    // console.log(result);
    const cartItem = await Cart.findByIdAndUpdate(
      result._id,
      {
        quantity: result.quantity + 1,
      },
      {
        new: true,
      }
    );

    res.status(200).send(cartItem);
  } else {
    const cartItem = new Cart(req.body);
    cartItem
      .save()
      .then((result) => {
        return res.status(201).send(result);
      })
      .catch((err) => {
        return res.status(400).send({ error: err });
      });
  }
};

module.exports.destroy = async (req, res) => {
  Cart.findByIdAndRemove(req.params.id)
    .then((result) => {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(404).send({ success: false, message: "item not found" });
      }
    })
    .catch((err) => {
      res.status(500).send({ error: err });
    });
};

module.exports.userCart = async (req, res) => {
  const cartItems = await Cart.find({ user: req.params.id }).populate(
    "product"
  );

  // calculate total price
  let totalPrice = 0;
  for (let i = 0; i < cartItems.length; i++) {
    totalPrice =
      totalPrice + cartItems[i].product.price * cartItems[i].quantity;
  }

  return res.send({ totalPrice: totalPrice, cartItems: cartItems });
};

module.exports.updateCartProductQuantitiy = async (req, res) => {
  const cartItem = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      quantity: req.body.quantity,
    },
    {
      new: true,
    }
  );
  return res.send(cartItem);
};
