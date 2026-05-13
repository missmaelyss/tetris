import game from '../src/client/reducers/game'
import rootReducer from '../src/client/reducers'
import { GAME_STATUS, PLAYERS_UPDATE, ME_UPDATE } from '../src/client/actions'

describe('game reducer', () => {
  const initialState = {
    myGrid: [],
    myScore: 0,
    myPiece: [],
    otherPlayers: [],
    permission: null,
    gameStatus: {},
  }

  it('returns the initial state for an unknown action', () => {
    expect(game(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  it('handles GAME_STATUS', () => {
    const state = game(undefined, { type: GAME_STATUS, payload: { status: 'started', users: {} } })
    expect(state.gameStatus).toEqual({ status: 'started', users: {} })
    expect(state.myGrid).toEqual([])
  })

  it('handles PLAYERS_UPDATE: splits others from current player and stores raw data', () => {
    const others = [{ name: 'alice', grid: [1] }, { name: 'bob', grid: [2] }]
    const state = game(undefined, {
      type: PLAYERS_UPDATE,
      payload: { others, me: [9, 9], myname: 'alice' },
    })
    expect(state.myGrid).toEqual([9, 9])
    expect(state.otherPlayers).toHaveLength(1)
    expect(state.otherPlayers[0].name).toBe('bob')
  })

  it('handles PLAYERS_UPDATE: keeps all others when current player is not in the list', () => {
    const others = [{ name: 'bob' }, { name: 'charlie' }]
    const state = game(undefined, {
      type: PLAYERS_UPDATE,
      payload: { others, me: [], myname: 'alice' },
    })
    expect(state.otherPlayers).toHaveLength(2)
  })

  it('handles ME_UPDATE: updates grid, score, piece and permission', () => {
    const state = game(undefined, {
      type: ME_UPDATE,
      payload: { grid: [1, 2, 3], score: 100, piece: [4, 5], permission: 2 },
    })
    expect(state.myGrid).toEqual([1, 2, 3])
    expect(state.myScore).toBe(100)
    expect(state.myPiece).toEqual([4, 5])
    expect(state.permission).toBe(2)
  })

  it('does not mutate state on ME_UPDATE', () => {
    const prev = game(undefined, { type: '@@INIT' })
    const next = game(prev, { type: ME_UPDATE, payload: { grid: [], score: 0, piece: [], permission: 1 } })
    expect(next).not.toBe(prev)
  })
})

describe('rootReducer', () => {
  it('initialises the game slice', () => {
    const state = rootReducer(undefined, { type: '@@INIT' })
    expect(state).toHaveProperty('game')
    expect(state.game.myGrid).toEqual([])
  })
})
