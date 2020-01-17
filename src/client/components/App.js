import ReactDOM from 'react-dom'
import React, { useState } from 'react'
import io from "socket.io-client"
import './App.css'
import Game from './Game'

const endpoint = 'localhost:4001';
const name = parseInt(Math.random()*1000).toString()
const socket = io.connect(endpoint + '?room=1245&name='+ name);

socket.on('other', (others) => {
  others.splice(others.findIndex((element) => element.name === name), 1)
  var element = others.map((other) => (
    <Game grid={other.grid} other="other"/>
    )
  )
  // ReactDOM.render(
  //   element,
  //   document.getElementById('other')
  // );
})

// socket.on('me', (me) => {
//   console.log(me)
//   setMyGrid(me.grid)
//   ReactDOM.render(
//     <Game grid={me.grid} other="real" />,
//     document.getElementById('real')
//   );
//   ReactDOM.render(
//     <button onClick={() => 
//       socket.emit('changeMyColor', {name: me.name})}>Change My Color</button>,
//     document.getElementById('button')
//   );
// })

function App() {
  // Déclaration d'une nouvelle variable d'état, que l'on appellera “count”
  const [myGrid, setMyGrid] = useState([]);
  const [otherGrid, setOtherGrid] = useState([]);

  socket.on('me', (me) => {
    console.log(me)
    setMyGrid(me.grid)
  })

  socket.on('other', (others) => {
    others.splice(others.findIndex((element) => element.name === name), 1)
    setOtherGrid(others)
  })


  return (
    <div id="app">
      <div id="real">
        <Game grid={myGrid} other="real" />
      </div>
      <div id="other">
      {otherGrid.map((other) => (
          <Game 
            grid={other.grid}
            other="other"
          />
      ))}
      </div>
      <div id="button"></div>
      <button onClick={() => socket.emit('changeColor')}>Change All Color</button>
    </div>
  );
}

// const App = () => {
//   return (
//     <div id="app">
//       <div id="real"></div>
//       <div id="other"></div>
//       <div id="button"></div>
//       <button onClick={() => socket.emit('changeColor')}>Change All Color</button>
//     </div>
    
//   );
// }

export default App