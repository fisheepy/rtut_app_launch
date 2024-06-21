import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ data }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');

  const formattedData = useMemo(() => {
    return data.map(event => ({
      ...event,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      title: event.title,
      location: event.location,
      creator: event.creator
    }));
  }, [data]);

  const EventTooltip = ({ event }) => (
    <div style={{ marginTop: '10px' }}>
      <div>
        <strong>Location:</strong> {event.location || 'N/A'}
      </div>
      <div>
        <strong>Created by:</strong> {event.creator || 'Unknown'}
      </div>
    </div>
  );

  return (
    <div style={{ height: '70vh', width: '700px', margin: '0 auto' }}>
      <Calendar
        localizer={localizer}
        events={formattedData}
        defaultView="month"
        startAccessor="start"
        endAccessor="end"
        style={{ height: '70vh' }}
        tooltipAccessor={null}
        components={{
          event: EventTooltip,
        }}
        onNavigate={date => setCurrentDate(date)}
        onView={view => setView(view)}
        view={view}
        date={currentDate}
      />
    </div>
  );
};

export default CalendarComponent;
