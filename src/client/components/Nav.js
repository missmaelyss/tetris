import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from 'react-bootstrap'

const TopBar = () => {
return (
    <Navbar bg="dark" variant="dark">
       <Link to="/"><Navbar.Brand>RedTetris</Navbar.Brand></Link>
    </Navbar>
    )
}

export default TopBar;
