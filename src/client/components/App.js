import React from 'react'
import './App.css'
import TopBar from './Nav'
import Home from './Home'
import Game from './Game'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

const App = () => {
  return (
    <div id="app">
      <Router>
        <TopBar/>
        <Switch>
          <Route path="/:room/:username" exact component={Game}></Route>
          <Route path="/" component={Home}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App