import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationModal from './notificationModal';
import { NotificationProvider } from './context/novuNotifications';
import UsefulLinksComponent from './usefulLinksComponent';
import UserSettingsComponent from './userSettingsComponent';
import { GrUserSettings, GrFormClose } from "react-icons/gr";
import commonStyles from './styles/commonStyles';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import AppVersionComponent from './appVersionComponent'; // Import your version component

function App({ windowDimensions, navigation }) {
  const [subscriberId, setSubscriberId] = useState(null);
  const [subscriberName, setSubscriberName] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pushToken, setPushToken] = useState(null);
  const [notificationData, setNotificationData] = useState(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const sendTokenToServer = (token, userData) => {
    const url = 'https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/register_token';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        user: userData
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Token registered:', data);
      })
      .catch(error => {
        console.error('Error registering token:', error);
      });
  };

  useEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          PushNotifications.register();
        } else {
          console.log('User denied permissions to push notifications.');
        }
      });

      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        setPushToken(token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on push registration:', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notification received: ', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Notification action performed', notification);
        console.log('Notification Data:', notification.notification.data);
        setNotificationData(notification.notification.data);
      });

      return () => {
        PushNotifications.removeAllListeners();
      };
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function fetchUserDetails() {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const userFirstName = await AsyncStorage.getItem('userFirstName');
        const userLastName = await AsyncStorage.getItem('userLastName');
        if (!isCancelled && userId && userFirstName && userLastName) {
          setSubscriberId(userId);
          setSubscriberName({ userFirstName, userLastName });
          setIsDataLoaded(true);
          if (pushToken) {
            sendTokenToServer(pushToken, { userFirstName, userLastName });
          }
        } else {
          setTimeout(fetchUserDetails, 5000);
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
        if (!isCancelled) {
          setTimeout(fetchUserDetails, 5000);
        }
      }
    }

    fetchUserDetails();

    return () => {
      isCancelled = true;
    };
  }, [pushToken]);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const logout = async () => {
    // Clear user data from AsyncStorage
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userFirstName');
    await AsyncStorage.removeItem('userLastName');

    // Navigate to login screen
    navigation.replace('RegistrationForm');
  };

  return (
    <View style={commonStyles.app.container}>
      <View style={commonStyles.app.banner}>
        {isDataLoaded ? (
          <Text style={commonStyles.app.bannerText}>Welcome Back, {subscriberName.userFirstName} </Text>
        ) : (
          <Text style={commonStyles.app.bannerText}>Welcome Back </Text>
        )}
      </View>
      <View style={commonStyles.app.iconButtonContainer}>
        <Pressable onPress={toggleMenu} style={commonStyles.app.settingIcon}>
          <GrUserSettings />
        </Pressable>
      </View>
      {isMenuVisible && (
        <View style={commonStyles.app.menu}>
          <Pressable onPress={() => setIsMenuVisible(false)} style={commonStyles.app.backIcon}>
            <GrFormClose />
          </Pressable>
          {/* Display components side by side */}
          <View style={commonStyles.app.menuRow}>
            <UserSettingsComponent />
            <UsefulLinksComponent />
          </View>
          {/* Version number and Logout button aligned to bottom */}
          <View style={commonStyles.app.bottomContainer}>
            <AppVersionComponent />
            <Pressable onPress={() => setIsLogoutModalVisible(true)} style={commonStyles.app.logoutButton}>
              <Text style={commonStyles.app.logoutButtonText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      )}
      <View style={commonStyles.app.content}>
        <div>
          <NotificationProvider applicationIdentifier="o-7dmY_XxQs5" subscriberId={subscriberId}>
            <NotificationModal windowDimensions={windowDimensions} notificationData={notificationData} />
          </NotificationProvider>
        </div>
      </View>
      <Modal
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={commonStyles.app.centeredModalContainer}>
          <View style={commonStyles.app.enlargedModalContent}>
            <Text style={commonStyles.app.confirmationText}>Are you sure you want to logout?</Text>
            <Pressable onPress={logout} style={commonStyles.app.confirmButton}>
              <Text style={commonStyles.app.confirmButtonText}>Yes</Text>
            </Pressable>
            <Pressable onPress={() => setIsLogoutModalVisible(false)} style={commonStyles.app.cancelButton}>
              <Text style={commonStyles.app.cancelButtonText}>No</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}

export default App;
