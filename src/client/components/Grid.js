import PropTypes from 'prop-types'
import React from 'react'
import Tail from './Tail'
import './Grid.css'

const COLORS = ["white","red", "yellow", "green",
 "blue", "orange", "dark-blue", "violet"]

const Grid = ({ grid, other }) => (
    <div className={`grid ${other}`}>
        {
            grid.map((colorIndex, index) => (
                <Tail
                    key={index}
                    color={ COLORS[colorIndex] }
                    other={other}
                />
            ))
        }
    </div>
)

Grid.propTypes = {
    grid: PropTypes.array.isRequired,
}

export default Grid