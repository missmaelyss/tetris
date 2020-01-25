const Piece = require("./Piece");

function Player(name, permission, socket){
    this.name = name,
    this.color = 7
    this.permission = permission // 0 = spectator, 1 = player, 2 = creator
    this.socket = socket
    this.classement = 0 // 0 = default, 1 = winner, else classement 
    this.grid = new Array(200).fill(this.color)
    this.piece = new Piece()
    // MAE
    this.changeColorGrid = changeColorGrid
    this.sendMyInfo = sendMyInfo
    this.addPieceToGrid = addPieceToGrid
    this.removePieceToGrid = removePieceToGrid
    this.pause = false
    this.switchPause = switchPause
    this.checkPiece = checkPiece

}

function switchPause() {
    this.pause = !this.pause
}

function checkPiece(){
    this.piece.touchLeft = false
    this.piece.touchRight = false

    var i = 0
    while (i < this.piece.grid.length)
    {
        var l = 0
        while (l < this.piece.grid[0].length)
        {
            if (this.piece.grid[i][l])
            {
                if (l == 0 && (this.piece.position[0] == 0 || this.grid[l + this.piece.position[0] - 1 + (i + this.piece.position[1]) * 10] != 7))
                    this.piece.touchLeft = true
                if (l == this.piece.grid[0].length - 1 && (this.piece.position[0] + l == 9 || this.grid[l + this.piece.position[0] + 1 + (i + this.piece.position[1]) * 10] != 7))
                    this.piece.touchRight = true
                if ((i + this.piece.position[1]) * 10 >= 190 || this.grid[l + this.piece.position[0] + (i + 1 + this.piece.position[1]) * 10] != 7)
                    this.piece.touchBottom = true
            }
            l++
        }
        i++
    }
}

function changeColorGrid() {
    let     i = 0;
    this.color = this.grid[0] % 7 + 1

    while (i < 200)
    {
        this.grid[i] = this.color
        i++;
    }
    this.addPieceToGrid()
}

function removePieceToGrid() {
    var i = 0
    while (i < 4)
    {
        var l = 0
        while (l < 4)
        {
            if (this.piece.grid[i][l])
            {
                this.grid[l + this.piece.position[0] + (i + this.piece.position[1]) * 10] = (this.color)
            }
            l++
        }
        i++
    } 
}

function addPieceToGrid() {
    var i = 0
    while (i < 4)
    {
        var l = 0
        while (l < 4)
        {
            if (this.piece.grid[i][l])
            {
                this.grid[l + this.piece.position[0] + (i + this.piece.position[1]) * 10] = (this.piece.color)
            }
            l++
        }
        i++
    } 
}

function sendMyInfo() {
    let me = {name: this.name, grid: this.grid}
    this.socket.emit('me', me)
}

module.exports = Player;