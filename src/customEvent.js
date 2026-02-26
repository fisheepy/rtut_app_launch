// CustomEvent.js
import React from 'react';

const CustomEvent = ({ event, onClick }) => {
  return (
    <div
      className="custom-event"
      style={{
        cursor: 'pointer',
        borderRadius: '4px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px',
      }}
      onClick={() => {
        onClick(event);
      }}
    >
      <span className="event-title">{event.title}</span>
    </div>
  );
};

export default CustomEvent;
