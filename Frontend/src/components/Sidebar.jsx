import React, { useState, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from "react-bootstrap/Modal";
import Matching from "./Matching";
import SuccessfulMatch from "./SuccessfulMatch";
import UnsuccessfulMatch from "./UnsuccessfulMatch";
const { getUserFromToken } = require('./user/userAvatarBox');

function Sidebar() {
    const [ws, setWs] = useState(null);
    const [difficulty, setDifficulty] = useState('');
    const [language, setLanguage] = useState('');
    const [userId, setUserId] = useState(null); 

    const [showMatching, setShowMatching] = useState(false);
    const [showSuccessfulMatch, setShowSuccessfulMatch] = useState(false);
    const [showUnsuccessfulMatch, setShowUnsuccessfulMatch] = useState(false);
    
    const handleShowMatching = () => setShowMatching(true);
    const handleCloseMatching = () => setShowMatching(false);
    
    const handleCloseSuccessfulMatch = () => setShowSuccessfulMatch(false);
    const handleCloseUnsuccessfulMatch = () => setShowUnsuccessfulMatch(false);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserFromToken();
            if (user !== "No User") {
                setUserId(user.username); // Set the username in state
            } else {
                setUserId("Guest"); // Fallback in case no user is found
            }
        };

        fetchUser();

        const websocket = new WebSocket('ws://localhost:8080');

        websocket.onmessage = (event) => {
            const { message, type } = JSON.parse(event.data);
            console.log(`Notification from server: ${message} ////////////////////////////`);
            
            if (type === 'match') {
                setShowMatching(false);
                setShowSuccessfulMatch(true);
            } else if (type === 'rejection') {
                setShowMatching(false);
                setShowUnsuccessfulMatch(true);
            }
        };

        setWs(websocket);
        
        return () => {
            websocket.close();
        };
    }, []);

    const handleMatch = () => {
        setShowMatching(true);
        if (ws && difficulty && language) {
            ws.send(JSON.stringify({ userId, difficulty, language })); // Send to server
        } else {
            alert('Please select a difficulty and language.');
        }
    };

    return (
        <Stack gap={3} className='p-3 m-3 justify-content-center align-items-center'>
            <Card>
                <Card.Body>
                    <Card.Title>PeerPrep is...</Card.Title>
                    <Card.Text>
                        A platform for you to practice your technical interview skills with like-minded individuals!
                    </Card.Text>
                </Card.Body>
            </Card>
            <div>
                <Button variant="success" onClick={() => setDifficulty('easy')}>Easy</Button>{' '}
                <Button variant="warning" onClick={() => setDifficulty('medium')}>Medium</Button>{' '}
                <Button variant="danger" onClick={() => setDifficulty('hard')}>Hard</Button>{' '}
            </div>
            <Form.Select 
                aria-label="Select your language" 
                onChange={(e) => {
                    const selectedLanguage = e.target.value === "C++" ? "cplusplus" : e.target.value.toLowerCase();
                    setLanguage(selectedLanguage);
                }}>
                <option value="">Select your language</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
            </Form.Select>
            <Button variant="primary" onClick={handleMatch}>Match me!</Button>

            {/* Modals */}
            <Modal show={showMatching} onHide={handleCloseMatching} backdrop="static" className="custom-modal" centered>
                <Matching handleClose={handleCloseMatching}/>
            </Modal>

            <Modal show={showSuccessfulMatch} onHide={handleCloseSuccessfulMatch} backdrop="static" className="custom-modal" centered>
                <SuccessfulMatch handleClose={handleCloseSuccessfulMatch}/>
            </Modal>

            <Modal show={showUnsuccessfulMatch} onHide={handleCloseUnsuccessfulMatch} backdrop="static" className="custom-modal" centered>
                <UnsuccessfulMatch handleClose={handleCloseUnsuccessfulMatch}/>
            </Modal>
        </Stack>
    );
}

export default Sidebar;
