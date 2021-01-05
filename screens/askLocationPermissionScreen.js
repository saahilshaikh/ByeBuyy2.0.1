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
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../appTheme';

const {width, height} = Dimensions.get('window');

const AskLocationPermissionScreen = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 200,
            height: 200,
            backgroundColor: colors.white,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          <View
            style={{
              width: 150,
              height: 150,
            }}>
            <LottieView
              source={require('../assets/lf30_editor_R1rZIH.json')}
              autoPlay={true}
              loop={true}
            />
          </View>
        </View>
        <Text style={styles.header}>Where do you want to ByeBuyy?</Text>
        <Text style={styles.subheader}>
          To enjoy all that ByeBuyy offers you,we need to know where to look for
          them
        </Text>
        <TouchableOpacity
          onPress={props.handleAllowedLocationPermission}
          style={styles.permButton}>
          <Text style={styles.buttomText}>Allow Location Access</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.handleDeniedLocationPermission}
          style={styles.denyButton}>
          <Text
            style={[
              styles.buttomText,
              {textDecorationLine: 'underline', fontSize: 14},
            ]}>
            Deny Access
          </Text>
        </TouchableOpacity>
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
    width: 0.8 * width,
    fontFamily: 'Muli-Bold',
    color: colors.baseline,
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  subheader: {
    width: 0.8 * width,
    fontFamily: 'Muli-Regular',
    color: '#e5e5e5',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  permButton: {
    width: 240,
    height: 50,
    borderRadius: 5,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  denyButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttomText: {
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    color: colors.baseline,
  },
});

export default AskLocationPermissionScreen;
