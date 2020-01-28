import PropTypes from 'prop-types'
import React from 'react'
import Tail from './Tail'
import './Grid.css'

const COLORS = ["white","red", "yellow", "green",
 "blue", "orange", "dark-blue", "violet","grey"]

const Grid = ({ grid, type, score, piece}) => (
    <div className="player">
        <div className={`grid ${type}`}>
        {
            grid.map((colorIndex, index) => (
                <Tail
                    key={index}
                    color={ COLORS[colorIndex] }
                    other={type}
                />
            ))
        }
        </div>
        <div className="score">{"Score: " + score}</div>
        <div className={`grid piece`}>
        {
            piece.map((colorIndex, index) => (
                <Tail
                    key={index}
                    color={ COLORS[colorIndex] }
                    other="piece"
                />
            ))
        }
        </div>
    </div>    
)

Grid.propTypes = {
    grid: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    piece: PropTypes.array.isRequired,
}

export default Grid