import React from 'react'
import './App.css'
import Home from './Home'
import Game from './Game'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

const App = () => {
  return (
    <div id="app">
      <Router>
          <Switch>
            <Route exact path="/:room/:username" component={Game}/>
            <Route path="/" component={Home}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App