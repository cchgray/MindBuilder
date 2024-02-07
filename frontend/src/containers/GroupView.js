import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { load_user, getUsersByCoach, loadUsersInGroup,
     addUserToGroup, removeUserFromGroup, fetchGroupInfo, clearCalendarEvents, loadCalendarEventsByGroup, deleteGroup } from '../actions/auth';
import MyCalendar from '../components/Calendar';
import { Navigate } from 'react-router-dom';

const GroupView = ({ user, calendarEvents, load_user, loadCalendarEventsByGroup, 
    getUsersByCoach, loadUsersInGroup, addUserToGroup, removeUserFromGroup, 
    usersByCoach, usersInGroup, fetchGroupInfo, groupInfo, deleteGroup }) => {
 
  const [userToAdd, setUserToAdd] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  
  const { groupId } = useParams(); 

  useEffect(() => {
    load_user();
  }, [load_user]);

  useEffect(() => {
    if (user) {
        getUsersByCoach(user.id);
        if (groupId) {
          loadUsersInGroup(groupId); // Automatically populate groupId
          fetchGroupInfo(groupId);
        }
        
    }
    }, [getUsersByCoach, loadUsersInGroup, user, groupId, fetchGroupInfo]);

  useEffect(() => {
    if (groupId) {
      clearCalendarEvents();
      loadCalendarEventsByGroup(groupId);
    }
  }, [loadCalendarEventsByGroup, groupId]);
  
  const handleAddUserToGroup = () => {
    if (userToAdd) {
      addUserToGroup(groupId, userToAdd);
      // Clear userToAdd state or handle it as needed
      setUserToAdd('');
    }
  };

  const handleRemoveUser = (userId) => {
    const isConfirmed = window.confirm('Are you sure you want to remove user from this Group?');
    if (isConfirmed) {
      removeUserFromGroup(groupId, userId).then(() => {
        // After successful removal, reload the list of users in the group
        loadUsersInGroup(groupId);
      })
      .catch((error) => {
        // Handle any errors here, such as displaying an error message
        console.error('Error removing user from group:', error);
      });
    }
  };

  const usersNotInGroup = usersByCoach.filter(
    (user) => !usersInGroup.some((groupUser) => groupUser.id === user.id)
  );

  const handleDeleteGroup = () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this group? This action cannot be undone. All events and users in the group will be removed.');
    if (isConfirmed) {
      try{
        deleteGroup(groupId);
        setRequestSent(true);
      }
      catch(err){
        console.log(err);
      }
    }
  };

  if (requestSent) {
    return <Navigate to='/coach-dashboard' />
  }

  return ( <div className="container mt-5">
  {/* ...other user information */}
  <div>
  <div className="container mt-4">
  <div className="row">
    <div className="col-md-6">
      <div className="mt-4">
        <h5>Athletes in Team</h5>
        {usersInGroup.length > 0 ? (
          <ul className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {usersInGroup.map((user) => (
              <li
                key={user.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {user.first_name} {user.last_name}
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveUser(user.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Athletes in this Team.</p>
        )}
      </div>
    </div>
    <div className="col-md-6">
      <div className="mt-4">
        <h5>Add Athlete to Team</h5>
        {groupId ? (
          <div>
            <select
              value={userToAdd}
              onChange={(e) => setUserToAdd(e.target.value)}
              className="form-control mb-2"
            >
              <option value="">Select a user to add</option>
              {usersNotInGroup.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddUserToGroup}
              className="btn btn-success"
            >
              Add Athlete to Team
            </button>
            
          </div>
          
        ) : (
          <p>Select a Team to add Athletes.</p>
        )}
      </div>
      <div>
            <button
              onClick={handleDeleteGroup}
              className="btn btn-danger mt-3"
            >
              Delete Team
            </button>
            </div>
    </div>
  </div>
</div>
</div>
  

<br />
  <div style={{ marginTop: '20px' }}>
      {groupInfo ? (
          <>
              {/* <h2>{groupInfo.name} Calendar</h2> */}
              <p>{groupInfo.about}</p>

              <MyCalendar 
                  key={JSON.stringify(calendarEvents)} 
                  events={calendarEvents}
                  user={user}
                  group={groupId}
                  groupName={groupInfo.name}
                  usersInGroup={usersInGroup}
              />
          </>
      ) : (
          <p>Loading group information...</p>
      )}
  </div>
</div>
  );
};


const mapStateToProps = state => ({
    user: state.auth.user,
    calendarEvents: state.auth.calendarEvents,
    usersByCoach: state.auth.usersByCoach || [],
    usersInGroup: state.auth.usersInGroup || [],
    groupInfo: state.auth.groupInfo || [],
  });
  
  const mapDispatchToProps = (dispatch) => ({
    getUsersByCoach: (coachId) => dispatch(getUsersByCoach(coachId)),
    load_user: () => dispatch(load_user()),
    loadCalendarEventsByGroup: (groupId) => dispatch(loadCalendarEventsByGroup(groupId)),
    loadUsersInGroup: (groupId) => dispatch(loadUsersInGroup(groupId)),
    addUserToGroup: (groupId, userId) => dispatch(addUserToGroup(groupId, userId)),
    removeUserFromGroup: (groupId, userId) => dispatch(removeUserFromGroup(groupId, userId)),
    fetchGroupInfo: (groupId) => dispatch(fetchGroupInfo(groupId)),
    clearCalendarEvents: () => dispatch(clearCalendarEvents()),
    deleteGroup: (groupId) => dispatch(deleteGroup(groupId)),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(GroupView);