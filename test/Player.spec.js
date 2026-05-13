const Player = require('../src/server/objects/Player')
const Piece = require('../src/server/objects/Piece')

const makeSocket = (id = 's1') => ({ emit: jest.fn(), id })

describe('Player', () => {
  describe('constructor', () => {
    it('creates an active player with a 200-cell empty grid', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      expect(p.grid).toHaveLength(200)
      expect(p.grid.every(v => v === 0)).toBe(true)
    })

    it('starts with status 0 (active), score 0 and classement 0', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      expect(p.status).toBe(0)
      expect(p.score).toBe(0)
      expect(p.classement).toBe(0)
    })

    it('creates a spectator with empty grid and classement -1', () => {
      const p = new Player('viewer', 0, makeSocket(), 'room1')
      expect(p.grid).toHaveLength(0)
      expect(p.classement).toBe(-1)
      expect(p.status).toBe(1)
    })

    it('creator has permission 2', () => {
      const p = new Player('creator', 2, makeSocket(), 'room1')
      expect(p.permission).toBe(2)
    })
  })

  describe('checkLines()', () => {
    it('does nothing and returns 0 when no line is complete', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      expect(p.checkLines()).toBe(0)
      expect(p.score).toBe(0)
    })

    it('clears 1 complete row, gives 40 points and returns 0 malus', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      for (let i = 190; i < 200; i++) p.grid[i] = 1
      const malus = p.checkLines()
      expect(p.score).toBe(40)
      expect(malus).toBe(0)
      expect(p.grid).toHaveLength(200)
    })

    it('clears 2 complete rows, gives 100 points and returns 1 malus line', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      for (let i = 180; i < 200; i++) p.grid[i] = 1
      const malus = p.checkLines()
      expect(p.score).toBe(100)
      expect(malus).toBe(1)
    })

    it('clears 4 complete rows, gives 1200 points and returns 3 malus lines', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      for (let i = 160; i < 200; i++) p.grid[i] = 1
      const malus = p.checkLines()
      expect(p.score).toBe(1200)
      expect(malus).toBe(3)
    })

    it('does not clear a row containing an indestructible cell (value 8)', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      for (let i = 190; i < 199; i++) p.grid[i] = 1
      p.grid[199] = 8
      expect(p.checkLines()).toBe(0)
      expect(p.score).toBe(0)
    })
  })

  describe('addBottomLines()', () => {
    it('does nothing in mode 0', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      p.linesToAdd = 3
      p.addBottomLines(0)
      expect(p.grid[199]).toBe(0)
    })

    it('adds indestructible lines (value 8) in mode 2', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      p.linesToAdd = 2
      p.addBottomLines(2)
      expect(p.linesToAdd).toBe(0)
      for (let i = 180; i < 200; i++) expect(p.grid[i]).toBe(8)
    })

    it('adds lines with one random gap in mode 1', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      p.linesToAdd = 1
      p.addBottomLines(1)
      const lastRow = p.grid.slice(190, 200)
      // exactly one cell should be 0 (the gap)
      expect(lastRow.filter(v => v === 0)).toHaveLength(1)
    })
  })

  describe('addPieceToGrid() / removePieceToGrid()', () => {
    it('writes piece color to the grid, then clears it on remove', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      p.piece = new Piece(1, 0) // O-piece: [[0,2,2,0],[0,2,2,0],[0,0,0,0]]
      p.piece.position = [0, 18]

      p.addPieceToGrid()
      expect(p.grid[181]).toBe(2)
      expect(p.grid[182]).toBe(2)
      expect(p.grid[191]).toBe(2)
      expect(p.grid[192]).toBe(2)

      p.removePieceToGrid()
      expect(p.grid[181]).toBe(0)
      expect(p.grid[182]).toBe(0)
    })
  })

  describe('changeColorGrid()', () => {
    it('sets all empty cells to 8 and leaves occupied cells unchanged', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      p.grid = new Array(200).fill(0)
      p.grid[50] = 3
      p.changeColorGrid()
      expect(p.color).toBe(8)
      expect(p.grid[50]).toBe(3)
      expect(p.grid[51]).toBe(8)
    })
  })

  describe('switchPause()', () => {
    it('toggles the pause state', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      expect(p.pause).toBe(false)
      p.switchPause()
      expect(p.pause).toBe(true)
      p.switchPause()
      expect(p.pause).toBe(false)
    })
  })

  describe('sendMyInfo()', () => {
    it('emits a "me" event with name, score and permission', () => {
      const socket = makeSocket()
      const p = new Player('alice', 1, socket, 'room1')
      p.sendMyInfo()
      expect(socket.emit).toHaveBeenCalledWith('me', expect.objectContaining({
        name: 'alice',
        score: 0,
        permission: 1,
      }))
    })
  })

  describe('down()', () => {
    it('drops the piece to the bottom (piece.stop becomes true)', () => {
      const p = new Player('alice', 1, makeSocket(), 'room1')
      p.piece.position = [3, 0]
      p.down()
      expect(p.piece.stop).toBe(true)
    })
  })
})
