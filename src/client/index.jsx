import React from 'react'
import { createRoot } from 'react-dom/client'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import './style.css'
import App from './components/App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import rootReducer from './reducers'
import socketMiddleware from './middlewares/socket'

const store = createStore(rootReducer, applyMiddleware(socketMiddleware))

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
