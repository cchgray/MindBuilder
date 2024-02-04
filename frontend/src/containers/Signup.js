import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup } from '../actions/auth';
//import axios from 'axios';

const Signup = ({ signup, isAuthenticated }) => {
    const [accountCreated, setAccountCreated] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: 'player',
        about: '',
        password: '',
        re_password: ''
    });

    const { first_name, last_name, email, role, about, password, re_password } = formData;
    const [registrationMessage, setRegistrationMessage] = useState('');


    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e)=> {
        e.preventDefault();

        if (password === re_password) {
            await signup(first_name, last_name, email,  role, about, password, re_password);

            
            //need an api call to reference the table of coach invite links
            //pass the email as a parameter to the api call, return the coach id if found and the user id
            //if not found, return null and proceed
            //if found assign the user id to the coach id using api call found in the explore.js file

            setRegistrationMessage('Please activate your account with the email from themindgymusers@gmail.com. Check your spam folder if you do not see the email in your inbox.');
            setTimeout(() => {
                setAccountCreated(true);
            }, 15000); // Redirect to login page after 2 seconds
        }
    };

    if (isAuthenticated) {
        return <Navigate to='/' />
    }
    if (accountCreated) {
        return <Navigate to='/login' />
    }

    return (
        <div className='container mt-5'>
            <h1>Sign Up</h1>
            <p>Create your Account</p>
            {registrationMessage && (
                <div className="alert alert-success mt-3">
                    {registrationMessage}
                </div>
            )}
            <form onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='text'
                        placeholder='First Name*'
                        name='first_name'
                        value={first_name}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='text'
                        placeholder='Last Name*'
                        name='last_name'
                        value={last_name}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='email'
                        placeholder='Email*'
                        name='email'
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                
                <div className='form-group'>
                <label>Role:</label>
                <div>
                    <label style={{ marginRight: '10px' }}>
                    <input
                        type='radio'
                        name='role'
                        value='player'
                        checked={role === 'player'}
                        onChange={e => onChange(e)}
                    />
                    Player
                    </label>
                    <label style={{ marginRight: '10px' }}>
                    <input
                        type='radio'
                        name='role'
                        value='coach'
                        checked={role === 'coach'}
                        onChange={e => onChange(e)}
                    />
                    Coach
                    </label>
                </div>
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='text'
                        placeholder='about*'
                        name='about'
                        value={about}
                        onChange={e => onChange(e)}
                        
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Password*'
                        name='password'
                        value={password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Confirm Password*'
                        name='re_password'
                        value={re_password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                <button className='btn btn-primary' type='submit'>Register</button>
            </form>
            <p className='mt-3'>
                Already have an account? <Link to='/login'>Sign In</Link>
            </p>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { signup })(Signup);