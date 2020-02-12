import { expect } from 'chai'
import React from 'react'
import { shallow, mount  } from 'enzyme'

import Grid from '../src/client/components/Grid'
import Tail from '../src/client/components/Tail'

describe('<Grid />', () => {
  it('renders without crashing with empty grid and piece and type real', () => {
    const wrapper = shallow(<Grid grid={[]} type="real" name="test" score={0} piece={[]} />)
  })

  it('renders without crashing with empty grid and piece and type others', () => {
    const wrapper = shallow(<Grid grid={[]} type="others" name="test" score={0} piece={[]} />)
  })

  it('renders 4 tails for the grid and 4 for the piece', () => {
    var piece = new Array(4).fill(1)
    const wrapper = mount(<Grid grid={piece} type="real" name="test" score={0} piece={piece} />)
    expect(wrapper.find(Tail)).length(8)
  })

  it('renders 4 tails for the grid', () => {
    var piece = new Array(4).fill(1)
    const wrapper = mount(<Grid grid={piece} type="real" name="test" score={0} piece={[]} />)
    expect(wrapper.find(Tail)).length(4)
  })
})