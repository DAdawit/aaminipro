var { expressjwt: jwt } = require("express-jwt");
const expressJwt = require("express-jwt");
function authJwt() {
  const Secret = process.env.ACCESS_TOKEN_SECRET;
  return jwt({
    secret: Secret,
    algorithms: ["HS256"],
    //algorithms: ['RS256']
  });
}

module.exports = { authJwt };

// write code for express js validating jwt token?
