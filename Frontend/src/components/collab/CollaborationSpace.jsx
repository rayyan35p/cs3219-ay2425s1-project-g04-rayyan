import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const CollaborationSpace = () => {
    const navigate = useNavigate();
    const { roomId } = useParams(); // Get the roomId from the URL

    const handleExit = () => {
        navigate("/home")
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Collaboration Space</h1>
            <p>You are in room: {roomId}</p>
            <Button variant="danger" onClick={() => handleExit()}>Exit</Button>{' '}
        </div>
    );
};

export default CollaborationSpace;
