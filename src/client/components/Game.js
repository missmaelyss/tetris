import React, { useState, useEffect } from 'react'
import io from "socket.io-client"
import './Game.css'
import Grid from './Grid'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import {useParams} from 'react-router-dom'
import {Redirect} from 'react-router-dom'
const endpoint = 'localhost:4001';
let socket = false;

let keyReady = true;

const Game = () => {
  let {room, username} = useParams();

  if (!socket){

    socket = io.connect(endpoint + '?room='+ room + '&name='+ username)
  }
  const [myGrid, setMyGrid] = useState([])
  const [myScore, setMyScore] = useState([])
  const [myPiece, setMyPiece] = useState([])
  const [otherGrid, setOtherGrid] = useState([])
  const [permission, setPermission] = useState([])


  useEffect(() => {
    socket.on('players',(others, me) => {
      // setMyGrid(me)
      others.splice(others.findIndex((element) => element.name === username), 1)
      var element = others.map((other) => (
        <Col>
          <Grid grid={other.grid} type="other" score={other.score} piece={other.nextGrid}/>
        </Col>
      ))
      setOtherGrid(element)
    });

    socket.on('me',(me) => {
      console.log(me)
      setMyGrid(me.grid)
      setMyScore(me.score)
      setMyPiece(me.piece)
      setPermission(me.permission)
    });
    // eslint-disable-next-line
  },0);

  if (!room || !username)
    return(<Redirect to="/" />)

  function keyHandler(event){
    if (keyReady === false) { return; }
    keyReady = false

    if (event.key === 'ArrowDown')
      socket.emit('move', {name: username, direction: 0})
    else if (event.key === 'ArrowLeft' || event.key === "ArrowRight" ){
      socket.emit('move',{
        name: username, 
        direction: (event.key === "ArrowLeft" ? -1 : 1)
      })
    }
    else if (event.key === " ")
      socket.emit('space', {name:username})
    else if (event.key === "ArrowUp")
      socket.emit('rotate', {name:username})
    else {
      keyReady = true
      return;
    }
    setTimeout((() => {keyReady = true}), 100)
  }

  window.addEventListener("keydown", keyHandler)
  return (
    <div id="app">
      <div id="real"><Grid grid={myGrid} type="real" score={myScore} piece={myPiece}/></div>
      <div id="other">{otherGrid}</div>
      <div id="button">
        {permission === 2 ?
  (        <Button variant="success" onClick={() => socket.emit('start', {name: username})}>Start Game</Button>  )
          : ( "Only the owner can start the game")
        }
      </div>
    </div>
  );
}

export default Game