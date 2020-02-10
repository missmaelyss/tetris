import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'


import Tail from '../src/client/components/Tail'

describe('<Tail />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Tail color="red" />)
  })
})