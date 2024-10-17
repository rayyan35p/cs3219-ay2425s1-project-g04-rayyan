import React, { useState, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
const { getUserFromToken } = require('./user/userAvatarBox')


function Sidebar() {
    const [ws, setWs] = useState(null);
    const [difficulty, setDifficulty] = useState('');
    const [language, setLanguage] = useState('');
    const [userId, setUsername] = useState(null); 

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserFromToken();
            if (user !== "No User") {
                setUsername(user.username); // Set the username in state
            } else {
                setUsername("Guest"); // Fallback in case no user is found
            }
        };

        fetchUser();

        const websocket = new WebSocket('ws://localhost:8080');
        setWs(websocket);

            
        return () => {
            websocket.close();
        };
    }, []);

    const handleMatch = () => {
        if (ws && difficulty && language) {
            ws.send(JSON.stringify({ userId, difficulty, language })); //Send to server
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
                <Button variant="success" onClick={() => setDifficulty('Easy')}>Easy</Button>{' '}
                <Button variant="warning" onClick={() => setDifficulty('Medium')}>Medium</Button>{' '}
                <Button variant="danger" onClick={() => setDifficulty('Hard')}>Hard</Button>{' '}
            </div>
            <Form.Select aria-label="Select your language" onChange={(e) => setLanguage(e.target.value)}>
                <option value="">Select your language</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
            </Form.Select>
            <Button variant="primary" onClick={handleMatch}>Match me!</Button>
        </Stack>
    );
}

export default Sidebar;
