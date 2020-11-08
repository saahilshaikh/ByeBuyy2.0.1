import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {PulseLoader} from 'react-native-indicator';

const {width, height} = Dimensions.get('window');

const LoadingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{width: 150, height: 150}}>
        <Image
          style={styles.logo}
          source={require('../assets/images/logo.png')}
        />
      </View>
      <ActivityIndicator size="large" color="#d65a31" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15202B',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

export default LoadingScreen;
