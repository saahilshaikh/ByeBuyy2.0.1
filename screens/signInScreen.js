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
import { CommonActions } from '@react-navigation/native';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

export default class SignInScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      show: false,
      error: '',
      loading: false,
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
    } else if (this.state.password === '') {
      this.setState({
        error: 'Password field is required',
        loading: false,
      });
    } else if (this.state.password.length < 6) {
      this.setState({
        error: 'Password cannot be less than 6 charcters',
        loading: false,
      });
    } else {
      auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          console.log('Login Success');
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'Main' }],
            }),
          );
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
          } else if (err.code === 'auth/wrong-password') {
            this.setState({
              error: 'Wrong Password',
              loading: false,
            });
          } else {
            console.log(err);
            this.setState({
              error: 'Sign In Error',
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
              fontFamily: 'Muli-Regular',
              marginBottom: 50,
              color: colors.white,
            }}>
            {this.state.loading ? 'Logging you in' : 'Login,\nto continue'}
          </Text>
          <Text style={styles.error}>{this.state.error}</Text>
          {this.state.loading ? (
            <ActivityIndicator size="large" color={colors.baseline} />
          ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputHeader}>Email</Text>
                  <TextInput
                    value={this.state.email}
                    onChangeText={(text) => {
                      this.setState({
                        email: text,
                      });
                    }}
                    onSubmitEditing={() => {
                      this.secondTextInput.focus();
                    }}
                    style={styles.input}></TextInput>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputHeader}>Password</Text>
                  <TextInput
                    value={this.state.password}
                    onChangeText={(text) => {
                      this.setState({
                        password: text,
                      });
                    }}
                    ref={(input) => {
                      this.secondTextInput = input;
                    }}
                    onSubmitEditing={this.handleSignIn}
                    style={[styles.input, { paddingRight: 40 }]}
                    secureTextEntry={!this.state.show}></TextInput>
                  <TouchableOpacity onPress={() => this.setState({ show: !this.state.show })} style={styles.passwordIcon}>
                    {
                      this.state.show
                        ?
                        <Ionicons
                          name="ios-eye"
                          size={20}
                          style={{ color: colors.grey }}
                        />
                        :
                        <Ionicons
                          name="ios-eye-off"
                          size={20}
                          style={{ color: colors.grey }}
                        />
                    }
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={this.handleSignIn}
                  style={styles.button}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.white,
                      fontFamily: 'Muli-Bold',
                    }}>
                    Login
                </Text>
                </TouchableOpacity>
              </>
            )}
          {!this.state.loading ? (
            <>
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text
                  onPress={() => {
                    this.setState({ error: '' });
                    this.props.navigation.navigate('Forgot');
                  }}
                  style={{
                    fontSize: 14,
                    color: colors.grey,
                    fontFamily: 'Muli-Bold',
                  }}>
                  Forgot your password?
                </Text>
              </View>
            </>
          ) : null}
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
    position: 'relative'
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
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.baseline,
    paddingVertical: 16,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: colors.baseline,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'Muli-Regular',
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
  passwordIcon: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
