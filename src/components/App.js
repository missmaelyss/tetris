import React, { Component } from 'react'
import Tail from './Tail'
import shuffle from 'lodash.shuffle'
import './App.css'

// import Footer from './Footer'
// import AddTodo from '../containers/AddTodo'
// import VisibleTodoList from '../containers/VisibleTodoList'
// import '../style.css'

// const App = () => (
//   <div>
//     <AddTodo />
//     <VisibleTodoList />
//     <Footer />
//   </div>
// )
// export default App

const COLORS = ["red", "blue", "green", "yellow"]

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class App extends Component {
    state = {
      tails: this.generateForm(),
      pause: false,
  }

  generateForm() {
    const result = []
    const size = 10 * 20
    if (!this.start) {
      while (result.length < size)
      {
        result.push(COLORS[getRandomInt(5)])
      }
    }
    return result
  }

  moveDown() {
    const result = []
    const { tails, pause } = this.state
    const size = 10 * 20
    var n = 0
    while (n < size)
    {
      if (n > 9)
        result[n] = tails[n - 10]
      else
        result[n] = "white"
      n++
    }

    if (this.pause === true) 
      return tails
  
    return result
  }

  switchPause()
  {
    this.setState({ pause: !this.state.pause})
    console.log(this.state.pause)
  }

  render() {
    const { tails , pause } = this.state
    return (
      <div className="area" onClick={() => this.switchPause()}>
        {tails.map((color, index) => (
          <Tail
            index={index}
            color={color}
            />
        ))}
      </div>
    )
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ tails: this.moveDown() });
    }, 1500);
  }
}

export default App