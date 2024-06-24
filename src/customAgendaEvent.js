import React from 'react';

const CustomAgendaEvent = ({ event }) => (
    <div style={{ marginTop: '10px' }}>
        <div>
            <strong>Title:</strong> {event.title}
        </div>
        <div>
            <strong>Location:</strong> {event.location || 'N/A'}
        </div>
        <div>
            <strong>Created by:</strong> {event.creator || 'Unknown'}
        </div>
        <div>
            <strong>Detail:</strong> {event.detail || 'No details provided'}
        </div>
    </div>
);

export default CustomAgendaEvent;
