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
app.use(express.static('uploads'))
app.use(bodyParser.json());
app.use(morgan("tiny"));
// app.use(authJwt);
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(app);

const cors = require("cors");

app.use(express.static("public"));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST"],
  },
});

// When client connects
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });
  // Listen for messages from clients
  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    // Broadcast message to all clients
    io.emit("receive_message", data);
  });

  // When client disconnects
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

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
app.use(express.json());

app.use("/api", require("./routes/routes"));

app.use(function (err, req, res, next) {
  res.status(422).send({ error: err.message });
});

app.listen(process.env.port || 4000, function () {
  console.log("listning for request || port 4000");
});
