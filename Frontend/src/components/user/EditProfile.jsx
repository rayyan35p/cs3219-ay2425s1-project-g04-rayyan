// Page where users can change their profile information, including their username, email, and password.
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import userService from "../../services/users"
import InputField from "../auth/InputField";

function EditProfile() {
    const navigate = useNavigate();
    const { id } = useParams(); // Access the id from the route
    const [userData, setUserData] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    useEffect(() => {
        // Fetch the user data based on the id
        async function fetchUserData() {
            const response = await userService.getUser(id,
                { headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}` } });
            setUserData(response.data);
        }
        fetchUserData();
    }, [id]);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword ] = useState('')
    const handleEditProfile = async (e) => {
        e.preventDefault();
        // Handle the user profile edit
        const newUser = {};
        if (username) newUser.username = username;
        if (email) newUser.email = email;
        if (password) newUser.password = password;

        // Reset error messages
        setErrorMessage('');
        setSuccessMessage('');
        setUsernameError(false);
        setEmailError(false);
        setPasswordError(false);

        // Validate inputs
        if (!username && !email && !password) {
            setErrorMessage("Please fill in at least one field")
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError(true);
            setErrorMessage('Passwords do not match');
            return;
        }

        // update user data
        try {
            await userService.updateUser(id, newUser,
                { headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}` } });
            setSuccessMessage('User data updated successfully!');
            navigate("/home")
        } catch (e) {
            console.log("Unable to update user data", e);
            if (e.response) {
                switch (e.response.status) {
                    case 401:
                        setErrorMessage('Unauthorized. Please login again.');
                        break;
                    case 409:
                        setErrorMessage('Username or email already exists.');
                        setUsernameError(true);
                        setEmailError(true);
                        break;
                    case 500:
                        setErrorMessage('Server error. Please try again later.');
                        break;
                    default:
                        setErrorMessage('An unexpected error occurred.');
                        break;
                }
            }
        }
    }


    const goHome = () => navigate('/home')
    // Render user edit form based on userData
    return userData ? (
        <div>
            <h2>Edit Profile</h2>
            <div className="right-side">
                <div className="input-container">
                    <form onSubmit={handleEditProfile}>
                        <InputField
                            label="Username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                setUsernameError(false);
                            }}
                            error={usernameError}
                        />
                        <InputField
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailError(false);
                            }}
                            error={emailError}
                        />
                        <InputField
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setPasswordError(false);
                            }}
                            error={passwordError}
                        />
                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                setPasswordError(false);
                            }}
                            error={passwordError}
                        />
                        <div className='button-container'>
                            <button type="submit" className="signup-button">
                                Change Profile Details
                            </button>
                        </div>
                        <div className='button-container'>
                            <button type={'button'} onClick={goHome} className="signup-button">
                                Cancel
                            </button>
                        </div>
                    </form>
                    <div className='notification'>
                        {/* Success Message */}
                        {successMessage && <p className="text-success mt-3">{successMessage}</p>}

                        {/* Error Message */}
                        {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <p>Loading...</p>
    );
}

export default EditProfile;
