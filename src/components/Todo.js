import React from 'react'
import PropTypes from 'prop-types'

const activeStyle = {
  textDecoration : 'none',
  color: 'seagreen',
}

const completedStyle = {
  textDecoration : 'line-through',
  color: 'slateblue',
}


const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={
      completed ?  completedStyle : activeStyle
    }
  >
    {text}
  </li>
)
Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}
export default Todo