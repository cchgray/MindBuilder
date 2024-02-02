import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { load_user, loadCalendarEventsByUser, getGroupsAssignedToUser, clearCalendarEvents } from '../actions/auth';
import MyCalendar from '../components/Calendar';
import { Link } from 'react-router-dom';

const UserProfile = ({ user, calendarEvents, load_user, loadCalendarEventsByUser, getGroupsAssignedToUser, groupsAssignedToUser }) => {
  useEffect(() => {
    load_user();
  }, [load_user]);

  useEffect(() => {
    if (user && user.id) {
      clearCalendarEvents();
      loadCalendarEventsByUser(user.id);
      getGroupsAssignedToUser(user.id);
    }
  }, [loadCalendarEventsByUser, user, getGroupsAssignedToUser]);

  return (
    
    <div className='container mt-5'>
      {/* ...other user information */}
      <div style={{ marginTop: '20px' }}>
      <h3>Groups Assigned to User</h3>
{Array.isArray(groupsAssignedToUser) && groupsAssignedToUser.length > 0 ? (
    <ul className="list-group">
        {groupsAssignedToUser.map((group) => (
            <li key={group.id} className="list-group-item d-flex justify-content-between align-items-center">
                {group.name}
                <Link to={`/group-user-view/${group.id}`} className="btn btn-secondary">
                    View Group
                </Link>
            </li>
        ))}
    </ul>
) : (
    <p>No groups assigned to this user.</p>
)}
        <h2>{user.first_name} {user.last_name}'s Calendar</h2>
        
        <MyCalendar
          key={JSON.stringify(calendarEvents)} 
          events={calendarEvents}
          user={user}
          readOnly={true}
        />
        
        </div>

    </div>
  );
};

 
const mapStateToProps = state => ({
  user: state.auth.user,
  calendarEvents: state.auth.calendarEvents,
  groupsAssignedToUser: state.auth.groupsAssignedToUser || [],
});

const mapDispatchToProps = (dispatch) => ({
  load_user: () => dispatch(load_user()),
  loadCalendarEventsByUser: (userId) => dispatch(loadCalendarEventsByUser(userId)),
  getGroupsAssignedToUser: (userId) => dispatch(getGroupsAssignedToUser(userId)), 
  clearCalendarEvents: () => dispatch(clearCalendarEvents()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
