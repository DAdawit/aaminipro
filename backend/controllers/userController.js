const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const maxAge = 3 * 24 * 60 * 60;
function createToken(id) {
  const secrete = process.env.SECRETE;

  const token = jwt.sign(
    {
      id: id,
    },
    secrete,
    {
      expiresIn: "1d",
    }
  );

  return token;
}

module.exports.index = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(200).send(users);
};

module.exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).send({ count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports.registerUser = async (req, res) => {
  // const { fullname, email, password, sex, age } = req.body;
  // // validate the input
  // if (!fullname || !email || !password || !sex || !age) {
  //   return res.status(400).send({
  //     message: "All fields are required!",
  //     fields: "name,email,password,sex,age",
  //   });
  // }
  // if (password.length < 6) {
  //   return res
  //     .status(400)
  //     .send({ message: "Password must be at least 6 characters long!" });
  // }
  // // validate sex enum
  // if (!["male", "female"].includes(sex)) {
  //   return res.status(400).json({ message: "Invalid sex value" });
  // }
  // // regex to validate email format
  // if (
  //   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  //   // regex to validate
  // ) {
  //   return res.status(400).send({ message: "Invalid email format!" });
  // }
  // // regex to validate password strength
  // if (
  //   !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(
  //     password
  //   )
  // ) {
  //   return res.status(400).send({
  //     message:
  //       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!",
  //   });
  // }

  // // validate age
  // if (typeof age !== "number" || age < 10 || age > 120) {
  //   return res.status(400).send({ message: "Invalid age value!" });
  // }
  // // check if the email already exists
  // const user = await User.findOne({ email });
  // if (user) {
  //   return res.status(400).send({ message: "Email already exists!" });
  // }
  let imagePath = "";

  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, "..", "uploads/userPprofile");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    let file = null;
    let oldPath = "";
    let newPath = "";
    if (files.profilePicture || files.profilePicture[0]) {
      file = files.profilePicture[0];
      oldPath = file.filepath;
      let timestamp = Date.now();
      newPath = path.join(uploadDir, `${timestamp}_${file.originalFilename}`);
      imagePath = `/uploads/userPprofile/${timestamp}_${file.originalFilename}`;
    }

    fs.readFile(oldPath, async (err, rawData) => {
      if (err) {
        console.log(err);
        return res.status(500).send("File read error");
      }
      fs.writeFile(newPath, rawData, async function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send("File save error");
        } else {
          // console.log(fields);
          const { fullname, email, password, sex, age } = fields;

          if (!fullname || !email || !password || !sex || !age) {
            return res.status(400).send({
              message: "All fields are required!",
              fields: "name,email,password,sex,age",
            });
          }
          if (password[0].length < 6) {
            return res.status(400).send({
              message: "Password must be at least 6 characters long!",
            });
          }
          // validate sex enum
          if (!["male", "female"].includes(sex[0])) {
            return res.status(400).json({ message: "Invalid sex value" });
          }
          // regex to validate email format
          if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email[0])
            // regex to validate
          ) {
            return res.status(400).send({ message: "Invalid email format!" });
          }
          // regex to validate password strength
          if (
            !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(
              password[0]
            )
          ) {
            return res.status(400).send({
              message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!",
            });
          }

          // validate age
          console.log("age", age[0]);
          if (
            // typeof age[0] !== "number" ||
            parseInt(age[0]) < 10 ||
            parseInt(age[0]) > 120
          ) {
            return res.status(400).send({ message: "Invalid age value!" });
          }
          // check if the email already exists
          const user = await User.findOne({ email: email[0] });
          if (user) {
            return res.status(400).send({ message: "Email already exists!" });
          }
          const newUser = new User({
            fullname: fullname[0],
            email: email[0],
            sex: sex[0],
            age: age[0],
            profilePicture: imagePath,
            password: bcrypt.hashSync(password[0], 8),
          });
          await newUser
            .save()
            .then(async (result) => {
              const token = await createToken(result._id);
              res.cookie("token", token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
              });
              // res.status(201).send({
              //   id: result._id,
              //   fullname: result.fullname,
              //   email: result.email,
              //   token,
              // });
              res.status(201).send({ user: result, token: token });
            })
            .catch((err) => {
              // console.log(err);
              res.status(400).send(err);
            });
          // res.send(fields);
        }
        // console.log("File uploaded successfully", newPath);
      });
    });
  });
  return 0;

  // const newUser = new User({
  //   fullname: fullname,
  //   email: email,
  //   sex: sex,
  //   age: age,
  //   profilePicture: imagePath,
  //   password: bcrypt.hashSync(password, 8),
  // });

  // await newUser
  //   .save()
  //   .then(async (result) => {
  //     const token = await createToken(result._id);
  //     res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 });
  //     res.status(201).send({
  //       id: result._id,
  //       fullname: result.fullname,
  //       email: result.email,
  //       token,
  //     });
  //     // res.status(201).send({ user: result, token: token });
  //   })
  //   .catch((err) => {
  //     // console.log(err);
  //     res.status(400).send(err);
  //   });
};

