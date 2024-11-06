import React, {useState, useRef, useEffect} from 'react';
import {Accordion, ListGroup, ListGroupItem, Form, Button, Badge} from 'react-bootstrap';

const Chat = ({ currentUser, messages, sendMessage }) => {
    const [text, setText] = useState('');
    const chatContainerRef = useRef(null);
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);

    const handleSend = () => {
        console.log("I am sending")
        if (text.trim()) {
            sendMessage(text);
            setText('');
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <Accordion defaultActiveKey="0" className='mt-3' onSelect={(eventKey) => setIsAccordionOpen(eventKey === "0")}>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    Chat
                </Accordion.Header>
                <Accordion.Body>
                    <div
                        ref={chatContainerRef}
                        style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            marginBottom: '1rem',
                        }}
                    >
                        <ListGroup>
                            {messages.map((msg, idx) => (
                                <ListGroupItem
                                    key={idx}
                                    style={{
                                        backgroundColor: msg.sender === currentUser ? "#d1e7dd" : "#50d7da",
                                        textAlign: msg.sender === currentUser ? "right" : "left"
                                    }}
                                >
                                    <Badge bg="secondary">{msg.sender}</Badge>: {msg.text}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                    {isAccordionOpen && ( // Only show message input when accordion is open
                        <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                            <Form.Group controlId="messageInput">
                                <Form.Control
                                    type="text"
                                    placeholder="Type a message..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-2">
                                Send
                            </Button>
                        </Form>
                    )}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default Chat;