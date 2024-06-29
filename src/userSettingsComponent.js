import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, Alert, StyleSheet } from 'react-native';
import { VscFeedback } from "react-icons/vsc";
import { GiConfirmed, GiCancel } from "react-icons/gi";
import commonStyles from './styles/commonStyles';
import axios from 'axios';

const UserSettingsComponent = () => {
    const [expanded, setExpanded] = useState(false);
    const [name, setName] = useState('');
    const [feedback, setFeedback] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleFeedbackSubmit = () => {
        if (!name.trim() || !feedback.trim()) {
            setModalMessage('Please fill in all fields');
            setMessageModalVisible(true);
            return;
        }

        const feedbackEndpoint = 'https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/submit-feedback';

        axios.post(feedbackEndpoint, { name, feedback })
            .then((response) => {
                setModalMessage('Thank you for your feedback!');
                setName('');
                setFeedback('');
                setModalVisible(false);
            })
            .catch((error) => {
                setModalMessage('Failed to submit feedback. Please try again.');
                console.error('Feedback submission error:', error);
            })
            .finally(() => {
                setMessageModalVisible(true);
            });
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={commonStyles.useSetting.container}>
            <Pressable onPress={() => setExpanded(!expanded)}>
                <Text style={commonStyles.useSetting.toggleText}>{expanded ? 'Collapse' : 'User Settings'}</Text>
            </Pressable>

            {expanded && (
                <Pressable
                    style={commonStyles.useSetting.feedbackButton}
                    onPress={() => setModalVisible(true)}
                >
                    <VscFeedback />
                    <Text style={commonStyles.useSetting.linkText}>User Feedback</Text>
                </Pressable>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={commonStyles.useSetting.centeredView}>
                    <View style={commonStyles.useSetting.modalView}>
                        <TextInput
                            style={commonStyles.useSetting.nameInput}
                            onChangeText={setName}
                            value={name}
                            placeholder="Your Name"
                        />
                        <TextInput
                            style={commonStyles.useSetting.feedbackInput}
                            onChangeText={setFeedback}
                            value={feedback}
                            placeholder="Type your feedback here..."
                            multiline
                        />
                        <View style={commonStyles.useSetting.buttonGroup}>
                            <Pressable
                                style={commonStyles.useSetting.Button}
                                onPress={handleFeedbackSubmit}
                            >
                                <GiConfirmed
                                    style={commonStyles.useSetting.button}
                                    fontSize={40}
                                    color='green'
                                />
                            </Pressable>
                            <Pressable
                                style={commonStyles.useSetting.Button}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <GiCancel
                                    style={{ ...commonStyles.useSetting.button, pointerEvents: "none" }}
                                    fontSize={40}
                                />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={messageModalVisible}
                onRequestClose={() => setMessageModalVisible(!messageModalVisible)}
            >
                <View style={commonStyles.useSetting.centeredView}>
                    <View style={commonStyles.useSetting.modalView}>
                        <Text style={commonStyles.useSetting.modalText}>{modalMessage}</Text>
                        <Pressable
                            style={[commonStyles.useSetting.Button, { backgroundColor: '#2196F3' }]}
                            onPress={() => setMessageModalVisible(!messageModalVisible)}
                        >
                            <Text style={commonStyles.useSetting.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
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

export default UserSettingsComponent;
