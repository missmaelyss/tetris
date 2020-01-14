import PropTypes from 'prop-types'
import React from 'react'

import './Tail.css'

const Tail = ({ index, color }) => (
    <div className={`tail ${color}`}>
        <span className="symbol">
            {}
        </span>
    </div>
)

Tail.propTypes = {
    index: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
        'red',
        'yellow',
        'green',
        'blue',
        'orange',
        'dark-blue',
        'violet',
        'white'
    ]).isRequired,
}
export default Tail