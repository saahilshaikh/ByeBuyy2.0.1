import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation-locker';
import HomeStack from '../stack/homeStack';
import colors from '../appTheme';

class AppScreen extends React.Component {
  componentDidMount() {
    // Orientation.lockToPortrait();
    SplashScreen.hide();
  }
  render() {
    const linking = {
      prefixes: ['https://www.byebuyy.com/', 'byebuyy://'],
    };
    return (
      <>
        <NavigationContainer linking={linking}>
          <HomeStack />
        </NavigationContainer>
      </>
    );
  }
}

export default AppScreen;
