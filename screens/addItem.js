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
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
var RNFS = require('react-native-fs');
import Snackbar from 'react-native-snackbar';
import LottieView from 'lottie-react-native';
import * as Progress from 'react-native-progress';
import SelectInput from 'react-native-select-input-ios';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import axios from 'axios';
import link from '../fetchPath';

const {width, height} = Dimensions.get('window');
export default class AddItem extends React.Component {
  constructor() {
    super();
    var date = new Date();
    var day = date.getDate();
    var day2 = date.getDate() + 1;
    var month = date.getMonth() + 1;
    var month2 = date.getMonth() + 1;
    var month3 = date.getMonth() + 1;
    var day3;
    day3 = day2 + 29;
    month3 = month2;
    var year = date.getFullYear();
    var year2 = year;
    if ((0 == year % 4 && 0 != year % 100) || 0 == year % 400) {
      if (month2 === 2 && day2 > 29) {
        day2 = day2 - 29;
        month2 = month2 + 1;
        day3 = day2 + 29;
        month3 = month2;
      }
      if (
        day2 > 30 &&
        (month2 === 4 || month2 === 6 || month2 === 9 || month2 === 11)
      ) {
        day2 = day2 - 30;
        month2 = month2 + 1;
        day3 = day2 + 29;
        month3 = month2;
      }
      if (
        day2 > 31 &&
        (month2 === 1 ||
          month2 === 3 ||
          month2 === 5 ||
          month2 === 7 ||
          month2 === 8 ||
          month2 === 10)
      ) {
        day2 = day2 - 31;
        month2 = month2 + 1;
        day3 = day2 + 29;
        month3 = month2;
      }
      if (day2 > 31 && month2 === 12) {
        day2 = day2 - 31;
        month2 = 1;
        year = year + 1;
        day3 = day2 + 29;
        month3 = month2;
      }
      if (month3 === 2 && day3 > 29) {
        day3 = day3 - 29;
        month3 = month3 + 1;
      }
      if (
        day3 > 30 &&
        (month3 === 4 || month3 === 6 || month3 === 9 || month3 === 11)
      ) {
        day3 = day3 - 30;
        month3 = month3 + 1;
      }
      if (
        day3 > 31 &&
        (month3 === 1 ||
          month3 === 3 ||
          month3 === 5 ||
          month3 === 7 ||
          month3 === 8 ||
          month3 === 10)
      ) {
        day3 = day3 - 31;
        month3 = month3 + 1;
      }
      if (day3 > 31 && month3 === 12) {
        day3 = day3 - 31;
        month3 = 1;
        year2 = year2 + 1;
      }
    } else {
      if (month2 > 12) {
        month2 = month2 - 12;
        month3 = month3 - 12;
      }
      if (month2 === 2 && day2 > 28) {
        day2 = day2 - 28;
        month2 = month2 + 1;
        day3 = day2 + 29;
        month3 = month2;
      }
      if (
        day2 > 30 &&
        (month2 === 4 || month2 === 6 || month2 === 9 || month2 === 11)
      ) {
        day2 = day2 - 30;
        month2 = month2 + 1;
        day3 = day2 + 29;
        month3 = month2;
      }
      if (
        day2 > 31 &&
        (month2 === 1 ||
          month2 === 3 ||
          month2 === 5 ||
          month2 === 7 ||
          month2 === 8 ||
          month2 === 10)
      ) {
        day2 = day2 - 31;
        month2 = month2 + 1;
        day3 = day2 + 29;
        month3 = month2;
      }
      if (day2 > 31 && month2 === 12) {
        day2 = day2 - 31;
        month2 = 1;
        year = year + 1;
        day3 = day2 + 29;
        month3 = month2;
      }
      if (month3 === 2 && day3 > 28) {
        day3 = day3 - 28;
        month3 = month3 + 1;
      }
      if (
        day3 > 30 &&
        (month3 === 4 || month3 === 6 || month3 === 9 || month3 === 11)
      ) {
        day3 = day3 - 30;
        month3 = month3 + 1;
      }
      if (
        day3 > 31 &&
        (month3 === 1 ||
          month3 === 3 ||
          month3 === 5 ||
          month3 === 7 ||
          month3 === 8 ||
          month3 === 10)
      ) {
        day3 = day3 - 31;
        month3 = month3 + 1;
      }
      if (day3 > 31 && month3 === 12) {
        day3 = day3 - 31;
        month3 = 1;
        year2 = year2 + 1;
      }
      console.log(day3);
    }
    if (day < 10) {
      day = ('0' + day).slice(-2);
    }
    if (day2 < 10) {
      day2 = ('0' + day2).slice(-2);
    }
    if (day3 < 10) {
      day3 = ('0' + day3).slice(-2);
    }
    if (month < 10) {
      month = ('0' + month).slice(-2);
    }
    if (month2 < 10) {
      month2 = ('0' + month2).slice(-2);
    }
    if (month3 < 10) {
      month3 = ('0' + month3).slice(-2);
    }
    var minDate = year + '-' + month + '-' + day;
    var minDate2 = year + '-' + month2 + '-' + day2;
    var maxDate2 = year + '-' + month3 + '-' + day3;
    console.log(minDate2, maxDate2);
    this.state = {
      type: 0,
      wyh: '',
      wye: '',
      sfd: minDate,
      std: '',
      giveaway: false,
      category: '',
      desc: '',
      city: '',
      images: [],
      loading: false,
      modalVisible: false,
      visible: true,
      contentLoading: true,
      categories: [],
      neighbourhood: '',
      minDate: minDate,
      minDate2: minDate2,
      maxDate2: maxDate2,
      success: false,
      lat: '',
      long: '',
      loadingLocation: false,
      country: '',
      code: '',
      quantity: 1,
      types: [
        {label: 'Select a type', value: 0},
        {label: 'Exchange', value: 1},
        {label: 'Borrow', value: 2},
        {label: 'Donate', value: 3},
      ],
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
    };
  }

