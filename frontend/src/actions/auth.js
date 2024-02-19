import api from './api-config';

import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    LOGOUT,
    LOAD_CALENDAR_EVENTS_SUCCESS,
    UPDATE_CALENDAR_EVENT_SUCCESS,
    ADD_CALENDAR_EVENT_SUCCESS,
    DELETE_CALENDAR_EVENT_SUCCESS,
    LOAD_USERS_BY_COACH_SUCCESS,
    ACCEPT_COACH_REQUEST,
    CLEAR_CALENDAR_EVENTS,
    LOAD_GROUPS_ASSIGNED_TO_COACH_SUCCESS,
    CREATE_GROUP_SUCCESS,
    DELETE_GROUP_SUCCESS,
    LOAD_USERS_IN_GROUP_SUCCESS,
    LOAD_USERS_IN_GROUP_FAIL,
    ADD_USER_TO_GROUP_SUCCESS,
    ADD_USER_TO_GROUP_FAIL,
    REMOVE_USER_FROM_GROUP_SUCCESS,
    REMOVE_USER_FROM_GROUP_FAIL,
    FETCH_GROUP_INFO_SUCCESS,
    FETCH_GROUP_INFO_FAILURE,
    LOAD_CALENDAR_EVENTS_BY_GROUP_SUCCESS,
    UPDATE_USER_EVENT_STATUS_SUCCESS,
    DELETE_USER_EVENT_STATUS_SUCCESS,
    ADD_USER_EVENT_STATUS_SUCCESS,
    LOAD_GROUPS_ASSIGNED_TO_USER_SUCCESS,
    FETCH_NOTES_SUCCESS,
    FETCH_NOTES_FAILURE,
    UPDATE_NOTES_SUCCESS,
    UPDATE_NOTES_FAILURE,
    REMOVE_COACH_ASSIGNMENT_SUCCESS,
    REMOVE_COACH_ASSIGNMENT_FAILURE,
    INVITE_USER_SUCCESS,
    INVITE_USER_FAILURE

} from './types';

 
export const invitationCheck = async (email) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            },
        };
        
        // Update the API endpoint and data based on your backend implementation
        const res = await api.post(
            `/accounts/check-invitation/`, // Update with your actual endpoint for checking invitation
            { email }, // Pass the email as the request body
            config
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const inviteUser = (user, inviteEmail) => async (dispatch) => {
    console.log(user);
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            },
        };
        // Update the API endpoint and data based on your backend implementation
        const res = await api.post(
            `/accounts/create-invitation/`, // Update with your actual endpoint
            user,
            inviteEmail, // Pass the invitationData as the request body
            config
        );
        console.log(res.data);

        dispatch({ type: INVITE_USER_SUCCESS, payload: res.data }); // Use res.data as the payload
        return res.data;
    } catch (error) {
        dispatch({ type: INVITE_USER_FAILURE }); // Dispatch a failure action if there's an error
        // Handle error
    }
};

export const removeCoachAssignment = (coachId, userId) => async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access')}`,
          'Accept': 'application/json',
        },
      };
      const response = await api.post(
        `/accounts/remove-coach-assignment/${coachId}/${userId}/`, // Replace with your actual API endpoint
        null,
        config
      );
      console.log(response);
  
      dispatch({ type: REMOVE_COACH_ASSIGNMENT_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: REMOVE_COACH_ASSIGNMENT_FAILURE, payload: error });
    }
  };

export const updateNotes = (coachId, userId, editedNotes) => {
    return async (dispatch) => {
        try {
            const response = await api.put(
                `accounts/update-coach-notes/${coachId}/${userId}/`,
                { notes: editedNotes },
                {
                    headers: {
                        'Authorization': `JWT ${localStorage.getItem('access')}`,
                    },
                }
            );
            console.log(response);  
            const updatedNotes = response.data;

            // Dispatch action with updated notes
            dispatch({
                type: UPDATE_NOTES_SUCCESS,
                payload: updatedNotes,
            });
        } catch (error) {
            console.error('Error updating notes:', error);

            dispatch({
                type: UPDATE_NOTES_FAILURE,
                payload: error,
            });

            throw error;
        }
    };
};

// Action Creators
export const fetchNotes = (coachId, athleteId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`,
        'Accept': 'application/json',
      },
    };

    const response = await api.get(
      `/accounts/coach-notes/${coachId}/${athleteId}/`, // Replace with your actual API endpoint
      config
    );

    dispatch({ type: FETCH_NOTES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_NOTES_FAILURE, payload: error });
  }
};



  // Async Action: Fetch Group Information
  export const fetchGroupInfo = (groupId) => async (dispatch) => {
  
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access')}`,
          'Accept': 'application/json',
        },
      };
  
      const response = await api.get(
        `/accounts/group-info/${groupId}/`,
        config
      );
      
      dispatch({ type: FETCH_GROUP_INFO_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_GROUP_INFO_FAILURE});
    }
  };

