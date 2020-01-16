function Player(name, permission, socket){
    this.name = name,
    this.permission = permission // 0 = spectator, 1 = player, 2 = creator
    this.socket = socket
    this.grid = createEmptyGrid()
}

function createEmptyGrid() {
    let     i = 0;
    let     grid = []
    let     line = []
    while (i < 10)
    {
        line.push(0)
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

module.exports = Player;