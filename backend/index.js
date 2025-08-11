const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { authJwt } = require("./middlewares/jwt");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.static("public"));

// Database connection
const myUrl = "mongodb://localhost:27017/telebirr";

const uri =
  "mongodb+srv://dadawit:CdawjOQlulra13am@cluster0.gbn1ssb.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(uri)
  .then(() => console.log("DB connected!!"))
  .catch((err) => console.log(err));

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (userId) => {
    console.log(`User ${userId} joined room`);
    socket.join(userId); // Join the user to a specific room
  });

  socket.on("send_message", (data) => {
    console.log("Received message:", data);
    // Broadcast the message to all clients
    // socket.broadcast.emit("received_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Routes
app.use("/api", require("./routes/routes"));

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
