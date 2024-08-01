import React, { useState } from 'react';
import { View, Text, Pressable, CheckBox, StyleSheet } from 'react-native';
import commonStyles from './styles/commonStyles';
import { useUser } from './context/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUniqueId } from './utils';

const DisclaimerForm = ({ navigation, windowDimensions }) => {
    const [isChecked, setIsChecked] = useState(false);
    const { userInfo } = useUser(); // Get userInfo from context

    const styles = {
        container: { ...commonStyles.login.container, width: windowDimensions.width, height: windowDimensions.height },
        form: { ...commonStyles.login.form, width: windowDimensions.width * 0.75 },
        header: commonStyles.login.header,
        text: commonStyles.login.text,
        checkboxContainer: { ...commonStyles.login.checkboxContainer, marginTop: 20 },
        checkbox: commonStyles.login.checkbox,
        buttonContainer: { ...commonStyles.login.buttonContainer, width: windowDimensions.width * 0.75 },
        tabButton: { ...commonStyles.login.tabButton, width: windowDimensions.width * 0.45, marginTop: 20 },
        tabButtonText: commonStyles.login.tabButtonText,
        disabledButton: { ...commonStyles.login.tabButton, width: windowDimensions.width * 0.45, marginTop: 20, backgroundColor: '#cccccc' }
    };

    const handleContinue = async () => {
        try {
            const response = await fetch('https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/accept-disclaimer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accepted: true, username: userInfo.username }), // Replace 'currentUserId' with the actual user ID
            });
            console.log(response);
            if (response.ok) {
                if (userInfo.passwordResetDate) {
                    await AsyncStorage.setItem('userFirstName', userInfo['First Name']);
                    await AsyncStorage.setItem('userLastName', userInfo['Last Name']);
                    const userId = generateUniqueId(
                        userInfo['First Name'].toUpperCase(),
                        userInfo['Last Name'].toUpperCase()
                    );
                    await AsyncStorage.setItem('userId', userId);
                    navigation.navigate("Main", {
                        userId: userInfo.username,
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName
                    });
                } else {
                    navigation.navigate("PasswordReset", { userId: userInfo.username });
                }
            } else {
                console.error('Failed to send acceptance to the backend:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending acceptance to the backend:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.header}>Disclaimer</Text>
                <Text style={styles.text}>This is a placeholder for the disclaimer page.</Text>
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={isChecked}
                        onValueChange={setIsChecked}
                        style={styles.checkbox}
                    />
                    <Text>I acknowledge and accept the terms.</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={isChecked ? styles.tabButton : styles.disabledButton}
                        onPress={() => {
                            if (isChecked) {
                                handleContinue();
                            }
                        }}
                        disabled={!isChecked}
                    >
                        <Text style={styles.tabButtonText}>Continue to App</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default DisclaimerForm;
