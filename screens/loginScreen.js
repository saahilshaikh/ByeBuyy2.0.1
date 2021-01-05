import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-community/google-signin';
import LottieView from 'lottie-react-native';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';

const {width, height} = Dimensions.get('window');

class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }
  handleGoogle = async () => {
    this.setState({
      loading: true,
    });
    try {
      GoogleSignin.configure({
        webClientId:
          '1078552807062-oknmc6j1kmuga88qa7psq8a5o238drbr.apps.googleusercontent.com',
        forceConsentPrompt: true,
        offlineAccess: false,
      });
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = await auth.GoogleAuthProvider.credential(
        idToken,
      );
      const res = await auth().signInWithCredential(googleCredential);
      console.log(res);
      if (res.additionalUserInfo.profile.email !== null) {
        var data = {
          name: res.additionalUserInfo.profile.given_name,
          uname: '',
          photo: res.additionalUserInfo.profile.picture,
          email: res.additionalUserInfo.profile.email,
          loginType: 'google',
          prof: '',
          institution: '',
        };
        console.log(data);
        const re = await axios.post(link + '/api/user/signup', data);
        if (re.data.type === 'success') {
          console.log(re.data.success);
          this.props.navigation.dispatch(
            CommonActions.reset({
              routes: [{name: 'Main'}],
            }),
          );
        } else {
          auth().signOut();
          Snackbar.show({
            text: re.data.error,
            duration: Snackbar.LENGTH_SHORT,
          });
          this.setState({
            loading: false,
          });
        }
      } else {
        auth().signOut();
        console.log(error);
        this.setState({
          loading: false,
        });
      }
    } catch (error) {
      console.log('LOGIN 85', error);
      this.setState({
        loading: false,
      });
      Snackbar.show({
        text: 'Sorry we could not log you in!',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  handleFacebook = async () => {
    this.setState({
      loading: true,
    });
    console.log('FB LOGIN');
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign-in the user with the credential
      const res = await auth().signInWithCredential(facebookCredential);
      if (res.additionalUserInfo.profile.email !== null) {
        var data2 = {
          name: res.additionalUserInfo.profile.name,
          uname: '',
          photo: res.additionalUserInfo.profile.picture.data.url,
          email: res.additionalUserInfo.profile.email,
          loginType: 'facebook',
          prof: '',
          institution: '',
        };
        const re = await axios.post(link + '/api/user/signup', data2);
        if (re.data.type === 'success') {
          console.log(re.data.success);
          this.props.navigation.dispatch(
            CommonActions.reset({
              routes: [{name: 'Main'}],
            }),
          );
        } else {
          auth().signOut();
          Snackbar.show({
            text: re.data.error,
            duration: Snackbar.LENGTH_SHORT,
          });
          this.setState({
            loading: false,
          });
        }
      } else {
        auth().signOut();
        console.log(error);
        this.setState({
          loading: false,
        });
      }
    } catch (error) {
      console.log('error 172');
      console.log(error.code);
      if (error.code === 'auth/account-exists-with-different-credential') {
        Snackbar.show({
          text: 'Please login using previous login method!',
        });
      } else {
        Snackbar.show({
          text: 'Sorry we could not log you in!',
          duration: Snackbar.LENGTH_SHORT,
        });
      }

      this.setState({
        loading: false,
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width: '100%', flex: 1, paddingHorizontal: 40}}>
          <View style={{width: '100%'}}>
            <TouchableOpacity
              style={styles.action}
              onPress={() => this.props.navigation.pop()}>
              <Ionicons
                name="ios-arrow-back"
                size={30}
                style={{color: colors.baseline}}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 24,
              color: colors.white,
              fontFamily: 'Muli-Regular',
            }}>
            welcome to ,{'\n'}
            <Text
              style={{
                fontSize: 30,
                color: colors.white,
                fontFamily: 'Muli-Regular',
              }}>
              bye
              <Text
                style={{fontFamily: 'Muli-Regular', color: colors.baseline}}>
                buyy
              </Text>
            </Text>
          </Text>
          <View style={{width: '100%', alignItems: 'center'}}>
            <View style={styles.imageBox}>
              <LottieView
                source={require('../assets/login.json')}
                autoPlay
                loop
              />
            </View>
          </View>
          {this.state.loading ? (
            <View style={{width: '100%', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 28,
                  marginBottom: 20,
                  color: colors.grey,
                  fontFamily: 'Muli-Bold',
                }}>
                Logging you in
              </Text>
              <ActivityIndicator size={'large'} color={colors.baseline} />
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                flex: 1,
                justifyContent: 'flex-end',
                marginBottom: 20,
              }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.navigate('SignUp')}>
                <Text
                  style={{
                    color: colors.baseline,
                    fontSize: 16,
                    fontFamily: 'Muli-Bold',
                  }}>
                  Create an account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: colors.baseline}]}
                onPress={() => this.props.navigation.navigate('SignIn')}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#fff',
                    fontFamily: 'Muli-Bold',
                  }}>
                  Login with e-mail
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: 18,
                  marginTop: 10,
                  marginBottom: 15,
                  color: colors.grey,
                  fontFamily: 'Muli-Regular',
                }}>
                or continue with
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={styles.social}
                  onPress={this.handleFacebook}>
                  <Image
                    style={{width: 42, height: 42}}
                    source={require('../assets/images/facebook.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.social}
                  onPress={this.handleGoogle}>
                  <Image
                    style={{width: 40, height: 40}}
                    source={require('../assets/images/google.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
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
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  imageBox: {
    width: 300,
    height: 300,
  },
  button: {
    width: '100%',
    marginVertical: 12,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.baseline,
  },
  social: {
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
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

export default LoginScreen;
