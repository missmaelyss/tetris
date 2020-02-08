const Piece = require("./Piece");
const Rand = require('random-seed').create()
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
    this.classement =  (this.permission != 0 ? 0 : -1)// 0 = default, 1 = winner, -1 = spectator else classement 
    this.grid = (this.permission != 0 ? new Array(200).fill(this.color) : [])
    this.seed = require('random-seed').create(room)
    this.newPiece = newPiece
    this.piece = this.newPiece()
    this.changeColorGrid = changeColorGrid
    this.sendMyInfo = sendMyInfo
    this.addPieceToGrid = addPieceToGrid
    this.removePieceToGrid = removePieceToGrid
    this.pause = false
    this.switchPause = switchPause
    this.checkPiece = checkPiece
    this.checkBottom = checkBottom
    this.checkLines = checkLines
    this.linesToAdd = 0;
    this.down = down
    this.score = 0;
    this.status = (this.permission != 0 ? 0 : 1) // 0 current, 1 over
    this.addBottomLines = addBottomLines
    this.nextGrid = new Array(16).fill(this.color)
    this.nextPiece = this.newPiece()
    this.NextGrid = NextGrid
    this.NextGrid()
    this.spectrum = (this.permission != 0 ? new Array(200).fill(this.color) : [])
    this.changeSpectrum = changeSpectrum 
}

function changeSpectrum() {
    if (!this.status)
        this.removePieceToGrid()
    var l = 0
    while (l < 10) {
        var i = 0
        var found = false
        while (i < 20) {
            if (!found && this.grid[l + i * 10] != 0 && this.grid[l + i * 10] != 8)
                found = true
            if (found == true)
                this.spectrum[l + i * 10] = 9
            i++
        }
        l++
    }
    this.addPieceToGrid()
}

function getRandomInRange(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  }

function addBottomLines(linesMode){
    if (!linesMode)
        return
    this.grid.splice(0, 10 * this.linesToAdd)
    while (this.linesToAdd > 0){
        if (linesMode == 1){
            let empty = getRandomInRange(0, 9)
            this.grid.push(
                (empty == 0 ? 0 : getRandomInRange(1, 8)),
                (empty == 1 ? 0 : getRandomInRange(1, 8)),
                (empty == 2 ? 0 : getRandomInRange(1, 8)),
                (empty == 3 ? 0 : getRandomInRange(1, 8)),
                (empty == 4 ? 0 : getRandomInRange(1, 8)),
                (empty == 5 ? 0 : getRandomInRange(1, 8)),
                (empty == 6 ? 0 : getRandomInRange(1, 8)),
                (empty == 7 ? 0 : getRandomInRange(1, 8)),
                (empty == 8 ? 0 : getRandomInRange(1, 8)),
                (empty == 9 ? 0 : getRandomInRange(1, 8))
            )
        }
        else if (linesMode == 2)
            this.grid.push(8,8,8,8,8,8,8,8,8,8)
        this.linesToAdd--;
    }
}

function checkLines(){
    let i = 0;
    let lineCount = 0;
    while (i < 20){
        let current = this.grid.slice(i * 10, (i + 1) * 10)
        if (!(current.some((element) => element == 0 || element == 8 ))){
            this.grid.splice(i * 10, 10)
            this.grid.unshift(0,0,0,0,0,0,0,0,0,0)
            lineCount++;
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
    return (lineCount - 1 > 0 ? lineCount - 1 : 0);
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
                    return (0)
                if (l + this.piece.position[0] + (i + this.piece.position[1]) * 10 >= 0 && this.grid[l + this.piece.position[0] + (i + this.piece.position[1]) * 10] != 0)
                    return (0)
                if (l + this.piece.position[0] - 1 + (i + this.piece.position[1]) * 10 % 10 == 9)
                    return (0)
                if (l + this.piece.position[0] + 1 + (i + this.piece.position[1]) * 10 % 10 == 0)
                    return (0)
                
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
    let me = {name: this.name, grid: this.grid, score: this.score, piece: this.nextGrid, permission: this.permission}
    this.socket.emit('me', me)
}

module.exports = Player;