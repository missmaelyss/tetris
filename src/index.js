import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import CounterComponent from './containers/CounterComponent'
import store from './store'

render(
  <Provider store={store}>
    <CounterComponent />
  </Provider>,
  document.getElementById('root')
)