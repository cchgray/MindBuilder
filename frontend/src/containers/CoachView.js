import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import MyCalendar from '../components/Calendar'; // Import your Calendar component
import { load_user, loadCalendarEventsByUser } from '../actions/auth';

const CoachView = ({ user, calendarEvents, load_user, location, loadCalendarEventsByUser }) => {
    const selectedUser = location.state ? location.state.selectedUser : null;

    console.log(selectedUser.id);
    useEffect(() => {
        load_user();
      }, [load_user]);

      useEffect(() => {
        if (selectedUser && selectedUser.id) {
          loadCalendarEventsByUser(selectedUser.id);
        }
      }, [loadCalendarEventsByUser, selectedUser]);
    
    return (
        <div>
            <h2>Coach View</h2>
            {/* Display any coach-related information here */}
            <MyCalendar events={calendarEvents} user={selectedUser} />
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    calendarEvents: state.auth.calendarEvents,
});
const mapDispatchToProps = (dispatch) => ({
    load_user: () => dispatch(load_user()),
    loadCalendarEventsByUser: (userId) => dispatch(loadCalendarEventsByUser(userId)),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(CoachView);
  