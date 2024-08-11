import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css'; // Import your CSS file
import CustomEvent from './customEvent';
import CustomAgendaEvent from './customAgendaEvent';
import { Modal, StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback } from 'react-native';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ data }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH); // Default to month view
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter events based on the current view
  const filteredData = useMemo(() => {
    const start = moment(currentDate).startOf(view).toDate();
    const end = moment(currentDate).endOf(view).toDate();

    return data.filter(event => {
      const eventStart = new Date(event.startDate);
      return eventStart >= start && eventStart <= end;
    });
  }, [data, view, currentDate]);

  const formattedData = useMemo(() => {
    return filteredData.map(event => ({
      ...event,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      title: event.title,
      location: event.location,
      creator: event.creator,
      allDay: event.allDay || false,
      detail: event.detail || '',
    }));
  }, [filteredData]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={formattedData}
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.WEEK, Views.DAY]} // Disable agenda view by not including it here
        startAccessor="start"
        endAccessor="end"
        style={{ height: '95%', width: '100%' }}
        tooltipAccessor={null}
        components={{
          event: (props) => (
            <CustomEvent {...props} onClick={() => handleEventClick(props.event)} />
          ),
          agenda: {
            event: CustomAgendaEvent
          },
        }}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        view={view}
        date={currentDate}
        min={new Date(2024, 1, 1, 8, 0)} // 8:00 AM
        max={new Date(2024, 1, 1, 18, 0)} // 6:00 PM
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={modalStyles.overlay}>
            <TouchableWithoutFeedback>
              <View style={modalStyles.modalView}>
                <ScrollView contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}>
                  <Text style={modalStyles.modalHeadline}>Title: {selectedEvent?.title}</Text>
                  <Text style={modalStyles.modalHeadline}>Location: {selectedEvent?.location}</Text>
                  <Text style={modalStyles.modalText}>Creator: {selectedEvent?.creator}</Text>
                  <Text style={modalStyles.modalText}>Details: {selectedEvent?.detail}</Text>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </div>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: '75%',
    minHeight: 200,
    maxHeight: '80%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeadline: {
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    width: "100%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "justify",
    lineHeight: 20,
    width: '100%',
  }
});

export default CalendarComponent;
