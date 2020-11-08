import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import { color } from 'react-native-reanimated';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

export default class ForgotScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      error: '',
      loading: false,
      success: false,
    };
  }
  handleSignIn = () => {
    this.setState({
      loading: true,
      error: '',
    });
    if (this.state.email === '') {
      this.setState({
        error: 'Email field is required',
        loading: false,
      });
    } else {
      auth()
        .sendPasswordResetEmail(this.state.email, this.state.password)
        .then(() => {
          console.log('Login Success');
          this.setState({
            loading: false,
            success: true,
          });
        })
        .catch((err) => {
          if (err.code === 'auth/invalid-email') {
            this.setState({
              error: 'Email Id is not valid',
              loading: false,
            });
          } else if (err.code === 'auth/user-not-found') {
            this.setState({
              error: 'User not found',
              loading: false,
            });
          } else {
            console.log(err);
            this.setState({
              error: 'Unknown Error',
              loading: false,
            });
          }
        });
    }
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{
            width: '100%',
            flex: 1,
            paddingHorizontal: 40,
          }}>
          <TouchableOpacity
            style={styles.action}
            onPress={() => this.props.navigation.pop()}>
            <Ionicons
              name="ios-arrow-back"
              size={40}
              style={{ color: colors.baseline }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 28,
              marginBottom: 60,
              color: colors.white,
              fontFamily: 'Muli-Bold',
            }}>
            Forgot Password
          </Text>
          {this.state.success ? (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <LottieView
                source={require('../assets/433-checked-done.json')}
                style={{ width: 200, height: 200 }}
                autoPlay={true}
                loop={true}
              />
              <Text
                style={{
                  color: colors.grey,
                  textAlign: 'center',
                  fontSize: 16,
                  fontFamily: 'Muli-Regular',
                }}>
                A password reset email has been send to{' '}
                <Text
                  style={{
                    color: colors.baseline,
                  }}>
                  {this.state.email}
                </Text>
              </Text>
            </View>
          ) : (
              <>
                <Text style={styles.error}>{this.state.error}</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputHeader}>Email</Text>
                  <TextInput
                    value={this.state.email}
                    onChangeText={(text) => {
                      this.setState({
                        email: text,
                      });
                    }}
                    onSubmitEditing={this.handleSignIn}
                    style={styles.input}></TextInput>
                </View>
                {this.state.loading ? (
                  <ActivityIndicator size="large" color={colors.baseline} />
                ) : (
                    <TouchableOpacity
                      onPress={this.handleSignIn}
                      style={styles.button}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.white,
                          fontFamily: 'Muli-Bold',
                        }}>
                        Reset Password
                  </Text>
                    </TouchableOpacity>
                  )}
              </>
            )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.primary,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputHeader: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 5,
    fontFamily: 'Muli-Bold',
  },
  input: {
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grey,
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    color: colors.white,
    height: 50,
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.baseline,
    paddingVertical: 16,
    borderRadius: 5,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  action: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderRadius: 25,
    backgroundColor: colors.secondary,
  },
});
