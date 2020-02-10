import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'


import App from '../src/client/components/App'

describe('<App />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<App />)
  })
})