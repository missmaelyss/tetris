import React, { useState, useEffect } from 'react'
import io from "socket.io-client"
import './Game.css'
import Grid from './Grid'
import {useParams} from 'react-router-dom'


const endpoint = 'localhost:4001';
let socket = false;

let keyReady = true;

const Game = () => {
  let {room, username} = useParams();

  if (!socket){
    socket = io.connect(endpoint + '?room='+ room + '&name='+ username)
  }
  const [myGrid, setMyGrid] = useState([])
  const [otherGrid, setOtherGrid] = useState([])

  useEffect(() => {
    document.title = `mdr`;
    // let {room, username} = useParams();
    socket.on('players',(others, me) => {
      // setMyGrid(me)
      others.splice(others.findIndex((element) => element.name === username), 1)
      var element = others.map((other) => (
        <Grid grid={other.grid} other="other"/>
      ))
      setOtherGrid(element)
    });

    socket.on('me',(me) => {
      setMyGrid(me.grid)
    });
    // eslint-disable-next-line
  },0);

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
      <div id="real"><Grid grid={myGrid} other="real" /></div>
      <div id="other">{otherGrid}</div>
      <div id="button">
        {/* <button onClick={() => socket.emit('changeColor', {name: username})}>Change All Color</button> */}
        {/* <button onClick={() => socket.emit('changeMyColor', {name: username})}>Change My Color</button> */}
        {/* <button onClick={() => socket.emit('moveDown', {name: username})}>Move Down</button> */}
        <button onClick={() => socket.emit('move', {name: username, direction: -1})}>←</button>
        <button onClick={() => socket.emit('move', {name: username, direction: 1})}>→</button>
        <button onClick={() => socket.emit('move', {name: username, direction: 0})}>↓</button>
        <button onClick={() => socket.emit('pause', {name: username})}>Pause</button>
        <button onClick={() => socket.emit('start', {name: username})}>Start Game</button>
        <button onClick={() => socket.emit('rotate', {name: username})}>Rotate</button>
      </div>
    </div>
  );
}

export default Game