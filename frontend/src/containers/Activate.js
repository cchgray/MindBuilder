import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { verify } from '../actions/auth';


import getLPTheme from '../containers/LandingPage/getLPTheme';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const LPtheme = createTheme(getLPTheme('light'));

const Activate = ({ verify, match }) => {
    const [verified, setVerified] = useState(false);

    const { uid, token } = useParams(); 

    const verify_account = e => {
 
        verify(uid, token);
        setVerified(true);
    };

    if (verified) {
        return <Navigate to='/' />
    }

    return (

    <ThemeProvider theme={LPtheme}>

    <CssBaseline />
        <div className='container'>
            <div 
                className='d-flex flex-column justify-content-center align-items-center'
                style={{ marginTop: '200px' }}
            >
                <h1>Verify your Account:</h1>
                <button
                    onClick={verify_account}
                    style={{ marginTop: '50px' }}
                    type='button'
                    className='btn btn-primary'
                >
                    Verify
                </button>
            </div>
        </div>
    </ThemeProvider>
    );
};

export default connect(null, { verify })(Activate);