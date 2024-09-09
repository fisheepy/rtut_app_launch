import React from 'react';
import packageJson from '../package.json'; // Adjust path to your package.json

const AppVersionComponent = () => {
  const appVersion = packageJson.version;

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    versionText: {
      fontSize: '20px',
      color: '#000000',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <p style={styles.versionText}>App Version: {appVersion}</p>
    </div>
  );
};

export default AppVersionComponent;
