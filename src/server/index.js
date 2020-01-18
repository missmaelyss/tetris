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
  let currentGame = Games.find(element => element.roomId = socket.handshake.query.room)
  if (!currentGame)
    Games.push(currentGame = new Game(socket.handshake.query.room, socket.handshake.query.name, socket))
  else
    currentGame.joinRoom(socket.handshake.query.name, socket);
  socket.on("disconnect", () => {
    currentGame.leaveRoom(socket.handshake.query.name)
    if (currentGame.players.length == 0){
      delete currentGame;
      console.log("Room #" + socket.handshake.query.room + " closed because it was empty")
      Games.splice(Games.indexOf((element) => element.roomId == socket.handshake.query.room))
      console.log(Games)
    }
  });

  socket.on("changeColor", ({name}) => {
    currentGame.changeColorGame(name)
  });

  socket.on("changeMyColor", ({name}) => {
    currentGame.changeMyColor(name)
  });

  socket.on("moveDown", ({name}) => {
    currentGame.moveMyPiece(name)
  });
});
server.listen(port, () => console.log(`Listening on port ${port}`));
