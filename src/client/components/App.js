import React, { Component } from 'react'
import Tail from './Tail'
import shuffle from 'lodash.shuffle'
import './App.css'

const COLORS = ["red", "yellow", "green",
 "blue", "orange", "dark-blue", "violet", "white"]

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
        if (result.length < 15)
          result.push(getRandomInt(8))
        else
          result.push(7)
        }
    }
    return (result)
    // return shuffle(result)
  }

  // moveDown() {
  //   const result = []
  //   const { tails, pause } = this.state
  //   const size = 10 * 20
  //   var n = 0
  //   while (n < size)
  //   {
  //     if (n > 9)
  //       result[n] = tails[n - 10]
  //     else
  //       result[n] = "white"
  //     n++
  //   }

  //   setTimeout(() => {
  //     this.setState({ tails: pause ? result : this.moveDown() });
  //   }, 1500);
  //   return result
  // }

  switchPause()
  {
    const { tails, pause } = this.state
    this.setState({ pause: !pause})
    // if (pause) {
    //   this.moveDown()
    // }
    console.log(this.state.pause)
  }

  render() {
    const { tails , pause } = this.state
    return (
      <div className="area" onClick={() => this.switchPause()}>
        {tails.map((colorIndex, index) => (
          <Tail
            index={index}
            color={COLORS[colorIndex]}
            />
        ))}
      </div>
    )
  }

  // componentDidMount() {
  //   console.log("RENDER")
  //   setTimeout(() => {
  //     this.setState({ tails: this.moveDown() });
  //   }, 1500);
  // }
}

export default App