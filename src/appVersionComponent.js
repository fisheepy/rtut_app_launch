import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const AppVersionComponent = () => {
  const [version, setVersion] = useState('');

  useEffect(() => {
    // Get the version number from DeviceInfo
    const appVersion = DeviceInfo.getVersion();
    setVersion(appVersion);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.versionText}>App Version: {version}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppVersionComponent;
