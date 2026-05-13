import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import "./Lobby.css"

const Lobby = ({ status, users, onStart, onReset, onSwitchSpectators }) => {
  const [spectrum, setSpectrum] = useState(false)
  const [lines, setLines] = useState(0)

  if (users) {
    var players = users.players.map((player) => (
      <span key={player.name} role="img" aria-label="player">⚫️ <span className="username">{player.name} </span><br /></span>
    ))
    var spectators = users.spectators.map((spectator) => (
      <span key={spectator.name} role="img" aria-label="spectator">👁 <span className="username">{spectator.name}</span><br /></span>
    ))
  }

  return (
    <Container xs={12} sm={10} md={8}>
      <Row className="mb-5">
        <Col>
          <h3>Players</h3>
          <span role="img" aria-label="creator">⭐️ <strong><span className="username">{users ? users.creator.name : ''}</span></strong><br /></span>
          {players}
          {spectators}
        </Col>
        <Col className="justify-content-md-centere">
          <div className="buttons">
            <Button className="mb-1" disabled={status !== 'waiting'} variant="success"
              onClick={() => onStart && onStart({ spectrum, lines })}>Start Game</Button><br />
            <Button className="mb-1" disabled={!(status === 'ended' && users && users.spectators.length > 0)} variant="success"
              onClick={() => onSwitchSpectators && onSwitchSpectators()}>Invite Spectators</Button>
            <Button className="mb-1" disabled={!(status === 'ended')} variant="success"
              onClick={() => onReset && onReset()}>Reset Room</Button>
            <Button className="mb-1" variant={spectrum ? "success" : "secondary"}
              onClick={() => setSpectrum(!spectrum)}>Spectrum {spectrum ? " enabled" : "disabled"}</Button>
            <Button className="mb-1" variant={lines ? "success" : "secondary"}
              onClick={() => setLines((lines + 1) % 3)}>{lines === 0 ? "No Malus Lines" : (lines === 1 ? "Destructibles lines" : "Indestructibles Lines")}</Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Lobby
