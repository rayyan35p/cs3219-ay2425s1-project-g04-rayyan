import React, { useState, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from "react-bootstrap/Modal";
import Matching from "./matching/Matching";
import SuccessfulMatch from "./matching/SuccessfulMatch";
import UnsuccessfulMatch from "./matching/UnsuccessfulMatch";
import CriteriaDisplay from './matching/CriteriaDisplay';
import { useNavigate } from 'react-router-dom';
import {getAllCategories} from '../services/categories'
const { getUserFromToken } = require('./user/userAvatarBox');

function Sidebar() {
    const [ws, setWs] = useState(null);
    const [difficulty, setDifficulty] = useState('');
    const [category, setCategory] = useState('');
    const [userId, setUserId] = useState(null); 
    const [categories, setCategories] = useState([]);

    const [showMatching, setShowMatching] = useState(false);
    const [showSuccessfulMatch, setShowSuccessfulMatch] = useState(false);
    const [showUnsuccessfulMatch, setShowUnsuccessfulMatch] = useState(false);

    const handleShowMatching = () => setShowMatching(true);
    const handleCloseMatching = () => setShowMatching(false);
    
    const handleCloseSuccessfulMatch = () => setShowSuccessfulMatch(false);
    const handleCloseUnsuccessfulMatch = () => setShowUnsuccessfulMatch(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories from backend
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(response);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();

        // Fetch user data
        const fetchUser = async () => {
            const user = await getUserFromToken();
            if (user !== "No User") {
                setUserId(user.username); // Set the username in state
            } else {
                setUserId("Guest"); // Fallback in case no user is found
            }
        };

        fetchUser();

        console.log("categories: ", categories)

        const websocket = new WebSocket('ws://localhost:8080');

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(`Notification from server: ${data.message}`);
            
            if (data.type === 'match' && data.collaborationUrl) {
                setShowMatching(false);
                setShowSuccessfulMatch(true);
                setTimeout(() => {
                   navigate(data.collaborationUrl);  // Programmatically navigate to collaboration space
                }, 3000); 
            } else if (data.type === 'rejection') {
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
        if (ws && difficulty && category) {
            handleShowMatching();
            setShowUnsuccessfulMatch(false);
            ws.send(JSON.stringify({ userId, difficulty, category, action: 'match' })); // Send category instead of language
        } else {
            alert('Please select a difficulty and category.');
        }
    };

    const handleCancel = () => {
        handleCloseMatching();
        ws.send(JSON.stringify({ userId, action: 'cancel' }));
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

            {/* Category Dropdown */}
            <Form.Select 
                aria-label="Select a category" 
                onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                ))}
            </Form.Select>

            {/* Display Criteria Selected */}
            <CriteriaDisplay difficulty={difficulty} category={category}></CriteriaDisplay>

            <Button variant="primary" onClick={handleMatch}>Match me!</Button>

            {/* Modals */}
            <Modal show={showMatching} onHide={handleCloseMatching} backdrop="static" className="custom-modal" centered>
                <Matching handleCancel={handleCancel}/>
            </Modal>

            <Modal show={showSuccessfulMatch} onHide={handleCloseSuccessfulMatch} backdrop="static" className="custom-modal" centered>
                <SuccessfulMatch handleClose={handleCloseSuccessfulMatch}/>
            </Modal>

            <Modal show={showUnsuccessfulMatch} onHide={handleCloseUnsuccessfulMatch} backdrop="static" className="custom-modal" centered>
                <UnsuccessfulMatch handleClose={handleCloseUnsuccessfulMatch} handleMatch={handleMatch}/>
            </Modal>
        </Stack>
    );
}

export default Sidebar;
