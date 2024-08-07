import React, { useState } from 'react';
import { View, Text, Pressable, CheckBox, ScrollView } from 'react-native';
import commonStyles from './styles/commonStyles';
import { useUser } from './context/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUniqueId } from './utils';

const DisclaimerForm = ({ navigation, windowDimensions }) => {
  const [isChecked, setIsChecked] = useState(false);
  const { userInfo } = useUser(); // Get userInfo from context

  const styles = {
    container: { ...commonStyles.login.container, width: windowDimensions.width, height: windowDimensions.height },
    form: { ...commonStyles.login.form, width: windowDimensions.width * 0.95 },
    header: { ...commonStyles.login.header, marginTop: 50 },
    text: { ...commonStyles.login.text, fontSize: '12', textAlign: 'justify' },
    headline: { ...commonStyles.login.text, fontWeight: 'bold', textAlign: 'justify' },
    checkboxContainer: { ...commonStyles.login.checkboxContainer, flexDirection: 'row', alignItems: 'center', marginTop: 20 },
    checkbox: commonStyles.login.checkbox,
    buttonContainer: { ...commonStyles.login.buttonContainer, flexDirection: 'column', alignItems: 'center' },
    tabButton: { ...commonStyles.login.tabButton, width: windowDimensions.width * 0.45 },
    tabButtonText: commonStyles.login.tabButtonText,
    disabledButton: { ...commonStyles.login.tabButton, width: windowDimensions.width * 0.45, backgroundColor: '#cccccc' },
    returnButton: { ...commonStyles.login.tabButton, width: windowDimensions.width * 0.45, backgroundColor: '#be2528' }
  };

  const handleContinue = async () => {
    try {
      const response = await fetch('https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/accept-disclaimer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accepted: true, username: userInfo.username }),
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
            lastName: userInfo.lastName,
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
        <ScrollView>
          <Text style={styles.header}>Disclaimer for App Testing Participation</Text>
          <Text style={styles.text}>
            Thank you for participating in the testing phase of our new company app. Please read the following information carefully:
          </Text>
          <Text style={styles.headline}>1. Voluntary Participation:</Text>
          <Text style={styles.text}>
            Participation in this app testing is voluntary.
          </Text>
          <Text style={styles.headline}>2. Communication Consent:</Text>
          <Text style={styles.text}>
            By participating in this testing program, you agree to receive communications from the app, including but not limited to app notifications, text messages, and emails. These communications are necessary to ensure the effective testing and feedback process.
          </Text>
          <Text style={styles.headline}>3. Data Usage:</Text>
          <Text style={styles.text}>
            Any data collected during this testing phase will be used solely for the purpose of improving the app's functionality and user experience. We are committed to ensuring that your data is handled securely and in compliance with all relevant privacy laws.
          </Text>
          <Text style={styles.headline}>4. Feedback:</Text>
          <Text style={styles.text}>
            Your feedback is invaluable in helping us refine the app. We encourage you to report any issues or suggestions you may have during the testing period.
          </Text>
          <Text style={styles.headline}>5. No Guarantee of Performance:</Text>
          <Text style={styles.text}>
            This app is in the testing phase and may not function as intended. There may be bugs or issues that we are actively working to resolve.
          </Text>
          <Text style={styles.headline}>6. No Expectation of Taking Any Action Out of Working Hours:</Text>
          <Text style={styles.text}>
            Notifications will not be sent outside normal working hours unless there is an urgent message or a technical delay. There is no expectation for you to view items or take action outside normal working hours.
          </Text>
          <Text style={styles.headline}>7. Termination of Participation:</Text>
          <Text style={styles.text}>
            You can terminate your participation in this testing phase at any time by notifying the testing team.
          </Text>
          <Text style={styles.headline}>8. Contact Information:</Text>
          <Text style={styles.text}>
            If you have any questions or need assistance during the testing phase, please contact our support team by clicking "User Settings – User Feedback" in the app.
          </Text>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isChecked}
              onValueChange={setIsChecked}
              style={styles.checkbox}
            />
            <Text style={styles.text}>
              By proceeding with the app installation and usage, you acknowledge that you have read, understood, and agree to the terms outlined in this disclaimer.
            </Text>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Pressable
            style={isChecked ? styles.tabButton : styles.disabledButton}
            onPress={handleContinue}
            disabled={!isChecked}
          >
            <Text style={styles.tabButtonText}>Continue to App</Text>
          </Pressable>
          <Pressable
            style={styles.returnButton}
            onPress={() => navigation.navigate('RegistrationForm')}
          >
            <Text style={styles.tabButtonText}>Return</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default DisclaimerForm;
