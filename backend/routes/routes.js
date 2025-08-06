const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const fileUploader = require("../utils/fileUploader");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
router.get("/", (req, res) => {
  res.send({
    message: "wellcome",
  });
});

router.get("/users", userController.index);
router.get("/users/count", userController.getUserCount);
router.get("/users/:id", userController.getUser);
router.post("/users", userController.registerUser);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/verifyToken", userController.verifyToken);

router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id", userController.updateUser);
router.put("/users/updateProfile/:id", userController.updateProfilePicture);

router.post("/upload-file", function async(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, "..", "uploads/userPprofile");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    let file = files.profilePicture[0];
    let oldPath = file.filepath;
    let timestamp = Date.now();
    let newPath = path.join(uploadDir, `${timestamp}_${file.originalFilename}`);
    let imagePath = `/uploads/userPprofile/${timestamp}_${file.originalFilename}`;
    fs.readFile(oldPath, (err, rawData) => {
      if (err) {
        console.log(err);
        return res.status(500).send("File read error");
      }
      fs.writeFile(newPath, rawData, function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send("File save error");
        }
        console.log("File uploaded successfully", newPath);
        return res.json({
          message: "Successfully uploaded",
          fields,
          files,
          imagePath,
        });
      });
    });
  });
});

module.exports = router;
