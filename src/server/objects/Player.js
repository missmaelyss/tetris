const Piece = require("./Piece");
const PiecePool = [
    [
        [[1,1,0],[0,1,1],[0,0,0]],
        [[0,0,1],[0,1,1],[0,1,0]],
        [[0,0,0],[1,1,0],[0,1,1]],
        [[0,1,0],[1,1,0],[1,0,0]]
    ],
    [
        [[0,2,2,0],[0,2,2,0],[0,0,0,0]]
    ],
    [
        [[0,3,3],[3,3,0],[0,0,0]],
        [[0,3,0],[0,3,3],[0,0,3]],
        [[0,0,0],[0,3,3],[3,3,0]],
        [[3,0,0],[3,3,0],[0,3,0]]
    ],
    [
        [[0,0,0,0],[4,4,4,4],[0,0,0,0],[0,0,0,0]],
        [[0,0,4,0],[0,0,4,0],[0,0,4,0],[0,0,4,0]],
        [[0,0,0,0],[0,0,0,0],[4,4,4,4],[0,0,0,0]],
        [[0,4,0,0],[0,4,0,0],[0,4,0,0],[0,4,0,0]]
    ],
    [
        [[0,0,5],[5,5,5],[0,0,0]],
        [[0,5,0],[0,5,0],[0,5,5]],
        [[0,0,0],[5,5,5],[5,0,0]],
        [[5,5,0],[0,5,0],[0,5,0]]
    ],
    [
        [[6,0,0],[6,6,6],[0,0,0]],
        [[0,6,6],[0,6,0],[0,6,0]],
        [[0,0,0],[6,6,6],[0,0,6]],
        [[0,6,0],[0,6,0],[6,6,0]]
    ],
    [
        [[0,7,0],[7,7,7],[0,0,0]],
        [[0,7,0],[0,7,7],[0,7,0]],
        [[0,0,0],[7,7,7],[0,7,0]],
        [[0,7,0],[7,7,0],[0,7,0]]
    ]
];
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
    this.down = down
    this.score = 0;
    this.status = 0 // 0 current, 1 over

    this.nextGrid = new Array(16).fill(this.color)
    this.nextPiece = this.newPiece()
    this.NextGrid = NextGrid
    this.NextGrid()
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

function switchPause() {
    this.pause = !this.pause
}

function down()
{
    while (!this.piece.stop)
    {
        var testPiece = new Piece(this.piece.pieceId, this.piece.pieceRot)
        testPiece.color = this.piece.color
        testPiece.position[0] = this.piece.position[0]
        testPiece.position[1] = this.piece.position[1]
        testPiece.stop = false
        this.piece.changeYPosition(-1)
        if (!this.checkPiece())
            this.piece = testPiece
        this.checkBottom()
    }
}

function checkBottom() {
    var i = 0
    while (i < this.piece.grid.length)
    {
        var l = 0
        while (l < this.piece.grid[0].length)
        {
            if (this.piece.grid[i][l] && l + this.piece.position[0] + (i + 1 + this.piece.position[1]) * 10 >= 0)
            {
                if (this.piece.grid[i][l] && l + this.piece.position[0] + (i + 1 + this.piece.position[1]) * 10 >= 200 || this.grid[l + this.piece.position[0] + (i + 1 + this.piece.position[1]) * 10] != 0 && (i == this.piece.grid.length - 1 || this.piece.grid[i + 1][l] == 0))
                {
                    this.piece.stop = true
                    if (l + this.piece.position[0]  + (i + this.piece.position[1] - (this.piece.grid.length - 1)) * 10 < 0)
                    {
                        this.status = 1
                        this.changeColorGrid()
                    }
                }
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
            if (this.piece.grid[i][l])
            {
                if (l + this.piece.position[0] + (i + this.piece.position[1]) * 10 >= 200)
                {
                    // console.log("trop en bas")
                    return (0)
                }
                if (l + this.piece.position[0] + (i + this.piece.position[1]) * 10 >= 0 && this.grid[l + this.piece.position[0] + (i + this.piece.position[1]) * 10] != 0)
                {
                    // console.log("touche une autre piece")
                    return (0)
                }
                if (l + this.piece.position[0] - 1 + (i + this.piece.position[1]) * 10 % 10 == 9)
                {
                    // console.log(l + this.piece.position[0] + (i + this.piece.position[1]) * 10 + " trop a droite")
                    return (0)
                }
                if (l + this.piece.position[0] + 1 + (i + this.piece.position[1]) * 10 % 10 == 0)
                {
                    // console.log(l + this.piece.position[0] + (i + this.piece.position[1]) * 10 + " trop a gauche")
                    return (0)
                }
                
            }
            l++
        }
        i++
    }
    return (1)
}

function changeColorGrid() {
    let     i = 0;
    this.color = 8

    while (i < 200)
    {
        if (this.grid[i] == 0)
            this.grid[i] = this.color
        i++;
    }
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

function NextGrid() {
    var i = 0
    while (i < 4)
    {
        var l = 0
        while (l < 4)
        {
            this.nextGrid[l + i * 4] = this.color
            l++
        }
        i++
    }
    var i = 0
    while (i < this.nextPiece.grid.length)
    {
        var l = 0
        while (l < this.nextPiece.grid[0].length)
        {
            if (this.nextPiece.grid[i][l])
            {
                this.nextGrid[l + i * 4] = (this.nextPiece.color)
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
    let me = {name: this.name, grid: this.grid, score: this.score, piece: this.nextGrid}
    this.socket.emit('me', me)
}

module.exports = Player;