module.exports.getUser = async (req, res) => {
  // check the id is valid
  if (!req.params.id) {
    return res.status(400).send({ message: "User ID is required" });
  }
  // isValidObjectId(req.params.id) is a mongoose method to check if the id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ message: "Invalid User ID" });
  }
  await User.findById(req.params.id)
    .select("-password")
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send(err);
    });
};

module.exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({ error: true, message: "Email not found" });
  }

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    // create token
    const token = createToken(user.id);
    res.cookie("token", token, { maxAge: maxAge * 1000 });
    // res.status(200).send({ id: user.id, email: user.email, token });
    res.status(200).send({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      sex: user.sex,
      age: user.age,
      profilePicture: user.profilePicture,
      token,
    });
  } else {
    return res.status(400).send({ error: true, message: "Incorrect Password" });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).send({ message: "loged out" });
};

module.exports.verifyToken = async (req, res) => {
  try {
    const userId = await this.getUserId(req);
    const user = await User.findById(userId).select("-password");
    return res.send(user);
  } catch (error) {
    if (error.message === "No token provided") {
      return res.status(401).send({ message: "No token provided" });
    } else {
      return res.status(401).send({ message: "Unauthorized" });
    }
  }
};

module.exports.getUserId = (req) => {
  return new Promise((resolve, reject) => {
    let token = "";
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      token = bearerHeader.split(" ")[1];
    }
    const secrete = process.env.SECRETE;

    if (token) {
      jwt.verify(token, secrete, (err, decodedToken) => {
        if (err) {
          handleError(err);
        } else {
          resolve(decodedToken.id);
        }
      });
    } else {
      reject(new Error("No token provided"));
    }
  });
};

module.exports.deleteUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ message: "User ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ message: "Invalid User ID" });
  }
  await User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send({ message: "User deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Internal Server Error" });
    });
};

module.exports.updateUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ message: "User ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ message: "Invalid User ID" });
  }

  const { fullname, email, sex, ag } = req.body;

  await User.findByIdAndUpdate(req.params.id, {
    fullname,
    email,
    sex,
    age,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send({ message: "User updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Internal Server Error" });
    });
};

module.exports.updateProfilePicture = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ message: "User ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ message: "Invalid User ID" });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.log(err);
      return res.status(500).send("Form parse error");
    }

    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, "..", "uploads", "userPprofile");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
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
      fs.writeFile(newPath, rawData, async function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send("File save error");
        }
        console.log("File uploaded successfully", imagePath);
        // Update user after file is saved
        try {
          const user = await User.findByIdAndUpdate(req.params.id, {
            profilePicture: imagePath,
          });
          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }
          res
            .status(200)
            .send({ message: "Profile picture updated successfully" });
        } catch (err) {
          console.log(err);
          return res.status(500).send({ message: "Internal Server Error" });
        }
      });
    });
  });
};
