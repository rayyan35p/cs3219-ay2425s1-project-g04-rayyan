import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function NavigationBar() {
    return (
        <Navbar className='bg-light'>
            <Container>
                <Navbar.Brand>PeerPrep</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;