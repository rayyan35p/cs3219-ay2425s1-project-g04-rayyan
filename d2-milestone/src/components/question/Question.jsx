import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CreateQn from "./CreateQn";

function Question() {
    const [questions, setQuestions] = useState([]);
    const [showComponent, setShowComponent] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const handleShow = () => setShowComponent(true);
    const handleClose = () => setShowComponent(false);

    useEffect(() => {
        axios.get('http://localhost:3001')
        .then(result => {
            setQuestions(result.data);
        })
        .catch(err => console.log(err));
    }, []);

    const easyQuestions = questions.filter(q => q.question_complex === "Easy");
    const mediumQuestions = questions.filter(q => q.question_complex === "Medium");
    const hardQuestions = questions.filter(q => q.question_complex === "Hard");
    
    const addQuestion = (newQuestion) => {
        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    };

    // Show the delete confirmation modal
    const handleShowDelete = (id) => {
        setQuestionToDelete(id);
        setShowDeleteModal(true);
    };

    // Hide the delete confirmation modal
    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setQuestionToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (questionToDelete) {
            axios.delete("http://localhost:3001/deleteQuestion/" + questionToDelete)
            .then(res => {
                console.log(res);
                setQuestions(questions.filter(question => question._id !== questionToDelete));
                handleCloseDelete();
            })
            .catch(err => console.log(err));
        }
    };

    return (
        <div className="d-flex">
            <div className='bg-white rounded p-3 m-3'>
                <div className="d-flex justify-content-between">
                    <h1>Questions</h1>
                    <button className="btn btn-primary mt-3" onClick={() => handleShow()}>
                        {showComponent ? 'Hide' : 'Add question'}
                    </button>

                    <Modal show={showComponent} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Question</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CreateQn handleClose={handleClose} addQuestion={addQuestion}/>
                        </Modal.Body>
                    </Modal>
                </div>
                <hr/>

                <div className="container">
                  <h2 className="p-2">Easy Questions</h2>

                  <Table>
                      <thead>
                      <tr>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Category</th>
                          <th>Action</th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                          easyQuestions.map((question) => {
                              return <tr>
                                  <td>{question.question_title}</td>
                                  <td>{question.question_desc}</td>
                                  <td>{question.question_cat ? question.question_cat.join(", ") : ''}</td>
                                  <td>
                                      <ButtonGroup className="mb-2">
                                          <Link to={`/update/${question._id}`} className='btn btn-success'>Edit</Link>
                                          <button className='btn btn-danger' size="sm"
                                              onClick={(e) => handleShowDelete(question._id)}>
                                                  Delete
                                          </button>
                                      </ButtonGroup>
                                  </td>
                              </tr>
                          })
                      }
                      </tbody>
                  </Table>

                  <h2 className="p-2">Medium Questions</h2>

                  <Table>
                      <thead>
                      <tr>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Category</th>
                          <th>Action</th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                          mediumQuestions.map((question) => {
                              return <tr>
                                  <td>{question.question_title}</td>
                                  <td>{question.question_desc}</td>
                                  <td>{question.question_cat ? question.question_cat.join(", ") : ''}</td>
                                  <td>
                                      <ButtonGroup className="mb-2">
                                          <Link to={`/update/${question._id}`} className='btn btn-success'>Edit</Link>
                                          <button className='btn btn-danger' size="sm"
                                              onClick={(e) => handleShowDelete(question._id)}>
                                                  Delete
                                          </button>
                                      </ButtonGroup>
                                  </td>
                              </tr>
                          })
                      }
                      </tbody>
                  </Table>

                  <h2 className="p-2">Hard Questions</h2>

                  <Table>
                      <thead>
                      <tr>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Category</th>
                          <th>Action</th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                          hardQuestions.map((question) => {
                              return <tr>
                                  <td>{question.question_title}</td>
                                  <td>{question.question_desc}</td>
                                  <td>{question.question_cat ? question.question_cat.join(", ") : ''}</td>
                                  <td>
                                      <ButtonGroup className="mb-2">
                                          <Link to={`/update/${question._id}`} className='btn btn-success'>Edit</Link>
                                          <button className='btn btn-danger' size="sm"
                                              onClick={(e) => handleShowDelete(question._id)}>
                                                  Delete
                                          </button>
                                      </ButtonGroup>
                                  </td>
                              </tr>
                          })
                      }
                      </tbody>
                  </Table>
            
                    <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
                        <Modal.Body className="text-center">
                            <p>Delete question?</p>
                            <div>
                                <button className="btn btn-secondary me-2" onClick={handleCloseDelete}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleDeleteConfirm}>Confirm</button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Question;
