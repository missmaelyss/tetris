function Player(name, permission, socket){
    this.name = name,
    this.permission = permission // 0 = spectator, 1 = player, 2 = creator
    this.socket = socket
    this.grid = createEmptyGrid()

    // MAE
    this.changeColorGrid = changeColorGrid
    this.sendMyInfo = sendMyInfo

    this.sendMyInfo()
}

function createEmptyGrid() {
    let     i = 0;
    let     grid = []
    let     line = []
    while (i < 10)
    {
        line.push(7)
        i++;
    }
    i = 0;
    while (i < 20)
    {
        grid.push(line)
        i++;
    }
    return grid;
}

function changeColorGrid() {
    let     i = 0;
    let     grid = []
    let     line = []

    const color = this.grid[0][0] % 7 + 1

    while (i < 10)
    {
        line.push(color)
        i++;
    }
    i = 0;
    while (i < 20)
    {
        grid.push(line)
        i++;
    }
    this.grid = grid;
}

function sendMyInfo() {
    let me = {name: this.name, grid: this.grid}
    this.socket.emit('me', me)
}

module.exports = Player;