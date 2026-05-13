jest.mock('socket.io-client', () => {
  const createSocket = () => {
    const handlers = {}
    return {
      on: jest.fn((event, cb) => { handlers[event] = cb }),
      emit: jest.fn(),
      disconnect: jest.fn(),
      _trigger: (event, ...args) => handlers[event] && handlers[event](...args),
    }
  }
  return jest.fn(createSocket)
})

import io from 'socket.io-client'
import socketMiddleware from '../src/client/middlewares/socket'
import { GAME_STATUS, ME_UPDATE, PLAYERS_UPDATE } from '../src/client/actions'

const makeMW = () => {
  const store = { dispatch: jest.fn() }
  const next = jest.fn()
  const dispatch = socketMiddleware(store)(next)
  return { store, next, dispatch }
}

const connect = (dispatch) =>
  dispatch({ type: 'SOCKET_CONNECT', payload: { room: 'r1', name: 'alice' } })

describe('socketMiddleware', () => {
  beforeEach(() => io.mockClear())

  it('passes unrelated actions to next', () => {
    const { next, dispatch } = makeMW()
    const action = { type: 'OTHER', payload: 42 }
    dispatch(action)
    expect(next).toHaveBeenCalledWith(action)
  })

  it('does not call next for SOCKET_CONNECT', () => {
    const { next, dispatch } = makeMW()
    connect(dispatch)
    expect(next).not.toHaveBeenCalled()
  })

  it('calls io() with room and name on SOCKET_CONNECT', () => {
    const { dispatch } = makeMW()
    connect(dispatch)
    expect(io).toHaveBeenCalledWith(
      expect.any(String),
      { query: { room: 'r1', name: 'alice' } }
    )
  })

  it('does not call next for SOCKET_EMIT', () => {
    const { next, dispatch } = makeMW()
    connect(dispatch)
    dispatch({ type: 'SOCKET_EMIT', event: 'move', payload: { direction: 1 } })
    expect(next).not.toHaveBeenCalled()
  })

  it('emits the event to the socket on SOCKET_EMIT', () => {
    const { dispatch } = makeMW()
    connect(dispatch)
    const socket = io.mock.results[0].value
    dispatch({ type: 'SOCKET_EMIT', event: 'move', payload: { direction: -1 } })
    expect(socket.emit).toHaveBeenCalledWith('move', { direction: -1 })
  })

  it('dispatches GAME_STATUS when server emits gameStatus', () => {
    const { store, dispatch } = makeMW()
    connect(dispatch)
    const socket = io.mock.results[0].value
    socket._trigger('gameStatus', { status: 'started' })
    expect(store.dispatch).toHaveBeenCalledWith({ type: GAME_STATUS, payload: { status: 'started' } })
  })

  it('dispatches PLAYERS_UPDATE when server emits players', () => {
    const { store, dispatch } = makeMW()
    connect(dispatch)
    const socket = io.mock.results[0].value
    const others = [{ name: 'bob' }]
    socket._trigger('players', others, [1, 2], 'alice')
    expect(store.dispatch).toHaveBeenCalledWith({
      type: PLAYERS_UPDATE,
      payload: { others, me: [1, 2], myname: 'alice' },
    })
  })

  it('dispatches ME_UPDATE when server emits me', () => {
    const { store, dispatch } = makeMW()
    connect(dispatch)
    const socket = io.mock.results[0].value
    const me = { grid: [], score: 40, piece: [], permission: 1 }
    socket._trigger('me', me)
    expect(store.dispatch).toHaveBeenCalledWith({ type: ME_UPDATE, payload: me })
  })

  it('disconnects the previous socket on a second SOCKET_CONNECT', () => {
    const { dispatch } = makeMW()
    connect(dispatch)
    const first = io.mock.results[0].value
    connect(dispatch)
    expect(first.disconnect).toHaveBeenCalled()
  })
})
