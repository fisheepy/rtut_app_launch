import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationModal from './notificationModal';
import { NotificationProvider } from './context/novuNotifications';
import UsefulLinksComponent from './usefulLinksComponent';
import UserSettingsComponent from './userSettingsComponent';
import { GrUserSettings, GrFormClose } from "react-icons/gr"; // Import GrFormClose for the Back icon
import commonStyles from './styles/commonStyles';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

function App({ windowDimensions }) {
  const [subscriberId, setSubscriberId] = useState(null);
  const [subscriberName, setSubscriberName] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const sendTokenToServer = (token, userData) => {
    // const url = 'https://yourserver.com/api/register_token';

    // fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     token: token,
    //     user: userData
    //   })
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('Token registered:', data);
    //   })
    //   .catch(error => {
    //     console.error('Error registering token:', error);
    //   });
  };

  useEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      // Request permission for push notifications
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with the push notification service
          PushNotifications.register();
        } else {
          console.log('User denied permissions to push notifications.');
        }
      });

      // Listen for registration of the push notifications
      PushNotifications.addListener('registration',
        (token) => {
          console.log('Push registration success, token: ' + token.value);
          // Send token and user data to server
          sendTokenToServer(token.value);
        }
      );

      // Handle errors
      PushNotifications.addListener('registrationError',
        (error) => {
          console.error('Error on push registration:', error);
        }
      );

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
          setSubscriberName({ userFirstName, userLastName }); // Assuming userName is stored as a stringified JSON
          setIsDataLoaded(true); // Data is considered loaded when both states are set
        } else {
          setTimeout(fetchUserDetails, 5000); // Retry after 5 seconds if data is not yet available or complete
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
        if (!isCancelled) {
          setTimeout(fetchUserDetails, 5000); // Retry after error
        }
      }
    }

    fetchUserDetails();

    return () => {
      isCancelled = true; // Prevent setting state after the component is unmounted
    };
  }, []);


  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <View style={commonStyles.app.container}>
      <View style={commonStyles.app.banner}>
        {isDataLoaded ? (
          <Text style={commonStyles.app.bannerText}>Welcome Back, {subscriberName.userFirstName} {subscriberName.userLastName} </Text>
        ) : (
          <Text style={commonStyles.app.bannerText}>Loading...</Text>
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
          <UserSettingsComponent />
          <UsefulLinksComponent />
        </View>
      )}
      <View style={commonStyles.app.content}>
        <div>
          <NotificationProvider applicationIdentifier="o-7dmY_XxQs5" subscriberId={subscriberId}>
            <NotificationModal windowDimensions={windowDimensions} />
          </NotificationProvider>
        </div>
      </View>
    </View>
  );
}

export default App;
