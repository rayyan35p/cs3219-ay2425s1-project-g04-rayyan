import axios from 'axios';
import React, { useState, useEffect } from 'react';

function Question() {

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/readQuestion')
        .then(result => {
            setQuestions(result.data)
        })
        .catch(err => console.log(err))
    }, [])

    return (
        <div className="table-outer-container">
            <div className='table-inner-container'>
                <table className='table'>
                    <thead>
                    <tr>
                        <th>Category</th>
                        <th>Complexity</th>
                        <th>Description</th>
                        <th>ID</th>
                        <th>Title</th>
                        <th>DB ID</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        questions.map((question) => {
                            return <tr>
                                <td>{question.question_cat ? question.question_cat.join(", ") : ''}</td>
                                <td>{question.question_complex}</td>
                                <td>{question.question_desc}</td>
                                <td>{question.question_id}</td>
                                <td>{question.question_title}</td>
                                <td>{question._id}</td>
                                <td>
                                    <button className='update-button'>Edit</button>
                                <button className='delete-button'>Delete</button>
                            </td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Question