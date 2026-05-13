// Outgoing — player actions sent to the server via socket
export const move = (direction) => ({ type: 'SOCKET_EMIT', event: 'move', payload: { direction } })
export const rotate = () => ({ type: 'SOCKET_EMIT', event: 'rotate' })
export const drop = () => ({ type: 'SOCKET_EMIT', event: 'space' })
export const startGame = (config) => ({ type: 'SOCKET_EMIT', event: 'start', payload: config })
export const resetGame = () => ({ type: 'SOCKET_EMIT', event: 'reset' })
export const switchSpectators = () => ({ type: 'SOCKET_EMIT', event: 'switchSpectators' })

// Incoming — dispatched by the socket middleware when server events arrive
export const GAME_STATUS = 'GAME_STATUS'
export const PLAYERS_UPDATE = 'PLAYERS_UPDATE'
export const ME_UPDATE = 'ME_UPDATE'
export const SOCKET_CONNECT = 'SOCKET_CONNECT'
