import PropTypes from 'prop-types'
import React from 'react'
import Tail from './Tail'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'


import './Grid.css'

const COLORS = ["white","red", "yellow", "green",
 "blue", "orange", "dark-blue", "violet","grey","dark-grey"]

const Grid = ({ grid, type, name, score, piece}) => (
  <Container xs={12} sm={10} md={8} className="player">
    <Row className="justify-content-md-center">
      <Col xs="auto">
        {type === 'others'? (<div className="score">{"Score: " + score}</div>) : ('')}
        <div className={`grid ${type} align-content-right`}>
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
      </Col>
      <Col xs="auto">
        <div className="score">{name}</div>
        <div className="score">{"Score: " + score}</div>
        {type === 'real' ? (
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
          </div>) : (' ')}
        </Col>
      </Row>
    </Container>    
)

Grid.propTypes = {
    grid: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    piece: PropTypes.array.isRequired,
}

export default Grid