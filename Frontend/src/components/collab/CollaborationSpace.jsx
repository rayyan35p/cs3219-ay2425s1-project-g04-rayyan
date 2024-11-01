import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { getUserFromToken } from '../user/userAvatarBox';
import QuestionDisplay from './QuestionDisplay';
import Chat from './Chat';
import CollabNavigationBar from './CollabNavigationBar';
import CodeSpace from './CodeSpace';
import { Container, Row, Col } from 'react-bootstrap';
import collabService from '../../services/collab'; 
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Spinner from 'react-bootstrap/Spinner';

const CollaborationSpace = () => {
    const navigate = useNavigate();
    const { roomId } = useParams(); // Get the roomId from the URL
    const location = useLocation();
    const { category } = location.state || {};
    console.log(`category is :${category}`);
    const websocketRef = useRef(null); // Use ref to persist websocket across renders
    const [yDoc, setYDoc] = useState(null);
    const [provider, setProvider] = useState(null);
    const [code, setCode] = useState('');
    const [users, setUsers] = useState([]); // track users in the room 
    const [userId, setUserId] = useState(""); // current user 
    const [language, setLanguage] = useState("python") // set default language to python 
    const [output, setOutput] = useState("")
    const [messages, setMessages] = useState([])

    // use https://emkc.org/api/v2/piston/runtimes to GET other languages
    const LANGUAGEVERSIONS = {
        "python" : "3.10.0",
        "java" : "15.0.2",
        "c++": "10.2.0"
    };

    const [showAccessDeniedToast, setShowAccessDeniedToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const handleCloseToast = () => {
        setShowAccessDeniedToast(false);
        navigate("/home");
    };


    {/* Set up websockets for room management on client side, and collaboration for Yjs */}
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

        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();
                websocketRef.current = null;
            }
            if (provider) provider.destroy();
            if (yDoc) yDoc.destroy();
        };
    }, []);

    useEffect(() => {
        console.log("Messages state updated:", messages);
    }, [messages]);

    const initiateWebSocket = (userId) => {
        if (websocketRef.current) return; // Prevent duplicate connections

        const websocket = new WebSocket("ws://localhost:3004");
        websocketRef.current = websocket;

        websocket.onopen = () => {

            websocket.send(JSON.stringify({ type: 'joinRoom', roomId, userId }));
            websocket.send(JSON.stringify({ type: 'requestUserList', roomId }));
        };


        // on getting a reply from server
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(`[FRONTEND] data message is ${JSON.stringify(data)}`);
            switch (data.type) {
                case 'usersListUpdate':
                    setUsers(data.users); // Update the user list
                    setShowAccessDeniedToast(false);
                    setLoading(false); // Access allowed; stop loading
                    break;
                case 'accessDenied':
                    setToastMessage(data.message);
                    setShowAccessDeniedToast(true);
                    setLoading(false);
                    break;
                case 'newMessage':
                    console.log("adding message", data.message)
                    setMessages((prevMessages) => [...prevMessages, data.message]);
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
    };

    const handleExit = () => {
        if (websocketRef.current) websocketRef.current.send(JSON.stringify({ type: 'leaveRoom', roomId, userId }));

        // Clean up Yjs document and provider before going back to home
        if (provider) {
            provider.destroy();
        }

        if (yDoc) {
            yDoc.destroy();
        }
        navigate("/home");
    };

    const handleCodeRun = () => {
        const code_message = {
            "language": language,
            "files": [
                {
                    "content": code
                }
            ],
            "version": LANGUAGEVERSIONS[language]
        }

        collabService.getCodeOutput(code_message)
            .then(result => {
                console.log(result.data.run.output)
                setOutput(result.data.run.output)
            })
            .catch(err => console.log(err));
    };

    const handleEditorChange = (value) => {
        const yText = yDoc.getText('monacoEditor');
        yText.delete(0, yText.length);
        yText.insert(0, value);
    };

    const sendMessage = (text) => {
        const message = {text, sender: userId};
        websocketRef.current.send(JSON.stringify({ type: 'sendMessage', roomId: roomId, message: message}));
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center' }}>
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading collaboration space...</p>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center' }}>
            {showAccessDeniedToast ? (
                <ToastContainer className="p-3" position="top-center" style={{ zIndex: 1 }}>
                    <Toast
                        onClose={handleCloseToast}
                        show={showAccessDeniedToast}
                        delay={3000}
                        autohide
                        bg="danger"
                    >
                        <Toast.Body className='text-white'>
                            <strong>{toastMessage}</strong>
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            ) : (
                <>
                    <CollabNavigationBar handleExit={handleExit} handleCodeRun={handleCodeRun} users={users} setLanguage={setLanguage} language={language}/>
                    <Container fluid style={{ marginTop: '20px' }}>
                        <Row>
                            <Col md={8}>
                                <CodeSpace handleEditorChange={handleEditorChange} code={code} language={language} output={output}/>
                            </Col>
                            <Col md={4}>
                                <QuestionDisplay criteria={category}/>
                                <Chat currentUser={userId} messages={messages} sendMessage={sendMessage}> </Chat>
                            </Col>
                        </Row>
                    </Container>
                </>
            )}
        </div>
    );
};

export default CollaborationSpace;
