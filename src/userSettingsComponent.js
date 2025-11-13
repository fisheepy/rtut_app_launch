import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, StyleSheet, ScrollView } from 'react-native';
import { VscFeedback } from "react-icons/vsc";
import { GiConfirmed, GiCancel } from "react-icons/gi";
import { GrUpdate } from "react-icons/gr";
import commonStyles from './styles/commonStyles';
import { Capacitor } from '@capacitor/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the update link based on the platform
const updateLink = Capacitor.getPlatform() === 'ios'
  ? 'https://apps.apple.com/app/rtut/id6547833065/'
  : 'https://github.com/1gemsoftware/rtut_app/releases/download/release/RTUT-release.apk';

const UserSettingsComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const userFirstName = await AsyncStorage.getItem('userFirstName');
        const userLastName = await AsyncStorage.getItem('userLastName');

        setFirstName(userFirstName);
        setLastName(userLastName);
      } catch (e) {
        console.warn('Unable to load userId from storage', e);
      }
    })();
  }, []);

  const handleHrQuestionSubmit = async () => {
    if (!question.trim()) {
      setModalMessage('Please enter your question');
      setMessageModalVisible(true);
      return;
    }
    try {
      console.log(JSON.stringify({ question, phone, email, firstName, lastName }));
      const response = await fetch(
        'https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/hr-question',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, phone, email, firstName, lastName }),
        }
      );
      if (response.ok) {
        setModalMessage('Thank you, your question has been sent to HR.');
        setQuestion('');
        setPhone('');
        setEmail('');
        setModalVisible(false);
      } else {
        setModalMessage('Failed to submit your question. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setModalMessage('Failed to submit your question. Please try again.');
    } finally {
      setMessageModalVisible(true);
    }
  };

  return (
    <View style={commonStyles.useSetting.container}>
      {/* Update App Button */}
      <View style={commonStyles.useSetting.iconLink}>
        <Pressable onPress={() => window.open(updateLink, '_blank')}>
          <GrUpdate style={{ fontSize: 36, color: '#FF5733' }} />
        </Pressable>
        <Text style={commonStyles.useSetting.linkText}>UPDATE APP</Text>
      </View>

      {/* Questions to HR Button */}
      <Pressable
        style={commonStyles.useSetting.feedbackButton}
        onPress={() => setModalVisible(true)}
      >
        <VscFeedback />
        <Text style={commonStyles.useSetting.linkText}>QUESTIONS TO HR</Text>
      </Pressable>

      {/* Submission Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            {/* 关键：避让 + 可滚动 */}
            <View style={{ flex: 1, width: '100%' }}>
              <View
                // KeyboardAvoidingView 在 RNWeb/Capacitor 里可能不可用，用 View + padding 兼容
                style={{ flex: 1, paddingBottom: 80 }} // 预留底部按钮高度
              >
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingBottom: 16 }}
                >
                  <TextInput
                    style={[commonStyles.useSetting.nameInput, modalStyles.input]}
                    onChangeText={setPhone}
                    value={phone}
                    placeholder="Phone number (optional)"
                    keyboardType="phone-pad"
                    returnKeyType="next"
                  />
                  <TextInput
                    style={[commonStyles.useSetting.nameInput, modalStyles.input]} // 再预留点空间
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email (optional)"
                    keyboardType="email-address"
                    returnKeyType="done"
                  />
                  <TextInput
                    style={[commonStyles.useSetting.feedbackInput, modalStyles.input, modalStyles.textArea]}
                    onChangeText={setQuestion}
                    value={question}
                    placeholder="Type your question here..."
                    multiline
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => {/* 可选：把焦点移到下一个输入 */ }}
                  />
                </ScrollView>
              </View>

              {/* 底部固定按钮区：始终可点 */}
              <View style={modalStyles.fixedActions}>
                <Pressable style={commonStyles.useSetting.Button} onPress={handleHrQuestionSubmit}>
                  <GiConfirmed style={commonStyles.useSetting.button} fontSize={40} color="green" />
                </Pressable>
                <Pressable style={commonStyles.useSetting.Button} onPress={() => setModalVisible(false)}>
                  <GiCancel style={{ ...commonStyles.useSetting.button, pointerEvents: 'none' }} fontSize={40} />
                </Pressable>
              </View>
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
    marginTop: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#7a8ca1ff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '95%',
    height: '100%',
    maxHeight: '95%'
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 0,
  },
  textArea: {
    textAlignVertical: 'top',
    height: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  fixedActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#7a8ca1ff',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#fa0014',
  },
});

export default UserSettingsComponent;