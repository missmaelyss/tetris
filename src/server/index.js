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
let Games = [];

io.on("connection", socket => {
  let currentGame = Games.find(element => element.roomId == socket.handshake.query.room)
  if (!currentGame)
    Games.push(currentGame = new Game(socket.handshake.query.room, socket.handshake.query.name, socket))
  else
    currentGame.joinRoom(socket.handshake.query.name, socket);
  currentGame.sendGameStatus();
  socket.on("disconnect", () => {
    currentGame.leaveRoom(socket.handshake.query.name)
    if (!currentGame.players.some((element) => element.permission !== 0)){
      delete currentGame;
      console.log("Room #" + socket.handshake.query.room + " closed because it was empty")
      Games.splice(Games.indexOf((element) => element.roomId == socket.handshake.query.room))
    } else {
      currentGame.sendGameStatus();
    }
  });
  socket.on("start", ({spectrum, lines}) => {
    currentGame.startGame(socket.id, spectrum, lines);
    currentGame.sendGameStatus();
  })
  socket.on("move", ({direction}) => {
    currentGame.move(socket.id, direction)
  });
  socket.on("rotate", () => {
    currentGame.move(socket.id, 2)
  });
  socket.on("space", () => {
    currentGame.move(socket.id, 3)
  });
  socket.on("reset", () => {
    currentGame.resetGame(socket.id)
  });
  socket.on("switchSpectators", () => {
    currentGame.inviteSpectators(socket.id)
  });
});
server.listen(port, () => console.log(`Listening on port ${port}`));
