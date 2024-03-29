import React, { useEffect} from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { load_user,
      fetchGroupInfo, loadCalendarEventsByGroup, clearCalendarEvents } from '../actions/auth';
import MyCalendar from '../components/Calendar';

import getLPTheme from '../containers/LandingPage/getLPTheme';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const LPtheme = createTheme(getLPTheme('light'));

const GroupViewUserView = ({ user, calendarEvents, load_user, loadCalendarEventsByGroup, 
     fetchGroupInfo, groupInfo }) => {
 
  
  const { groupId } = useParams(); 

  useEffect(() => {
    load_user();
  }, [load_user]);

  useEffect(() => {
    if (user && groupId) {
          fetchGroupInfo(groupId);
    }
    }, [user, groupId, fetchGroupInfo]);

  useEffect(() => {
    if (groupId) {
      clearCalendarEvents();
      loadCalendarEventsByGroup(groupId);
    }
  }, [loadCalendarEventsByGroup, groupId]);
  

  return (


    <ThemeProvider theme={LPtheme}>

    <CssBaseline />
    <div className='container mt-5'>
      {/* ...other user information */}
      

        <div style={{ marginTop: '20px' }}>
            {groupInfo ? (
                <>
                {/* <h2>{groupInfo.name} Calendar</h2>
                <p>{groupInfo.about}</p> */}

                <MyCalendar
                    key={JSON.stringify(calendarEvents)} 
                    events={calendarEvents}
                    user={user}
                    group={groupId}
                    groupName={groupInfo.name}
                    readOnly={true}
                />
                </>
            ) : (
                <p>Loading team information...</p>
            )}
            </div>

    </div>
    </ThemeProvider>
  );
};


const mapStateToProps = state => ({
    user: state.auth.user,
    calendarEvents: state.auth.calendarEvents,
    groupInfo: state.auth.groupInfo || [],
  });
  
  const mapDispatchToProps = (dispatch) => ({
    load_user: () => dispatch(load_user()),
    loadCalendarEventsByGroup: (groupId) => dispatch(loadCalendarEventsByGroup(groupId)),
    fetchGroupInfo: (groupId) => dispatch(fetchGroupInfo(groupId)),
    clearCalendarEvents: () => dispatch(clearCalendarEvents()),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(GroupViewUserView);