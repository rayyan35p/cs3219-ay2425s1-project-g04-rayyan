import React from 'react';
import { useParams } from 'react-router-dom';

const CollaborationSpace = () => {
    const { roomId } = useParams(); // Get the roomId from the URL

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Collaboration Space</h1>
            <p>You are in room: {roomId}</p>
        </div>
    );
};

export default CollaborationSpace;
