import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill'; // Import the ReactQuill component
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal'; // Import the react-modal library
import { updateCalendarEvent, addCalendarEvent, deleteCalendarEvent, 
  updateUserEventStatus, addUserEventStatus, deleteUserEventStatus, addGroupCalendarEvent } from '../actions/auth';
import { connect } from 'react-redux';
import api from '../actions/api-config';

const localizer = momentLocalizer(moment);

const MyCalendar = ({ events, user, group, groupName, readOnly, usersInGroup, updateCalendarEvent, addCalendarEvent, deleteCalendarEvent,
                     updateUserEventStatus, addUserEventStatus, deleteUserEventStatus, addGroupCalendarEvent }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventStatus, setSelectedEventStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  const [eventData, addEventData] = useState({
    date: '', // Set an appropriate initial date value
    description: '',
    comments: '',
    title: '', 
    coach: null,
    group: group,
    user: user,
    type: '', 
  });
  

  useEffect(() => {
    if (events && events.length > 0) {
      const allDayEvents = events.map(event => ({
        ...event,
        start: moment(event.date).startOf('day').toDate(), // Adjust to start of day
        end: moment(event.date).endOf('day').toDate(), // Adjust to end of day
        allDay: true, // Set allDay to true for full-day events
      }));

      setCalendarEvents(allDayEvents);
    }
  }, [events]);


  const openAddEventModal = (clickedDate) => {
    const formattedDate = clickedDate.toISOString().split('T')[0];
    addEventData({
      ...eventData,
      date: formattedDate,
    });
    setIsAddEventModalOpen(true);
  };

  const closeAddEventModal = () => {
    setIsAddEventModalOpen(false);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    // Dispatch the action to add the event to the Redux store
    var response;
    if(!usersInGroup){

    response = await addCalendarEvent(eventData, user);
    const newEvent = {
      ...eventData,
      start: new Date(eventData.date), // Convert date to Date object
      end: new Date(eventData.date), // Set end time (adjust as needed)
      allDay: true, // Set allDay to true for full-day events
    };

    setCalendarEvents([...calendarEvents, newEvent]);

    const newUserEventStatus = {
      user: user.id,
      event: response.id, // Use the ID of the newly created CalendarEvent
      complete: false, // Adjust this value as needed
    };

    // Dispatch the action to add the UserEventStatus
    addUserEventStatus(newUserEventStatus);

    // Clear the eventData state to reset the form
    addEventData({
      date: '',
      description: '',
      comments: '',
      title: '',
      coach: null,
      group: group,
      user: user,
      type: '', 
    });
  
      closeAddEventModal();
    }
    else{
      response = await addGroupCalendarEvent(eventData, user, usersInGroup);
      const newEvent = {
        ...eventData,
        start: new Date(eventData.date), // Convert date to Date object
        end: new Date(eventData.date), // Set end time (adjust as needed)
        allDay: true, // Set allDay to true for full-day events
      };
  
      setCalendarEvents([...calendarEvents, newEvent]);
  
      // Clear the eventData state to reset the form
      addEventData({
        date: '',
        description: '',
        comments: '',
        title: '',
        coach: null,
        group: group,
        user: user,
        type: '', 
      });
  
      closeAddEventModal();
    }

  };

  const handleEventClick = async (event) => {
    setSelectedEvent(event);
    
    try {
      // Fetch UserEventStatus for the selected event and user
      const response = await api.get(
        `/calendarevents/usereventstatuses/?event=${event.id}`,
        {
          headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
          },
        }
      );
      if (response.data.length >= 1) {
        if(readOnly){
          const filteredData = response.data.filter(item => {
            return item.user === user.id;
          });
          setSelectedEventStatus(filteredData[0]);
        }
        else{
          console.log(response.data);
          if(group){
            setSelectedEventStatus(response.data);
          }
          else{
          setSelectedEventStatus(response.data[0]);
          }
        }
      }
      else {
        setSelectedEventStatus(null);
      }

      setIsModalOpen(true); // Open the modal
    } catch (error) {
      // Handle error
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedEvent(null); // Clear selectedEvent
    setSelectedEventStatus(null); // Clear selectedEvent
  };

  const handleEventEditSubmit = (e) => {
    e.preventDefault();

    // Dispatch the action to update the event
    updateCalendarEvent(selectedEvent);

    if (selectedEventStatus) {
      updateUserEventStatus(selectedEventStatus);
    } else {
      // Handle the case where UserEventStatus doesn't exist yet
      // You can create a new UserEventStatus here
      addUserEventStatus({
        user: user.id,
        event: selectedEvent.id,
        complete: selectedEventStatus.complete,
      });
    }

    // Close the modal
    handleCloseModal();
  };

  const handleDeleteEvent = (e) => {
    e.preventDefault();
    // Dispatch the action to delete the event
    deleteCalendarEvent(selectedEvent.id); // Assuming you have a deleteCalendarEvent action
  // Remove the deleted event from the calendarEvents state

  // Check if UserEventStatus exists and delete it
  if (selectedEventStatus) {
    deleteUserEventStatus(selectedEventStatus.id);
  }
  setCalendarEvents((prevEvents) =>
    prevEvents.filter((event) => event.id !== selectedEvent.id)
  );
    // Close the modal
    handleCloseModal();
  };
  
  const handleEventStyleGetter = (event) => {
    const typeColorMap = {
      'Breathing': 'blue',
      'Focus/Concentration': 'green',
      'Stress Management': 'orange',
      'Reflection': 'brown',
      'Imagery/Visualization': 'red',
      'Goal Setting': 'purple',
    };

    
    return {
      style: {
        backgroundColor: typeColorMap[event.type],
      },
    };
  };


  const customToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() - 1);
      toolbar.onNavigate('prev');
    };
  
    const goToNext = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() + 1);
      toolbar.onNavigate('next');
    };
  
    const goToCurrent = () => {
      const now = new Date();
      toolbar.date.setMonth(now.getMonth());
      toolbar.date.setYear(now.getFullYear());
      toolbar.onNavigate('current');
    };
  
    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
      );
    };
  
    return (
    <div className="container">
      <div className="row align-items-center">
      <div className="col-md-4 align-self-center"> {/* Adjust column size as needed */}
          <h2 className="mb-4">
            {group ? `${groupName}`: `${user.first_name} ${user.last_name}`}'s Calendar
          </h2>
        </div>
        <div className="col-md-4 text-center"> {/* Adjust column size as needed */}
          <h2 className="mb-4">{label()}</h2>
        </div>
        <div className="col-md-4 text-right"> {/* Adjust column size as needed */}
          <button className="btn btn-primary mr-2" hidden={readOnly} onClick={() => openAddEventModal(new Date())}>Add Event</button>
          <button className="btn btn-secondary mr-2" onClick={goToBack}>&#8249; Back</button>
          <button className="btn btn-primary mr-2" onClick={goToCurrent}>Today</button>
          <button className="btn btn-secondary" onClick={goToNext}>Next &#8250;</button>
          <div hidden={readOnly}>
        
      </div>
        </div>
      </div>
    </div>
    );
  };

  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)', // Change overlay background color and opacity
      zIndex: 1000, // Set a higher z-index to ensure modal is on top of other elements
    },
    content: {
      width: '60%', // Set the width of the modal
      maxWidth: '500px', // Set a maximum width
      margin: '0 auto', // Center the modal horizontally
      padding: '20px', // Add padding for better spacing
    },
  };

  return (
    <div>
    <style>
  {`
    .rbc-month-row {
      display: inline-table !important;
      height: 50px !important;
    }
  `}
    </style>
      

      <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          titleAccessor={(event) => (
            <>
              <div style={{ fontSize: '14px', textAlign: 'center' }}>{event.type}</div>
              <div style={{ fontSize: '12px', textAlign: 'left', overflow: 'visible', whiteSpace: 'wrap' }}>{event.title}</div>
              <div style={{ fontSize: '12px', textAlign: 'left', overflow: 'visible', whiteSpace: 'wrap' }}>{event.description}</div>
            </>
          )}
          style={{ color: 'black' }}
          selectable
          onSelectSlot={readOnly ? null : (slotInfo) => openAddEventModal(slotInfo.start)}
          onSelectEvent={handleEventClick}
          views={['month' ]}
          eventPropGetter={handleEventStyleGetter}
          components={{
            toolbar: customToolbar,
          }}
          popup={true}
        />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Event Details"
        style={modalStyles}
      >
       <form onSubmit={handleEventEditSubmit}>
          {selectedEvent && (
            <div className="event-details">
              <h3>{selectedEvent.title}</h3>
              <div className="form-check">
                  {readOnly ? (
                      // Render checkbox for read-only false
                      <div>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="completeCheckbox"
                            checked={selectedEventStatus ? selectedEventStatus.complete : false}
                            onChange={(e) =>
                                setSelectedEventStatus({
                                    ...selectedEventStatus,
                                    complete: e.target.checked,
                                })
                            }
                        />
                        <label className="form-check-label" htmlFor="completeCheckbox">
                            Complete
                        </label>
                      </div>
                  ) : (
                    <div>
                      {selectedEvent.group === null ? (
                        // Display individual completion status
                        selectedEventStatus && selectedEventStatus.complete
                          ? "Event completed"
                          : "Not completed yet"
                      ) : (
                        // Display group completion information
                        selectedEventStatus ? (
                          <React.Fragment>
                                <ul>
                                  {selectedEventStatus.map((status) => {
                                    // Find the user object with matching ID
                                    const matchedUser = usersInGroup.find((user) => user.id === status.user);

                                    return (
                                      <li key={status.id}>
                                        <p>{`${matchedUser ? matchedUser.first_name + ' ' + matchedUser.last_name : 'Error finding name'}`}: {status.complete ? "Event completed" : "Not completed yet"}</p>
                                      </li>
                                    );
                                  })}
                                </ul>
                          </React.Fragment>
                        ) : (
                          // Handle case when selectedEventStatus is not available
                          <p>Completion status not available</p>
                        )
                      )}
                    </div>
                  )}
              </div>
              <div className="form-group">
                <label htmlFor="descriptionTextarea">Description:</label>
                <textarea
                  className="form-control"
                  readOnly={readOnly}
                  id="descriptionTextarea"
                  value={selectedEvent.description}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button onClick={handleCloseModal} className="btn btn-secondary mx-2" >Close</button>
              <button onClick={handleDeleteEvent} className="btn btn-danger" hidden={readOnly}>Delete Event</button>
            </div>
          )}
        </form>

      </Modal>
      <Modal
        isOpen={isAddEventModalOpen}
        onRequestClose={closeAddEventModal}
        contentLabel="Add Event"
        style={modalStyles}
      >
       <form onSubmit={handleAddEvent}>
          <div className="event-add-details">
            <h3>Add New Event</h3>
            <div className="form-group">
              <label htmlFor="dateInput">Date:</label>
              <input
                className="form-control"
                type="date"
                id="dateInput"
                value={eventData.date || ''}
                onChange={(e) =>
                  addEventData({
                    ...eventData,
                    date: e.target.value,
                  })
                }
                required // Mark the field as required
              />
            </div>
            <div className="form-group">
              <label htmlFor="titleInput">Title:</label>
              <input
                className="form-control"
                type="text"
                id="titleInput"
                value={eventData.title || ''}
                onChange={(e) =>
                  addEventData({
                    ...eventData,
                    title: e.target.value,
                  })
                }
                required // Mark the field as required
              />
            </div>
            <div className="form-group">
              <label htmlFor="typeSelect">Type:</label>
              <select
                className="form-control"
                id="typeSelect"
                value={eventData.type || ''}
                onChange={(e) =>
                  addEventData({
                    ...eventData,
                    type: e.target.value,
                  })
                }
              >
                <option value="">Select Type</option>
                <option value="Breathing">Breathing</option>
                <option value="Focus/Concentration">Focus/Concentration</option>
                <option value="Stress Management">Stress Management</option>
                <option value="Reflection">Reflection</option>
                <option value="Imagery/Visualization">Imagery/Visualization</option>
                <option value="Goal Setting">Goal Setting</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="descriptionTextarea">Description:</label>
              <textarea
                className="form-control"
                id="descriptionTextarea"
                value={eventData.description || ''}
                onChange={(e) =>
                  addEventData({
                    ...eventData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            {/* <div className="form-group">
              <label htmlFor="descriptionTextarea">Description:</label>
              <ReactQuill
                theme="snow" 
                value={eventData.description || ''}
                onChange={(value) =>
                  addEventData({
                    ...eventData,
                    description: value,
                  })
                }
              />
            </div> */}
            <button type="submit" className="btn btn-primary mx-2">Add Event</button>
            <button onClick={closeAddEventModal} className="btn btn-secondary mx-2">Close</button>
          </div>
        </form>

      </Modal>

    </div>
        </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateCalendarEvent: (eventData) => dispatch(updateCalendarEvent(eventData)),
  addCalendarEvent: (eventData, user) => dispatch(addCalendarEvent(eventData, user)),
  deleteCalendarEvent: (eventData) => dispatch(deleteCalendarEvent(eventData)),
  addGroupCalendarEvent: (eventData, user, usersInGroup) => dispatch(addGroupCalendarEvent(eventData, user, usersInGroup)),
  addUserEventStatus: (userEventStatusData) => dispatch(addUserEventStatus(userEventStatusData)),
  deleteUserEventStatus: (userEventStatusData) => dispatch(deleteUserEventStatus(userEventStatusData)),
  updateUserEventStatus: (userEventStatusData) => dispatch(updateUserEventStatus(userEventStatusData)),
});

export default connect(null, mapDispatchToProps)(MyCalendar);
