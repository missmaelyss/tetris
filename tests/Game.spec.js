import { expect } from 'chai'
import io from "socket.io-client"
import React from 'react'
import { shallow, mount  } from 'enzyme'
import { Server } from 'mock-socket';

import Game from '../src/client/components/Game'

describe('<Game />', () => {
    
  it('renders without crashing', () => {
    const fakeURL = 'http://localhost:4001/';
    const mockServer = new Server(fakeURL);
    const wrapper = shallow(<Game />)
  })
})