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
  PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import colors from '../appTheme';
import SelectInput from 'react-native-select-input-ios';
import axios from 'axios';
import link from '../fetchPath';
import LottieView from 'lottie-react-native';
var otpGenerator = require('otp-generator');
import Contacts from 'react-native-contacts';

const {width, height} = Dimensions.get('window');

export default class SignUpScreen extends React.Component {
  constructor() {
    super();
    this.child1 = React.createRef();
    this.child2 = React.createRef();
    this.child3 = React.createRef();
    this.child4 = React.createRef();
    this.state = {
      email: '',
      password: '',
      show: false,
      error: 'xfdgg',
      loading: false,
      accept: false,
      uname: '',
      name: '',
      profs: [
        {label: 'Select a type', value: ''},
        {label: 'Student', value: 'Student'},
        {label: 'Non-Student', value: 'Non-Student'},
      ],
      prof: '',
      profStudent: '',
      referrelCode: '',
      showSuccess: false,
      showVerfiy: false,
      c1: '',
      c2: '',
      c3: '',
      c4: '',
      code: '',
      contacts: [],
    };
  }

  componentDidMount() {
    this.handleContact();
  }

  handleContact = async () => {
    var check = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    );
    console.log('CONTAC READ PER: ' + check);
    if (check) {
      var contacts = await Contacts.getAll();
      var emailList = [],
        infoList = [];
      for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].emailAddresses.length > 0) {
          emailList.push(contacts[i].emailAddresses[0].email);
        }
      }
      if (emailList.length > 0) {
        console.log('Email List check');
        for (var j = 0; j < emailList.length; j++) {
          var data = {
            id: emailList[j],
          };
          var res = await axios.post(link + '/api/user/single', data);
          if (res.data.email) {
            infoList.push(res.data);
            this.setState({
              contacts: infoList,
            });
          }
        }
      }
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (granted) {
        var contacts = await Contacts.getAll();
      }
    }
  };

  handleSignUp = async () => {
    this.setState({
      loading: true,
    });
    if (this.state.email === '') {
      this.setState({
        loading: false,
      });
      Snackbar.show({
        text: 'Please enter an email address!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.password === '') {
      this.setState({
        loading: false,
      });
      Snackbar.show({
        text: 'Please enter a password!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.password.length < 6) {
      this.setState({
        loading: false,
      });
      Snackbar.show({
        text: 'Password cannot be less than 6 charcters!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.name === '') {
      this.setState({
        loading: false,
      });
      Snackbar.show({
        text: 'Please ender your name!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.uname === '') {
      this.setState({
        loading: false,
      });
      Snackbar.show({
        text: 'Please enter a user name!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.uname.includes('@')) {
      this.setState({
        loading: false,
      });
      Snackbar.show({
        text: 'User name cannot include @ symbol!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.prof === '') {
      this.setState({
        loading: false,
      });
      Snackbar.show({
        text: 'Please select a profession!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.prof === 'Student' && this.state.profStudent === '') {
      this.setState({
        loading: false,
      });
      Snackbar.show({
        text: 'Please add your institution details!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.accept === false) {
      this.setState({
        loading: false,
      });
      Snackbar.show({
        text: 'Please accept terms and conditions !',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      var err = await this.handleUName();
      if (err === false) {
        if (this.state.referrelCode !== '') {
          var err2 = await this.handleRefer();
          if (err2) {
            var code = await otpGenerator.generate(4, {
              upperCase: false,
              specialChars: false,
              alphabets: false,
            });
            this.setState({
              showVerfiy: true,
              loading: false,
              code: code,
            });
            var data = {
              email: this.state.email,
              code: code,
            };
            var res = await axios.post(
              link + '/api/user/sendEmailVerification',
              data,
            );
            this.child1.current.focus();
          } else {
            Snackbar.show({
              text: 'Wrong refferal code!',
              duration: Snackbar.LENGTH_SHORT,
            });
            this.setState({
              loading: false,
            });
          }
        } else {
          var code = await otpGenerator.generate(4, {
            upperCase: false,
            specialChars: false,
            alphabets: false,
          });
          this.setState({
            showVerfiy: true,
            loading: false,
            code: code,
          });
          var data = {
            email: this.state.email,
            code: code,
          };
          var res = await axios.post(
            link + '/api/user/sendEmailVerification',
            data,
          );
          this.child1.current.focus();
        }
      } else {
        Snackbar.show({
          text: 'User name already taken!',
          duration: Snackbar.LENGTH_SHORT,
        });
        this.setState({
          loading: false,
        });
      }
    }
  };

  handleUName = async () => {
    var result = false;
    var res = await axios.get(link + '/api/userUname/' + this.state.uname);
    if (res.data !== null) {
      if (res.data.length > 0) {
        result = true;
      }
    }
    return result;
  };

  handleRefer = async () => {
    var result = false;
    var uname = this.state.referrelCode.substr(
      1,
      this.state.referrelCode.length - 1,
    );
    var data = {
      uname: uname,
    };
    var res = await axios.post(link + '/api/user/uname', data);
    if (res.data !== null) {
      if (res.data.length !== 0) {
        result = true;
      }
    }
    console.log(result);
    return result;
  };

  handleVerfiy = async () => {
    this.setState({
      loading: true,
    });
    var code = this.state.c1 + this.state.c2 + this.state.c3 + this.state.c4;
    if (this.state.code === code) {
      await auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(async () => {
          console.log('SignUp Success');
          var data = {
            name: this.state.name,
            uname: this.state.uname.toLowerCase(),
            photo: '',
            email: this.state.email,
            loginType: 'basic',
            prof: this.state.prof,
            institution: this.state.profStudent,
          };
          const re = await axios.post(link + '/api/user/signup', data);
          if (re.data.type === 'success') {
            console.log(re.data.success);
            console.log('New User Id:', re.data.success);
            const data2 = {
              uname: this.state.referrelCode.substr(
                1,
                this.state.referrelCode.length - 1,
              ),
              id: re.data.success,
            };
            if (this.state.referrelCode != '') {
              var re2 = await axios.post(link + '/api/user/refer', data2);
              this.handleNotifyOthers(re.data.success);
            } else {
              this.handleNotifyOthers(re.data.success);
            }
          }
        })
        .catch((err) => {
          if (err.code === 'auth/invalid-email') {
            this.setState({
              loading: false,
            });
            Snackbar.show({
              text: 'Email Id is not valid!',
              duration: Snackbar.LENGTH_SHORT,
            });
          } else if (err.code === 'auth/email-already-in-use') {
            this.setState({
              loading: false,
            });
            Snackbar.show({
              text: 'User already exist please login!',
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            console.log(err);
            Snackbar.show({
              text: 'Unknown Error!',
              duration: Snackbar.LENGTH_SHORT,
            });
            this.setState({
              loading: false,
            });
          }
        });
    } else {
      Snackbar.show({
        text: 'Wrong verification code entered!',
        duration: Snackbar.LENGTH_SHORT,
      });
      this.setState({
        loading: false,
      });
    }
  };

  handleNotifyOthers = (id) => {
    this.setState({
      showSuccess: true,
      loading: false,
    });
    var pushList = this.state.contacts;
    this.state.contacts.map((contact) => {
      if (contact.email !== this.state.email) {
        pushList.push(contact);
      }
    });
    for (var i = 0; i < pushList.length; i++) {
      this.sendPushNotification(
        'user',
        id,
        pushList[i].pushToken,
        this.state.name,
      );
    }
    setTimeout(() => {
      this.props.navigation.dispatch(
        CommonActions.reset({
          routes: [{name: 'Main'}],
        }),
      );
    }, 5000);
  };

  sendPushNotification = async (e, f, pushToken, name) => {
    const FIREBASE_API_KEY =
      'AAAA-x7BxpY:APA91bGm_UWNpbo0o6aOfVkEaIqRLZAhdh0oCjs-RCxA2qsrYy3LjTzSRzVeoBycvhXT2w2qRZEL2e7nmKa3-kgBRCfUZEyffWlpU8fhOhwaELLC0RpNvUtM6GAdcdC8jhhfaWxq6req';
    var pushTokens = [];
    pushTokens.push(pushToken);
    const message = {
      registration_ids: pushTokens,
      notification: {
        title: this.state.name + 'just joined Byebuyy',
        body: 'One of your contact just joined Byebuyy as ' + this.state.name,
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        type: e,
        id: f,
        date: new Date(),
      },
    };
    var body = JSON.stringify(message);
    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });

    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: body,
    });
    re = response.json();
    console.log('174', re);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.showSuccess ? (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}>
            <View style={{width: 200, height: 200}}>
              <LottieView
                source={require('../assets/433-checked-done.json')}
                autoPlay={true}
                loop={false}
                style={{transform: [{scale: 1.35}]}}
              />
            </View>
            <Text
              style={{
                fontSize: 20,
                color: colors.grey,
                textAlign: 'center',
                marginTop: 20,
                width: '80%',
              }}>
              Congratulation, you have earned 60 days of free access
            </Text>
          </View>
        ) : (
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
                style={{color: colors.baseline}}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 28,
                fontFamily: 'Muli-Regular',
                marginBottom: 20,
                color: colors.white,
              }}>
              {this.state.loading ? 'Signing you up' : 'Sign Up'}
            </Text>
            {this.state.loading ? (
              <ActivityIndicator size="large" color={colors.baseline} />
            ) : (
              <>
                {this.state.showVerfiy === false ? (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputHeader}>Full Name</Text>
                      <TextInput
                        value={this.state.name}
                        onChangeText={(text) => {
                          this.setState({
                            name: text,
                          });
                        }}
                        onSubmitEditing={() => {
                          this.secondTextInput.focus();
                        }}
                        onSubmitEditing={() => this.secondTextInput.focus()}
                        maxLength={25}
                        style={styles.input}></TextInput>
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputHeader}>User Name</Text>
                      <TextInput
                        value={this.state.uname}
                        onChangeText={(text) => {
                          this.setState({
                            uname: text.replace(' ', ''),
                          });
                        }}
                        onSubmitEditing={() => {
                          this.thirdTextInput.focus();
                        }}
                        ref={(input) => {
                          this.secondTextInput = input;
                        }}
                        maxLength={20}
                        style={styles.input}></TextInput>
                    </View>
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
                          this.fourthTextInput.focus();
                        }}
                        ref={(input) => {
                          this.thirdTextInput = input;
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
                          this.fourthTextInput = input;
                        }}
                        style={[styles.input, {paddingRight: 40}]}
                        secureTextEntry={!this.state.show}></TextInput>
                      <TouchableOpacity
                        onPress={() => this.setState({show: !this.state.show})}
                        style={styles.passwordIcon}>
                        {this.state.show ? (
                          <Ionicons
                            name="ios-eye"
                            size={20}
                            style={{color: colors.grey}}
                          />
                        ) : (
                          <Ionicons
                            name="ios-eye-off"
                            size={20}
                            style={{color: colors.grey}}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputHeader}>Profession</Text>
                      <View style={{width: '100%'}}>
                        <SelectInput
                          value={this.state.prof}
                          options={this.state.profs}
                          onCancelEditing={() => console.log('onCancel')}
                          onSubmitEditing={(e) => {
                            this.setState({
                              prof: e,
                            });
                          }}
                          style={styles.input}
                          labelStyle={{fontSize: 16, color: colors.white}}
                        />
                      </View>
                    </View>
                    {this.state.prof === 'Student' ? (
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputHeader}>Institution</Text>
                        <TextInput
                          value={this.state.profStudent}
                          onChangeText={(text) => {
                            this.setState({
                              profStudent: text,
                            });
                          }}
                          maxLength={21}
                          style={styles.input}></TextInput>
                      </View>
                    ) : null}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputHeader}>Referrel Code</Text>
                      <TextInput
                        value={this.state.referrelCode}
                        onChangeText={(text) => {
                          this.setState({
                            referrelCode: text,
                          });
                        }}
                        maxLength={50}
                        style={styles.input}></TextInput>
                    </View>
                    <View
                      style={[
                        styles.inputContainer,
                        {flexDirection: 'row', margin: 0, alignItems: 'center'},
                      ]}>
                      {this.state.accept ? (
                        <Ionicons
                          onPress={() => this.setState({accept: false})}
                          name="ios-radio-button-on"
                          size={(6 / 100) * width}
                          style={{color: colors.baseline, marginRight: 15}}
                        />
                      ) : (
                        <Ionicons
                          onPress={() => this.setState({accept: true})}
                          name="ios-radio-button-off"
                          size={(6 / 100) * width}
                          style={{color: colors.grey, marginRight: 15}}
                        />
                      )}
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.grey,
                          width: '90%',
                          fontFamily: 'Muli-Regular',
                        }}>
                        I accept{' '}
                        <Text
                          onPress={() =>
                            this.props.navigation.navigate('Privacy')
                          }
                          style={{color: colors.baseline}}>
                          Privacy Policy
                        </Text>{' '}
                        &{' '}
                        <Text
                          onPress={() =>
                            this.props.navigation.navigate('Terms')
                          }
                          style={{color: colors.baseline}}>
                          Terms and Conditions
                        </Text>
                        .
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={this.handleSignUp}
                      style={styles.button}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.white,
                          fontFamily: 'Muli-Bold',
                        }}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.subHeader}>
                      Please enter the 4 digit code send to your email
                    </Text>
                    <View style={styles.codeContainer}>
                      <TextInput
                        keyboardType="phone-pad"
                        onChangeText={(text) => {
                          this.setState({
                            c1: text,
                          });
                          this.child2.current.focus();
                        }}
                        onSubmitEditing={() => {
                          this.child2.current.focus();
                        }}
                        value={this.state.c1}
                        style={styles.code}
                        ref={this.child1}
                      />
                      <TextInput
                        keyboardType="phone-pad"
                        onChangeText={(text) => {
                          this.setState({
                            c2: text,
                          });
                          this.child3.current.focus();
                        }}
                        onSubmitEditing={() => {
                          this.child3.current.focus();
                        }}
                        value={this.state.c2}
                        style={styles.code}
                        ref={this.child2}
                      />
                      <TextInput
                        keyboardType="phone-pad"
                        onChangeText={(text) => {
                          this.setState({
                            c3: text,
                          });
                          this.child4.current.focus();
                        }}
                        onSubmitEditing={() => {
                          this.child4.current.focus();
                        }}
                        value={this.state.c3}
                        style={styles.code}
                        ref={this.child3}
                      />
                      <TextInput
                        keyboardType="phone-pad"
                        onChangeText={(text) => {
                          this.setState({
                            c4: text,
                          });
                        }}
                        value={this.state.c4}
                        style={styles.code}
                        ref={this.child4}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={this.handleVerfiy}
                      style={styles.button}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.white,
                          fontFamily: 'Muli-Bold',
                        }}>
                        Verify
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </ScrollView>
        )}
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
    marginBottom: 15,
    position: 'relative',
  },
  inputHeader: {
    fontSize: 14,
    color: colors.grey,
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
    justifyContent: 'center',
  },
  subHeader: {
    fontFamily: 'Muli-Regular',
    color: colors.white,
    fontSize: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  code: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: colors.baseline,
    borderRadius: 5,
    fontSize: 20,
    fontFamily: 'Muli-Bold',
    color: colors.white,
    textAlign: 'center',
  },
});
