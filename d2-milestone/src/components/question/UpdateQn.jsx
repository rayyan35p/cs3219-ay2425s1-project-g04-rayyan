import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import questionService from "../../services/questions"

function UpdateQn({question, handleClose, editQuestion}) {

  console.log("question_db_id is: ", question._id)

  const [category, setCategory] = useState(question.category)
  const [complexity, setComplexity] = useState(question.complexity)
  const [description, setDescription] = useState(question.description)
  const [id, setID] = useState(question.id);
  const [title, setTitle] = useState(question.title)

  const Update = (e) => {
    e.preventDefault()
    // console.log("Update triggered")

    const updatedQuestion = {
        category, 
        complexity, 
        description, 
        id, 
        title,
    };

    questionService.updateQuestion(question._id, {category, complexity, description, id, title})
        .then(result => {
            console.log('Question edited successfully:', result)
            
            editQuestion(id, updatedQuestion);
            handleClose(); 
        })
        .catch(e => {
            console.error('Error updateding question:', e);
        });
};

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
        <div className="w-50 bg-white rounded p-3">
            <form onSubmit={Update}>
                <h2>Update Question</h2>
                <div className="mb-2">
                    <label htmlFor="">Category</label>
                    <input type="text" placeholder='Data Structures' className='form-control'
                    value={category.join(", ")} onChange={(e) => setCategory(e.target.value.split(","))}/>
                </div>
                <div className="container mt-3">
                    <h3>Complexity</h3>
                    <div className="form-check">
                        <input type="radio" id="easy" value="Easy" checked={complexity === "Easy"} onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="easy">Easy</label>
                    </div>
                    <div className="form-check">
                        <input type="radio" id="medium" value="Medium" checked={complexity === "Medium"} onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="medium">Medium</label>
                    </div>
                    <div className="form-check">
                        <input type="radio" id="hard" value="Hard" checked={complexity === "Hard"} onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="hard">Hard</label>
                    </div>
                </div>
                <div className="mb-2">
                    <label htmlFor="">Description</label>
                    <input type="text" placeholder='Return the largest....' className='form-control'
                    value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className="mb-2">
                    <label htmlFor="">ID</label>
                    <input type="text" placeholder='21' className='form-control'
                    value={id} onChange={e => setID(e.target.value)}/>
                </div>
                <div className="mb-2">
                    <label htmlFor="">Title</label>
                    <input type="text" placeholder='Shortest Distance' className='form-control'
                    value={title} onChange={e => setTitle(e.target.value)}/>
                </div>
                <button className="btn btn-success">Update</button>
            </form>
        </div>
    </div>
  )
}

export default UpdateQn