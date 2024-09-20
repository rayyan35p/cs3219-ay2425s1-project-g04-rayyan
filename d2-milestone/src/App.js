import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Question from './components/question/Question';
import CreateQn from './components/question/CreateQn';
import UpdateQn from './components/question/UpdateQn';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Question/>}></Route>
        <Route path='/create' element={<CreateQn/>}></Route>
        <Route path='/update/:id' element={<UpdateQn/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
