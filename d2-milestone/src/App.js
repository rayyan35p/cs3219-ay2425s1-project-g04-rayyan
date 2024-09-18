import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Question from './Question';
import CreateQn from './CreateQn';
import UpdateQn from './UpdateQn';

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
