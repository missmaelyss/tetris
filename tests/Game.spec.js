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

  it('renders without crashing', () => {
    
    const wrapper = shallow(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )
  })

  // it('receives me from server with socket', () => {
  //   const wrapper = shallow(
  //     <MemoryRouter initialEntries={['/42/1234']}>
  //       <Game/>
  //     </MemoryRouter>
  //   )
  //   var me = {grid: [1,1,1,1], score: 42, piece: [2,2,2,2], permission: 2}
  //   mockServer.emit('me', me);
  // })

  it('renders without crashing', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game/>
      </MemoryRouter>
      )

      wrapper.find('#content').at(0).simulate('keypress', {key: 'ArrowDown'})
    // wrapper.simulate('touchstart', {key: 'ArrowDown'})
    // wrapper.simulate('touchmove', {key: 'ArrowDown'})


    // wrapper.simulate('touchStart',{touches: [{ clientX: 100, clientY: 0 }]});
  })
})