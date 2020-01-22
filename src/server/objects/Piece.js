function Piece() {
    this.color = Math.floor(Math.random() * Math.floor(7))
    this.grid = generateGrid()
    this.position = [3, -1 * this.grid.length]
    this.changeXPosition = changeXPosition
    this.changeYPosition = changeYPosition
    return this;
}

function generateGrid() {
    grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]]
    return grid
}

function changeXPosition(direction) {
    direction = parseInt(direction)
    //direction: -1 = left 1 = right
    if (direction == -1 && (this.position[0] == 0))
        return;
    else if (direction == 1 && (this.grid[0].length + this.position[0] == 10))
        return
    this.position[0] += parseInt(direction)
}

function changeYPosition(direction) {
    direction = parseInt(direction)
    if (this.position[1] -direction + this.grid.length > 20)
        return
    this.position[1] = ((this.position[1] - direction))
}


module.exports = Piece;
