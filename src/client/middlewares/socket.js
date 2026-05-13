import io from 'socket.io-client'
import { GAME_STATUS, ME_UPDATE, PLAYERS_UPDATE } from '../actions'

const socketMiddleware = (store) => {
  let socket = null

  return next => action => {
    if (action.type === 'SOCKET_CONNECT') {
      if (socket) socket.disconnect()
      const { room, name } = action.payload
      socket = io(window.location.origin, { query: { room, name } })

      socket.on('gameStatus', data =>
        store.dispatch({ type: GAME_STATUS, payload: data })
      )
      socket.on('players', (others, me, myname) =>
        store.dispatch({ type: PLAYERS_UPDATE, payload: { others, me, myname } })
      )
      socket.on('me', me =>
        store.dispatch({ type: ME_UPDATE, payload: me })
      )
      return
    }

    if (action.type === 'SOCKET_EMIT') {
      if (socket) socket.emit(action.event, action.payload)
      return
    }

    return next(action)
  }
}

export default socketMiddleware
