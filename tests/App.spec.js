import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'


import App from '../src/client/components/App'

describe('<App />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<App />)
  })
})