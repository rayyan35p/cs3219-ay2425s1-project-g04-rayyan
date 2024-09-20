import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, } from 'react-router-dom';
import CreateQn from "./CreateQn";
import Modal from "react-bootstrap/Modal";

function Question() {
    const [questions, setQuestions] = useState([]);
    const [showComponent, setShowComponent] = useState(false);
    const handleShow = () => setShowComponent(true);
    const handleClose = () => setShowComponent(false);

  useEffect(() => {
    axios.get('http://localhost:3001')
    .then(result => {
        setQuestions(result.data)
    })
    .catch(err => console.log(err))
  }, [])

    const addQuestion = (newQuestion) => {
        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    };

  const handleDelete = (id) => {
    axios.delete("http://localhost:3001/deleteQuestion/" + id)
    .then(res => {
        console.log(res)
        window.location.reload()
  })
    .catch(err => console.log(err))
  }

  return (
    <div className="d-flex vh-50 bg-primary justify-content-center align-items-center">
        <div className='w-50 bg-white rounded p-3'>
            <button className="btn btn-primary mt-3"
                    onClick={() => handleShow()}>
                {showComponent ? 'Hide' : 'Add question'}
            </button>

            {/* Modal to display the CreateQn form */}
            <Modal show={showComponent} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateQn handleClose={handleClose} addQuestion={addQuestion}/>
                </Modal.Body>
            </Modal>

            <hr/>


            <table className='table'>
                <thead>
                <tr>
                    <th>Category</th>
                    <th>Complexity</th>
                    <th>Description</th>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {
                    questions.map((question) => {
                        return <tr>
                            <td>{question.Category ? question.Category.join(", ") : ''}</td>
                            <td>{question.Complexity}</td>
                            <td>{question.Description}</td>
                            <td>{question.ID}</td>
                            <td>{question.Title}</td>
                            <td>
                                <Link to={`/update/${question.DB_id}`} className='btn btn-success'>Edit</Link>
                                <button className='btn btn-danger'
                                        onClick={(e) => handleDelete(question.DB_id)}>Delete
                                </button>
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