import React, { useState, useEffect } from 'react'
import io from "socket.io-client"
import './Game.css'
import Grid from './Grid'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Lobby from "./Lobby.js"
import {useParams} from 'react-router-dom'
import {Redirect} from 'react-router-dom'
const endpoint = '51.91.56.214:4001';
let socket = false;

let keyReady = true;

const Game = () => {
  let {room, username} = useParams();

  if (!socket){
    socket = io.connect(endpoint + '?room='+ room + '&name='+ username)
    console.log(socket)
  }
  const [myGrid, setMyGrid] = useState([])
  const [myScore, setMyScore] = useState([])
  const [myPiece, setMyPiece] = useState([])
  const [otherGrid, setOtherGrid] = useState([])
  const [permission, setPermission] = useState([])
  const [gameStatus, setGameStatus] = useState([])


  useEffect(() => {
    socket.on('gameStatus', (status) => {
      setGameStatus(status)
    });
    socket.on('players',(others, me) => {
      // setMyGrid(me)
      var myGrid = others.findIndex((element) => element.name === username)
      setMyGrid(me)
      if (myGrid !== -1)
        others.splice(myGrid, 1)
      var element = others.map((other) => (
        <Col>
          <Grid grid={other.grid} type="other" score={other.score} piece={other.nextGrid}/>
        </Col>
      ))
      setOtherGrid(element)
    });

    socket.on('me',(me) => {
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
    if (keyReady === false) { event.preventDefault();return; }
    

    keyReady = false

    if (event.key === 'ArrowDown'){
      event.preventDefault();
      socket.emit('move', {name: username, direction: 0})
    }
    else if (event.key === 'ArrowLeft' || event.key === "ArrowRight" ){
      socket.emit('move',{
        name: username, 
        direction: (event.key === "ArrowLeft" ? -1 : 1)
      })
    }
    else if (event.key === " "){
      event.preventDefault();
      socket.emit('space', {name:username})
    }
    else if (event.key === "ArrowUp"){
      event.preventDefault();
      socket.emit('rotate', {name:username})
    }
    else {
      keyReady = true
      return;
    }
    setTimeout((() => {keyReady = true}), 100)
  }

  window.addEventListener("keydown", keyHandler)
  return (
    <Container id="content" xs={10} sm={6} md={4} >
      <h1 className="display-4">Room #{room}</h1>
      { gameStatus.status !== 'started' ? (
        <Lobby status={gameStatus.status} users={gameStatus.users} socket={socket} username={username} />)
      : ('')
      }
      {(permission === 2 ||  permission === 1) && gameStatus.status !== 'waiting' ? (
        <Col className="mb-5"><Grid grid={myGrid} type="real" score={myScore} piece={myPiece}/></Col>)
        : ('')
      }
      { gameStatus.status !== 'waiting' ? (
        <Col id="other">{otherGrid}</Col>)
        : ('')
      }
    </Container>
  );
}

export default Game