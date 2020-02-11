import { expect } from 'chai'
import io from "socket.io-client"
import React from 'react'
import { shallow, mount  } from 'enzyme'

import Lobby from '../src/client/components/Lobby'

describe('<Lobby />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Lobby />)
  })

  it('should trigger its `onClick` prop when clicked', () => {
    const wrapper = shallow(<Lobby socket={io.connect("http://localhost:3000/")}/>)
    wrapper.find('.mb-1').at(0).simulate('click')
    wrapper.find('.mb-1').at(1).simulate('click')
    wrapper.find('.mb-1').at(2).simulate('click')
    wrapper.find('.mb-1').at(3).simulate('click')
    wrapper.find('.mb-1').at(4).simulate('click')
  })

  it('should maps spectators and players when passing users', () => {
    var creator = [{id:0, name:"God"}]
    var players = [{id:0, name:"Mae"}, {id:1, name:"Comette"}]
    var spectators = [{id:0, name:"Vivi"}, {id:1, name:"Maxou"}]
    var users = {creator, players, spectators}
    const wrapper = shallow(<Lobby users={users}/>)
  })

  it('should disable button "invite spectator"', () => {
    var creator = [{id:0, name:"God"}]
    var players = [{id:0, name:"Mae"}, {id:1, name:"Comette"}]
    var spectators = []
    var users = {creator, players, spectators}
    const wrapper = shallow(<Lobby status="ended" users={users} socket={io.connect("http://localhost:3000/")}/>)
    wrapper.find('.mb-1').at(1).simulate('click')
  })

  it('changes Indestructibles Lines', () => {
    var creator = [{id:0, name:"God"}]
    var players = [{id:0, name:"Mae"}, {id:1, name:"Comette"}]
    var spectators = [{id:0, name:"Vivi"}, {id:1, name:"Maxou"}]
    var users = {creator, players, spectators}
    const wrapper = shallow(<Lobby users={users}/>)
    wrapper.find('.mb-1').at(4).simulate('click');
    wrapper.find('.mb-1').at(4).simulate('click');
  })
})