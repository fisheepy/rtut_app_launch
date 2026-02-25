import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, ImageBackground, CheckBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from './styles/commonStyles';
import { generateUniqueId } from './utils';
import { useUser } from './context/userContext';
import CircularProgress from '@mui/material/CircularProgress';
import { TextInputMask } from 'react-native-masked-text';
import { TouchableWithoutFeedback } from 'react-native';

const backgroundImage = require('./assets/Dearborn-New-Sign-scaled-1.jpg');

const LoginForm = ({ navigation, windowDimensions }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for toggling password visibility
  const { setUserInfo } = useUser();

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUserName = await AsyncStorage.getItem('userName');
        if (savedUserName) {
          setUserName(savedUserName);
          setRememberMe(true);
        }
        // Remove legacy plaintext password cache if it exists.
        await AsyncStorage.removeItem('password');
      } catch (error) {
        console.error('Failed to load saved credentials:', error);
      }
    };

    loadCredentials();
  }, []);

  const styles = {
    container: { ...commonStyles.login.container, width: windowDimensions.width, height: windowDimensions.height, backgroundColor: '#f1f5f9' },
    form: { ...commonStyles.login.form, width: Math.min(windowDimensions.width * 0.86, 420) },
    input: commonStyles.login.input,
    buttonContainer: { ...commonStyles.login.buttonContainer, width: '100%' },
    tabButton: { ...commonStyles.login.tabButton, width: '100%' },
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
    linkText: {
      color: '#2196F3',
      textAlign: 'center',
      textDecorationLine: 'underline',
      marginVertical: 10,
    },
    pressableLink: {
      alignSelf: 'center', // Center the Pressable horizontally
      paddingVertical: 0,  // Minimal padding to reduce size
      paddingHorizontal: 0, // Minimal padding to reduce size
      marginVertical: 0,   // Minimal margin to reduce size
    },
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
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

        if (userInfo.isActivated !== 'true') {
          navigation.navigate("DisclaimerForm");
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
        } else {
          await AsyncStorage.removeItem('userName');
        }
        // Always avoid persisting plaintext passwords locally.
        await AsyncStorage.removeItem('password');
      } else if (response.status === 403 || response.status === 404) {
        setModalMessage('User ID and password combination not found.');
        setModalVisible(true);
      } else {
        console.error('Failed to fetch user info:', response.statusText);
        setModalMessage('User ID and password combination not found.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error saving UID:', error);
      setModalMessage('An error occurred. Please try again.');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = () => {
    setResetModalVisible(true);
  };

  const handleSendResetLink = async () => {
    try {
      const response = await fetch('https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phone }),
      });

      const result = await response.json();

      if (response.ok) {
        // Successfully sent reset link
        setModalMessage('A reset link has been sent to your phone.');
      } else {
        // Handle errors returned by the server
        setModalMessage(result.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reset link:', error);
      setModalMessage('An error occurred while sending the reset link. Please try again.');
    } finally {
      setModalVisible(true); // Show the modal with the result message
      setResetModalVisible(false); // Close the reset modal
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={commonStyles.login.header}>Welcome Back</Text>
          <Text style={commonStyles.login.helperText}>Use your RTUT username and password to continue.</Text>
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
            secureTextEntry={!showPassword} // Toggle password visibility
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
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={showPassword}
              onValueChange={setShowPassword}
              style={styles.checkbox}
            />
            <Text>Show Password</Text>
          </View>
          <Pressable style={styles.pressableLink} onPress={handlePasswordReset}>
            <Text style={styles.linkText}>Forgot Username/Password?</Text>
          </Pressable>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.tabButton}
              title="Confirm"
              onPress={handleConfirm}>
              <Text style={styles.tabButtonText}>Confirm</Text>
            </Pressable>
          </View>
          {loading && <CircularProgress style={{ marginTop: 20 }} />}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={modalStyles.centeredView}>
              <TouchableWithoutFeedback>
                <View style={modalStyles.modalView}>
                  <Text style={modalStyles.modalText}>{modalMessage}</Text>
                  <Pressable
                    style={[modalStyles.button, modalStyles.buttonClose]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={modalStyles.textStyle}>Close</Text>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Reset Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={resetModalVisible}
          onRequestClose={() => setResetModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setResetModalVisible(false)}>
            <View style={modalStyles.centeredView}>
              <TouchableWithoutFeedback>
                <View style={modalStyles.modalView}>
                  <Text style={modalStyles.modalText}>Enter your associated phone number to reset your password:</Text>
                  <TextInputMask
                    type={'custom'}
                    options={{
                      mask: '(999)-999-9999'
                    }}
                    placeholder="Phone (SMS will be sent for resetting)"
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    style={styles.input}
                  />
                  <Pressable
                    style={[modalStyles.button, modalStyles.buttonClose]}
                    onPress={handleSendResetLink}
                  >
                    <Text style={modalStyles.textStyle}>Send Reset Link</Text>
                  </Pressable>
                  <Pressable
                    style={modalStyles.button}
                    onPress={() => setResetModalVisible(false)}
                  >
                    <Text style={modalStyles.textStyle}>Cancel</Text>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
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
    backgroundColor: "#f9f1db",
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
    elevation: 2,
    marginVertical: 5, // Space between buttons
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
