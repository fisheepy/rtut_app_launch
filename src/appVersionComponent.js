import React from 'react';
import packageJson from '../package.json'; // Adjust path to your package.json

const AppVersionComponent = () => {
  const appVersion = packageJson.version;

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    versionText: {
      fontSize: '12px',
      color: '#e2e8f0',
      textAlign: 'center',
      fontWeight: '600',
      letterSpacing: '0.2px',
      backgroundColor: 'rgba(15, 23, 42, 0.35)',
      border: '1px solid rgba(148, 163, 184, 0.35)',
      borderRadius: '999px',
      padding: '4px 10px'
    }
  };

  return (
    <div style={styles.container}>
      <p style={styles.versionText}>App Version: {appVersion}</p>
    </div>
  );
};

export default AppVersionComponent;
