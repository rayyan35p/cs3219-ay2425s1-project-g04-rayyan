import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { getQuestionsByCategory } from '../../services/questions';

const QuestionDisplay = ({ criteria }) => {
    const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    const [cats, setCats] = useState(null)

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const questions = await getQuestionsByCategory(criteria);
                if (questions.length > 0) {
                    setQuestion(questions[0]);
                    setCats(questions[0].category.join(", "))
                } else {
                    setError("No question found for the selected topic.");
                }
            } catch (err) {
                setError("Failed to fetch question.");
                console.error(err);
            }
        };

        if (criteria) {
            fetchQuestion();
        }
    }, [criteria]);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Card>
            <Card.Header>{question ? question.title : "Loading..."}</Card.Header>
            <Card.Body style={{textAlign: 'left'}}>
                <p>{cats ? cats : "Loading question description..."}</p>
                <p>{question ? question.description : "Loading question description..."}</p>
            </Card.Body>
        </Card>
    );
};

export default QuestionDisplay;
