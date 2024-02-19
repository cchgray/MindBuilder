import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/auth';

import getLPTheme from '../containers/LandingPage/getLPTheme';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const LPtheme = createTheme(getLPTheme('light'));

const Login = ({ login, isAuthenticated, userRole, failedLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '' 
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        login(email, password);

        
    };

        // Render error message if login fails
    const renderError = () => {
        if (failedLogin) {
            return (
                <div className="alert alert-danger" role="alert">
                    Login failed or account has not been activated. Please check your credentials and try again.
                </div>
            );
        }
        return null;
    };


    if (isAuthenticated) {
        if (userRole === 'player'){
            return <Navigate to='/me' />
        }
        if (userRole === 'coach'){
            return <Navigate to='/coach-dashboard' />
        }
    }

    return (


    <ThemeProvider theme={LPtheme}>

    <CssBaseline />
        <div className='container mt-5'>
            <h1>Sign In</h1>
            {renderError()}
            <p>Sign into your Account</p>
            <form onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Password'
                        name='password'
                        value={password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                <button className='btn btn-primary' type='submit'>Login</button>
            </form>
            {/* <button className='btn btn-danger mt-3' onClick={continueWithGoogle}>
                Continue With Google
            </button>
            <br />
            <button className='btn btn-primary mt-3' onClick={continueWithFacebook}>
                Continue With Facebook
            </button> */}
            <p className='mt-3'>
                Don't have an account? <Link to='/signup'>Sign Up</Link>
            </p>
            <p className='mt-3'>
                Forgot your Password? <Link to='/reset-password'>Reset Password</Link>
            </p>
        </div>
    </ThemeProvider>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userRole: state.auth.user ? state.auth.user.role : null,
    failedLogin: state.auth.failedLogin
});

export default connect(mapStateToProps, { login })(Login);