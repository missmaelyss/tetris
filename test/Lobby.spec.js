import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'

import Lobby from '../src/client/components/Lobby'

const makeSocket = () => ({ emit: sinon.spy() })

const users = {
  creator: { name: 'Alice' },
  players: [{ name: 'Bob' }],
  spectators: [{ name: 'Charlie' }],
}

describe('<Lobby />', () => {
  it('renders without crashing with no props', () => {
    shallow(<Lobby />)
  })

  it('renders the creator, players and spectators when users is provided', () => {
    const wrapper = shallow(<Lobby users={users} />)
    expect(wrapper.find('.username').length).to.be.at.least(3)
  })

  it('"Start Game" is enabled when status is "waiting"', () => {
    const wrapper = shallow(<Lobby status="waiting" users={users} socket={makeSocket()} />)
    expect(wrapper.find('.mb-1').at(0).props().disabled).to.equal(false)
  })

  it('"Start Game" is disabled when status is "started"', () => {
    const wrapper = shallow(<Lobby status="started" users={users} socket={makeSocket()} />)
    expect(wrapper.find('.mb-1').at(0).props().disabled).to.equal(true)
  })

  it('"Reset Room" is disabled when status is "waiting"', () => {
    const wrapper = shallow(<Lobby status="waiting" users={users} socket={makeSocket()} />)
    expect(wrapper.find('.mb-1').at(2).props().disabled).to.equal(true)
  })

  it('"Reset Room" is enabled when status is "ended"', () => {
    const wrapper = shallow(<Lobby status="ended" users={users} socket={makeSocket()} />)
    expect(wrapper.find('.mb-1').at(2).props().disabled).to.equal(false)
  })

  it('"Invite Spectators" is disabled when there are no spectators', () => {
    const usersNoSpectators = { ...users, spectators: [] }
    const wrapper = shallow(<Lobby status="ended" users={usersNoSpectators} socket={makeSocket()} />)
    expect(wrapper.find('.mb-1').at(1).props().disabled).to.equal(true)
  })

  it('emits "start" with spectrum and lines config when Start Game is clicked', () => {
    const socket = makeSocket()
    const wrapper = shallow(<Lobby status="waiting" users={users} socket={socket} />)
    wrapper.find('.mb-1').at(0).simulate('click')
    expect(socket.emit).to.have.been.calledWith('start', { spectrum: false, lines: 0 })
  })

  it('toggles spectrum mode on button click', () => {
    const socket = makeSocket()
    const wrapper = shallow(<Lobby status="waiting" users={users} socket={socket} />)
    expect(wrapper.find('.mb-1').at(3).text()).to.include('disabled')
    wrapper.find('.mb-1').at(3).simulate('click')
    expect(wrapper.find('.mb-1').at(3).text()).to.include('enabled')
  })

  it('cycles lines mode: none → destructible → indestructible → none', () => {
    const wrapper = shallow(<Lobby status="waiting" users={users} socket={makeSocket()} />)
    expect(wrapper.find('.mb-1').at(4).text()).to.include('No Malus')
    wrapper.find('.mb-1').at(4).simulate('click')
    expect(wrapper.find('.mb-1').at(4).text()).to.include('Destructibles')
    wrapper.find('.mb-1').at(4).simulate('click')
    expect(wrapper.find('.mb-1').at(4).text()).to.include('Indestructibles')
    wrapper.find('.mb-1').at(4).simulate('click')
    expect(wrapper.find('.mb-1').at(4).text()).to.include('No Malus')
  })
})
