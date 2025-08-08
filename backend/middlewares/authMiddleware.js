const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    const secrete = process.env.secrete;
    jwt.verify(token, secrete, async (err, decodedToken) => {
      if (err) {
        return res.status(401).send({ error: "invalid token" });
      } else {
        const user = await User.findById(decodedToken.id);
        console.log(decodedToken);
        console.log("user", user);
        next();
      }
    });
  } else {
    return res.status(401).send({ error: "Unauthorized" });
  }
};

module.exports = { requireAuth };
