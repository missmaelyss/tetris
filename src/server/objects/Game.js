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
    this.sendPlayersOwnGrid = sendPlayersOwnGrid
    this.gameLoop = gameLoop
    this.gameTick = gameTick

    //test Mae
    this.changeColorGame = changeColorGame
    this.changeMyColor = changeMyColor
    this.otherPlayersData = otherPlayersData

    console.log(creator, "opened the room #" + roomId)
    this.startGame(creator)
    return this;
}

function joinRoom(name, socket){
    //TODO: need to check if the username is taken
    
    // newOne = new Player(name, (this.status == "waiting" ? 1 : 0), socket)
    // this.players.push(newOne)

    // I changed this
    this.players.push(new Player(name, (this.status == "waiting" ? 1 : 0), socket))

    console.log(name, "joined the room #" + this.roomId + "(" + this.players.length + " players)")

    this.sendToAll("other", "")
}
function leaveRoom(name) {
    this.players.splice(this.players.findIndex((element) => element.name == name ), 1)
    console.log(name, "left the room #" + this.roomId + "(" + this.players.length + " players)")
    this.sendToAll("other", "")
}
function gameTick(){
    console.log("tick")
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

function changeColorGame() {
    this.players.forEach(player => {
        player.changeColorGrid()
        player.sendMyInfo()
    });
    this.sendToAll("other", "")
}

function changeMyColor(name) {
    this.players.forEach(player => {
        if (player.name == name) {
            player.changeColorGrid()        
            player.sendMyInfo()
        }
        // this.sendToAll("other", this.otherPlayersData(player))
    });
    this.sendToAll("other", "")
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

function    otherPlayersData(player){
    var otherPlayersData = []

    this.players.forEach(other => {
        if (other != player) {
            let copyPlayer = {... other}
            delete copyPlayer.socket
            otherPlayersData.push(copyPlayer)
        }
    })
    return otherPlayersData
}

function sendToAll(tag, data) {
    if (tag === "other") {
        this.players.forEach(player => {
            data = this.otherPlayersData(player)
            player.socket.emit(tag, data)
        });
    }
    else {
        this.players.forEach(player => {
            player.socket.emit(tag, data)
        });
    }
}

module.exports = Game;