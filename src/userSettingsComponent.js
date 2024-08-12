import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, StyleSheet } from 'react-native';
import { VscFeedback } from "react-icons/vsc";
import { GiConfirmed, GiCancel } from "react-icons/gi";
import { GrUpdate } from "react-icons/gr";
import commonStyles from './styles/commonStyles';
import UsefulLinksComponent from './usefulLinksComponent';

const UserSettingsComponent = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [feedback, setFeedback] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const handleFeedbackSubmit = async () => {
        if (!name.trim() || !feedback.trim()) {
            setModalMessage('Please fill in all fields');
            setMessageModalVisible(true);
            return;
        }

        try {
            const response = await fetch('https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/submit-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, feedback }),
            });

            if (response.ok) {
                setModalMessage('Thank you for your feedback!');
                setName('');
                setFeedback('');
                setModalVisible(false);
            } else {
                setModalMessage('Failed to submit feedback. Please try again.');
                console.error('Feedback submission error:', response.statusText);
            }
        } catch (error) {
            setModalMessage('Failed to submit feedback. Please try again.');
            console.error('Feedback submission error:', error);
        } finally {
            setMessageModalVisible(true);
        }
    };

    return (
        <View style={commonStyles.useSetting.container}>
            {/* Update App Button */}
            <View style={commonStyles.useSetting.iconLink}>
                <Pressable onPress={() => window.open('https://apps.apple.com/app/rtut/id6547833065/', '_blank')}>
                    <GrUpdate style={{ fontSize: 36, color: '#FF5733' }} />
                </Pressable>
                <Text style={commonStyles.useSetting.linkText}>Update App</Text>
            </View>

            {/* User Feedback Button */}
            <Pressable
                style={commonStyles.useSetting.feedbackButton}
                onPress={() => {
                    console.log("Feedback button pressed");
                    setModalVisible(true);
                }}
            >
                <VscFeedback />
                <Text style={commonStyles.useSetting.linkText}>User Feedback</Text>
            </Pressable>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <TextInput
                            style={[commonStyles.useSetting.nameInput, modalStyles.input]}
                            onChangeText={setName}
                            value={name}
                            placeholder="Your Name"
                        />
                        <TextInput
                            style={[commonStyles.useSetting.feedbackInput, modalStyles.input, modalStyles.textArea]}
                            onChangeText={setFeedback}
                            value={feedback}
                            placeholder="Type your feedback here..."
                            multiline
                        />
                        <View style={commonStyles.useSetting.buttonGroup}>
                            <Pressable
                                style={commonStyles.useSetting.Button}
                                onPress={() => {
                                    console.log("Confirmed button pressed");
                                    handleFeedbackSubmit();
                                }}
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

            {/* Message Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={messageModalVisible}
                onRequestClose={() => setMessageModalVisible(!messageModalVisible)}
            >
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <Text style={modalStyles.modalText}>{modalMessage}</Text>
                        <Pressable
                            style={[modalStyles.button, { backgroundColor: '#2196F3' }]}
                            onPress={() => setMessageModalVisible(!messageModalVisible)}
                        >
                            <Text style={modalStyles.textStyle}>Close</Text>
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
        elevation: 5,
        width: '80%',
        height: '80%',
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
    },
    textArea: {
        height: 500,
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
