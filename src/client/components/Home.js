import React from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'


const Home = () => {
  return (
    <Container className="pt-5 h-100">
      <Row className="pb-5 h-100 justify-content-center align-items-center">
        <Col xs={12} sm={11} md={10} lg={8} className="ml-0 mb-5">
          <h1 className="display-4 text-light text-center" >RedTetris</h1>
          <Card>
            <Card.Body text="black">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1"> #</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="Room"
                      aria-label="Room"
                      aria-describedby="basic-addon1"
                    />
                    <InputGroup.Append>
                      <Link to={`/room/$(room)/$(username)`}><Button variant="outline-danger">Join</Button></Link>
                      <Button variant="outline-danger">Create</Button>
                    </InputGroup.Append>
                  </InputGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Home;
