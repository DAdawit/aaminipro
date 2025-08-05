const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { authJwt } = require("./authMiddleware/jwt");
// const auth = require("./helper/jwt");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("tiny"));
// app.use(authJwt);

const cors = require("cors");

app.use(express.static("public"));

const uri =
  "mongodb+srv://dadawit:CdawjOQlulra13am@cluster0.gbn1ssb.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => {
    console.log("db connected !!");
  })
  .catch((err) => {
    console.log(err);
  });

// mongoose.connect("mongodb://localhost/e-shope");
// mongoose.Promise = global.Promise;

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(cors());

app.use("/api", require("./routes/routes"));

app.use(function (err, req, res, next) {
  res.status(422).send({ error: err.message });
});

app.listen(process.env.port || 4000, function () {
  console.log("listning for request || port 4000");
});
