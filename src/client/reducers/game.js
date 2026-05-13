import { GAME_STATUS, ME_UPDATE, PLAYERS_UPDATE } from '../actions'

const initialState = {
  myGrid: [],
  myScore: 0,
  myPiece: [],
  otherPlayers: [],
  permission: null,
  gameStatus: {},
}

const game = (state = initialState, action) => {
  switch (action.type) {
    case GAME_STATUS:
      return { ...state, gameStatus: action.payload }

    case PLAYERS_UPDATE: {
      const { others, me, myname } = action.payload
      const otherPlayers = others.filter(p => p.name !== myname)
      return { ...state, myGrid: me, otherPlayers }
    }

    case ME_UPDATE:
      return {
        ...state,
        myGrid: action.payload.grid,
        myScore: action.payload.score,
        myPiece: action.payload.piece,
        permission: action.payload.permission,
      }

    default:
      return state
  }
}

export default game
