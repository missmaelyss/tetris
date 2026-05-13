import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'
import { render } from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import Game from '../src/client/components/Game'

jest.mock('socket.io-client', () => () => ({
  on: jest.fn(),
  emit: jest.fn(),
}))

describe('<Game />', () => {

  const map = {};
  window.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });
  const event = { key: "", preventDefault: () => {} };

  it('renders without crashing', () => {
    shallow(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
    )
  })

  it('handles touchstart ', () => {
    render(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
    )
    map.touchstart({touches: [{ clientX: 100, clientY: 0 }]});
  })

  it('handles false key', () => {
    render(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
    )
    jest.spyOn(event, 'preventDefault');
    map.keydown(event);
    expect(event.preventDefault).to.have.been.called;
  })

  it('handles key ArrowUp', () => {
    render(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
    )
    event.key = "ArrowUp"
    jest.spyOn(event, 'preventDefault');
    map.keydown(event);
    expect(event.preventDefault).to.have.been.called;
  })

  it('handles key space', () => {
    render(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
    )
    event.key = " "
    jest.spyOn(event, 'preventDefault');
    map.keydown(event);
    expect(event.preventDefault).to.have.been.called;
  })

  it('handles key ArrowDown', () => {
    render(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
    )
    event.key = ""
    jest.spyOn(event, 'preventDefault');
    map.keydown(event);
    expect(event.preventDefault).to.have.been.called;
  })

  it('handles touchmove with no xDown and yDown', () => {
    render(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
    )
    map.touchmove({touches: [{ clientX: 100, clientY: 0 }]});
  })

  it('handles touchmove with xDown and yDown', () => {
    render(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
    )
    map.touchstart({touches: [{ clientX: 100, clientY: 100 }]});
    map.touchmove({touches: [{ clientX: -200, clientY: 0 }]});
  })

  it('handles touchmove with xDown and yDown', () => {
    render(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
    )
    map.touchstart({touches: [{ clientX: 100, clientY: 100 }]});
    map.touchmove({touches: [{ clientX: 100, clientY: 0 }]});
  })
})
