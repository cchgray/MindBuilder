import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getUsersByCoach, loadCalendarEventsByUser, clearCalendarEvents, getGroupsAssignedToCoach, createGroup } from '../actions/auth';
import MyCalendar from '../components/Calendar'; // Import your Calendar component
import { Link } from 'react-router-dom';

const CoachDashboard = ({ coachId, user, usersByCoach, 
    getUsersByCoach, loadCalendarEventsByUser, calendarEvents, clearCalendarEvents, 
    groupsAssignedToCoach, getGroupsAssignedToCoach, createGroup  }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [groupName, setGroupName] = useState('');

    useEffect(() => {
        if (user) {
            getUsersByCoach(coachId);
            getGroupsAssignedToCoach(coachId);
        }
    }, [getUsersByCoach, getGroupsAssignedToCoach, coachId, user]);

    useEffect(() => {
        // Cleanup function
        const clearEventsAndLoad = async () => {
            clearCalendarEvents();
            if (selectedUser && selectedUser.id) {
                await loadCalendarEventsByUser(selectedUser.id);
            }
        };

        clearEventsAndLoad();

        // Cleanup function will be called when component unmounts or selectedUser changes
        return clearCalendarEvents;
    }, [clearCalendarEvents, loadCalendarEventsByUser, selectedUser]);

    const handleCreateGroup = (e) => {
        e.preventDefault();

        if (groupName) {
            createGroup({ name: groupName, coach: coachId, about: '' }); // Call the createGroup action
            setGroupName(''); // Clear the group name input
        }
    };

    const handleUserCalendar = (e) => {
        clearCalendarEvents();
        loadCalendarEventsByUser(e.id);
        setSelectedUser(e);
    };

    return (
        <div className="container">
            <h2 className="mt-4">{user.first_name} {user.last_name}'s Dashboard</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="mt-4">
                <h5>Athletes</h5>
                {usersByCoach.length > 0 ? (
                    <ul className="list-group">
                        {usersByCoach.map((assignedUser) => (
                            <li
                                key={assignedUser.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                {assignedUser.first_name} {assignedUser.last_name}
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleUserCalendar(assignedUser)}
                                >
                                    Go To Calendar
                                </button>
                                <Link to={`/about/${assignedUser.id}`} className="btn btn-secondary">
                                    View Profile
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users assigned to this coach.</p>
                )}
            </div></div>
            <div className="col-md-4">
                <div className="mt-4">
                <h5>Groups Assigned to Coach</h5>
                {Array.isArray(groupsAssignedToCoach) && groupsAssignedToCoach.length > 0 ? (
                    <ul className="list-group">
                        {groupsAssignedToCoach.map((group) => (
                            <li
                                key={group.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                {group.name}
                                <Link to={`/group/${group.id}`} className="btn btn-secondary">
                                    View Group
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No groups assigned to this coach.</p>
                )}
            </div></div>
            <div className="col-md-4">
            <div className="mt-4">
                <h5>Create a New Group</h5>
                <form onSubmit={handleCreateGroup} className="form-inline">
                    <input
                        type="text"
                        className="form-control mr-2"
                        placeholder="Group Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <button type="submit" className="btn btn-success">
                        Create Group
                    </button>
                </form>
            </div></div></div>
            {selectedUser && (
                <div className="mt-4">
                    <h3>Calendar for {selectedUser.first_name} {selectedUser.last_name}</h3>
                    <MyCalendar key={JSON.stringify(calendarEvents)} events={calendarEvents} user={selectedUser} />
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    coachId: state.auth.user ? state.auth.user.id : null,
    usersByCoach: state.auth.usersByCoach || [],
    user: state.auth.user,
    calendarEvents: state.auth.calendarEvents,
    groupsAssignedToCoach: state.auth.groupsAssignedToCoach || [],
});

const mapDispatchToProps = (dispatch) => ({
    getUsersByCoach: (coachId) => dispatch(getUsersByCoach(coachId)),
    loadCalendarEventsByUser: (userId) => {
        
            dispatch(loadCalendarEventsByUser(userId));
        
    },
    getGroupsAssignedToCoach: (coachId) => dispatch(getGroupsAssignedToCoach(coachId)), 
    createGroup: (groupData) => dispatch(createGroup(groupData)),
    clearCalendarEvents: () => dispatch(clearCalendarEvents()),

});

export default connect(mapStateToProps, mapDispatchToProps)(CoachDashboard);
