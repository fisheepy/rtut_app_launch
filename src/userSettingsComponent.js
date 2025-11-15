import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, StyleSheet, ScrollView } from 'react-native';
import { VscFeedback } from "react-icons/vsc";
import { GrUpdate } from "react-icons/gr";
import commonStyles from './styles/commonStyles';
import { Capacitor } from '@capacitor/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isIOS = Capacitor.getPlatform() === 'ios';

// Define the update link based on the platform
const updateLink = isIOS
  ? 'https://apps.apple.com/app/rtut/id6547833065/'
  : 'https://github.com/1gemsoftware/rtut_app/releases/download/release/RTUT-release.apk';

const UserSettingsComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [firstName, setFirstName] = useState('');   // ← 纯 JS：去掉 <string | null>
  const [lastName, setLastName] = useState('');     // ← 纯 JS：去掉 <string | null>
  const [kbHeight, setKbHeight] = useState(0);
  const [step, setStep] = useState(1);              // ← 纯 JS：去掉 <1 | 2>

  useEffect(() => {
    (async () => {
      try {
        const userFirstName = await AsyncStorage.getItem('userFirstName');
        const userLastName = await AsyncStorage.getItem('userLastName');
        setFirstName(userFirstName || '');
        setLastName(userLastName || '');
      } catch (e) {
        console.warn('Unable to load userId from storage', e);
      }

      // iOS: use visualViewport to estimate keyboard height
      if (!isIOS || typeof window === 'undefined' || !window.visualViewport) return;

      const vv = window.visualViewport;
      const updateInset = () => {
        const bottomInset = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
        setKbHeight(bottomInset);
      };

      vv.addEventListener('resize', updateInset);
      vv.addEventListener('scroll', updateInset);
      updateInset();

      return () => {
        vv.removeEventListener('resize', updateInset);
        vv.removeEventListener('scroll', updateInset);
      };
    })();
  }, []);

  const handleHrQuestionSubmit = async () => {
    if (!question.trim()) {
      setModalMessage('Please enter your question');
      setMessageModalVisible(true);
      return;
    }
    try {
      const payload = { question, phone, email, firstName, lastName };
      console.log(JSON.stringify(payload));
      const response = await fetch(
        'https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/hr-question',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        setModalMessage('Thank you, your question has been sent to HR.');
        setQuestion(''); setPhone(''); setEmail('');
        setModalVisible(false);
        setStep(1);
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

  const onOpenUpdateLink = () => {
    // In Capacitor WebView this usually works; if needed, replace with Capacitor Browser.open
    window.open(updateLink, '_blank');
  };

  return (
    <View style={commonStyles.useSetting.container}>
      {/* Update App Button */}
      <View style={commonStyles.useSetting.iconLink}>
        <Pressable onPress={onOpenUpdateLink}>
          <GrUpdate style={{ fontSize: 36, color: '#FF5733' }} />
        </Pressable>
        <Text style={commonStyles.useSetting.linkText}>UPDATE APP</Text>
      </View>

      {/* Questions to HR Button */}
      <Pressable
        style={commonStyles.useSetting.feedbackButton}
        onPress={() => { setStep(1); setModalVisible(true); }}
      >
        <VscFeedback />
        <Text style={commonStyles.useSetting.linkText}>QUESTIONS TO HR</Text>
      </Pressable>

      {/* Submission Modal (Two-step) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.centeredView}>
          <View style={[modalStyles.modalView, { maxHeight: '90%', height: undefined }]}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
              {step === 1 ? 'Ask HR a Question' : 'Optional Contact Info'}
            </Text>

            {/* Step 1: Only question */}
            {step === 1 && (
              <View style={{ flex: 1, width: '100%' }}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 8 }}>
                  <TextInput
                    style={[
                      commonStyles.useSetting.feedbackInput,
                      modalStyles.input,
                      modalStyles.textArea,
                      { textAlignVertical: 'top' }
                    ]}
                    onChangeText={setQuestion}
                    value={question}
                    placeholder="Type your question here..."
                    multiline
                    returnKeyType="done"
                  />
                </ScrollView>

                {/* Actions */}
                <View style={[commonStyles.useSetting.buttonGroup, styles.actionRow]}>
                  <Pressable
                    style={[commonStyles.useSetting.Button, styles.actionFlex]}
                    onPress={() => {
                      if (!question.trim()) {
                        setModalMessage('Please enter your question');
                        setMessageModalVisible(true);
                        return;
                      }
                      setStep(2);
                    }}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <Text style={styles.primaryActionText}>NEXT</Text>
                  </Pressable>

                  <View style={{ width: 16 }} />

                  <Pressable
                    style={[commonStyles.useSetting.Button, styles.actionFlex]}
                    onPress={() => setModalVisible(false)}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <Text style={styles.neutralActionText}>CANCEL</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Step 2: Optional phone/email */}
            {step === 2 && (
              <View style={{ flex: 1, width: '100%' }}>
                <Text style={{ color: '#fff', opacity: 0.85, marginBottom: 6 }}>
                  Phone and email are optional. You can submit without them.
                </Text>

                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 8 }}>
                  <TextInput
                    style={[commonStyles.useSetting.nameInput, modalStyles.input]}
                    onChangeText={setPhone}
                    value={phone}
                    placeholder="Phone number (optional)"
                    keyboardType="phone-pad"
                    returnKeyType="next"
                  />
                  <TextInput
                    style={[commonStyles.useSetting.nameInput, modalStyles.input]}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email (optional)"
                    keyboardType="email-address"
                    returnKeyType="done"
                  />
                </ScrollView>

                {/* Actions */}
                <View style={[
                  commonStyles.useSetting.buttonGroup,
                  styles.actionRow,
                  isIOS ? { marginBottom: kbHeight ? kbHeight : 0 } : null
                ]}>
                  <Pressable
                    style={[commonStyles.useSetting.Button, styles.actionFlex]}
                    onPress={handleHrQuestionSubmit}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <Text style={styles.primaryActionText}>SUBMIT</Text>
                  </Pressable>

                  <View style={{ width: 16 }} />

                  <Pressable
                    style={[commonStyles.useSetting.Button, styles.actionFlex]}
                    onPress={() => { setModalVisible(false); setStep(1); }}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <Text style={styles.neutralActionText}>CANCEL</Text>
                  </Pressable>
                </View>
              </View>
            )}
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
    maxHeight: '90%',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  textArea: {
    height: 200,
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
    color: 'white'
  },
});

const styles = StyleSheet.create({
  actionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  actionFlex: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
  },
  neutralActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
});

export default UserSettingsComponent;
