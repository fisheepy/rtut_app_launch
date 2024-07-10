import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, ImageBackground, Picker } from 'react-native';
import commonStyles from './styles/commonStyles';
const backgroundImage = require('./assets/Dearborn-New-Sign-scaled-1.jpg');

const RegisterForm = ({ navigation, windowDimensions }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [type, setType] = useState('customer');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const styles = {
    container: { ...commonStyles.login.container, width: windowDimensions.width, height: windowDimensions.height, backgroundColor: '#eeeee4' },
    form: { ...commonStyles.login.form, width: windowDimensions.width * 0.75 },
    input: { ...commonStyles.login.input, flex: 1 },
    buttonContainer: { ...commonStyles.login.buttonContainer, width: windowDimensions.width * 0.75 },
    tabButton: { ...commonStyles.login.tabButton, width: windowDimensions.width * 0.25 },
    tabButtonText: commonStyles.login.tabButtonText,
    backgroundImage: commonStyles.login.backgroundImage,
    errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginBottom: 10 }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setModalMessage('Passwords do not match.');
      setModalVisible(true);
      return;
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password) || !/[@$!%*#?&]/.test(password)) {
      setModalMessage('Password must be at least 8 characters long and include at least one letter, one number, and one special character.');
      setModalVisible(true);
      return;
    }

    try {
      const response = await fetch('https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/register_external', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, firstName, lastName, type, phoneNumber, email }),
      });
      if (response.ok) {
        setModalMessage('Registration successful. Please log in.');
        setModalVisible(true);
      } else {
        console.error('Failed to register user:', response.statusText);
        setModalMessage('An error occurred. Please try again.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setModalMessage('An error occurred. Please try again.');
      setModalVisible(true);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={styles.row}>
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />
          </View>
          <Text>Password must be at least 8 characters long and include at least one letter, one number, and one special character.</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}  // Mask the password input
              style={styles.input}
            />
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}  // Mask the password input
              style={styles.input}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={styles.input}
            />
          </View>
          <Text>Your relationship to RTUT</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Customer" value="customer" />
              <Picker.Item label="Driver" value="driver" />
              <Picker.Item label="Vendor" value="vendor" />
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.tabButton}
              title="Submit Registration"
              onPress={handleRegister}>
              <Text style={styles.tabButtonText}>Submit Registration</Text>
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

export default RegisterForm;
