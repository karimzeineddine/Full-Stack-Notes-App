import React, { useState } from 'react';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation checks before making the API call
    if (!name) {
      setError('Please enter your name');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setError(''); // Clear any previous errors

    // Sign-up API call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle register success response
      if (response.data && response.data.accessToken) {
        // Store the accessToken in localStorage to keep the user logged in
        localStorage.setItem("Token", response.data.accessToken);

        // Navigate to the dashboard after successful sign-up
        navigate('/dashboard');
      } else {
        // Handle case where no accessToken is returned
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      // Handle any errors during sign-up
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display API error message
      } else {
        console.error(error);
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      
      <div className='flex items-center justify-center h-screen bg-slate-200'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7 text-center'>SignUp</h4>
            <input 
              type="text" 
              placeholder='Name' 
              className='input-box' 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder='Email' 
              className='input-box' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <PasswordInput 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button type='submit' className='btn-primary'>
              Create Account
            </button>

            <p className='text-sm text-center mt-4'>
              Already have an account?{" "}
              <Link to="/login" className='font-medium text-primary underline'>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;