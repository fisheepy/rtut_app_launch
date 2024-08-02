import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, ImageBackground, CheckBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from './styles/commonStyles';
import { generateUniqueId } from './utils';
import { useUser } from './context/userContext';

const backgroundImage = require('./assets/Dearborn-New-Sign-scaled-1.jpg');

const LoginForm = ({ navigation, windowDimensions }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { setUserInfo } = useUser(); // Get the setUserInfo function from context

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUserName = await AsyncStorage.getItem('userName');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedUserName && savedPassword) {
          setUserName(savedUserName);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Failed to load saved credentials:', error);
      }
    };

    loadCredentials();
  }, []);

  const styles = {
    container: { ...commonStyles.login.container, width: windowDimensions.width, height: windowDimensions.height },
    form: { ...commonStyles.login.form, width: windowDimensions.width * 0.75 },
    input: commonStyles.login.input,
    buttonContainer: { ...commonStyles.login.buttonContainer, width: windowDimensions.width * 0.75 },
    tabButton: { ...commonStyles.login.tabButton, width: windowDimensions.width * 0.25 },
    tabButtonText: commonStyles.login.tabButtonText,
    backgroundImage: commonStyles.login.backgroundImage,
    errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    checkbox: {
      marginRight: 10,
    },
  };

  const handleConfirm = async () => {
    try {
      // Clear saved credentials before attempting a new login
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('password');

      console.log('Fetching User Info from server');
      const response = await fetch('https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/authentication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });
      if (response.ok) {
        const data = await response.json();
        const userInfo = data[0];
        setUserInfo(userInfo); 

        if ( userInfo.isActivated!=='true') {
          navigation.navigate("DisclaimerForm");  // Navigate to Disclaimer page if not activated
          return;
        }
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
        if (rememberMe) {
          await AsyncStorage.setItem('userName', userName);
          await AsyncStorage.setItem('password', password);
        } else {
          await AsyncStorage.removeItem('userName');
          await AsyncStorage.removeItem('password');
        }
      } else if (response.status === 403 || response.status === 404) {
        setModalMessage('User ID and password combination not found.');
        setModalVisible(true);
      } else {
        console.error('Failed to fetch user info:', response.statusText);
        setModalMessage('An error occurred. Please try again.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error saving UID:', error);
      setModalMessage('An error occurred. Please try again.');
      setModalVisible(true);
    }
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
            secureTextEntry={true}  // Mask the password input
            style={styles.input}
          />
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={rememberMe}
              onValueChange={setRememberMe}
              style={styles.checkbox}
            />
            <Text>Remember Me</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.tabButton}
              title="Confirm"
              onPress={handleConfirm}>
              <Text style={styles.tabButtonText}>Confirm</Text>
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
    </ImageBackground>
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

export default LoginForm;
