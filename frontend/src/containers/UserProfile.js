import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { load_user, loadCalendarEventsByUser, getGroupsAssignedToUser, clearCalendarEvents } from '../actions/auth';
import MyCalendar from '../components/Calendar';
import { Link } from 'react-router-dom';
import api from '../actions/api-config';

const UserProfile = ({ user, calendarEvents, load_user, loadCalendarEventsByUser, getGroupsAssignedToUser, groupsAssignedToUser }) => {
  useEffect(() => {
    load_user();
  }, [load_user]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        // Load user-specific data (calendar events, groups, etc.)
        clearCalendarEvents();
        loadCalendarEventsByUser(user.id);
        getGroupsAssignedToUser(user.id);
      }
    };

    fetchData();
  }, [loadCalendarEventsByUser, user, getGroupsAssignedToUser]);

  useEffect(() => {
    const handleInvitationCheck = async () => {
      try {
        // Update the API endpoint based on your backend implementation
        const res = await api.post(
          `/accounts/check-invitation/`,
          { email: user.email },
          {
            headers: {
              'Authorization': `JWT ${localStorage.getItem('access')}`,
            },
          }
        );
  
  
        if (res.data.userId != null && res.data.coachId != null) {
          // Assign the user to the coach using the obtained information
          //console.log("coach " + res.data.coachId, "invite " + res.data.userId);
          const user_id = res.data.userId;
          const coach_id = res.data.coachId;
          try {
            const result = await api.post(
                `/accounts/assign-coach/`, // Replace with your actual API endpoint
                { user_id, coach_id },  // Send user_id and coach_id in the request data
                {
                    headers: {
                        'Authorization': `JWT ${localStorage.getItem('access')}`,
                    },
                }
            );
            //console.log(result.status);
            if (result.status === 201) {
              //console.log('Coach assigned successfully', user_id, coach_id);
              try {
                const result = await api.post(
                    `/accounts/accept-invitation/`, // Replace with your actual API endpoint
                    { user_id, coach_id },  // Send user_id and coach_id in the request data
                    {
                        headers: {
                            'Authorization': `JWT ${localStorage.getItem('access')}`,
                        },
                    }
                  );
                  if (result.status === 200) {
                    //console.log('Invite changed to accepted in model');
                  }
                  else {
                    //console.log('Error changing invite status to accepted');  
                  }
              
              } catch (error) {
                  //console.error('Error assigning coach:', error);
              }


            }
            
        } catch (error) {
            //console.error('Error assigning coach:', error);
        }

        }
      } catch (error) {
        //console.log(error);
      }
    };
  
    handleInvitationCheck();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



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

<br />
<br />
        {/* <h2>{user.first_name} {user.last_name}'s Calendar</h2> */}
        
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
