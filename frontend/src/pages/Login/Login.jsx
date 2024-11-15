import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance'; 


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!password) {
            setError("Please enter a password.");
            return;
        }
        setError("");
        // Simulate login request
        try {
            const response = await axiosInstance.post("/login", {
                email: email,
                password: password,
            });

            //handle success response
            if (response.data && response.data.accessToken) {
                localStorage.setItem("Token", response.data.accessToken)
                navigate('/dashboard')
            }
        }
        catch (error) {
            //handle error
            if (error.response && error.response.date && error.response.data.messsage) {
                setError(error.response.data.message)
            } else {
                setError("Something went wrong. Please try again.")
            }
        }

    }
    return (
        <>
            <div className='flex items-center justify-center h-screen bg-slate-200'>
                <div className='w-96 border rounded bg-white px-7 py-10'>
                    <form onSubmit={handleLogin}>
                        <h4 className='text-2xl mb-7 text-center'>Login</h4>
                        <input type="text" placeholder='Email' className='input-box'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                        <button type='submit' className='btn-primary'>
                            Login
                        </button>

                        <p className='text-sm text-center mt-4'>
                            Not registered yet?{""}
                            <Link to="/signup" className='font-medium text-primary underline'> Create an Account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login