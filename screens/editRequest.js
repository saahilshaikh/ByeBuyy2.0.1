import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
var RNFS = require('react-native-fs');
import Snackbar from 'react-native-snackbar';
import LottieView from 'lottie-react-native';
import * as Progress from 'react-native-progress';
import SelectInput from 'react-native-select-input-ios';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import LoadingScreen from './loadingScreen';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');
export default class EditRequest extends React.Component {
  constructor() {
    super();
    this.state = {
      category: '',
      desc: '',
      city: '',
      loading: false,
      modalVisible: false,
      visible: true,
      contentLoading: true,
      categories: [],
      type: '',
      types: [
        { label: 'Select a type', value: '' },
        { label: 'Borrow', value: 'borrow' },
        { label: 'Donate', value: 'donate' },
      ],
      neighbourhood: '',
      success: false,
      lat: '',
      long: '',
      loadingLocation: false,
      country: '',
      code: '',
      quantity: 1,
      quantities: [
        {
          value: 1,
          label: '1',
        },
        {
          value: 2,
          label: '2',
        },
        {
          value: 3,
          label: '3',
        },
        {
          value: 4,
          label: '4',
        },
        {
          value: 5,
          label: '5',
        },
        {
          value: 6,
          label: '6',
        },

        {
          value: 7,
          label: '7',
        },
        {
          value: 8,
          label: '8',
        },
        {
          value: 9,
          label: '9',
        },
        {
          value: 10,
          label: '10',
        },
      ],
      subcategory: '',
      bcategories: [
        { label: 'Action and adventure', value: 'Action and adventure' },
        { label: 'Biography', value: 'Biography' },
        { label: 'College', value: 'College' },
        { label: 'Comic', value: 'Comic' },
        { label: 'Competitive exams', value: 'Competitive exams' },
        { label: 'Cooking', value: 'Cooking' },
        { label: 'Fiction', value: 'Fiction' },
        { label: 'Non-Fiction', value: 'Non-Fiction' },
        { label: 'History', value: 'History' },
        { label: 'Horror', value: 'Horror' },
        { label: 'Novel & literature', value: 'Novel & literature' },
        { label: 'Others', value: 'Others' },
        { label: 'Pre school', value: 'Pre school' },
        { label: 'Regional language', value: 'Regional language' },
        { label: 'Religous', value: 'Religous' },
        { label: 'Romance', value: 'Romance' },
        { label: 'Sci-Fi', value: 'Sci-Fi' },
        { label: 'Self help', value: 'Self help' },
        { label: 'Suspense and thriller', value: 'Suspense and thriller' },
      ],
    };
  }

  async componentDidMount() {
    var res = await axios.get(link + '/api/categories');
    if (res.data !== null) {
      var categories = [],
        x = {};
      x['value'] = '';
      x['label'] = 'Select a category';
      categories.push(x);
      res.data.map((cat) => {
        var x2 = {};
        x2['value'] = cat.name;
        x2['label'] = cat.name;
        categories.push(x2);
      });
      this.setState({
        categories: categories,
        contentLoading: false,
      });
    }
    var data2 = {
      id: this.props.route.params.id,
    };
    console.log('EDIT ID:', this.props.route.params.id);
    var res2 = await axios.post(link + '/api/product/single', data2);
    console.log('data2:', data2);
    if (res2.data !== null) {
      console.log(res2.data);
      this.setState({
        city: res2.data.city,
        neighbourhood: res2.data.neighbourhood,
        lat: res2.data.lat,
        long: res2.data.long,
        country: res2.data.country,
        code: res2.data.code,
        category: res2.data.category,
        desc: res2.data.description,
        type: res2.data.type,
        subcategory: res2.data.subcategory,
      });
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  handleLocation = async () => {
    Keyboard.dismiss();
    console.log('Accessing Location Service');
    this.setState({
      loadingLocation: true,
    });
    if (Platform.OS === 'android') {
      await this.handlePermissionAndroid();
    } else {
      await this.handlePermissionIOS();
    }
  };

  handlePermissionAndroid = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    console.log('Permission Android');
    this.handleInit(granted);
  };

  handlePermissionIOS = async () => {
    const granted = await Geolocation.requestAuthorization('whenInUse');
    console.log('Permission IOS');
    this.handleInit(granted);
  };

  handleInit = async (granted) => {
    if (granted === 'granted') {
      await this.handlePosition();
    } else if (granted === 'denied') {
      console.log('Denied');
      Snackbar.show({
        text: 'Could not access location service',
        duration: Snackbar.LENGTH_SHORT,
      });
      this.setState({
        loadingLocation: false,
      });
    }
  };

  handlePosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(
          position.coords.latitude + '  ' + position.coords.longitude,
        );
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
        console.log(this.state.lat, this.state.long);
        this.handleGeoCoder(position);
      },
      (error) => {
        this.setState({
          loadingLocation: false,
        });
        Snackbar.show({
          text: 'Please turn on location services',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        showLocationDialog: false,
      },
    );
  };

