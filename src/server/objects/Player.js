function Player(name, permission){
    this.name = name,
    this.permission = permission // 0 = spectator, 1 = player, 2 = creator
}
module.exports = Player;