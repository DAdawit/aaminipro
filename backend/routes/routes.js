const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const categoryController = require("../controllers/categoryController");
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const cartController = require("../controllers/CartController");
const wishListController = require("../controllers/wishListController");
const { requireAuth } = require("../authMiddleware/authMiddleware");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const fileUploader = require("../utils/fileUploader");

router.get("/", (req, res) => {
  res.send({
    message: "wellcome",
  });
});
router.get("/categories", categoryController.index);
router.get("/categoryies/:id", categoryController.view);
router.post("/categories", categoryController.store);
router.delete("/categories/:id", categoryController.destroy);

router.get("/products", productsController.index);
router.get("/products/:id", productsController.view);
router.post("/products", productsController.store);
router.get("/products/featured/", productsController.featured);

router.get("/users", userController.index);
router.get("/users/:id", userController.getUser);
router.post("/users", userController.registerUser);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/verifyToken", userController.verifyToken);

router.post("/orders", orderController.store);
router.get("/orders", orderController.index);
router.get("/orders/:id", orderController.view);
router.put("/orders/:id", orderController.update);
router.delete("/orders/:id", orderController.destroy);
router.get("/getTotalSales", orderController.getTotalSales);
router.get("/orderCount", orderController.orderCount);
router.get("/userOrderedList/:id", orderController.getUserOrderedList);

router.get("/cart", cartController.index);
router.get("/cart/:id", cartController.view);
router.delete("/cart/:id", cartController.destroy);
router.post("/cart", cartController.store);
router.get("/userCart/:id", cartController.userCart);
router.put(
  "/updateCartProductQuantitiy/:id",
  cartController.updateCartProductQuantitiy
);

router.get("/whitList", wishListController.index);
router.get("/whitList/:id", wishListController.view);
router.delete("/whitList/:id", wishListController.destroy);
router.post("/whitList", wishListController.store);
router.get("/userWishList/:id", wishListController.userWishList);

router.post("/upload-file", function async(req, res) {
  // const form = new formidable.IncomingForm();
  // form.parse(req, function (err, fields, files) {
  //   // Ensure uploads directory exists
  //   const uploadDir = path.join(__dirname, "..", "uploads");
  //   if (!fs.existsSync(uploadDir)) {
  //     fs.mkdirSync(uploadDir);
  //   }

  //   let file = files.newFile[0];
  //   let oldPath = file.filepath;
  //   let newPath = path.join(uploadDir, file.originalFilename);

  //   fs.readFile(oldPath, (err, rawData) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).send("File read error");
  //     }
  //     fs.writeFile(newPath, rawData, function (err) {
  //       if (err) {
  //         console.log(err);
  //         return res.status(500).send("File save error");
  //       }
  //       console.log("File uploaded successfully", newPath);
  //       return res.json({ message: "Successfully uploaded", fields, files });
  //     });
  //   });
  // });
  const path = fileUploader(req, res, "products");
  res.status(200).send(path);
});

module.exports = router;
