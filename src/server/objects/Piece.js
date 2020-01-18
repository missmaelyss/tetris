function Piece() {
    this.color = 5
    this.grid = generateGrid()
    this.position = []
    this.changePosition = changePosition
    return this;
}

function generateGrid() {
    grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]]
    return grid
}

function changePosition(position) {
    this.position = position
}

module.exports = Piece;
