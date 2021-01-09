import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Linking,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../appTheme';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import auth from '@react-native-firebase/auth';
import link from '../fetchPath';
const {width, height} = Dimensions.get('window');

export default class FeedbackScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      feedback: '',
      email: '',
      success: false,
      loading: false,
    };
  }

  async componentDidMount() {
    if (auth().currentUser) {
      this.setState({
        email: auth().currentUser.email,
      });
    }
  }

  handleBack = () => {
    this.props.navigation.pop();
    this.props.route.params.handleBack();
  };

  handleFeedback = async () => {
    if (
      this.state.email.replace(/ /g, '').length === 0 ||
      !this.state.email.includes('@')
    ) {
      Snackbar.show({
        text: 'Please enter a proper email!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.feedback.replace(/ /g, '').length < 10) {
      Snackbar.show({
        text: 'Please enter a proper feedback!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      this.setState({
        feedback: '',
        loading: true,
      });
      var data = {
        email: this.state.email,
        feedback: this.state.feedback,
      };
      var res = await axios.post(link + '/api/saveFeedback', data);
      if (res.data !== null) {
        if (res.data.type === 'success') {
          this.setState({
            success: true,
            loading: false,
          });
        }
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            backgroundColor: '#1B1F22',
            paddingHorizontal: 20,
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            elevation: 5,
          }}>
          <TouchableOpacity onPress={this.handleBack}>
            <Ionicons name="ios-arrow-back" size={30} color={colors.baseline} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 10,
            }}>
            <View style={{width: 30, height: 30}}>
              <Image
                style={{width: '100%', height: '100%'}}
                source={require('../assets/images/icon.png')}
              />
            </View>
            <Text style={styles.header}>
              bye<Text style={styles.header2}>buyy</Text>
            </Text>
          </View>
        </View>
        <ScrollView style={{width: '100%', flex: 1}}>
          {this.state.success ? (
            <View style={{width: '100%', flex: 1, alignItems: 'center'}}>
              <View style={{width: '80%', flex: 1, alignItems: 'center'}}>
                <View style={{width: 500, height: 500}}>
                  <LottieView
                    source={require('../assets/40991-man-with-a-pencil.json')}
                    autoPlay={true}
                    loop={true}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 30,
                    fontFamily: 'Muli-Bold',
                    color: colors.baseline,
                  }}>
                  Thank you!
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Muli-Regular',
                    color: colors.grey,
                    textAlign: 'center',
                  }}>
                  By making your voice heard, you help us improve{' '}
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Muli-Bold',
                      color: colors.grey,
                      textAlign: 'center',
                    }}>
                    ByeBuyy
                  </Text>
                </Text>
              </View>
            </View>
          ) : (
            <View style={{width: '100%', flex: 1}}>
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: 'Muli-Bold',
                  color: colors.baseline,
                  marginLeft: 20,
                  marginTop: 20,
                }}>
                Give feedback
              </Text>
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <View
                  style={{
                    width: '90%',
                    flex: 1,
                  }}>
                  <View style={styles.inputGroup}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Muli-Regular',
                        color: colors.grey,
                      }}>
                      Enter your email
                    </Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      maxLength={100}
                      onChangeText={(email) => this.setState({email})}
                      value={this.state.email}></TextInput>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Muli-Regular',
                        color: colors.grey,
                      }}>
                      Share your feedback ...
                    </Text>
                    <TextInput
                      style={styles.inputArea}
                      autoCapitalize="none"
                      multiline={true}
                      maxLength={400}
                      onChangeText={(feedback) => this.setState({feedback})}
                      value={this.state.feedback}></TextInput>
                  </View>
                </View>
                {this.state.loading ? (
                  <ActivityIndicator
                    color={colors.baseline}
                    size="large"
                    style={{marginTop: 20}}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={this.handleFeedback}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Share Feedback</Text>
                  </TouchableOpacity>
                )}
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
    position: 'relative',
    backgroundColor: colors.primary,
  },
  header: {
    color: colors.white,
    fontSize: 20,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  header2: {
    color: colors.baseline,
    fontSize: 20,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginLeft: 10,
  },
  input: {
    marginTop: 5,
    height: 50,
    backgroundColor: '#e5e5e5',
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    color: '#464646',
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 20,
  },
  inputArea: {
    marginTop: 5,
    backgroundColor: '#e5e5e5',
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    color: '#464646',
    padding: 10,
    height: 200,
    textAlignVertical: 'top',
    borderRadius: 3,
  },
  button: {
    width: '90%',
    height: 55,
    backgroundColor: colors.baseline,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 25,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Muli-Regular',
    color: colors.white,
  },
});
