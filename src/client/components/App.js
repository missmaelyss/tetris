import React, { useState, useEffect } from 'react'
import io from "socket.io-client"
import './App.css'
import Grid from './Grid'

const endpoint = 'localhost:4001';
const name = parseInt(Math.random()*1000).toString()
const socket = io.connect(endpoint + '?room=1245&name='+ name);

const App = () => {
  
  const [myGrid, setMyGrid] = useState([])
  const [otherGrid, setOtherGrid] = useState([])

  useEffect(() => {
    socket.on('players',(others, me) => {
      setMyGrid(me)
      others.splice(others.findIndex((element) => element.name === name), 1)
      var element = others.map((other) => (
        <Grid grid={other.grid} other="other"/>
      ))
      setOtherGrid(element)
    });

    socket.on('me',(me) => {
      setMyGrid(me.grid)
    });


  },0);

  return (
    <div id="app">
      <div id="real"><Grid grid={myGrid} other="real" /></div>
      <div id="other">{otherGrid}</div>
      <div id="button">
        <button onClick={() => socket.emit('changeColor', {name: name})}>Change All Color</button>
        <button onClick={() => socket.emit('changeMyColor', {name: name})}>Change My Color</button>
        <button onClick={() => socket.emit('moveDown', {name: name})}>Move Down</button>
      </div>
    </div>
  );
}

export default App