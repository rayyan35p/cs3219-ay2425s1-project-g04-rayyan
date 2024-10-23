import React from 'react';
import { Button, Container, Navbar, Nav } from 'react-bootstrap';

const CollabNavigationBar = ({ handleExit, users }) => {
  return (
     <Navbar className='bg-light' sticky='top'>
        <Container className='d-flex justify-content-between'>
          {/* Run Code and Exit Buttons in Center */}
          <Nav className='mx-auto'>
            <Button>Run Code</Button>
            <Button variant="danger" className="ms-2" onClick={handleExit}>Exit</Button>
          </Nav>
          
          <Nav>
            {users.map(user => {
                return <div
                className='border rounded p-2 bg-secondary text-center mx-2'
                style={{ minWidth: '100px'}}>
                  {user}
                </div>
            })}
          </Nav>
        </Container>
     </Navbar>
  )
}

export default CollabNavigationBar