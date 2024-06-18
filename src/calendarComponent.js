import React, { useState } from 'react';
import {
  Scheduler,
  WeekView,
  MonthView,
  DayView,
  Appointments,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';

function CalendarComponent({ data }) {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));

  const TooltipContent = ({ appointmentData, ...restProps }) => (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
      <div style={{ marginTop: '10px' }}>
        <div>
          <strong>Location:</strong> {appointmentData.location || 'N/A'}
        </div>
        <div>
          <strong>Created by:</strong> {appointmentData.creator || 'Unknown'}
        </div>
      </div>
    </AppointmentTooltip.Content>
  );

  return (
    <Scheduler data={data} locale="en-US">
      <ViewState currentDate={currentDate} onCurrentDateChange={setCurrentDate} />
      <MonthView />
      <WeekView startDayHour={8} endDayHour={20} />
      <DayView startDayHour={8} endDayHour={20} />
      <Toolbar />
      <DateNavigator />
      <ViewSwitcher />
      <Appointments />
      <AppointmentTooltip contentComponent={TooltipContent} showCloseButton />
    </Scheduler>
  );
}

export default CalendarComponent;
