import React from 'react'
import './App.css'
import Home from './Home'
import Game from './Game'
import { HashRouter, Route } from 'react-router-dom'

const App = () => {
  return (
    <div id="app">
          <HashRouter hashType="noslash"> 
            <Route path="/:room[:username]" component={Game}/>
            <Route exact path="/" component={Home}/>
          </HashRouter>
    </div>
  );
}

export default App