const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

module.exports.registerUser = async (req, res) => {
  const { username, email, password, sex, age } = req.body;
  // validate the input
  if (!username || !email || !password || !sex || !age) {
    return res.status(400).send({ message: "All fields are required!" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .send({ message: "Password must be at least 6 characters long!" });
  }

  // validate sex enum
  if (!["male", "female"].includes(sex)) {
    return res.status(400).json({ message: "Invalid sex value" });
  }

  if (
    // regex to validate email format
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    // regex to validate
  ) {
    return res.status(400).send({ message: "Invalid email format!" });
  }

  // regex to validate password strength
  if (
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(
      password
    )
  ) {
    return res.status(400).send({
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!",
    });
  }
  // check if the email already exists
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).send({ message: "Email already exists!" });
  }
  const newUser = new User({
    name: username,
    email: email,
    sex: sex,
    age: age,
    password: bcrypt.hashSync(password, 8),
  });

  await newUser
    .save()
    .then(async (result) => {
      const token = await createToken(result._id);
      res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).send({
        id: result._id,
        name: result.name,
        email: result.email,
        token,
      });
      // res.status(201).send({ user: result, token: token });
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).send(err);
    });
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
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
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
