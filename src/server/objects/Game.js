const Player = require("./Player");
const Piece = require("./Piece");

function Game(roomId, creator, socket) {
    this.roomId = roomId,
    this.status = "waiting",
    this.players = [new Player(creator, 2, socket)]
    this.playerData = []
    this.publicPlayersData = publicPlayersData
    this.joinRoom = joinRoom
    this.leaveRoom = leaveRoom
    this.startGame = startGame
    this.sendToAll = sendToAll
    this.sendPlayersOwnGrid = sendPlayersOwnGrid
    this.gameLoop = gameLoop
    this.gameTick = gameTick
    this.printMyPiece = printMyPiece
    this.moveMyPiece = moveMyPiece
    this.move = move
    this.pause = pause


    //test Mae
    this.changeColorGame = changeColorGame
    this.changeMyColor = changeMyColor

    console.log(creator, "opened the room #" + roomId)
    this.players[0].sendMyInfo()
    // this.piece.changePosition([3, -3])
    setTimeout(()=> {this.startGame(creator)}, 8000)
    return this;
}

function joinRoom(name, socket){
    //TODO: need to check if the username is taken
    
    this.players.push(new Player(name, (this.status == "waiting" ? 1 : 0), socket))

    console.log(name, "joined the room #" + this.roomId + "(" + this.players.length + " players)")
    this.playerData = this.publicPlayersData()
    this.sendToAll("players", data = this.playerData)
}

function leaveRoom(name) {
    this.players.splice(this.players.findIndex((element) => element.name == name ), 1)
    console.log(name, "left the room #" + this.roomId + "(" + this.players.length + " players)")
    // this.sendToAll("players", data = this.publicPlayersData())
    this.playerData = this.publicPlayersData()
    this.sendToAll("players", data = this.playerData)
}

function gameTick(){
    this.players.forEach((player) => {
        // console.log(player.piece.position[1] + player.piece.grid.length)
        if (player.piece.position[1] + player.piece.grid.length > 19){
            delete player.piece;
            player.piece = new Piece;
        }
        this.moveMyPiece(player.name)

    })
    // console.log("tick")
}

function gameLoop(){
    let     interval = setInterval(() => {
        if (this.players.length === 0 || !(this.players.some((player) => player.classement === 0))){
            clearInterval(interval)
            this.status = "ended"
            console.log("#" + this.roomId + " just ended")
        }
        else {
            this.gameTick()
        }
    }, 1000);
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
    console.log("#" + this.roomId + " just started")
    this.status = 'started'
    this.gameLoop()
}

function changeColorGame(name) {
    this.players.forEach(player => {
        player.changeColorGrid()
    });
    this.players.find((element) => element.name == name).sendMyInfo()
    this.sendToAll("players", data = this.playerData)
}

function changeMyColor(name) {
    this.players.find((element) => element.name == name).changeColorGrid()
    // this.players.find((element) => element.name == name).addPieceToGrid(this.piece)
    this.players.find((element) => element.name == name).sendMyInfo()
    this.sendToAll("players", data = this.playerData)
}

function printMyPiece(name) {
    this.players.find((element) => element.name == name).addPieceToGrid()
    this.players.find((element) => element.name == name).sendMyInfo()
    // this.sendToAll("players", data = this.playerData)
}

function moveMyPiece(name) {
    var player = this.players.find((element) => element.name == name)
    if (player.pause)
        return
    player.removePieceToGrid()
    player.piece.changeYPosition(-1)
    player.addPieceToGrid()
    player.sendMyInfo()
    this.sendToAll("players", data = this.playerData)
}

function move(name, direction) {
    var player = this.players.find((element) => element.name == name)
    if (player.pause)
        return
    player.removePieceToGrid();
    (direction === 0 ? player.piece.changeYPosition(-1) : player.piece.changeXPosition(direction))
    player.addPieceToGrid()
    player.sendMyInfo()
    this.sendToAll("players", data = this.playerData)
}

function pause(name) {
    var player = this.players.find((element) => element.name == name)
    player.switchPause()
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

function    sendPlayersOwnGrid(){
    this.players.forEach(player => {
        player.socket.emit(tag, player.grid)
    });
}

function sendToAll(tag, data) {
    this.players.forEach(player => {
        player.socket.emit(tag, data, player.grid)
    });
}

module.exports = Game;