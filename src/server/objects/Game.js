const Player = require("./Player");

function Game(roomId, creator, socket){
    this.roomId = roomId,
    this.status = "waiting",
    this.players = [new Player(creator, 2, socket)]
    
    this.publicPlayersData = publicPlayersData
    this.joinRoom = joinRoom
    this.leaveRoom = leaveRoom
    this.startGame = startGame
    this.sendToAll = sendToAll
    console.log(creator, "opened the room #" + roomId)
    return this;
}

function joinRoom(name, socket){
    //TODO: need to check if the username is taken
    this.players.push(new Player(name, (this.status == "waiting" ? 1 : 0), socket))
    console.log(name, "joined the room #" + this.roomId + "(" + this.players.length + " players)")
    this.sendToAll("players", this.publicPlayersData())
}

function leaveRoom(name) {
    this.players.splice(this.players.findIndex((element) => element.name == name ), 1)
    console.log(name, "left the room #" + this.roomId + "(" + this.players.length + " players)")
    this.sendToAll("players", this.publicPlayersData())
}

function startGame(name) {
    if (this.status !== "waiting"){
        console.log(name + " tried to start the game in Room #" + this.roomId, "but it already started")
        return -1;
    }
    else if (this.players.findIndex((element) => element.permission == 2).name == name){
        console.log(name + " tried to start the game in Room #" + this.roomId, "but don't have permission")
        return -1;
    }
    this.status = 'starting'
}

function    publicPlayersData(){
    var publicPlayersData = []

    this.players.forEach(player => {
        let copyPlayer = {... player}
        delete copyPlayer.socket
        publicPlayersData.push(copyPlayer)
    })
    return publicPlayersData
}

function sendToAll(tag, data){
    this.players.forEach(player => {
        player.socket.emit(tag, data)
    });
}

module.exports = Game;