// Action to remove a user from a group
    export const removeUserFromGroup = (groupId, userId) => async (dispatch) => {
    try {
        const response = await api.post(
            `/accounts/remove-user-from-group/${groupId}/${userId}/`,
            null, // No request body needed for removal
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json',
                },
            }
        );
        dispatch({ type: REMOVE_USER_FROM_GROUP_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: REMOVE_USER_FROM_GROUP_FAIL });
    }
};


  export const loadUsersInGroup = (groupId) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const res = await api.get(`/accounts/assigned-users/${groupId}/`, config);
        dispatch({ type: LOAD_USERS_IN_GROUP_SUCCESS, payload: res.data });
    } catch (error) {
        dispatch({ type: LOAD_USERS_IN_GROUP_FAIL });
    }
};

// Action to add a user to a group
export const addUserToGroup = (groupId, user) => async (dispatch) => {
    try {
        const response = await api.post(
            `/accounts/add-users-to-group/${groupId}/`,
            { user_id: user },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json',
                },
            }
        );
        dispatch({ type: ADD_USER_TO_GROUP_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: ADD_USER_TO_GROUP_FAIL });
    }
};

export const createGroup = (groupData) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const res = await api.post(`/accounts/create-training-group/`, groupData, config);
        dispatch({ type: CREATE_GROUP_SUCCESS, payload: res.data });
    } catch (error) {
        console.log(error);
    }
};

export const deleteGroup = (groupId) => async (dispatch) => {
    try {
        const response = await api.post(
            `/calendarevents/delete-group/${groupId}/`,
            null, // No request body needed for removal
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json',
                },
            }
        );
      dispatch({ type: DELETE_GROUP_SUCCESS, payload: response.data });
      // Dispatch any additional actions you need after successful deletion
    } catch (error) {
      // Handle error
      console.error('Error deleting group:', error);
    }
  };

// Add a new action to fetch groups assigned to a coach
export const getGroupsAssignedToUser = (userId) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const res = await api.get(`/accounts/groups-assigned-to-user/${userId}/`, config);
        dispatch({ type: LOAD_GROUPS_ASSIGNED_TO_USER_SUCCESS, payload: res.data });
    } catch (error) {
        // Handle error
    }
};
  
// Add a new action to fetch groups assigned to a coach
export const getGroupsAssignedToCoach = (coachId) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const res = await api.get(`/accounts/groups-assigned-to-coach/${coachId}/`, config);
        dispatch({ type: LOAD_GROUPS_ASSIGNED_TO_COACH_SUCCESS, payload: res.data });
    } catch (error) {
        // Handle error
    }
};


// Define an action to assign a coach
export const assignCoach = (user_id, coach_id) => async dispatch => {
    try {
        const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1];
        
        const response = await api.post(
            `/accounts/assign-coach/`, // Replace with your actual API endpoint
            { user_id, coach_id },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json',
                     'X-CSRFToken': csrfToken,
                     'allow': 'POST'
                },
            }
        );
 
        dispatch({ type: ACCEPT_COACH_REQUEST, payload: response.data });
    } catch (error) {
        // Handle error and dispatch an error action if needed
        dispatch({ type: ACCEPT_COACH_REQUEST, payload: error });
    }
};



export const getUsersByCoach = (coachId) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const res = await api.get(`/accounts/users-by-coach/${coachId}/`, config);
        dispatch({ type: LOAD_USERS_BY_COACH_SUCCESS, payload: res.data });
    } catch (error) {
        
    }
};

export const clearCalendarEvents = () => dispatch => {
    dispatch({ type: CLEAR_CALENDAR_EVENTS });
  };

