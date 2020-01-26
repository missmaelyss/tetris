const PiecePool = [[[[1,1,0],[0,1,1]],[[0,1],[1,1],[1,0]]],[[[2,2],[2,2]]],[[[0,3,3],[3,3,0]],[[3,0],[3,3],[0,3]]],[[[4,4,4,4]],[[4],[4],[4],[4]]],[[[0,0,5],[5,5,5]],[[5,0],[5,0],[5,5]],[[5,5,5],[5,0,0]],[[5,5],[0,5],[0,5]]],[[[6,0,0],[6,6,6]],[[6,6],[6,0],[6,0]],[[6,6,6],[0,0,6]],[[0,6],[0,6],[6,6]]],[[[0,7,0],[7,7,7]],[[7,0],[7,7],[7,0]],[[7,7,7],[0,7,0]],[[0,7],[7,7],[0,7]]]];

function Piece(pieceId, rotation) {
    this.color = Math.floor(Math.random() * Math.floor(6)) + 1
    this.grid = generateGrid(pieceId, rotation)
    this.pieceId = pieceId
    this.pieceRot = rotation
    this.changeXPosition = changeXPosition
    this.changeYPosition = changeYPosition
    this.rotate = rotate
    this.position = [3, -1 * this.grid.length]
    this.stop = false
    return this;
}

function rotate() {
    this.pieceRot = (this.pieceRot + 1) % PiecePool[this.pieceId].length;
    this.grid = PiecePool[this.pieceId][this.pieceRot]
}

function generateGrid(pieceId, rotation) {
    grid = PiecePool[pieceId][rotation]
    return grid
}

function changeXPosition(direction) {
    direction = parseInt(direction)
    this.position[0] += parseInt(direction)
}

function changeYPosition(direction) {
    direction = parseInt(direction)
    this.position[1] = ((this.position[1] - direction))
}

module.exports = Piece;