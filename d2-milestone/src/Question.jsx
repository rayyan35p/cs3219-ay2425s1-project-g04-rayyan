import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Question() {
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001')
    .then(result => {
        setQuestions(result.data)
    })
    .catch(err => console.log(err))
  }, [])

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
            <Link to="/create" className='btn btn-success'>Add +</Link>
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
                                <td>{question.Category.join(", ")}</td>
                                <td>{question.Complexity}</td>
                                <td>{question.Description}</td>
                                <td>{question.ID}</td>
                                <td>{question.Title}</td>
                                <td>
                                    <Link to={`/update/${question.DB_id}`} className='btn btn-success'>Edit</Link>
                                    <button className='btn btn-danger' onClick={(e) => handleDelete(question.DB_id)}>Delete</button>
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