const Category = require("../models/Category");
const multer = require("multer");
const fs = require("fs");

let imageUrl = "";

const Storage = multer.diskStorage({
  destination: "public/categories",
  filename: (req, file, cb) => {
    imageUrl = Date.now() + file.originalname;
    cb(null, imageUrl);
  },
});

const upload = multer({
  storage: Storage,
}).single("image");

module.exports.index = async (req, res) => {
  const categories = await Category.find({});
  res.status(200).send(categories);
};

module.exports.view = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.status(200).send(category);
  } else {
    res.status(400).send({
      message: "not found",
    });
  }
};

module.exports.store = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newCategory = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        image: "categories/" + imageUrl,
      });
      newCategory
        .save()
        .then(() => {
          res.status(201).send(newCategory);
        })
        .catch((err) => {
          res.send({ error: err.message });
          // console.log(err.message);
        });
    }
  });
};

module.exports.destroy = (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        res.status(200).send({ success: true, message: "category deleted" });
      } else {
        res.status(404).send({ success: false, message: "category not found" });
      }
    })
    .catch((err) => {
      res.status(400).send({ error: err });
    });
};
