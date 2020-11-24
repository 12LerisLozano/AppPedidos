const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const server = http.listen(8080, function() {
  console.log("Dirección emitida a *:8080");
});
app.get("/", function(req, res) {
  res.render("index.ejs");
});
io.sockets.on("connection", function(socket) {
  socket.on("username", function(username) {
    socket.username = username;
    io.emit("is_online", "🔵 <i>" + socket.username + " se une al chat..</i>");

    io.sockets.on("direction", function(socket){
      socket.on("direction", function(direction) {
        socket.direction = direction;
        io.emit("direction", "🔵 <i>" + socket.direction + " esta es su dirección..</i>");
      });
  });
  socket.on("disconnect", function(username) {
    io.emit(
      "is_online",
      "🔴 <i>" + socket.username + " ha dejado el chat ..</i>"
    );
  });
  socket.on("chat_message", function(message) {
    io.emit(
      "chat_message",
      "<strong>" + socket.username + "</strong>: " + message
    );
    socket.on('direction', function(direction) {
      io.emit(
      "direction",
      "<strong>" + socket.direction + "</strong> " + direction   
      )
    })
  }); 
});
});