  async componentDidMount() {
    var res2 = await axios.get(link + '/api/categories');
    if (res2.data) {
      var categories = [],
        x = {};
      x['value'] = '';
      x['label'] = 'Select a category';
      categories.push(x);
      res2.data.map((item) => {
        var x2 = {};
        x2['value'] = item.name;
        x2['label'] = item.name;
        categories.push(x2);
      });
      console.log(categories);
      this.setState({
        categories: categories,
        contentLoading: false,
      });
    }
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
          } else if (item.types.includes('sublocality_level_1')) {
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

  handlePicker = () => {
    this.props.navigation.navigate('PickPhotos', {
      handleImages: (e) => this.handleImages(e),
      images: this.state.images,
    });
  };

  handleImages = (e) => {
    console.log('ADD ITEM:', e);
    this.setState({
      images: e,
    });
  };

  handleSubmit = async () => {
    console.log('Running Add Item');
    var props = this.props;
    if (this.state.type === 0) {
      Snackbar.show({
        text: 'Please select a type',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (this.state.wyh === '') {
      Snackbar.show({
        text: 'What do you have ? cannot be blank',
        duration: Snackbar.LENGTH_SHORT,
      });
      this.setState({
        loading: false,
      });
    } else if (this.state.wye === '' && this.state.type === 1) {
      Snackbar.show({
        text: 'What do you want to exchnage with ? cannot be blank',
        duration: Snackbar.LENGTH_SHORT,
      });
      this.setState({
        loading: false,
      });
    } else if (
      this.state.sfd === '' &&
      this.state.type === 2 &&
      this.state.giveaway === false
    ) {
      Snackbar.show({
        text: 'Please select a share from date',
        duration: Snackbar.LENGTH_SHORT,
      });
      this.setState({
        loading: false,
      });
    } else if (
      this.state.std === '' &&
      this.state.type === 2 &&
      this.state.giveaway === false
    ) {
      Snackbar.show({
        text: 'Please select a share to date',
        duration: Snackbar.LENGTH_SHORT,
      });
      this.setState({
        loading: false,
      });
    } else if (this.state.category === '') {
      Snackbar.show({
        text: 'Please select a product category',
        duration: Snackbar.LENGTH_SHORT,
      });
      this.setState({
        loading: false,
      });
    } else if (this.state.desc === '' || this.state.desc.length < 10) {
      Snackbar.show({
        text: 'Please add a product description of atleast 10 characters',
        duration: Snackbar.LENGTH_SHORT,
      });
      this.setState({
        loading: false,
      });
    } else if (this.state.city === '' && this.state.neighbourhood === '') {
      Snackbar.show({
        text: 'Please add a location',
        duration: Snackbar.LENGTH_SHORT,
      });
      this.setState({
        loading: false,
      });
    } else if (this.state.images.length === 0) {
      Snackbar.show({
        text: 'Please add a image',
        duration: Snackbar.LENGTH_SHORT,
      });
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        loading: true,
      });
      var images = [];
      for (var i = 0; i < this.state.images.length; i++) {
        var url = await this.handleUpload(this.state.images[i]);
        var image = {};
        image['image'] = url;
        image['index'] = this.state.images[i].index;
        image['type'] = this.state.images[i].file.type;
        images.push(image);
      }
      if (this.state.type === 1) {
        var data = {
          varient: 'Product',
          images: images,
          what: this.state.wyh,
          category: this.state.category,
          description: this.state.desc,
          city: this.state.city,
          lat: this.state.lat,
          long: this.state.long,
          neighbourhood: this.state.neighbourhood,
          country: this.state.country,
          code: this.state.code,
          owner: auth().currentUser.email,
          type: 'exchange',
          withh: this.state.wye,
          quantity: this.state.quantity,
          share_from: '',
          share_till: '',
        };
      } else if (this.state.type === 2) {
        var data = {
          varient: 'Product',
          images: images,
          what: this.state.wyh,
          category: this.state.category,
          description: this.state.desc,
          city: this.state.city,
          lat: this.state.lat,
          long: this.state.long,
          neighbourhood: this.state.neighbourhood,
          country: this.state.country,
          code: this.state.code,
          owner: auth().currentUser.email,
          type: 'borrow',
          withh: '',
          quantity: this.state.quantity,
          share_from: this.state.sfd,
          share_till: this.state.std,
        };
      } else {
        var data = {
          varient: 'Product',
          images: images,
          what: this.state.wyh,
          category: this.state.category,
          description: this.state.desc,
          city: this.state.city,
          lat: this.state.lat,
          long: this.state.long,
          neighbourhood: this.state.neighbourhood,
          country: this.state.country,
          code: this.state.code,
          owner: auth().currentUser.email,
          type: 'donate',
          withh: '',
          quantity: this.state.quantity,
          share_from: '',
          share_till: '',
        };
      }
      const res = await axios.post(link + '/api/postProduct', data);
      if (res.data.type === 'success') {
        this.props.route.params.handleShowNew();
        this.setState(
          {
            loading: false,
            visible: true,
            success: true,
          },
          () => {
            setTimeout(function () {
              props.navigation.pop();
            }, 2000);
          },
        );
      } else {
        this.setState({
          loading: false,
        });
      }
    }
  };

  handleUpload = async (e) => {
    console.log('Running Upload');
    var topic = '';
    if (this.state.type === 1) {
      topic = 'Ready to exchange ' + this.state.wyh + ' with ' + this.state.wye;
    } else if (this.state.type === 2) {
      topic = 'Ready to borrow ' + this.state.wyh;
    } else {
      topic = 'Ready to donate ' + this.state.wyh;
    }
    var y;
    var storageRef = storage().ref(
      `users/${auth().currentUser.email}/products/${topic}/${e.key}`,
    );
    await RNFS.readFile(e.uri, 'base64').then(async (result) => {
      await storageRef.putString(result, 'base64', {
        contentType: 'jpg',
      });
    });
    await storageRef.getDownloadURL().then((url) => {
      y = url;
    });
    return y;
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
              color="#d65a31"
              indeterminate={true}
            />
            <Text
              style={{
                color: '#e5e5e5',
                fontSize: 20,
                marginTop: 30,
                textAlign: 'center',
              }}>
              Adding Product
            </Text>
          </View>
        ) : (
          <View style={{width: '100%', flex: 1}}>
            {this.state.success ? (
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  backgroundColor: '#15202B',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{width: 200, height: 200}}>
                  <LottieView
                    source={require('../assets/433-checked-done.json')}
                    autoPlay={true}
                    loop={false}
                    style={{transform: [{scale: 1.5}]}}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    color: '#e5e5e5',
                    textAlign: 'center',
                    marginTop: 20,
                    width: '80%',
                  }}>
                  Product Posted Succesfully
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View style={{width: '100%', flex: 1}}>
                  <View style={styles.header}>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={styles.action}
                        onPress={() => this.props.navigation.pop()}>
                        <Ionicons
                          name="ios-close"
                          size={30}
                          style={{color: '#d65a31'}}
                        />
                      </TouchableOpacity>
                      <Text style={styles.headerText}>Add Product</Text>
                    </View>
                    <TouchableOpacity onPress={this.handleSubmit}>
                      <Ionicons
                        name="ios-checkmark"
                        size={35}
                        color="#d65a31"
                      />
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    style={{width: '100%'}}>
                    <View
                      style={{
                        width: '100%',
                        alignItems: 'center',
                        paddingVertical: 10,
                      }}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputGroupText}>Type</Text>
                        <View style={{width: '100%'}}>
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
                            labelStyle={{fontSize: 16, color: '#464646'}}
                          />
                        </View>
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputGroupText}>
                          What do you have ?
                        </Text>
                        <TextInput
                          style={styles.input}
                          autoCapitalize="none"
                          maxLength={40}
                          onChangeText={(wyh) => this.setState({wyh})}
                          value={this.state.wyh}></TextInput>
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputGroupText}>
                          Describe what you have
                        </Text>
                        <TextInput
                          style={styles.inputArea}
                          autoCapitalize="none"
                          multiline={true}
                          maxLength={400}
                          onChangeText={(desc) => this.setState({desc})}
                          value={this.state.desc}></TextInput>
                      </View>
                      {this.state.type === 1 ? (
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputGroupText}>
                            What do you want to exchange with ?
                          </Text>
                          <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            maxLength={40}
                            onChangeText={(wye) => this.setState({wye})}
                            value={this.state.wye}></TextInput>
                        </View>
                      ) : null}

                      {this.state.type === 2 ? (
                        <>
                          <View style={styles.DateGroup}>
                            <View style={styles.inputGroupRow}>
                              <Text style={styles.inputGroupText}>
                                Share from
                              </Text>
                              <DatePicker
                                style={{width: width * 0.4, marginTop: 5}}
                                date={this.state.sfd}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
                                minDate={this.state.minDate}
                                maxDate={this.state.minDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                  dateIcon: {
                                    position: 'absolute',
                                    right: 0,
                                    marginLeft: 0,
                                  },
                                  dateInput: {
                                    marginRight: 40,
                                    backgroundColor: '#e5e5e5',
                                    color: '192734',
                                    borderRadius: 3,
                                    borderWidth: 0,
                                  },
                                  // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => {
                                  this.setState({sfd: date});
                                }}
                              />
                            </View>
                            <View>
                              <Text style={styles.inputGroupText}>
                                Share to
                              </Text>
                              <DatePicker
                                style={{width: width * 0.4, marginTop: 5}}
                                date={this.state.std}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
                                minDate={this.state.minDate2}
                                maxDate={this.state.maxDate2}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                  dateIcon: {
                                    position: 'absolute',
                                    right: 0,
                                    marginLeft: 0,
                                  },
                                  dateInput: {
                                    marginRight: 40,
                                    backgroundColor: '#e5e5e5',
                                    color: '192734',
                                    borderRadius: 3,
                                    borderWidth: 0,
                                  },
                                  // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => {
                                  this.setState({std: date});
                                }}
                              />
                            </View>
                          </View>
                        </>
                      ) : null}
                      <View
                        style={{
                          width: '90%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View style={styles.inputGroup2}>
                          <Text style={styles.inputGroupText}>Category</Text>
                          <View style={{width: '100%'}}>
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
                              labelStyle={{fontSize: 16, color: '#464646'}}
                            />
                          </View>
                        </View>
                        {/* <View style={styles.inputGroup3}>
                              <Text style={styles.inputGroupText}>Quantity</Text>
                              <View style={{ width: '100%' }}>
                                <SelectInput
                                  value={this.state.quantity}
                                  options={this.state.quantities}
                                  onCancelEditing={() => console.log('onCancel')}
                                  onSubmitEditing={(e) => {
                                    this.setState({
                                      quantity: e,
                                    });
                                  }}
                                  style={styles.picker}
                                  labelStyle={{ fontSize: 16, color: '#464646' }}
                                />
                              </View>
                            </View> */}
                      </View>

                      {this.state.loadingLocation ? (
                        <View
                          style={{
                            width: '90%',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View style={{width: '10%'}}>
                            <ActivityIndicator size="large" color="#d65a31" />
                          </View>
                          <Text
                            style={{
                              fontSize: 16,
                              color: '#ACADAA',
                              marginLeft: 10,
                            }}>
                            Finding Location
                          </Text>
                        </View>
                      ) : (
                        <>
                          {this.state.city.length > 0 &&
                          this.state.neighbourhood.length > 0 ? (
                            <View style={{width: '90%'}}>
                              <Text style={styles.inputGroupText}>
                                Location
                              </Text>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: '#d65a31',
                                  fontFamily: 'Muli-Bold',
                                }}>
                                {this.state.neighbourhood} ,{this.state.city} ,
                                {this.state.country}
                              </Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={this.handleLocation}
                              style={{
                                width: '90%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                marginTop: 10,
                              }}>
                              <AntDesign
                                name="pluscircle"
                                style={{fontSize: 30, color: '#d65a31'}}
                              />
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: '#ACADAA',
                                  marginLeft: 10,
                                  fontFamily: 'Muli-Bold',
                                }}>
                                Add Location
                              </Text>
                            </TouchableOpacity>
                          )}
                        </>
                      )}
                      <View
                        style={[
                          styles.inputGroup,
                          {marginTop: 20, marginBottom: 30},
                        ]}>
                        <Text style={styles.inputGroupText}>Images</Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                            flexWrap: 'wrap',
                            marginTop: 5,
                          }}>
                          {this.state.images.length > 0 ? (
                            <>
                              {this.state.images.map((image) => {
                                return (
                                  <View styles={{position: 'relative'}}>
                                    <Image
                                      source={{uri: image.uri}}
                                      style={styles.imagePicker}
                                    />
                                    <TouchableOpacity
                                      onPress={this.handlePicker}
                                      style={styles.editLogo}>
                                      <AntDesign
                                        name="edit"
                                        style={{fontSize: 16, color: '#e5e5e5'}}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                );
                              })}
                            </>
                          ) : null}
                          {this.state.images.length < 5 ? (
                            <TouchableOpacity
                              onPress={this.handlePicker}
                              style={styles.imagePicker}>
                              <AntDesign name="plus" style={styles.upload} />
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                </View>
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
    backgroundColor: '#15202B',
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#192734',
    elevation: 3,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#e5e5e5',
    fontFamily: 'Muli-Bold',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.5,
  },
  selectorText: {
    fontSize: 14,
    color: '#e5e5e5',
    fontFamily: 'Muli-Bold',
  },
  inputGroup: {
    width: '90%',
    marginBottom: 15,
  },
  inputGroup2: {
    width: '100%',
    marginBottom: 15,
  },
  inputGroup3: {
    width: '35%',
    marginBottom: 15,
  },
  inputGroupText: {
    fontSize: 14,
    color: '#ACADAA',
    fontFamily: 'Muli-Bold',
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
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    borderRadius: 3,
  },
  imagePicker: {
    width: width * 0.27,
    height: width * 0.27,
    backgroundColor: '#d65a31',
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
    backgroundColor: '#d65a31',
    padding: 12,
    borderRadius: 20,
    elevation: 5,
    zIndex: 5,
  },
  upload: {
    fontSize: 60,
    color: '#fff',
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