export const deleteUserEventStatus = (userEventStatusId) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`,
            },
        };

        await api.delete(
            `/calendarevents/usereventstatuses/${userEventStatusId}/`,
            config
        );

        dispatch({ type: DELETE_USER_EVENT_STATUS_SUCCESS, payload: userEventStatusId });
    } catch (error) {
        // Handle error
    }
};

export const addUserEventStatus = (userEventStatusData) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const res = await api.post(
            `/calendarevents/usereventstatuses/`,
            userEventStatusData,
            config
        );

        dispatch({ type: ADD_USER_EVENT_STATUS_SUCCESS, payload: res.data });

    } catch (error) {
        // Handle error
    }
};

export const updateUserEventStatus = (userEventStatusData) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const res = await api.patch(
            `/calendarevents/usereventstatuses/${userEventStatusData.id}/`,
            userEventStatusData,
            config
        );

        dispatch({ type: UPDATE_USER_EVENT_STATUS_SUCCESS, payload: res.data });

    } catch (error) {
        // Handle error
    }
};


export const deleteCalendarEvent = (eventId) => async (dispatch) => {
    try {
      const config = {
        headers: {
          'Authorization': `JWT ${localStorage.getItem('access')}`,
        },
      };
  
      await api.delete(
        `/calendarevents/calendarevents/${eventId}/`,
        config
      );
  
      dispatch({ type: DELETE_CALENDAR_EVENT_SUCCESS, payload: eventId });
    } catch (error) {
      // Handle error
    }
  };

export const addCalendarEvent = (eventData, user) => async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access')}`,
          'Accept': 'application/json'
        }
      }; 
      eventData.user = user;
      const res = await api.post(
        `/calendarevents/calendarevents/`,
        eventData, // Pass the updated eventData as the request body
        config
      );
      dispatch({ type: ADD_CALENDAR_EVENT_SUCCESS, payload: res.data }); // Use res.data as the payload
      return res.data;
    } catch (error) {
      // Handle error
    }
  };

  export const addGroupCalendarEvent = (eventData, user, usersInGroup) => async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access')}`,
          'Accept': 'application/json'
        }
      }; 
      eventData.user = user;
      const res = await api.post(
        `/calendarevents/calendarevents/`,
        eventData, // Pass the updated eventData as the request body
        config
      );

    if(eventData.group){       // Create individual UserEventStatus entries for each user in the group
        usersInGroup.forEach(async userInGroup => {
            const userEventStatusData = {
                user: userInGroup.id,
                event: res.data.id,
                complete: false,
            };

            await api.post(
                `/calendarevents/usereventstatuses/`,
                userEventStatusData,
                config
            );
        })}
      dispatch({ type: ADD_CALENDAR_EVENT_SUCCESS, payload: res.data }); // Use res.data as the payload
      return res.data;
    } catch (error) {
      // Handle error
    }
  };

  export const updateCalendarEvent = (eventData) => async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access')}`,
          'Accept': 'application/json'
        }
      }; 
  
      const res = await api.patch(
        `/calendarevents/calendarevents/${eventData.id}/`,
        eventData, // Pass the updated eventData as the request body
        config
      );
  
      dispatch({ type: UPDATE_CALENDAR_EVENT_SUCCESS, payload: res.data }); // Use res.data as the payload
  
    } catch (error) {
      // Handle error
    }
  };
  
export const loadCalendarEventsByUser = (userId) => async dispatch => {
    try {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    }; 
      const res = await api.get(`/calendarevents/calendarevents/list_by_user/?user_id=${userId}`, config);
      dispatch({ type: LOAD_CALENDAR_EVENTS_SUCCESS, payload: res.data });
      
    } catch (error) {
      // Handle error
    }
  };
  
  export const loadCalendarEventsByGroup = (groupId) => async dispatch => {
    try {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    }; 
      const res = await api.get(`/calendarevents/calendarevents/list_by_group/?group_id=${groupId}`, config);
      dispatch({ type: LOAD_CALENDAR_EVENTS_BY_GROUP_SUCCESS, payload: res.data });
      
    } catch (error) {
      // Handle error
    }
  };



export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        }; 

        try {
            const res = await api.get(`/auth/users/me/`, config);
    
            dispatch({
                type: USER_LOADED_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
};


export const checkAuthenticated = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }; 

        const body = JSON.stringify({ token: localStorage.getItem('access') });

        try {
            const res = await api.post(`/auth/jwt/verify/`, body, config)

            if (res.data.code !== 'token_not_valid') {
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: AUTHENTICATED_FAIL
            });
        }

    } else {
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
};

export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await api.post(`/auth/jwt/create/`, body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(load_user());
    } catch (err) {
        console.log(err);
        dispatch({
            type: LOGIN_FAIL
        })
    }
};

export const signup = (first_name, last_name, email, role, about, password, re_password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ first_name, last_name, email, role, about, password, re_password });

    try {
        const res = await api.post(`/auth/users/`, body, config);
        //console.log(res.data.id);
        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: SIGNUP_FAIL
        })
    }
};

export const verify = (uid, token) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token });

    try {
        await api.post(`/auth/users/activation/`, body, config);

        dispatch({
            type: ACTIVATION_SUCCESS,
        });
    } catch (err) {
        dispatch({
            type: ACTIVATION_FAIL
        })
    }
};

export const reset_password = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        await api.post(`/auth/users/reset_password/`, body, config);

        dispatch({
            type: PASSWORD_RESET_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_FAIL
        });
    }
};

export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token, new_password, re_new_password });

    try {
        await api.post(`/auth/users/reset_password_confirm/`, body, config);

        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL
        });
    }
};

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
};