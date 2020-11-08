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
import LottieView from 'lottie-react-native';
import { PulseLoader } from 'react-native-indicator';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

const LocationLoadingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{ width: 250, height: 200 }}>
          <LottieView
            source={require('../assets/18143-discord-nearby-animation.json')}
            autoPlay={true}
            loop={true}
          />
        </View>
        <Text style={styles.header}>Finding Your Location</Text>
        <PulseLoader color={colors.baseline} size={50} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  header: {
    fontFamily: 'Muli-Bold',
    color: colors.baseline,
    fontSize: 20,
    marginBottom: 20,
  },
});

export default LocationLoadingScreen;
