const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const Game = require("./objects/Game");

const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let i = 0;
let Games = [];

io.on("connection", socket => {
  let currentGame = Games.find(element => element.roomId = socket.handshake.query.room)
  if (!currentGame)
    Games.push(new Game(socket.handshake.query.room, socket.handshake.query.name))
  else
    currentGame.joinRoom(socket.handshake.query.name);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
server.listen(port, () => console.log(`Listening on port ${port}`));
