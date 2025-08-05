const Product = require("../models/Product");

const multer = require("multer");

let imageUrl = "";

const Storage = multer.diskStorage({
  destination: "public/products",
  filename: (req, file, cb) => {
    imageUrl = Date.now() + file.originalname;
    cb(null, imageUrl);
  },
});

const upload = multer({
  storage: Storage,
}).single("image");

module.exports.index = async (req, res) => {
  const products = await Product.find({})
    .select("name image description category price")
    .populate("category");
  res.status(200).send(products);
};

module.exports.store = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: "products/" + imageUrl,
        // images:req.body.
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      });

      newProduct
        .save()
        .then(() => {
          res.status(201).send(newProduct);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({ err: err });
        });
    }
  });
};

module.exports.view = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  // fetch related product items
  const relatedItems = await Product.find({
    category: product.category,
    _id: { $ne: req.params.id },
  }).limit(5);
  // console.log({ "product detail": product, "relatid products": relatedItems });
  if (!product) {
    res.status(404).send({ err: "not found" });
  } else {
    res.status(200).send({ product, relatedItems });
  }
};

module.exports.featured = async (req, res) => {
  const products = await Product.find({ isFeatured: true });
  res.send(products);
};

// const express = require("express");
// const path = require("path");
// const fs = require("fs");
// const formidable = require("formidable");
// const app = express();

// app.post("/upload-file", function (req, res) {
//   const form = formidable();
//   form.parse(req, function (err, fields, files) {
//     let oldPath = files.newFile.filepath;
//     let newPath =
//       path.join(__dirname, "uploads") + "/" + files.newFile.originalFilename;
//     let rawData = fs.readFileSync(oldPath);
//     fs.writeFile(newPath, rawData, function (err) {
//       if (err) console.log(err);
//       return res.send("Successfully uploaded");
//     });
//   });
// });
// app.use("/*", function (req, res) {
//   return res.status(200).send({ message: "message received" });
// });
// app.listen(8085, function () {
//   console.log("server started");
// });
