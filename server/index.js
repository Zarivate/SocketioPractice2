const express = require("express");

// Our app variable set to an instance of the express function
const app = express();
const http = require("http");
const cors = require("cors");

// The Server class comes from the socket.io library so we import it from there
const { Server } = require("socket.io");

// Cors middleware used here
app.use(cors());

// server variable that uses the http library where we pass our express app into the function to make our server
const server = http.createServer(app);

// The server variable we made above has to come before this point in order for it to be usable
const io = new Server(server, {
  cors: {
    // Tells socket.io that it's okay to accept socket communications with this specific url
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// The events we listen to happen, listed below
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // The emit for whenever someone sends a message/pushes the send button on the Chat
  socket.on("send_message", (data) => {
    // This is to ensure we only send the data to the person(s) in the same room
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
