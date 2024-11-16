import React, { useState } from 'react';
import { View, Text, Pressable, CheckBox, ScrollView } from 'react-native';
import commonStyles from './styles/commonStyles';
import { useUser } from './context/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUniqueId } from './utils';
import packageJson from '../package.json'; // Adjust path to your package.json

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

  const getDeviceInfo = () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory || 'unknown',
    };
  };

  const handleContinue = async () => {
    const deviceInfo = getDeviceInfo();  // Get device information

    try {
      const response = await fetch('https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/accept-disclaimer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accepted: true,
          username: userInfo.username,
          appVersion: packageJson.version,
          deviceInfo,  // Include device information here
        }),
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
          <Text style={styles.header}>User Consent Agreement for Company App Usage</Text>
          <Text style={styles.text}>
            Welcome to the official release of the Royal Truck and Utility Trailer Company App. Please carefully review the following terms:
          </Text>
          <Text style={styles.headline}>Acknowledgment of Participation</Text>
          <Text style={styles.text}>
            By logging into and using this app, you agree to participate in the company’s digital platform as a user, understanding that its primary purpose is to streamline communication, enhance functionality, and improve workplace efficiency.
          </Text>
          <Text style={styles.headline}>Consent to Communications</Text>
          <Text style={styles.text}>
            You acknowledge and agree to receive communications through this app, including notifications, text messages, and emails. These communications are integral to facilitating efficient company processes and ensuring timely updates.
          </Text>
          <Text style={styles.headline}>Data Collection and Usage</Text>
          <Text style={styles.text}>
            We are committed to respecting your privacy. All data collected through the app will be used solely to support internal communication, enhance system functionality, and improve the overall user experience. Your data will be managed securely in accordance with applicable privacy laws.
          </Text>
          <Text style={styles.headline}>Performance Expectation</Text>
          <Text style={styles.text}>
            This app is designed to perform as reliably as possible. However, users may encounter occasional technical issues as we work continuously to enhance its functionality. Please report any issues promptly to support our improvement efforts.
          </Text>
          <Text style={styles.headline}>Working Hours and Notifications</Text>
          <Text style={styles.text}>
            Notifications and communications will align with normal working hours, except in cases of urgent company matters or unforeseen technical delays. There is no expectation for you to engage with app content or respond outside regular working hours.
          </Text>
          <Text style={styles.headline}>Feedback and Support</Text>
          <Text style={styles.text}>
            We value your input in making this app a beneficial tool for all employees. For questions, support, or to provide feedback, please use the “User Settings – User Feedback” option in the app to reach our support team.
          </Text>
          <Text style={styles.headline}>Acceptance of Terms</Text>
          <Text style={styles.text}>
            By logging into and using this app, you confirm that you have read, understood, and agree to the terms outlined in this agreement.
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
