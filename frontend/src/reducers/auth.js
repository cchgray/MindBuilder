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
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    FACEBOOK_AUTH_SUCCESS,
    FACEBOOK_AUTH_FAIL,
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
    INVITE_USER_FAILURE,

} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    calendarEvents: [],
    usersByCoach: [],
    groupsAssignedToCoach: [],
    groupsAssignedToUser: [],
    usersInGroup: [],
    groupInfo: null,
    userEventStatuses: [], 
    coachNotesOnUser: null,
    failedLogin: false,
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    // ...other reducer cases
 
    switch(type) {
    case INVITE_USER_SUCCESS:
    case INVITE_USER_FAILURE:
    case REMOVE_COACH_ASSIGNMENT_SUCCESS:
      return {
        ...state,
        usersByCoach: state.usersByCoach.filter(user => user.id !== action.payload.userId),
      };
    case REMOVE_COACH_ASSIGNMENT_FAILURE:
      return {
        ...state,
        usersByCoach: null,
      };
    case UPDATE_NOTES_SUCCESS:
        return {
            ...state,
            coschnotesOnUser: action.payload,
        };
    case UPDATE_NOTES_FAILURE:
        return {
            ...state,
            coachNotesOnUser: null,
        };
    case FETCH_NOTES_SUCCESS:
        return {
            ...state,
            coachNotesOnUser: action.payload,
    };
    case FETCH_NOTES_FAILURE:
        return {
            ...state,
            coachNotesOnUser: null,
    };
    case FETCH_GROUP_INFO_SUCCESS:
      return {
        ...state,
        groupInfo: action.payload,
      };
    case FETCH_GROUP_INFO_FAILURE:
      return {
        ...state,
        groupInfo: null,
      };
        case REMOVE_USER_FROM_GROUP_SUCCESS:
            return {
                ...state,
                // Update the usersInGroup array after successful removal
                usersInGroup: state.usersInGroup.filter(user => user.id !== action.payload.userId),
                // You may need to adjust the above line based on your data structure
            };
        case REMOVE_USER_FROM_GROUP_FAIL:
            return {
                ...state,
                // Handle failure if needed
            };
        case LOAD_USERS_IN_GROUP_SUCCESS:
            return {
                ...state,
                usersInGroup: action.payload,
            };

        case LOAD_USERS_IN_GROUP_FAIL:
            return {
                ...state,
                usersInGroup: [], // Set to an empty array on failure
            };

        case ADD_USER_TO_GROUP_SUCCESS:
            return {
                ...state,
                usersInGroup: [...state.usersInGroup, action.payload.user],
            };

        case ADD_USER_TO_GROUP_FAIL:
            return {
                ...state,
                // Handle failure as needed
            };
        case CREATE_GROUP_SUCCESS:
            return {
                ...state,
                groupsAssignedToCoach: [...state.groupsAssignedToCoach, action.payload], // Add the newly created group to the list
            };
        case DELETE_GROUP_SUCCESS:
        case LOAD_GROUPS_ASSIGNED_TO_COACH_SUCCESS:
            return {
                ...state,
                groupsAssignedToCoach: action.payload, // Set groupsAssignedToCoach to the payload containing assigned groups
            };
            case LOAD_GROUPS_ASSIGNED_TO_USER_SUCCESS:
            return {
                ...state,
                groupsAssignedToUser: action.payload, // Set groupsAssignedToCoach to the payload containing assigned groups
            };
        case CLEAR_CALENDAR_EVENTS:
            return {
              ...state,
              calendarEvents: [], // Reset calendarEvents to an empty array
            };
        case ACCEPT_COACH_REQUEST:
            return {
                ...state
            };
            case LOAD_USERS_BY_COACH_SUCCESS:
                return {
                    ...state,
                    usersByCoach: action.payload
                };
        case DELETE_CALENDAR_EVENT_SUCCESS:
            return {
                ...state,
                calendarEvents: state.calendarEvents.filter(
                (event) => event.id !== action.payload
                ),
            };
        case ADD_CALENDAR_EVENT_SUCCESS:
            return {
                ...state,
                calendarEvents: [...state.calendarEvents, action.payload],
            };
        case UPDATE_CALENDAR_EVENT_SUCCESS:
            return {
                ...state,
                calendarEvents: state.calendarEvents.map((event) =>
                event.id === action.payload.id ? action.payload : event
                ),
            };
            case DELETE_USER_EVENT_STATUS_SUCCESS:
      return {
        ...state,
        userEventStatuses: state.userEventStatuses.filter(
          (status) => status.id !== action.payload
        ),
      };
    case ADD_USER_EVENT_STATUS_SUCCESS:
      return {
        ...state,
        userEventStatuses: [...state.userEventStatuses, action.payload],
      };
    case UPDATE_USER_EVENT_STATUS_SUCCESS:
      return {
        ...state,
        userEventStatuses: state.userEventStatuses.map((status) =>
          status.id === action.payload.id ? action.payload : status
        ),
      };
            case LOAD_CALENDAR_EVENTS_SUCCESS: // Handle the new action type
            return {
              ...state,
                calendarEvents: payload,
            };
            case LOAD_CALENDAR_EVENTS_BY_GROUP_SUCCESS: // Handle the new action type
            return {
              ...state,
                calendarEvents: payload,
            };
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case LOGIN_SUCCESS:
        case GOOGLE_AUTH_SUCCESS:
        case FACEBOOK_AUTH_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload,
                failedLogin: false
            }
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false
            }
        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null
            }
        case GOOGLE_AUTH_FAIL:
        case FACEBOOK_AUTH_FAIL:
        case LOGIN_FAIL:
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                failedLogin: true
            }
        case SIGNUP_FAIL:
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }
        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case PASSWORD_RESET_CONFIRM_FAIL:
        case ACTIVATION_SUCCESS:
        case ACTIVATION_FAIL:
            return {
                ...state
            }
        default:
            return state
    }
};