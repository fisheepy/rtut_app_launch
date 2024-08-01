import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet } from 'react-native';
import commonStyles from './styles/commonStyles';

const PasswordResetForm = ({ route, navigation }) => {
    const { userId } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const styles = {
        container: { ...commonStyles.login.container, width: '100%', height: '100%', backgroundColor: '#eeeee4' },
        form: { ...commonStyles.login.form, width: '80%' },
        input: commonStyles.login.input,
        buttonContainer: { ...commonStyles.login.buttonContainer, width: '80%' },
        tabButton: { ...commonStyles.login.tabButton, width: '100%' },
        tabButtonText: commonStyles.login.tabButtonText,
        overview: { color: '#000', marginBottom: 10, fontSize: 20, textAlign: 'center' },
        rules: { color: '#000', fontSize: 18, marginBottom: 10, textAlign: 'center' },
    };

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            setModalMessage('Passwords do not match');
            setModalVisible(true);
            return;
        }

        if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword) || !/[@$!%*#?&]/.test(newPassword)) {
            setModalMessage('Password does not meet the required criteria');
            setModalVisible(true);
            return;
        }

        try {
            const response = await fetch('https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, newPassword }),
            });
            console.log(JSON.stringify({ userId, newPassword }));
            console.log(response);
            if (response.ok) {
                setModalMessage('Password reset successful');
                setModalVisible(true);
                setTimeout(() => {
                    setModalVisible(false);
                    navigation.navigate("Main");
                }, 2000);
            } else {
                console.error('Failed to reset password:', response.statusText);
                setModalMessage('Failed to reset password');
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setModalMessage('An error occurred while resetting password');
            setModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.overview}>
                    You are required to reset your password before proceeding.
                </Text>
                <Text style={styles.rules}>
                    Password must be at least 8 characters long and include:
                    {"\n"}- At least one letter (A-Z or a-z)
                    {"\n"}- At least one number (0-9)
                    {"\n"}- At least one special character (@$!%*#?&)
                </Text>
                <TextInput
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                    style={styles.input}
                />
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={styles.tabButton}
                        title="Submit"
                        onPress={handlePasswordReset}>
                        <Text style={styles.tabButtonText}>Submit</Text>
                    </Pressable>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <Text style={modalStyles.modalText}>{modalMessage}</Text>
                        <Pressable
                            style={[modalStyles.button, modalStyles.buttonClose]}
                            onPress={() => setModalVisible(false)}
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

export default PasswordResetForm;
