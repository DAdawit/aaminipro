const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const fileUploader = require("../utils/fileUploader");

router.get("/", (req, res) => {
  res.send({
    message: "wellcome",
  });
});

router.get("/users", userController.index);
router.get("/users/:id", userController.getUser);
router.post("/users", userController.registerUser);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/verifyToken", userController.verifyToken);

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
  try {
    const path = fileUploader(req, "products");
    res.send(path);
  } catch (error) {
    console.error("Error during file upload:", error);
    return res.status(500).send("Internal Server Error");
  }
  const path = fileUploader(req, res, "products");
  res.send(path);
});

module.exports = router;
