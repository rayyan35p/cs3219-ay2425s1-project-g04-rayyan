// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button, Container, Row, Col } from 'react-bootstrap';

// function Login() {
//     const navigate = useNavigate();

//     const goToSignUp = () => {
//         navigate('/signup'); // Redirects to the sign-up page
//     };

//     return (
//         <Container className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
//             <Row>
//                 <Col md={6} className="text-center">
//                     <h2>Login Page</h2>
//                     <p>If you don't have an account, click the button below to sign up!</p>
//                     <Button variant="primary" onClick={goToSignUp}>
//                         Go to Sign Up
//                     </Button>
//                 </Col>
//             </Row>
//         </Container>
//     );
// }

// export default Login;

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../../css/Login.css'; // Import the CSS for styling
import InputField from './InputField';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <h1 className="title">PeerPrep</h1>
        <h2 className="subtitle">Sign In</h2>
      </div>
      <div className="right-side">
        <div className="input-container">
          <form onSubmit={handleLogin}>
            <div>
              <InputField label="Email" type="email" placeholder="Enter your email" />
              <InputField label="Password" type="password" placeholder="Enter your password" />
            </div>
            <div className="button-container">
              <Link to="/signup" className="create-account-link">Create Account</Link>
              <button type="submit" className="login-button">Sign In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

