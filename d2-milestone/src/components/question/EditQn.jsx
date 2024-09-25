import React from 'react'
import { useState } from 'react'
import questionService from "../../services/questions"

function EditQn({ question, handleClose, editQuestion, error, setError, allQuestions }) {
    const [category, setCategory] = useState(question.category);
    const [complexity, setComplexity] = useState(question.complexity);
    const [description, setDescription] = useState(question.description);
    const [id, setID] = useState(question.id);
    const [title, setTitle] = useState(question.title);
  
    //Problem....
    const isDuplicate = (editedQuestion, category) => {
        return allQuestions.some(q =>
            q.category.join(", ") === category.join(", ") &&
            q.complexity === editedQuestion.complexity &&
            q.description === editedQuestion.description &&
            q.id === editedQuestion.id &&
            q.title === editedQuestion.title &&
            q._id !== editedQuestion._id
        );
    };

    const Update = (e) => {
      e.preventDefault();

    // To remove empty strings and extra spaces
    const delimeter = ", "
    const categoryString = category.join(delimeter);
    const cleanedCategoryArray = categoryString.split(delimeter).filter(item => item.trim() !== "");

    const updatedQuestion = {
        category: cleanedCategoryArray,
        complexity, 
        description, 
        id, 
        title,
    };
    console.log("category now: ", cleanedCategoryArray)
    console.log("cat length", cleanedCategoryArray.length)
    if (!id || isNaN(Number(id))) {

        setError("ID must be a valid number.");
        console.log("id check")
        return;
    }

    if (cleanedCategoryArray.length === 0 || !title.trim() || !description.trim() || !complexity.trim()) {

        setError("All fields must be filled.");
        console.log("all fields check")
        return;
    }
    console.log("db_id:", question._id)
    console.log(cleanedCategoryArray, complexity, description, id, title);

    if (allQuestions.some(q =>
        q.category.join(", ") === cleanedCategoryArray.join(", ") &&
        q.complexity === complexity &&
        q.description === description &&
        q.id === id &&
        q.title === title &&
        q._id !== question._id)) {

        setError("This question already exists.")
        console.log("duplicate check")
        return;
    }

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
    <div className='d-flex bg-primary justify-content-center align-items-center'>
        <div className="w-100 bg-white p-3">
            <form onSubmit={Update}>
                <h2>Update Question</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-2">
                    <label htmlFor="">Category</label>
                    <input type="text" placeholder='Data Structures' className='form-control'
                    value={category.join(",")} onChange={(e) => setCategory(e.target.value.split(","))}/>
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

export default EditQn