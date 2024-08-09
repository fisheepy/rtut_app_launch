import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css'; // Import your CSS file
import CustomEvent from './customEvent';
import CustomAgendaEvent from './customAgendaEvent';
import { Modal, StyleSheet, Text, View, Pressable } from 'react-native';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ data }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH); // Use Views constant for consistency
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter events based on the current view
  const filteredData = useMemo(() => {
    if (view === Views.AGENDA) {
      const startOfMonth = moment(currentDate).startOf('month').toDate();
      const endOfMonth = moment(currentDate).endOf('month').toDate();
      return data.filter(event =>
        new Date(event.startDate) >= startOfMonth && new Date(event.startDate) <= endOfMonth
      );
    }
    return data;
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

  useEffect(() => {
    // When the view changes to agenda, update the current date to the start of the month
    if (view === Views.AGENDA) {
      setCurrentDate(moment(currentDate).startOf('month').toDate());
    }
  }, [view]);

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={formattedData}
        defaultView={Views.MONTH}
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
        onNavigate={date => setCurrentDate(date)}
        onView={view => setView(view)}
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
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>Title: {selectedEvent?.title}</Text>
            <Text style={modalStyles.modalText}>Location: {selectedEvent?.location}</Text>
            <Text style={modalStyles.modalText}>Creator: {selectedEvent?.creator}</Text>
            <Text style={modalStyles.modalText}>Details: {selectedEvent?.detail}</Text>
            <Pressable
              style={[modalStyles.button, modalStyles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={modalStyles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </div>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default CalendarComponent;
