import React from 'react';

const CustomEvent = ({ event, onClick }) => {
  return (
    <div onClick={onClick}>
      <strong>{event.title}</strong>
    </div>
  );
};

export default CustomEvent;
