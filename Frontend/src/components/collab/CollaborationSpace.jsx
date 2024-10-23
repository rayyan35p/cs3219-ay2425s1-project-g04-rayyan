import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { getUserFromToken } from '../user/userAvatarBox';
import QuestionDisplay from './QuestionDisplay';
import Chat from './Chat';
import CollabNavigationBar from './CollabNavigationBar';
import CodingSpace from './CodeSpace';
import { Container, Row, Col } from 'react-bootstrap';

const CollaborationSpace = () => {
    const navigate = useNavigate();
    const { roomId } = useParams(); // Get the roomId from the URL
    const [yDoc, setYDoc] = useState(null);
    const [provider, setProvider] = useState(null);
    const [websocket, setWebsocket] = useState(null); // add websocket state to be access by other functions
    const [code, setCode] = useState('');
    const [users, setUsers] = useState([]); // track users in the room 
    const [userId, setUserId] = useState(""); // current user 

    // get the userid only once with useEffect
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserFromToken();
            if (user !== "No User") {
                setUserId(user.username); // Set the username in state
                initiateWebSocket(user.username);
            } else {
                setUserId("Guest"); // Fallback in case no user is found
            }
        };

        fetchUser();
    }, [])

    const initiateWebSocket = (userId) => {

        // create websocket server for room management 
        const websocket = new WebSocket("ws://localhost:3004");
        setWebsocket(websocket);

        websocket.onopen = () => {
            // notify the server user has joined 
            websocket.send(JSON.stringify( {type: 'joinRoom', roomId, userId: userId}));
        }

        // on getting a reply from server
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'usersListUpdate':
                    setUsers(data.users);
                    break;
                default:
                    console.log("No messages received from room management server");
                    break;
            }
        };

        // create a Yjs document for collaboration
        const doc = new Y.Doc();
        setYDoc(doc);

        // create websocket provider to synchronize the document
        const wsProvider = new WebsocketProvider("ws://localhost:1234", roomId, doc);
        setProvider(wsProvider);


        // Create a shared type in Yjs for collaborative code editing
        const yText = doc.getText('monacoEditor');

        // Update monaco editor with Yjs changes 
        yText.observe(() => {
            setCode(yText.toString());
        });

        return () => {
            // clean up for room management
            wsProvider.destroy();
            doc.destroy();
        }
    }

    const handleExit = () => {
        // Notify server 3004 user is leaving 
        websocket.send(JSON.stringify({ type: 'leaveRoom', roomId, userId}));

        // Clean up Yjs document and provider before going back to home
        if (provider) {
            provider.destroy();
        }

        if (yDoc) {
            yDoc.destroy();
        }

        navigate("/home")
    };

    const handleEditorChange = (value) => {
        const yText = yDoc.getText('monacoEditor');
        yText.delete(0, yText.length); // Clear existing content 
        yText.insert(0, value); // Insert new content
    }

    return (
        <div>
            <CollabNavigationBar handleExit={handleExit} users={users}/>
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col md={8}>
                        <CodingSpace handleEditorChange={handleEditorChange} code={code}/>
                    </Col>
                    <Col md={4}>
                        <QuestionDisplay/>
                        <Chat/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CollaborationSpace;
