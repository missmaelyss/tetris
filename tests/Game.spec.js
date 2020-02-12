import { expect } from 'chai'
import io from "socket.io-client"
import React from 'react'
import { shallow, mount  } from 'enzyme'
import { Server } from 'mock-socket';
import {MemoryRouter} from 'react-router-dom'
import Game from '../src/client/components/Game'

describe('<Game />', () => {
  const fakeURL = 'http://localhost:4001/';
  const mockServer = new Server(fakeURL);
  mockServer.on('connection', socket => {
  });

  const map = {};
  window.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });
  const event = { key: "ArrowLeft", preventDefault: () => {} };

  it('renders without crashing', () => {
    
    const wrapper = shallow(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
  })

  it('receives me from server with socket', () => {
    const wrapper = shallow(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
    )
    var me = {grid: [1,1,1,1], score: 42, piece: [2,2,2,2], permission: 2}
    mockServer.emit('me', me);
  })

  it('handles touchstart ', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
      map.touchstart({touches: [{ clientX: 100, clientY: 0 }]});
  })

  it('handles key ArrowUp', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
      jest.spyOn(event, 'preventDefault');
      map.keydown(event);
  })

  it('handles key ArrowLeft', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
      // map.keydown();
  })

  it('handles other key', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
      map.keydown({ key: 'Test' });
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