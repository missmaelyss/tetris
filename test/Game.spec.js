import { expect } from 'chai'
import React from 'react'
import { shallow, mount  } from 'enzyme'
import { Server } from 'mock-socket';
import {MemoryRouter} from 'react-router-dom'
import Game from '../src/client/components/Game'

describe('<Game />', () => {

  const map = {};
  window.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });
  const event = { key: "", preventDefault: () => {} };

  it('renders without crashing', () => {
    const wrapper = shallow(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
  })

  it('handles touchstart ', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
      map.touchstart({touches: [{ clientX: 100, clientY: 0 }]});
  })

  it('handles false key', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
      jest.spyOn(event, 'preventDefault');
      map.keydown(event);
      expect(event.preventDefault).to.have.been.called;
  })

  it('handles key ArrowUp', () => {
    const wrapper = mount(
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
    const wrapper = mount(
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
    const wrapper = mount(
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
    const wrapper = mount(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
      map.touchmove({touches: [{ clientX: 100, clientY: 0 }]});
  })

  it('handles touchmove with xDown and yDown', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
      map.touchstart({touches: [{ clientX: 100, clientY: 100 }]});
      map.touchmove({touches: [{ clientX: -200, clientY: 0 }]});
  })

  it('handles touchmove with xDown and yDown', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
      map.touchstart({touches: [{ clientX: 100, clientY: 100 }]});
      map.touchmove({touches: [{ clientX: 100, clientY: 0 }]});
  })
  
})