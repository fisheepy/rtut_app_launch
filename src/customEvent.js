import React from 'react';

const CustomEvent = ({ event, onClick }) => {
  return (
    <div onClick={onClick}>
      <span>{event.title}</span>
    </div>
  );
};

export default CustomEvent;
