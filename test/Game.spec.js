import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'
import { render } from '@testing-library/react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import Game from '../src/client/components/Game'
import rootReducer from '../src/client/reducers'

jest.mock('../src/client/middlewares/socket', () => () => next => action => next(action))

const makeStore = () => createStore(rootReducer)

const renderGame = () => render(
  <Provider store={makeStore()}>
    <MemoryRouter initialEntries={['/42/1234']}>
      <Game />
    </MemoryRouter>
  </Provider>
)

describe('<Game />', () => {
  const map = {}
  window.addEventListener = jest.fn((event, cb) => {
    map[event] = cb
  })
  const event = { key: '', preventDefault: () => {} }

  it('renders without crashing', () => {
    shallow(
      <MemoryRouter initialEntries={['/42/1234']}>
        <Game />
      </MemoryRouter>
    )
  })

  it('handles touchstart', () => {
    renderGame()
    map.touchstart({ touches: [{ clientX: 100, clientY: 0 }] })
  })

  it('handles an unrecognised key without calling preventDefault', () => {
    renderGame()
    event.key = 'a'
    let called = false
    event.preventDefault = () => { called = true }
    map.keydown(event)
    expect(called).to.equal(false)
  })

  it('handles ArrowUp and calls preventDefault', () => {
    renderGame()
    event.key = 'ArrowUp'
    jest.spyOn(event, 'preventDefault')
    map.keydown(event)
    expect(event.preventDefault).to.have.been.called
  })

  it('handles Space and calls preventDefault', () => {
    renderGame()
    event.key = ' '
    jest.spyOn(event, 'preventDefault')
    map.keydown(event)
    expect(event.preventDefault).to.have.been.called
  })

  it('handles ArrowDown and calls preventDefault', () => {
    renderGame()
    event.key = 'ArrowDown'
    jest.spyOn(event, 'preventDefault')
    map.keydown(event)
    expect(event.preventDefault).to.have.been.called
  })

  it('handles touchmove when no touch origin is set', () => {
    renderGame()
    map.touchmove({ touches: [{ clientX: 100, clientY: 0 }] })
  })

  it('handles touchmove with horizontal swipe left', () => {
    renderGame()
    map.touchstart({ touches: [{ clientX: 100, clientY: 100 }] })
    map.touchmove({ touches: [{ clientX: -200, clientY: 100 }] })
  })

  it('handles touchmove with vertical swipe up (rotate)', () => {
    renderGame()
    map.touchstart({ touches: [{ clientX: 100, clientY: 100 }] })
    map.touchmove({ touches: [{ clientX: 100, clientY: 0 }] })
  })
})
