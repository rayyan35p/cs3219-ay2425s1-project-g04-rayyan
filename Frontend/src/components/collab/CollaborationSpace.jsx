import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { getUserFromToken } from '../user/utils/authUtils';
import QuestionDisplay from './QuestionDisplay';
import Chat from './Chat';
import CollabNavigationBar from './CollabNavigationBar';
import CodeSpace from './CodeSpace';
import { Container, Row, Col } from 'react-bootstrap';
import collabService from '../../services/collab'; 
import historyService from '../../services/history';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Spinner from 'react-bootstrap/Spinner';

const CollaborationSpace = () => {
    const navigate = useNavigate();
    const { roomId } = useParams(); // Get the roomId from the URL
    const websocketRef = useRef(null); // Use ref to persist websocket across renders
    const [yDoc, setYDoc] = useState(null);
    const [provider, setProvider] = useState(null);
    const [code, setCode] = useState('');
    const [users, setUsers] = useState([]); // track users in the room 
    const [usersSave, setUsersSave] = useState([]); // for saving users in the room; getting matched user's username
    const [userId, setUserId] = useState(""); // current user 
    const [username, setUsername] = useState(""); // current user 
    const [language, setLanguage] = useState("python") // set default language to python 
    const [output, setOutput] = useState("")
    const [messages, setMessages] = useState([])
    const [outputLoading, setOutputLoading] = useState(false)
    const [roomStartTime, setRoomStartTime] = useState(null); // Initialize state for room start time

    // use https://emkc.org/api/v2/piston/runtimes to GET other languages
    const LANGUAGEVERSIONS = {
        "python" : "3.10.0",
        "java" : "15.0.2",
        "c++": "10.2.0"
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
                setUserId(user.userId); // Set the username in state
                setUsername(user.username); // Set the username in state
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

    useEffect(() => {
        if (users.length == 2) {
            setUsersSave(users)
        }
    }, [users])

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
            // console.log(`[FRONTEND] data message is ${JSON.stringify(data)}`);
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
                // Handle room start time message
                case 'roomStartTime':
                    setRoomStartTime(data.startTime);
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
        try {
            // Filter out the current user from the usersSave array to find the matched user
            const matchedUser = usersSave.filter(user => user !== username)[0]; // Assuming usersSave contains objects with userId property
            const startTime = new Date(roomStartTime); // Convert start time from ISO to Date object
            const duration = new Date().getTime() - startTime.getTime();

            if (!matchedUser) {
                throw new Error("No matched user found");
            }
            const sessionData = {
                user: userId,
              matchedUsername: matchedUser, // Assuming user[1] is the matched user
              questionTitle: 'BFS', // This ID should be available in context or passed down
            //   questionTitle: questionTitle, // This ID should be available in context or passed down
            //   startTime: roomCreationTime,
            //   startTime: new Date(),
            //   duration: new Date().getTime() - new Date(roomCreationTime).getTime(),
            //   duration: 10,
            startTime: startTime.toISOString(),
            duration: Math.floor(duration / 1000),
              code: '1'
            }
        
            historyService.createHistoryAttempt(sessionData)
            // Navigate away or perform any additional actions on success
          } catch (error) {
            console.error("Failed to save session history:", error)
          }

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

                    {/* Main component content */}
                    <CollabNavigationBar handleExit={handleExit} handleCodeRun={handleCodeRun} users={users}
                                         setLanguage={setLanguage} language={language} userLangChange={handleLanguageChange}/>
                    <Container fluid style={{ marginTop: '20px' }}>
                        <Row>
                            <Col md={8}>
                                <CodeSpace handleEditorChange={handleEditorChange} loading={outputLoading} code={code} language={language} output={output}/>
                            </Col>
                            <Col md={4}>
                                <QuestionDisplay/>
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
