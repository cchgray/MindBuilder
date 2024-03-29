import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill'; // Import the ReactQuill component
import 'react-quill/dist/quill.snow.css'; // Import the styles
import api from '../actions/api-config';
import { fetchNotes, updateNotes, removeCoachAssignment } from '../actions/auth'; // Assuming you have a saveNotes action
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';


import getLPTheme from '../containers/LandingPage/getLPTheme';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const LPtheme = createTheme(getLPTheme('light'));

const AboutPage = ({ coachId, fetchNotes, notes, updateNotes, removeCoachAssignment, user }) => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [editedNotes, setEditedNotes] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get(`/accounts/user-about/${userId}/`, {
          headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
          },
        });
        setUserData(userResponse.data);
        if (user && user.role === 'coach') {
          fetchNotes(coachId, userId);
          setEditedNotes(notes);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, coachId, fetchNotes, notes, user]);

  const handleUpdateNotes = () => {
    // Assuming you have a saveNotes action to save the notes
    updateNotes(coachId, userId, editedNotes);
  };

  const handleRemoveUser = () => {
    const isConfirmed = window.confirm('Are you sure you want to remove this user?');

    if (isConfirmed) {
      removeCoachAssignment(coachId, userId);
    }
    setRequestSent(true);
  };

  if (requestSent) {
    return <Navigate to='/coach-dashboard' />
  }


  return (


    <ThemeProvider theme={LPtheme}>

    <CssBaseline />
    <div className="container mt-4">

    <style>
    {`
      .ql-container.ql-snow {
        height: 150px;
        overflowY: scroll;
      }
    `}
    </style>
      <h2>About Page</h2>
      {userData ? (
        <div>
          <h3>User Information</h3>
          <ul className="list-group">
              <li className="list-group-item">ID: {userData.id}</li>
              <li className="list-group-item">Name: {userData.first_name} {userData.last_name}</li>
              <li className="list-group-item">Role: {userData.role}</li>
              <li className="list-group-item">About: {userData.about}</li>
              <li className="list-group-item">Email: {userData.email}</li>
                
          </ul>
          <br></br>
          <h2> Coach's Notes on {userData.first_name} {userData.last_name}</h2>
          <br/>
          <button className='btn btn-success' onClick={handleUpdateNotes}>Save Notes</button>
          {user.role === 'coach' && (
            <div>
              <ReactQuill
                theme="snow"
                value={editedNotes}
                onChange={setEditedNotes}
              />
              
            </div>
          )}
          <br/>
          {user.role === 'coach' && (
            <div>
              <button
                  className="btn btn-danger" 
                  onClick={handleRemoveUser}>Remove User From Your Athletes</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  coachId: state.auth.user ? state.auth.user.id : null,
  notes: state.auth.coachNotesOnUser ? state.auth.coachNotesOnUser.notes : '',
});

const mapDispatchToProps = (dispatch) => ({
  fetchNotes: (coachId, userId) => dispatch(fetchNotes(coachId, userId)),
  updateNotes: (coachId, userId, notes) => dispatch(updateNotes(coachId, userId, notes)),
  removeCoachAssignment: (coachId, userId) => dispatch(removeCoachAssignment(coachId, userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutPage);
