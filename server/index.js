const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");
app.use(cors());
const public_key_server = 2 * 9;
const private_key_server = 2;
const server = http.createServer(app);
var shared_key;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const __dirname1 = path.resolve();

if ("production" === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

io.on("connection", (socket) => {
  // console.log(socket);
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  // socket.on("key", (data) => {
  //   console.log(data);
  //   shared_key = data * private_key_server;
  //   console.log("shared key in server", shared_key);
  //   socket.emit("users", public_key_server);
  // });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
  // socket.emit("users", socket);

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
