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
    const { category, question } = location.state || {};
    console.log(`category is :${category}`);
    console.log(`question is :${question}`);
    const websocketRef = useRef(null); // Use ref to persist websocket across renders
    const [yDoc, setYDoc] = useState(null);
    const [provider, setProvider] = useState(null);
    const [code, setCode] = useState('');
    const [users, setUsers] = useState([]); // track users in the room 
    const [userId, setUserId] = useState(""); // current user 
    const [language, setLanguage] = useState("python") // set default language to python 
    const [output, setOutput] = useState("")
    const [messages, setMessages] = useState([])
    const [outputLoading, setOutputLoading] = useState(false)
    const [isError, setIsError] = useState(false);

    // use https://emkc.org/api/v2/piston/runtimes to GET other languages
    const LANGUAGEVERSIONS = {
        "python" : "3.10.0",
        "java" : "15.0.2",
        "javascript": "1.32.3"
    };

    {/* State management for access denied toast */}
    const [showAccessDeniedToast, setShowAccessDeniedToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const handleCloseToast = () => {
        setShowAccessDeniedToast(false);
        navigate("/home");
    };

    {/* State management for user join/leave toast */}
    const [notifs, setNotifs] = useState([]); 

    const addNotif = (message) => {
        const id = Date.now(); // unique id based on timestamp
        setNotifs((prevNotifs) => [...prevNotifs, {id, message}]);

        // Remove notif after 2 seconds
        setTimeout(() => {
            setNotifs((prevNotifs) => prevNotifs.filter((notif) => notif.id !== id))
        }, 1500);
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
                    console.log("adding message", data.message);
                    setMessages((prevMessages) => [...prevMessages, data.message]);
                    break;
                case 'languageChange':
                    addNotif(`User ${data.user} has changed the language to ${data.language}`);
                    setLanguage(data.language);
                    break;
                case 'userJoin':
                    addNotif(`User ${data.user} has joined.`)
                    break;
                case 'userLeft':
                    addNotif(`User ${data.user} has left`)
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

        setOutputLoading(true);

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

                setOutputLoading(false);

                if (result.data.run.stderr != "") {
                    console.log("There is an error");
                   setIsError(true); 
                } else {
                    setIsError(false);
                }


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

    const handleLanguageChange = (value) => {
        websocketRef.current.send(JSON.stringify({ type: 'languageChange', roomId: roomId,
            user: userId, language: value }));
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

    <div style={{ height: '100vh', overflow: 'hidden' }}>
        {showAccessDeniedToast ? (
            <ToastContainer className="p-3" position="top-center" style={{ zIndex: 1, textAlign: 'center' }}>
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
                {/* Toast Container for Join/Leave notifications */}
                <ToastContainer className='p-3' position='top-center' style={{ zIndex: 1050 }}>
                    {notifs.map((notif) => (
                        <Toast key={notif.id} className='mb-2' style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                            <Toast.Body>
                                <strong className='text-black'>{notif.message}</strong>
                            </Toast.Body>
                        </Toast>
                    ))}
                </ToastContainer>
                <CollabNavigationBar handleExit={handleExit} handleCodeRun={handleCodeRun} users={users} setLanguage={setLanguage} language={language} userLangChange={handleLanguageChange}/>
                <Container fluid style={{ marginTop: '10px', height: 'calc(100vh - 60px)', display: 'flex', overflow: 'hidden' }}>
                    <Row style={{ flexGrow: 1, width: '100%', height: '100%', overflow: 'hidden' }}>
                        <Col md={6} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', marginTop: '5px'}}>
                            <CodeSpace handleEditorChange={handleEditorChange} loading={outputLoading} code={code} language={language} output={output} isError={isError}/>
                        </Col>
                        <Col md={6} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                            <div style={{ flex: 2, display: 'flex', overflow: 'hidden', width:'100%', minHeight:'0vh', marginTop:'5px'}}>
                                <QuestionDisplay question={question} style={{width:'100%'}}/>
                            </div>

                            <div style={{ flex: 2, height:'100%', marginBottom: '38px', maxHeight:'50vh'}}>
                                <Chat currentUser={userId} messages={messages} sendMessage={sendMessage}/>
                            </div>
      
                        </Col>
                    </Row>
                </Container>
            </>
        )}
    </div>

    );
};

export default CollaborationSpace;
