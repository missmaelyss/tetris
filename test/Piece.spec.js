const Piece = require('../src/server/objects/Piece')

describe('Piece', () => {
  describe('constructor', () => {
    it('sets color as pieceId + 1', () => {
      expect(new Piece(0, 0).color).toBe(1)
      expect(new Piece(6, 0).color).toBe(7)
    })

    it('starts with stop = false', () => {
      expect(new Piece(0, 0).stop).toBe(false)
    })

    it('starts centered horizontally at x = 3', () => {
      expect(new Piece(0, 0).position[0]).toBe(3)
    })

    it('starts above the visible grid (negative y)', () => {
      expect(new Piece(0, 0).position[1]).toBeLessThan(0)
    })

    it('stores the correct grid for the given rotation', () => {
      const piece = new Piece(3, 1) // I-piece, rotation 1 (vertical)
      expect(piece.grid[0][2]).toBe(4)
      expect(piece.grid[1][2]).toBe(4)
    })
  })

  describe('rotate()', () => {
    it('advances to the next rotation', () => {
      const piece = new Piece(0, 0) // S-piece, 4 rotations
      piece.rotate()
      expect(piece.pieceRot).toBe(1)
    })

    it('wraps around for the O-piece which has a single rotation', () => {
      const piece = new Piece(1, 0)
      piece.rotate()
      expect(piece.pieceRot).toBe(0)
    })

    it('updates the grid to match the new rotation', () => {
      const piece = new Piece(0, 0)
      const gridBefore = JSON.stringify(piece.grid)
      piece.rotate()
      expect(JSON.stringify(piece.grid)).not.toBe(gridBefore)
    })
  })

  describe('changeXPosition()', () => {
    it('moves right when direction is 1', () => {
      const piece = new Piece(0, 0)
      const x = piece.position[0]
      piece.changeXPosition(1)
      expect(piece.position[0]).toBe(x + 1)
    })

    it('moves left when direction is -1', () => {
      const piece = new Piece(0, 0)
      const x = piece.position[0]
      piece.changeXPosition(-1)
      expect(piece.position[0]).toBe(x - 1)
    })
  })

  describe('changeYPosition()', () => {
    it('moves the piece down when direction is -1 (y position increases)', () => {
      const piece = new Piece(0, 0)
      const y = piece.position[1]
      piece.changeYPosition(-1)
      expect(piece.position[1]).toBe(y + 1)
    })
  })
})
