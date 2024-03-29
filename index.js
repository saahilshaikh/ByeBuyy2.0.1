import React from 'react';
import {AppRegistry, Text, TextInput} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
