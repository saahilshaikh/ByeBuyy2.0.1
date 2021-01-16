import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

const NoInternetScreen = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{ width: 250, height: 250 }}>
          <LottieView
            source={require('../assets/nonet.json')}
            autoPlay={true}
            loop={true}
          />
        </View>
        <Text style={styles.header}>No Internet connection</Text>
        <TouchableOpacity onPress={() => props.handleReCheck()}>
          <Ionicons name="ios-refresh-circle" size={60} color={colors.baseline} />
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
    backgroundColor: colors.secondary,
  },
  header: {
    fontFamily: 'Muli-Bold',
    color: colors.baseline,
    fontSize: 20,
    marginBottom: 20,
  },
});

export default NoInternetScreen;
