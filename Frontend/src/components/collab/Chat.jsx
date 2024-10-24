import React from 'react'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'

const Chat = () => {

    const messages = ["Hello!", "Nice to meet you!"]
    return (
        <Card className='mt-3'>
            <Card.Header>Chat</Card.Header>
            <Card.Body>
                <ListGroup>
                    {messages.map((msg, idx) => (
                        <ListGroupItem key={idx}>{msg}</ListGroupItem>
                    ))}
                </ListGroup>
            </Card.Body>
        </Card>
    )
}

export default Chat