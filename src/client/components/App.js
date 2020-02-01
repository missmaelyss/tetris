import React from 'react'
import './App.css'
import Home from './Home'
import Game from './Game'
import Container from 'react-bootstrap/Container'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

const App = () => {
  return (
    <div id="app">
      <Router>
        <Container id="content" xs={10} sm={6} md={4} >
          <Switch>
            <Route path="/:room/:username" exact component={Game}></Route>
            <Route path="/" component={Home}/>
          </Switch>
        </Container>
      </Router>
    </div>
  );
}

export default App