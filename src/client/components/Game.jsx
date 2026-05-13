import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Game.css'
import Grid from './Grid.jsx'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Lobby from './Lobby.jsx'
import { useParams } from 'react-router-dom'
import { move, rotate, drop, startGame, resetGame, switchSpectators, SOCKET_CONNECT } from '../actions'

let keyReady = true
var xDown = null
var yDown = null

const Game = () => {
  const { room, username } = useParams()
  const dispatch = useDispatch()

  const myGrid = useSelector(state => state.game.myGrid)
  const myScore = useSelector(state => state.game.myScore)
  const myPiece = useSelector(state => state.game.myPiece)
  const otherPlayers = useSelector(state => state.game.otherPlayers)
  const permission = useSelector(state => state.game.permission)
  const gameStatus = useSelector(state => state.game.gameStatus)

  useEffect(() => {
    dispatch({ type: SOCKET_CONNECT, payload: { room, name: username } })
  }, [username])

  function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX
    yDown = evt.touches[0].clientY
  }

  function handleTouchMove(evt) {
    if (!xDown || !yDown) return

    const xUp = evt.touches[0].clientX
    const yUp = evt.touches[0].clientY
    const xDiff = xDown - xUp
    const yDiff = yDown - yUp

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      dispatch(move(xDiff > 0 ? -1 : 1))
    } else {
      if (yDiff > 0) dispatch(rotate())
      else dispatch(move(0))
    }
    xDown = null
    yDown = null
  }

  function keyHandler(event) {
    if (keyReady === false) { event.preventDefault(); return }
    keyReady = false

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      dispatch(move(0))
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      dispatch(move(event.key === 'ArrowLeft' ? -1 : 1))
    } else if (event.key === ' ') {
      event.preventDefault()
      dispatch(drop())
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      dispatch(rotate())
    } else {
      keyReady = true
      return
    }
    setTimeout(() => { keyReady = true }, 10)
  }

  window.addEventListener('keydown', keyHandler)
  window.addEventListener('touchstart', handleTouchStart)
  window.addEventListener('touchmove', handleTouchMove)

  const otherGrid = otherPlayers.map(other => (
    <Col key={other.name}>
      <Grid grid={other.grid} type="other" name={other.name} score={other.score} piece={other.nextGrid || []} />
    </Col>
  ))

  return (
    <Container id="content" xs={10} sm={6} md={4}>
      <h1 className="display-4">Room #{room}</h1>
      {gameStatus.status !== 'started' && (
        <Lobby
          status={gameStatus.status}
          users={gameStatus.users}
          username={username}
          onStart={(config) => dispatch(startGame(config))}
          onReset={() => dispatch(resetGame())}
          onSwitchSpectators={() => dispatch(switchSpectators())}
        />
      )}
      {(permission === 2 || permission === 1) && gameStatus.status !== 'waiting' && (
        <Col onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} className="mb-5">
          <Grid grid={myGrid} type="real" name="" score={myScore} piece={myPiece} />
        </Col>
      )}
      {gameStatus.status !== 'waiting' && (
        <Col id="other">{otherGrid}</Col>
      )}
    </Container>
  )
}

export default Game
