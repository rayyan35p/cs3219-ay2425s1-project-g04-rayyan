import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { getQuestionsByCategory } from '../../services/questions';

const QuestionDisplay = ({ question }) => {
    // const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    // const [cats, setCats] = useState(null)

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Card>
            <Card.Header>{question ? `${question.title} (${question.complexity})` : "Loading..."}</Card.Header>
            <Card.Body style={{textAlign: 'left'}}>
                <p>{question ? question.category.join(", ") : "Loading question description..."}</p>
                <p>{question ? question.description : "Loading question description..."}</p>
            </Card.Body>
        </Card>
    );
};

export default QuestionDisplay;
