const WishList = require("../models/WishList");

module.exports.index = async (req, res) => {
  const cartItems = await WishList.find().populate("product");
  if (!cartItems) {
    return res.status(404).send({ message: "not found" });
  }
  res.send(cartItems);
};
module.exports.view = async (req, res) => {
  WishList.findById(req.params.id)
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
  const result = await WishList.findOne({
    user: req.body.user,
    product: req.body.product,
  });

  if (result) {
    const wishListItem = await WishList.findByIdAndUpdate(
      result._id,
      {
        quantity: result.quantity + 1,
      },
      {
        new: true,
      }
    );

    res.status(200).send(wishListItem);
    // res.status(400).send({ message: "product already exist in your WishList" });
  } else {
    const WishListItem = new WishList(req.body);
    WishListItem.save()
      .then((result) => {
        return res.status(201).send(result);
      })
      .catch((err) => {
        return res.status(400).send({ error: err });
      });
  }
};

module.exports.destroy = async (req, res) => {
  WishList.findByIdAndRemove(req.params.id)
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

module.exports.userWishList = async (req, res) => {
  const whisListItems = await WishList.find({ user: req.params.id }).populate(
    "product"
  );
  if (!whisListItems) {
    return res.status(404).send({ message: "not found" });
  }
  res.send(whisListItems);
};
