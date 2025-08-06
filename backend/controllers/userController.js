const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
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
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({ message: "Email already exist !" });
  }
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    isAdimn: req.body.isAdmin,
    aggrement: req.body.aggrement,
    password: bcrypt.hashSync(req.body.password, 8),
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

import axios from "axios";
export const devBaseurl = "http://127.0.0.1:4000/api";
const api = axios.create({
  baseURL: devBaseurl,
});
let token = null;

if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
