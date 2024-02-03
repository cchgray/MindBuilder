import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill'; // Import the ReactQuill component
import 'react-quill/dist/quill.snow.css'; // Import the styles
import api from '../actions/api-config';
import { fetchNotes, updateNotes, removeCoachAssignment, getUsersByCoach } from '../actions/auth'; // Assuming you have a saveNotes action
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

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
        if (user.role === 'coach') {
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
    // Dispatch the action to remove the user
    removeCoachAssignment(coachId, userId);
    setRequestSent(true);
  };

  if (requestSent) {
    return <Navigate to='/coach-dashboard' />
  }


  return (
    <div className="container mt-4">
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
          {user.role === 'coach' && (
            <div>
              <ReactQuill
                theme="snow"
                value={editedNotes}
                onChange={setEditedNotes}
              />
              <button onClick={handleUpdateNotes}>Save</button>
            </div>
          )}
          {user.role === 'coach' && (
            <div>
              <button onClick={handleRemoveUser}>Remove User From Athletes</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
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
