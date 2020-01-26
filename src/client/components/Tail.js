import PropTypes from 'prop-types'
import React from 'react'

import './Tail.css'

const Tail = ({ color , other}) => (
    <div className={`tail ${color} ${other}`}>
    </div>
)

Tail.propTypes = {
    color: PropTypes.oneOf([
        'red',
        'yellow',
        'green',
        'blue',
        'orange',
        'dark-blue',
        'violet',
        'white',
        'grey'
    ]).isRequired,
}
export default Tail