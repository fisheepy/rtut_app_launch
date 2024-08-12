// CustomEvent.js
import React from 'react';

const CustomEvent = ({ event, onClick }) => {
  return (
    <div
      className="custom-event"
      style={{
        cursor: 'pointer',
        borderRadius: '4px',
        height: '100%', // Ensure the height covers the entire event slot
        display: 'flex',
      }}
      onClick={() => {
        console.log('Event clicked:', event);
        onClick(event);
      }}
    >
      <span className="event-title">{event.title}</span>
    </div>
  );
};

export default CustomEvent;