  handleGeoCoder = async (position) => {
    await Geocoder.from(position.coords.latitude, position.coords.longitude)
      .then((json) => {
        console.log(json.results[0].address_components);
        var country = '',
          code = '',
          city = '',
          neighbourhood = '',
          sublocality = '';
        json.results[0].address_components.map((item) => {
          if (item.types.includes('route')) {
            neighbourhood = item.long_name;
          } else if (item.types.includes('sublocality')) {
            sublocality = item.long_name;
          } else if (item.types.includes('administrative_area_level_2')) {
            city = item.long_name;
          } else if (item.types.includes('country')) {
            country = item.long_name;
            code = item.short_name;
          }
        });
        console.log(country, city, sublocality, neighbourhood, code);
        if (neighbourhood) {
          this.setState({
            city: city,
            neighbourhood: neighbourhood,
            country: country,
            code: code,
            loadingLocation: false,
          });
        } else {
          this.setState({
            city: city,
            neighbourhood: sublocality,
            country: country,
            code: code,
            loadingLocation: false,
          });
        }
      })
      .catch((error) => console.warn(error));
  };

  handleSubmit = async () => {
    var props = this.props;
    if (this.state.desc.replace(/ /g, '').length < 30) {
      Snackbar.show({
        text: 'Please add proper request',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.category === '') {
      Snackbar.show({
        text: 'Please select a product category',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.city === '' && this.state.neighbourhood === '') {
      Snackbar.show({
        text: 'Please add a location',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      var props = this.props;
      this.setState({
        loading: true,
      });
      var data = {
        varient: 'Request',
        images: [],
        what: '',
        category: this.state.category,
        description: this.state.desc,
        city: this.state.city,
        lat: this.state.lat,
        long: this.state.long,
        neighbourhood: this.state.neighbourhood,
        country: this.state.country,
        code: this.state.code,
        withh: this.state.wye,
        quantity: 0,
        share_from: '',
        share_till: '',
        giveaway: false,
        id: this.props.route.params.id,
        type: this.state.type,
        subcategory: this.state.subcategory,
      };
      var res = await axios.post(link + '/api/updateProduct', data);
      if (res.data !== null) {
        if (res.data.type === 'success') {
          this.setState(
            {
              loading: false,
              visible: true,
              success: true,
            },
            () => {
              props.route.params.handleRefresh();
              setTimeout(function () {
                props.navigation.pop();
              }, 2000);
            },
          );
        } else {
          this.setState({
            loading: false,
            visible: true,
            success: true,
          });
          Snackbar.show({
            text: 'Error',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading ? (
          <View
            style={{
              width: '100%',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Progress.Bar
              progress={0.25}
              width={50}
              height={5}
              color={colors.baseline}
              indeterminate={true}
            />
            <Text
              style={{
                color: colors.white,
                fontSize: 20,
                marginTop: 30,
                textAlign: 'center',
              }}>
              Updating Request
            </Text>
          </View>
        ) : (
            <View style={{ width: '100%', flex: 1 }}>
              {this.state.contentLoading ? (
                <LoadingScreen />
              ) : (
                  <View style={{ width: '100%', flex: 1 }}>
                    {this.state.success ? (
                      <View
                        style={{
                          width: '100%',
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{ width: 200, height: 200 }}>
                          <LottieView
                            source={require('../assets/433-checked-done.json')}
                            autoPlay={true}
                            loop={false}
                            style={{ transform: [{ scale: 1.5 }] }}
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 24,
                            color: colors.white,
                            textAlign: 'center',
                            marginTop: 20,
                            width: '80%',
                          }}>
                          Request succesfully updated
                    </Text>
                      </View>
                    ) : (
                        <View
                          style={{
                            flex: 1,
                            width: '100%',
                            alignItems: 'center',
                          }}>
                          <View style={{ width: '100%', flex: 1 }}>
                            <View style={styles.header}>
                              <View
                                style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity
                                  style={styles.action}
                                  onPress={() => this.props.navigation.pop()}>
                                  <Ionicons
                                    name="ios-close"
                                    size={30}
                                    style={{ color: colors.baseline }}
                                  />
                                </TouchableOpacity>
                                <Text style={styles.headerText}>Edit Request</Text>
                              </View>
                              {this.state.loading ? (
                                <ActivityIndicator size="large" color={colors.baseline} />
                              ) : (
                                  <TouchableOpacity onPress={this.handleSubmit}>
                                    <Ionicons
                                      name="ios-checkmark"
                                      size={35}
                                      color={colors.baseline}
                                    />
                                  </TouchableOpacity>
                                )}
                            </View>

                            <ScrollView
                              keyboardShouldPersistTaps="handled"
                              style={{ width: '100%', paddingTop: 10 }}>
                              <View style={{ width: '100%', alignItems: 'center' }}>
                                <View style={styles.inputGroup}>
                                  <Text style={styles.inputGroupText}>Type</Text>
                                  <View style={{ width: '100%' }}>
                                    <SelectInput
                                      value={this.state.type}
                                      options={this.state.types}
                                      onCancelEditing={() => console.log('onCancel')}
                                      onSubmitEditing={(e) => {
                                        this.setState({
                                          type: e,
                                        });
                                      }}
                                      style={styles.picker}
                                      labelStyle={{ fontSize: 16, color: colors.darkText }}
                                    />
                                  </View>
                                </View>
                                <View style={styles.inputGroup}>
                                  <Text style={styles.inputGroupText}>
                                    What do you want to request
                            </Text>
                                  <Text style={this.state.desc.replace(/ /g, '').length >= 20 ? styles.right : styles.wrong}>{this.state.desc.replace(/ /g, '').length}/{this.state.desc.replace(/ /g, '').length >= 20 ? "400" : "20"}</Text>
                                  <TextInput
                                    style={styles.inputArea}
                                    autoCapitalize="none"
                                    multiline={true}
                                    maxLength={300}
                                    onChangeText={(desc) => this.setState({ desc })}
                                    value={this.state.desc}></TextInput>
                                </View>
                                <View style={styles.inputGroup}>
                                  <Text style={styles.inputGroupText}>Category</Text>
                                  <View style={{ width: '100%' }}>
                                    <SelectInput
                                      value={this.state.category}
                                      options={this.state.categories}
                                      onCancelEditing={() => console.log('onCancel')}
                                      onSubmitEditing={(e) => {
                                        this.setState({
                                          category: e,
                                        });
                                      }}
                                      style={styles.picker}
                                      labelStyle={{ fontSize: 16, color: colors.darkText }}
                                    />
                                  </View>
                                </View>
                                {this.state.category === 'Books' ? (
                                  <View style={styles.inputGroup}>
                                    <Text style={styles.inputGroupText}>
                                      Sub-Category
                              </Text>
                                    <View style={{ width: '100%' }}>
                                      <SelectInput
                                        value={this.state.subcategory}
                                        options={this.state.bcategories}
                                        onCancelEditing={() =>
                                          console.log('onCancel')
                                        }
                                        onSubmitEditing={(e) => {
                                          this.setState({
                                            subcategory: e,
                                          });
                                        }}
                                        style={styles.picker}
                                        labelStyle={{ fontSize: 16, color: colors.darkText }}
                                      />
                                    </View>
                                  </View>
                                ) : null}
                                {this.state.loadingLocation ? (
                                  <View
                                    style={{
                                      width: '90%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <View style={{ width: '10%' }}>
                                      <ActivityIndicator
                                        size="large"
                                        color={colors.baseline}
                                      />
                                    </View>
                                    <Text
                                      style={{
                                        fontSize: 16,
                                        color: colors.white,
                                        marginLeft: 10,
                                        fontFamily: 'Muli-Bold',
                                      }}>
                                      Finding Location
                              </Text>
                                  </View>
                                ) : (
                                    <>
                                      <View style={{ width: '90%' }}>
                                        <Text style={styles.inputGroupText}>
                                          Location
                                </Text>
                                        <Text
                                          style={{
                                            fontSize: 16,
                                            color: colors.baseline,
                                            fontFamily: 'Muli-Bold',
                                          }}>
                                          {this.state.neighbourhood} ,{this.state.city}{' '}
                                  ,{this.state.country}
                                        </Text>
                                      </View>
                                      <TouchableOpacity
                                        onPress={this.handleLocation}
                                        style={{
                                          width: '90%',
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          marginTop: 10,
                                        }}>
                                        <Feather
                                          name="arrow-up-circle"
                                          style={{ fontSize: 30, color: colors.baseline }}
                                        />
                                        <Text
                                          style={{
                                            fontSize: 16,
                                            color: colors.white,
                                            marginLeft: 10,
                                            fontFamily: 'Muli-Bold',
                                          }}>
                                          Update to current location
                                </Text>
                                      </TouchableOpacity>
                                    </>
                                  )}
                              </View>
                            </ScrollView>
                          </View>
                        </View>
                      )}
                  </View>
                )}
            </View>
          )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.primary
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: colors.primary2,
    elevation: 3,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    marginLeft: 10,
    color: colors.baseline,
    fontFamily: 'Muli-Bold',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.5,
  },
  selectorText: {
    fontSize: 14,
    color: colors.white,
    fontFamily: 'Muli-Bold',
  },
  inputGroup: {
    width: '90%',
    marginBottom: 15,
    position: 'relative'
  },
  inputGroupText: {
    fontSize: 14,
    color: colors.grey,
    fontFamily: 'Muli-Bold',
  },
  input: {
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
  right: {
    fontSize: 12,
    fontFamily: 'Muli-Regular',
    color: 'green',
    position: 'absolute',
    right: 5,
    top: 25,
    elevation: 10
  },
  wrong: {
    fontSize: 12,
    fontFamily: 'Muli-Regular',
    color: 'red',
    position: 'absolute',
    right: 5,
    top: 25,
    elevation: 10
  },
  DateGroup: {
    width: '90%',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputGroupRow: {
    width: '50%',
  },
  picker: {
    width: '100%',
    marginTop: 5,
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    borderRadius: 3,
  },
  imagePicker: {
    width: width * 0.27,
    height: width * 0.27,
    backgroundColor: colors.baseline,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  editLogo: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    backgroundColor: colors.baseline,
    padding: 12,
    borderRadius: 20,
    elevation: 5,
    zIndex: 5,
  },
  upload: {
    fontSize: 60,
    color: colors.secondary,
  },
  button: {
    paddingHorizontal: 10,
    marginLeft: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  action: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
});
