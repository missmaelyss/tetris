const Player = require("./Player");
const Piece = require("./Piece");

function Game(roomId, creator, socket) {
    this.roomId = roomId,
    this.status = "waiting",
    this.players = [new Player(creator, 2, socket, roomId)]
    this.playerData = []
    this.publicPlayersData = publicPlayersData
    this.joinRoom = joinRoom
    this.leaveRoom = leaveRoom
    this.startGame = startGame
    this.sendToAll = sendToAll
    this.sendPlayersOwnGrid = sendPlayersOwnGrid
    this.gameLoop = gameLoop
    this.gameTick = gameTick
    this.move = move
    this.pause = pause

    console.log(creator, "opened the room #" + roomId)
    this.players[0].sendMyInfo()
    return this;
}

function joinRoom(name, socket){
    //TODO: need to check if the username is taken
    
    this.players.push(new Player(name, (this.status == "waiting" ? 1 : 0), socket, this.roomId))

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
        if(player.status == 0) {
            if (player.piece.stop){
                delete player.piece;
                player.checkLines();
                player.piece = player.newPiece();
            }
            else
            {
                if (!player.pause)
                    this.move(player.name, 0)
            }
        }
        else
            player.changeColorGrid()
    })
    this.sendToAll("players", data = this.playerData)
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
    }, 500);
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

 function move(name, direction) {
    // 0 = bas, direction: -1 = left 1 = right, 2 = rotate
    var player = this.players.find((element) => element.name == name)
    // if (player.pause)
    //     return
    player.removePieceToGrid();
    var testPiece = new Piece(player.piece.pieceId, player.piece.pieceRot)
    testPiece.color = player.piece.color
    testPiece.position[0] = player.piece.position[0]
    testPiece.position[1] = player.piece.position[1]
    testPiece.stop = false
    if (direction == 3)
        player.down()
    else
    {
        if (direction == 2)
            player.piece.rotate()
        else
            (direction === 0 ? player.piece.changeYPosition(-1) : player.piece.changeXPosition(direction))
        if (!player.checkPiece())
            player.piece = testPiece
        player.checkBottom()
    }
    
    player.addPieceToGrid()
    player.sendMyInfo()
    // this.sendToAll("players", data = this.playerData)
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