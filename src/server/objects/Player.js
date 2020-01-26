const Piece = require("./Piece");
const PiecePool = [[[[1,1,0],[0,1,1]],[[0,1],[1,1],[1,0]]],[[[2,2],[2,2]]],[[[0,3,3],[3,3,0]],[[3,0],[3,3],[0,3]]],[[[4,4,4,4]],[[4],[4],[4],[4]]],[[[0,0,5],[5,5,5]],[[5,0],[5,0],[5,5]],[[5,5,5],[5,0,0]],[[5,5],[0,5],[0,5]]],[[[6,0,0],[6,6,6]],[[6,6],[6,0],[6,0]],[[6,6,6],[0,0,6]],[[0,6],[0,6],[6,6]]],[[[0,7,0],[7,7,7]],[[7,0],[7,7],[7,0]],[[7,7,7],[0,7,0]],[[0,7],[7,7],[0,7]]]];

function Player(name, permission, socket, room){
    this.name = name,
    this.color = 0
    this.permission = permission // 0 = spectator, 1 = player, 2 = creator
    this.socket = socket
    this.classement = 0 // 0 = default, 1 = winner, else classement 
    this.grid = new Array(200).fill(this.color)
    this.seed = require('random-seed').create(room)
    this.newPiece = newPiece
    this.piece = this.newPiece()
    // MAE
    this.seed = require('random-seed').create(room)
    this.changeColorGrid = changeColorGrid
    this.sendMyInfo = sendMyInfo
    this.addPieceToGrid = addPieceToGrid
    this.removePieceToGrid = removePieceToGrid
    this.pause = false
    this.switchPause = switchPause
    this.checkPiece = checkPiece
    this.checkBottom = checkBottom
    this.checkLines = checkLines
    this.score = 0;
}

function checkLines(){
    let i = 0;
    let lineCount = 0;
    while (i < 20){
        let current = this.grid.slice(i * 10, (i + 1) * 10)
        if (!(current.some((element) => element === 0))){
            this.grid.splice(i * 10, 10)
            this.grid.unshift(0,0,0,0,0,0,0,0,0,0)
            lineCount++;
        } else if (lineCount != 0) {
            if (lineCount == 1)
                this.score += 40
            else if (lineCount == 2)
                this.score += 100
            else if (lineCount == 3)
                this.score += 300
            else if (lineCount == 4)
                this.score += 1200
            lineCount = 0;
        }
        i++;

    }
}

function switchPause() {
    this.pause = !this.pause
}

function checkBottom() {
    var i = 0
    while (i < this.piece.grid.length)
    {
        var l = 0
        while (l < this.piece.grid[0].length)
        {
            if (this.piece.grid[i][l] && l + this.piece.position[0] + (i + this.piece.position[1]) * 10 >= 0)
            {
                if ((i + this.piece.position[1]) * 10 >= 190 || this.grid[l + this.piece.position[0] + (i + 1 + this.piece.position[1]) * 10] != 0 && (i == this.piece.grid.length - 1 || this.piece.grid[i + 1][l] == 0))
                    this.piece.stop = true
            }
            l++
        }
        i++
    }
}

function checkPiece() {

    var i = 0
    this.piece.stop = false
    while (i < this.piece.grid.length)
    {
        var l = 0
        while (l < this.piece.grid[0].length)
        {
            if (this.piece.grid[i][l] && l + this.piece.position[0] + (i + this.piece.position[1]) * 10 >= 0)
            {
                if ((i + this.piece.position[1]) * 10 >= 200)
                {
                    // console.log("trop en bas")
                    return (0)
                }
                if (this.grid[l + this.piece.position[0] + (i + this.piece.position[1]) * 10] != 0)
                {
                    // console.log("touche une autre piece")
                    return (0)
                }
                if (l == 0 && (this.piece.position[0] < 0))
                {
                    // console.log("trop a gauche")
                    return (0)
                }
                if (l == this.piece.grid[0].length - 1 && (this.piece.position[0] + l > 9))
                {
                    // console.log("trop a droite")
                    return (0)
                }
                
            }
            l++
        }
        i++
    }
    return (1)
}

// function checkRotate(){
//     this.piece.touchBottom = false

//     var i = 0
//     while (i < this.piece.grid.length)
//     {
//         var l = 0
//         while (l < this.piece.grid[0].length)
//         {
//             if (this.piece.grid[i][l])
//             {
//                 if (l == 0 && (this.piece.position[0] < 0 || this.grid[l + this.piece.position[0] + (i + this.piece.position[1]) * 10] != 0))
//                 {
//                     console.log("LEFT")
//                     return (0)
//                 }
//                 if (l == this.piece.grid[0].length - 1 && (this.piece.position[0] + l > 9 || this.grid[l + this.piece.position[0] + (i + this.piece.position[1]) * 10] != 0))
//                 {
//                     console.log("RIGHT")
//                     return (0)
//                 }    
//                 if ((i + this.piece.position[1]) * 10 >= 200 || this.grid[l + this.piece.position[0] + (i + this.piece.position[1]) * 10] != 0)
//                 {
//                     console.log("BOTTOM")
//                     return (0)
//                 }    
//             }
//             l++
//         }
//         i++
//     }
//     return (1)
// }

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
    while (i < this.piece.grid.length)
    {
        var l = 0
        while (l < this.piece.grid[0].length)
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
    while (i < this.piece.grid.length)
    {
        var l = 0
        while (l < this.piece.grid[0].length)
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

function newPiece(){
    let pieceId = this.seed(PiecePool.length)
    let rotation = this.seed(PiecePool[pieceId].length)
    return(new Piece(pieceId, rotation))
}

function sendMyInfo() {
    let me = {name: this.name, grid: this.grid}
    this.socket.emit('me', me)
}

module.exports = Player;