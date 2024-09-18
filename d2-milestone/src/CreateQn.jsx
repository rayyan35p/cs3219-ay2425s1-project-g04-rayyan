import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CreateQn() {
  const [category, setCategory] = useState([])
  const [complexity, setComplexity] = useState('')
  const [description, setDescription] = useState('')
  const [ID, setID] = useState('')
  const [title, setTitle] = useState('')
  const navigate = useNavigate()

  const Submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/createQuestion", {category, complexity, description, ID, title})
    .then(result => {
        console.log(result)
        navigate('/')
      } 
    )
    .catch(err => console.log(err))
  }

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
        <div className="w-50 bg-white rounded p-3">
            <form onSubmit={Submit}>
                <h2>Add Question</h2>
                <div className="mb-2">
                    <label htmlFor="">Category</label>
                    <input type="text" placeholder='Data Structures' className='form-control'
                    onChange={(e) => setCategory(e.target.value.split(","))}/>
                </div>
                <div className="container mt-3">
                    <h3>Complexity</h3>
                    <div className="form-check">
                        <input type="radio" id="easy" value="Easy"
                        onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="easy">Easy</label>
                    </div>
                    <div className="form-check">
                        <input type="radio" id="medium" value="Medium"
                        onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="medium">Medium</label>
                    </div>
                    <div className="form-check">
                        <input type="radio" id="hard" value="Hard"
                        onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="hard">Hard</label>
                    </div>
                </div>
                <div className="mb-2">
                    <label htmlFor="">Description</label>
                    <input type="text" placeholder='Return the largest....' className='form-control'
                    onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className="mb-2">
                    <label htmlFor="">ID</label>
                    <input type="text" placeholder='21' className='form-control'
                    onChange={(e) => setID(e.target.value)}/>
                </div>
                <div className="mb-2">
                    <label htmlFor="">Title</label>
                    <input type="text" placeholder='Shortest Distance' className='form-control'
                    onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <button className="btn btn-success">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default CreateQn