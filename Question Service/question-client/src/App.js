import logo from './logo.svg';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Question from './Question Components/Question';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Question/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
