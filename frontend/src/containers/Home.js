import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
    <div className='container'>
        <div className='jumbotron mt-5'>
            <h1 className='display-4'>Welcome to the Mind Gym!</h1>
            <p className='lead'>A platform for Mental Performance Coaches to support their Athlete's training and growth.</p>
            <hr className='my-4' />
            <p>Please Log in or Sign up</p>
            <Link className='btn btn-primary btn-lg' to='/login' role='button'>Login</Link>
        </div>
    </div>
);

export default Home;