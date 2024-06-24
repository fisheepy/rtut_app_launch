import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css'; // Import your CSS file
import CustomEvent from './customEvent';
import CustomAgendaEvent from './customAgendaEvent';

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
      creator: event.creator,
      allDay: event.allDay || false,
      detail: event.detail || '',
    }));
  }, [data]);

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={formattedData}
        defaultView="month"
        startAccessor="start"
        endAccessor="end"
        style={{ height: '95%', width: '100%' }}
        tooltipAccessor={null}
        components={{
          event: CustomEvent, // Use the custom event component
          agenda: {
            event: CustomAgendaEvent
          },
        }}
        onNavigate={date => setCurrentDate(date)}
        onView={view => setView(view)}
        view={view}
        date={currentDate}
        min={new Date(2024, 1, 1, 8, 0)} // 8:00 AM
        max={new Date(2024, 1, 1, 18, 0)} // 6:00 PM
      />
    </div>
  );
};

export default CalendarComponent;
