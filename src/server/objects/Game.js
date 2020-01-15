const Player = require("./Player");

function Game(roomId, creator){
    this.roomId = roomId,
    this.status = "waiting",
    this.players = [new Player(creator, 2)]
    this.joinRoom = function (name) {
        this.players.push(new Player(name, ((this.status == "waiting" ? 1 : 0))))
        console.log(name, "joined the room #" + this.roomId + "(" + this.players.length + " players)")
    }
    this.leaveRoom = function (name) {
        this.players.splice(this.players.findIndex((element) => element.name == name ), 1)
        console.log(name, "left the room #" + this.roomId + "(" + this.players.length + " players)")
    }
    console.log(creator, "opened the room #" + roomId)
    return this;
}

module.exports = Game;