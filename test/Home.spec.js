import { expect } from 'chai'
import React from 'react'
import { shallow, mount  } from 'enzyme'

import Home from '../src/client/components/Home'

describe('<Home />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Home />)
  })

  it('Inputing name updates the state name', () => {
    const wrapper = shallow(<Home />);
    
    expect(wrapper.find("#FormUser")).length(1)

    wrapper.find('#FormUser').at(0).simulate('change', { target: {value: 'G' }});
    wrapper.find('#FormRoom').at(0).simulate('change', { target: {value: '4' }});
    expect(wrapper.find('Button').at(0).props().href).to.equal("/#4[G]");
 })
})