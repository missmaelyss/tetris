import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import './Home.css'


const Home = () => {
  const [name, setName] = useState([])
  const [room, setRoom] = useState([])

  return (
    <Card className="pt-5 white-background align-self-center">
      <Row className="pb-5 h-100 justify-content-center align-items-center">
        <Col xs={12} sm={11} md={10} lg={8} className="ml-0 mb-5">
          <h1 className="display-4 text-error text-center" >RedTetris</h1>
          <Card>
            <Card.Body text="black">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text  id="basic-addon1">Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="FormUser"
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  onChange={event => setName(event.target.value)}
                />
              </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1"> #</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      id="FormRoom"
                      onChange={event => setRoom(event.target.value)}
                      placeholder="Room"
                      aria-label="Room"
                      aria-describedby="basic-addon1"
                    />
                    <InputGroup.Append>
                      <Button disabled= {room.length === 0 || name.length === 0} href={`/${room}/${name}`} variant="outline-danger">Join</Button>
                    </InputGroup.Append>
                  </InputGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}

export default Home;
