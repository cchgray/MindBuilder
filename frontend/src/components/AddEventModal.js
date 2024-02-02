import React, { useState } from 'react';

const AddEventModal = ({ isOpen, onClose, onAddEvent }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    comments: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEvent(eventData);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Comments</label>
            <div className="control">
              <textarea
                className="textarea"
                name="comments"
                value={eventData.comments}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-primary">
                Add Event
              </button>
            </div>
            <div className="control">
              <button className="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
     );
};

export default AddEventModal;
