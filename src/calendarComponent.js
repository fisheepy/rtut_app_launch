import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';
import CustomEvent from './customEvent';
import CustomAgendaEvent from './customAgendaEvent';
import { Modal, StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ data }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [userFirstName, setUserFirstName] = useState(null);  // Store the user ID here
  const [userLastName, setUserLastName] = useState(null);  // Store the user ID here

  // Fetch user ID from AsyncStorage on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userFirstName = await AsyncStorage.getItem('userFirstName');
        const userLastName = await AsyncStorage.getItem('userLastName');

        setUserFirstName(userFirstName);
        setUserLastName(userLastName);

      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserId();
  }, []);

  // Filter events based on the current view and employees list
  const filteredData = useMemo(() => {
    let start, end;

    if (view === Views.AGENDA) {
      start = moment(currentDate).startOf('month').toDate();
      end = moment(currentDate).endOf('month').toDate();
    } else {
      start = moment(currentDate).startOf(view).toDate();
      end = moment(currentDate).endOf(view).toDate();
    }
    // Filter based on employees
    return data.filter(event => {
      const eventStart = new Date(event.startDate);
      // If event has employees field, check if the user's ID is in employees.username
      if (event.employees && event.employees.length > 0) {
        return eventStart >= start && eventStart <= end && event.employees.some(emp => emp.firstName === userFirstName && emp.lastName === userLastName);
      }
      else{
        return eventStart >= start && eventStart <= end;
      }     
    });
  }, [data, view, currentDate, userFirstName]);  // Ensure userId is included in dependencies

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
    if (view === Views.MONTH) {
      setPreviewEvent(event);
      setPreviewVisible(true);
      return;
    }
    openEventDetails(event);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);

    if (view === Views.AGENDA) {
      const endOfMonth = moment(date).endOf('month');
      const daysLeft = endOfMonth.diff(date, 'days');
      
      if (daysLeft < 7) {
        setCurrentDate(moment(date).add(1, 'months').startOf('month').toDate());
      } else {
        setCurrentDate(date);
      }
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setPreviewVisible(false);
    if (newView === Views.AGENDA) {
      setCurrentDate(moment(currentDate).startOf('month').toDate());
    }
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
    setPreviewVisible(false);
  };

  const formatEventRange = (event) => {
    if (!event?.start || !event?.end) return '';
    const start = moment(event.start);
    const end = moment(event.end);
    if (event.allDay) {
      return `All day · ${start.format('MMM D')}`;
    }
    return `${start.format('MMM D, HH:mm')} - ${end.format('HH:mm')}`;
  };

  const handlePreviewOpenDetails = () => {
    if (previewEvent) {
      openEventDetails(previewEvent);
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={formattedData}
        views={[Views.DAY, Views.MONTH, Views.AGENDA]}
        view={view}
        date={currentDate}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width: '100%' }}
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
        onSelectEvent={handleEventClick}
        min={new Date(2024, 1, 1, 8, 0)}
        max={new Date(2024, 1, 1, 18, 0)}
        step={30}
        timeslots={2}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={previewVisible}
        onRequestClose={() => setPreviewVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPreviewVisible(false)}>
          <View style={modalStyles.previewOverlay}>
            <TouchableWithoutFeedback>
              <View style={modalStyles.previewCard}>
                <Text style={modalStyles.previewTitle}>{previewEvent?.title || 'Untitled event'}</Text>
                <Text style={modalStyles.previewMeta}>{formatEventRange(previewEvent)}</Text>
                {!!previewEvent?.location && (
                  <Text style={modalStyles.previewMeta}>Location: {previewEvent.location}</Text>
                )}
                <Pressable style={modalStyles.previewButton} onPress={handlePreviewOpenDetails}>
                  <Text style={modalStyles.previewButtonText}>Open details</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
  previewOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  previewCard: {
    width: '86%',
    maxWidth: 360,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#dbe3ef',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  previewMeta: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 4,
  },
  previewButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#003462',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  previewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
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
