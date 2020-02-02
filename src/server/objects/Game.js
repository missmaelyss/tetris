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
    this.gameLoop = gameLoop
    this.gameTick = gameTick
    this.move = move
    this.pause = pause
    this.addLinesExcept = addLinesExcept
    this.sendGameStatus = sendGameStatus
    this.getPlayerList = getPlayerList
    this.socketIdToPlayer = socketIdToPlayer
    this.resetGame = resetGame
    this.inviteSpectators = inviteSpectators
    this.spectrum = 0
    this.linesMode = 0
    console.log(creator, "opened the room #" + roomId)
    this.players[0].sendMyInfo()
    return this;
}

function getPlayerList(){
    var players = []
    var spectators = []
    var creator
    this.players.forEach((player)=> {
        if (player.permission === 0){
            spectators.push({
                name: player.name,
            })
        } else if (player.permission === 2){
            creator = {
                name: player.name,
                classement: player.classement,
                score: player.score
            }
        } else {
            players.push({
                name: player.name,
                classement: player.classement,
                score: player.score
            })
        }
    })
    return {players: players, spectators: spectators, creator: creator}
}

function sendGameStatus (){
    let data = {
        status: this.status,
        users: this.getPlayerList()
    }
    this.sendToAll("gameStatus", data)
}

function joinRoom(name, socket){
    //TODO: need to check if the username is taken
    
    this.players.push(new Player(name, (this.status == "waiting" ? 1 : 0), socket, this.roomId))
    if (this.status == "waiting")
        console.log(name, "joined the room #" + this.roomId + "(" + this.players.length + " players)")
    else
        console.log(name, "is spectating the room #" + this.roomId)
    this.playerData = this.publicPlayersData()
    this.sendToAll("players", data = this.playerData)
}


function leaveRoom(name) {
    var deleted = this.players.find((element) => element.name == name)
    this.players.splice(this.players.findIndex((element) => element.name == name), 1)
    console.log(name, "left the room #" + this.roomId + "(" + this.players.length + " players)")
    if (deleted.permission == 2 && this.players.length){
        this.players[0].permission = 2
        console.log(this.players[0].name, "is now the owner of #" + this.roomId)
        this.players[0].sendMyInfo();
    }
    this.playerData = this.publicPlayersData()
    this.sendToAll("players", this.playerData)
}

//Add Lines to every player except name
function addLinesExcept(amount, name){
    if (amount === 0)
        return;
    this.players.forEach((player)=>{
        if (player.name !== name){
            console.log("add", amount, " to", player.name)
            player.linesToAdd += amount;
        }
    })
}

function resetGame(id){
    if (this.socketIdToPlayer(id).permission != 2){
        return;
    }
    var newPlayers = [];

    this.players.forEach((player) => {
        newPlayers.push(new Player(player.name, player.permission, player.socket, player.room))
    })
    this.players = newPlayers
    this.status = 'waiting'
    this.sendGameStatus()
    this.playerData = this.publicPlayersData()
    this.sendToAll("players", data = this.playerData)

}

function inviteSpectators(id){
    if (this.socketIdToPlayer(id).permission != 2){
        return;
    }
    console.log("invite spectators")
    this.players.forEach((element, index) => {
        if (element.permission == 0){
            this.players[index] = new Player(element.name, 1, element.socket, element.room)
            
        } 
    })
    this.sendGameStatus()
    this.playerData = this.publicPlayersData()
    this.sendToAll("players", data = this.playerData)
}

function socketIdToPlayer(id){
    return (this.players.find(element => element.socket.id === id))
}

function gameTick(){
    this.players.forEach((player) => {
        if(player.status == 0) {
            if (player.piece.stop){
                delete player.piece;
                this.addLinesExcept(player.checkLines(), player.name);
                player.piece = player.nextPiece;
                player.nextPiece = player.newPiece();
                player.addBottomLines(this.linesMode)
                player.NextGrid()
            }
            else if (!player.pause)
                this.move(player.socket.id, 0)
        }
        else if (player.classement === 0 && player.status === 1){
            player.classement = this.players.filter(player => player.status == 0 && player.permission != 0).length + 1
            console.log(player.name, "lost in #" + this.roomId, "on rank",  player.classement)
            player.changeColorGrid()
        }
    })
    this.playerData = this.publicPlayersData()
    this.sendToAll("players", data = this.playerData)
}

function gameLoop(){
    let     interval = setInterval(() => {
        if (this.players.length === 0 || !(this.players.some((player) => player.classement === 0))){
            clearInterval(interval)
            this.status = "ended"
            console.log("#" + this.roomId + " just ended")
            this.sendGameStatus()
        }
        else {
            this.gameTick()
        }
    }, 500);
}

function startGame(id, spectrum, lines) {
    var user = this.players.find((element) => element.socket.id == id)
    if (this.status !== "waiting"){
        console.log(user.name + " tried to start the game in Room #" + this.roomId, "but it already started")
        return -1;
    }
    else if (user.permission !== 2){
        console.log(user.name + " tried to start the game in Room #" + this.roomId, "but don't have permission")
        return -1;
    }
    console.log("#" + this.roomId + " just started")
    console.log(lines)
    this.spectrum = spectrum
    this.linesMode = lines
    this.status = 'started'
    this.gameLoop()
}

 function move(id, direction) {
    if (this.status != 'started')
        return
    // 0 = bas, direction: -1 = left 1 = right, 2 = rotate
    var player = this.players.find((element) => element.socket.id == id)
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
        if (player.permission != 0){
            let copyPlayer = {... player}
            delete copyPlayer.socket
            publicPlayersData.push(copyPlayer)
        }
    })
    return publicPlayersData
}

function sendToAll(tag, data) {

    this.players.forEach(player => {
        player.socket.emit(tag, data, player.grid)
    });
}

module.exports = Game;