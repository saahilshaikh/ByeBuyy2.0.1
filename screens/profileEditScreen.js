import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';
import SelectInput from 'react-native-select-input-ios';

var RNFS = require('react-native-fs');

const { width, height } = Dimensions.get('window');

export default class ProfileEditScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      photo: '',
      uname: '',
      editedPhoto: false,
      prof: '',
      bio: '',
      loading: true,
      saving: false,
      profs: [
        { label: 'Select a type', value: '' },
        { label: 'Student', value: 'Student' },
        { label: 'Non-Student', value: 'Non-Student' },
      ],
      profStudent: '',
    };
  }

  async componentDidMount() {
    var data = {
      id: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/user/single', data);
    if (res.data !== null) {
      this.setState({
        name: res.data.name,
        uname: res.data.uname,
        photo: res.data.photo,
        prof: res.data.prof,
        profStudent: res.data.institution,
        loading: false,
      });
    }
  }

  handleSave = async () => {
    this.setState({
      saving: true,
    });
    if (this.state.name === '') {
      this.setState({
        saving: false,
      });
      Snackbar.show({
        text: 'Please enter your name!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.uname === '') {
      this.setState({
        saving: false,
      });
      Snackbar.show({
        text: 'Please enter a user name!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.uname.includes('@')) {
      this.setState({
        saving: false,
      });
      Snackbar.show({
        text: 'User name cannot include @ symbol!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      var err = await this.handleUName();
      if (err === false) {
        if (this.state.editedPhoto) {
          RNFS.readFile(this.state.photo, 'base64').then((result) => {
            storage()
              .ref(`users/${auth().currentUser.email}/profile/profileimage`)
              .putString(result, 'base64', {
                contentType: 'jpg',
              })
              .then(() => {
                storage()
                  .ref(`users/${auth().currentUser.email}/profile/profileimage`)
                  .getDownloadURL()
                  .then(async (url) => {
                    var data = {
                      email: auth().currentUser.email,
                      name: this.state.name,
                      uname: this.state.uname,
                      photo: url,
                      prof: this.state.prof,
                      profStudent: this.state.profStudent,
                    };
                    var res = await axios.post(
                      link + '/api/user/editWithImage',
                      data,
                    );
                    if (res.data !== null) {
                      this.setState({
                        saving: false,
                      });
                      this.props.route.params.handleRefresh();
                      this.props.navigation.pop();
                    }
                  });
              })
              .catch((err) => {
                console.log('Firebase' + err);
                this.setState({
                  saving: false,
                });
                Snackbar.show({
                  text: 'Error',
                  duration: Snackbar.LENGTH_SHORT,
                });
              });
          });
        } else {
          var data = {
            email: auth().currentUser.email,
            name: this.state.name,
            uname: this.state.uname.toLowerCase(),
            prof: this.state.prof,
            profStudent: this.state.profStudent,
          };
          var res = await axios.post(link + '/api/user/edit', data);
          if (res.data !== null) {
            this.setState({
              saving: false,
            });
            this.props.route.params.handleRefresh();
            this.props.navigation.pop();
          }
        }
      } else {
        Snackbar.show({
          text: 'User name already taken!',
          duration: Snackbar.LENGTH_SHORT,
        });
        this.setState({
          saving: false,
        });
      }
    }
  };

  handleUName = async () => {
    var result = false;
    var res = await axios.get(link + '/api/userUname/' + this.state.uname);
    if (res.data !== null) {
      res.data.map((data) => {
        if (
          data.email !== auth().currentUser.email &&
          data.uname === this.state.uname.toLowerCase()
        ) {
          result = true;
        }
      });
    }
    return result;
  };

  handleImageChange = () => {
    Keyboard.dismiss();
    console.log('Edit Photo');
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      multiple: false,
      mediaType: 'photo',
    })
      .then((item) => {
        console.log(item);
        this.setState({
          photo: item.path,
          editedPhoto: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            backgroundColor: colors.primary2,
            paddingHorizontal: 15,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: 60,
            elevation: 3
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={() => this.props.navigation.pop()}>
              <Ionicons name="ios-close" size={30} color={colors.baseline} />
            </TouchableOpacity>
            <Text style={styles.header}>Edit Profile</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {this.state.saving ? (
              <ActivityIndicator size="large" color={colors.baseline} />
            ) : (
                <TouchableOpacity onPress={this.handleSave}>
                  <Ionicons
                    name="ios-checkmark"
                    size={30}
                    color={colors.baseline}
                  />
                </TouchableOpacity>
              )}
          </View>
        </View>
        <ScrollView style={{ width: '100%', flex: 1, paddingTop: 10 }}>
          {!this.state.loading ? (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <View style={styles.profileImageBox}>
                {this.state.photo ? (
                  <Image
                    source={{ uri: this.state.photo }}
                    style={styles.profileImage}
                  />
                ) : (
                    <View style={styles.profileImageTextBox}>
                      <Text style={styles.imageText}>
                        {this.state.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                <TouchableOpacity
                  onPress={this.handleImageChange}
                  style={styles.profileEditButton}>
                  <Ionicons
                    name="ios-camera"
                    size={24}
                    color={colors.baseline}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputGroupText}>Your name</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  maxLength={25}
                  onChangeText={(name) => this.setState({ name })}
                  value={this.state.name}></TextInput>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputGroupText}>User name</Text>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Muli-Bold',
                      fontSize: 20,
                      color: colors.baseline,
                      marginLeft: 5,
                    }}>
                    @
                  </Text>
                  <TextInput
                    style={[styles.input, { width: '90%' }]}
                    autoCapitalize="none"
                    maxLength={20}
                    autoCorrect={false}
                    onChangeText={(uname) =>
                      this.setState({ uname: uname.replace(' ', '') })
                    }
                    value={this.state.uname}></TextInput>
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputGroupText}>Profession</Text>
                <View style={{ width: '100%' }}>
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
                    labelStyle={{
                      fontSize: 16,
                      color: colors.darkText,
                      fontFamily: 'Muli-Regular',
                    }}
                  />
                </View>
              </View>
              {this.state.prof === 'Student' ? (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputGroupText}>Institution</Text>
                  <TextInput
                    value={this.state.profStudent}
                    onChangeText={(text) => {
                      this.setState({
                        profStudent: text,
                      });
                    }}
                    ref={(input) => {
                      this.fourthTextInput = input;
                    }}
                    maxLength={50}
                    style={styles.input}></TextInput>
                </View>
              ) : null}
            </View>
          ) : (
              <ActivityIndicator size="large" color={colors.baseline} />
            )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.primary,
    position: 'relative',
  },
  header: {
    color: colors.baseline,
    fontSize: 20,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  profileImageBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImageTextBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  imageText: {
    fontFamily: 'Muli-Bold',
    fontSize: 35,
    color: colors.darkText,
  },
  profileEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  inputGroup: {
    width: '90%',
    marginBottom: 15,
  },
  inputGroupText: {
    fontSize: 14,
    color: colors.grey,
    fontFamily: 'Muli-Bold',
  },
  input: {
    width: '100%',
    marginTop: 5,
    height: 50,
    backgroundColor: colors.white,
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    color: colors.darkText,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 3,
  },
  inputArea: {
    marginTop: 5,
    backgroundColor: colors.white,
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    color: colors.darkText,
    padding: 10,
    height: 200,
    textAlignVertical: 'top',
    borderRadius: 3,
  },
});
