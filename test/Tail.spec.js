import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'

import Tail from '../src/client/components/Tail'

describe('<Tail />', () => {
  it('renders without crashing', () => {
    shallow(<Tail color="red" other="real" />)
  })

  it('applies the color as a CSS class', () => {
    const wrapper = shallow(<Tail color="blue" other="real" />)
    expect(wrapper.hasClass('blue')).to.equal(true)
  })

  it('always has the "tail" base class', () => {
    const wrapper = shallow(<Tail color="red" other="real" />)
    expect(wrapper.hasClass('tail')).to.equal(true)
  })

  it('applies the "other" prop as a CSS class', () => {
    const wrapper = shallow(<Tail color="red" other="piece" />)
    expect(wrapper.hasClass('piece')).to.equal(true)
  })
})
