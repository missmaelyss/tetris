import PropTypes from 'prop-types'
import React from 'react'
import Tail from './Tail'
import './Game.css'

const COLORS = ["red", "yellow", "green",
 "blue", "orange", "dark-blue", "violet", "white"]

const Game = ({ grid, other }) => (
    <div className={`game ${other}`}>
        {grid.map((line, index) => (
            line.map((colorIndex, index) => (
                <Tail
                    key={index}
                    color={ COLORS[colorIndex] }
                    other={other}
                />
            ))
        ))}
    </div>
)

Game.propTypes = {
    grid: PropTypes.array.isRequired,
}

export default Game