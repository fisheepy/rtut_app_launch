import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from './styles/commonStyles';
import { generateUniqueId } from './utils';

const backgroundImage = require('./assets/Dearborn-New-Sign-scaled-1.jpg');

const RegistrationForm = ({ navigation, windowDimensions }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const styles = {
    container: { ...commonStyles.login.container, width: windowDimensions.width, height: windowDimensions.height, },
    form: { ...commonStyles.login.form, width: windowDimensions.width * 0.75, },
    input: commonStyles.login.input,
    buttonContainer: { ...commonStyles.login.buttonContainer, width: windowDimensions.width * 0.75, },
    tabButton: { ...commonStyles.login.tabButton, width: windowDimensions.width * 0.25, },
    tabButtonText: commonStyles.login.tabButtonText,
    backgroundImage: commonStyles.login.backgroundImage,
  };

  const handleConfirm = async () => {
    try {
      console.log('Fetching User Info from server');
      const response = await fetch('https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/authentication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });

      if (response.ok) {
        const data = await response.json();

        const firstName = data[0]["First Name"];
        const lastName = data[0]["Last Name"];
        const userId = generateUniqueId(
          firstName.toUpperCase(),
          lastName.toUpperCase()
        );

        localStorage.setItem('userId', userId);
        localStorage.setItem('userFirstName', firstName);
        localStorage.setItem('userLastName', lastName);
        console.log('User Info fetched and cached');
      } else {
        console.error('Failed to fetch user info:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving UID:', error);
    }

    // Navigate back to the main view
    navigation.navigate("Main");
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
            placeholder="User Name"
            value={userName}
            onChangeText={setUserName}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.tabButton}
              title="Confirm"
              onPress={handleConfirm}>
              <Text style={styles.tabButtonText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default RegistrationForm;
