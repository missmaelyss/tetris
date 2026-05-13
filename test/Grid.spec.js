import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'
import { render } from '@testing-library/react'

import Grid from '../src/client/components/Grid'

describe('<Grid />', () => {
  it('renders without crashing with empty grid and piece and type real', () => {
    shallow(<Grid grid={[]} type="real" name="test" score={0} piece={[]} />)
  })

  it('renders without crashing with empty grid and piece and type others', () => {
    shallow(<Grid grid={[]} type="others" name="test" score={0} piece={[]} />)
  })

  it('renders 4 tails for the grid and 4 for the piece', () => {
    const piece = new Array(4).fill(1)
    const { container } = render(<Grid grid={piece} type="real" name="test" score={0} piece={piece} />)
    expect(container.querySelectorAll('.tail').length).to.equal(8)
  })

  it('renders 4 tails for the grid', () => {
    const piece = new Array(4).fill(1)
    const { container } = render(<Grid grid={piece} type="real" name="test" score={0} piece={[]} />)
    expect(container.querySelectorAll('.tail').length).to.equal(4)
  })
})