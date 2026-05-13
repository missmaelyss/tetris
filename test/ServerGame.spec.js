const Game = require('../src/server/objects/Game')

const makeSocket = (id) => ({ emit: jest.fn(), id })

describe('Game (server)', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  describe('constructor', () => {
    it('creates a room with the creator at permission 2', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      expect(game.players).toHaveLength(1)
      expect(game.players[0].name).toBe('alice')
      expect(game.players[0].permission).toBe(2)
    })

    it('starts in "waiting" status', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      expect(game.status).toBe('waiting')
    })
  })

  describe('joinRoom()', () => {
    it('adds a player with permission 1', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.joinRoom('bob', makeSocket('s2'))
      expect(game.players).toHaveLength(2)
      expect(game.players[1].name).toBe('bob')
      expect(game.players[1].permission).toBe(1)
    })

    it('renames a player that has a duplicate name', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.joinRoom('alice', makeSocket('s2'))
      expect(game.players[1].name).not.toBe('alice')
    })

    it('joins as spectator (permission 0) when the game is already started', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.status = 'started'
      game.joinRoom('bob', makeSocket('s2'))
      expect(game.players[1].permission).toBe(0)
    })
  })

  describe('leaveRoom()', () => {
    it('removes the player from the room', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.joinRoom('bob', makeSocket('s2'))
      game.leaveRoom('s2')
      expect(game.players).toHaveLength(1)
    })

    it('transfers ownership to the next player when the creator leaves', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.joinRoom('bob', makeSocket('s2'))
      game.leaveRoom('s1')
      expect(game.players[0].permission).toBe(2)
      expect(game.players[0].name).toBe('bob')
    })
  })

  describe('startGame()', () => {
    it('allows the creator to start the game', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.startGame('s1', false, 0)
      expect(game.status).toBe('started')
    })

    it('blocks a non-creator from starting', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.joinRoom('bob', makeSocket('s2'))
      const result = game.startGame('s2', false, 0)
      expect(result).toBe(-1)
      expect(game.status).toBe('waiting')
    })

    it('blocks starting a game that is already started', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.startGame('s1', false, 0)
      const result = game.startGame('s1', false, 0)
      expect(result).toBe(-1)
    })
  })

  describe('resetGame()', () => {
    it('allows the creator to reset the room', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.status = 'ended'
      game.resetGame('s1')
      expect(game.status).toBe('waiting')
    })

    it('blocks a non-creator from resetting', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.joinRoom('bob', makeSocket('s2'))
      game.status = 'ended'
      game.resetGame('s2')
      expect(game.status).toBe('ended')
    })
  })

  describe('addLinesExcept()', () => {
    it('queues malus lines for all players except the named one', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.joinRoom('bob', makeSocket('s2'))
      game.joinRoom('charlie', makeSocket('s3'))
      game.addLinesExcept(2, 'alice')
      expect(game.players[0].linesToAdd).toBe(0) // alice untouched
      expect(game.players[1].linesToAdd).toBe(2)
      expect(game.players[2].linesToAdd).toBe(2)
    })

    it('does nothing when amount is 0', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.joinRoom('bob', makeSocket('s2'))
      game.addLinesExcept(0, 'alice')
      expect(game.players[1].linesToAdd).toBe(0)
    })
  })

  describe('getPlayerList()', () => {
    it('separates creator, players and spectators', () => {
      const game = new Game('room1', 'alice', makeSocket('s1'))
      game.joinRoom('bob', makeSocket('s2'))
      const list = game.getPlayerList()
      expect(list.creator.name).toBe('alice')
      expect(list.players).toHaveLength(1)
      expect(list.players[0].name).toBe('bob')
      expect(list.spectators).toHaveLength(0)
    })
  })

  describe('sendGameStatus()', () => {
    it('emits "gameStatus" to all connected sockets', () => {
      const s1 = makeSocket('s1')
      const s2 = makeSocket('s2')
      const game = new Game('room1', 'alice', s1)
      game.joinRoom('bob', s2)
      s1.emit.mockClear()
      s2.emit.mockClear()
      game.sendGameStatus()
      expect(s1.emit).toHaveBeenCalledWith('gameStatus', expect.objectContaining({ status: 'waiting' }), expect.anything(), expect.anything())
      expect(s2.emit).toHaveBeenCalledWith('gameStatus', expect.objectContaining({ status: 'waiting' }), expect.anything(), expect.anything())
    })
  })

  describe('inviteSpectators()', () => {
    it('promotes spectators to players when called by the creator', () => {
      const s1 = makeSocket('s1')
      const s2 = makeSocket('s2')
      const game = new Game('room1', 'alice', s1)
      game.status = 'started'
      game.joinRoom('bob', s2)
      expect(game.players[1].permission).toBe(0)
      game.inviteSpectators('s1')
      expect(game.players[1].permission).toBe(1)
    })

    it('does nothing when called by a non-creator', () => {
      const s1 = makeSocket('s1')
      const s2 = makeSocket('s2')
      const s3 = makeSocket('s3')
      const game = new Game('room1', 'alice', s1)
      game.joinRoom('bob', s2)
      game.status = 'started'
      game.joinRoom('charlie', s3)
      game.inviteSpectators('s2') // bob is not the creator
      expect(game.players[2].permission).toBe(0)
    })
  })
})
