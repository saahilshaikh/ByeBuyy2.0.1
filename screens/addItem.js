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
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'react-moment';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');
export default class AddItem extends React.Component {
  constructor() {
    super();
    var minDate = new Date();
    var minDate2 = new Date();
    var maxDate2 = new Date();
    maxDate2.setDate(maxDate2.getDate() + 30);
    console.log(minDate2, maxDate2);
    this.state = {
      type: 0,
      wyh: '',
      wye: '',
      sfd: '',
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
      dCategories: [],
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
      expiry: new Date(),
      types: [
        { label: 'Select a type', value: 0 },
        { label: 'Exchange', value: 1 },
        { label: 'Lend', value: 2 },
        { label: 'Donate', value: 3 },
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
      showMode: 'date',
      showTime: false,
      from: new Date(),
      to: new Date(),
      subcategory: 'Action and adventure',
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
        { label: 'Religious', value: 'Religious' },
        { label: 'Romance', value: 'Romance' },
        { label: 'Sci-Fi', value: 'Sci-Fi' },
        { label: 'Self help', value: 'Self help' },
        { label: 'Suspense and thriller', value: 'Suspense and thriller' },
      ],
      value: '0',
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
      this.setState(
        {
          categories: categories,
          contentLoading: false,
        },
        () => {
          console.log(this.state.categories);
        },
      );
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
        backgroundColor: colors.baseline,
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
          backgroundColor: colors.baseline,
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
    var diff = (new Date(this.state.to) - new Date(this.state.from)) / 3600000;
    console.log('Diff', diff * 60);
    console.log('Running Add Item');
    var props = this.props;
    if (this.state.type === 0) {
      Snackbar.show({
        text: 'Please select a type',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.baseline,
      });
    } else if (this.state.wyh.replace(/ /g, '').length < 5) {
      Snackbar.show({
        text: 'Please describe what do you have in atleast 5 characters ?',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.baseline,
      });
      this.setState({
        loading: false,
      });
    } else if (
      this.state.wye.replace(/ /g, '').length < 5 &&
      this.state.type === 1
    ) {
      Snackbar.show({
        text:
          'Please describe what to exchange with in atleast 5 characters ?',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.baseline,
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
        backgroundColor: colors.baseline,
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
        backgroundColor: colors.baseline,
      });
      this.setState({
        loading: false,
      });
    } else if (this.state.category === '') {
      Snackbar.show({
        text: 'Please select a product category',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.baseline,
      });
      this.setState({
        loading: false,
      });
    } else if (this.state.desc.replace(/ /g, '').length < 10) {
      Snackbar.show({
        text: 'Please add a product description of atleast 10 characters',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.baseline,
      });
      this.setState({
        loading: false,
      });
    } else if (this.state.city === '' && this.state.neighbourhood === '') {
      Snackbar.show({
        text: 'Please add a location',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.baseline,
      });
      this.setState({
        loading: false,
      });
    } else if (diff * 60 < 0) {
      Snackbar.show({
        text: 'Please, set a lower time for From ',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.baseline,
      });
    } else if (
      this.state.images.length === 0 &&
      this.state.category !== 'Food'
    ) {
      Snackbar.show({
        text: 'Please add a image',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.baseline,
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
          expiry: '',
          subcategory: this.state.subcategory,
          from: this.state.from,
          to: this.state.to,
          value: this.state.value,
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
          type: 'lend',
          withh: '',
          quantity: this.state.quantity,
          share_from: this.state.sfd,
          share_till: this.state.std,
          expiry: '',
          subcategory: this.state.subcategory,
          from: this.state.from,
          to: this.state.to,
          value: this.state.value,
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
          expiry: this.state.expiry,
          subcategory: this.state.subcategory,
          from: this.state.from,
          to: this.state.to,
          value: this.state.value,
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
      topic = 'Ready to lend ' + this.state.wyh;
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

  handleDate = (event, selectedDate) => {
    console.log(event, selectedDate);
    this.setState({
      expiry: selectedDate,
      showTime: false,
    });
  };

  handleTo = (e, date) => {
    var diff = (new Date(date) - new Date(this.state.from)) / 3600000;
    console.log('Diff', diff * 60);
    if (diff * 60 > 0) {
      date.setDate(this.state.expiry.getDate());
      date.setMonth(this.state.expiry.getMonth());
      date.setFullYear(this.state.expiry.getFullYear());
      this.setState({
        to: date,
        showTime2: false,
      });
    } else {
      Snackbar.show({
        text: 'Set a time higher than From Available Time',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.baseline,
      });
    }
  };

  handleFrom = (e, date) => {
    console.log('from');
    date.setDate(this.state.expiry.getDate());
    date.setMonth(this.state.expiry.getMonth());
    date.setFullYear(this.state.expiry.getFullYear());
    this.setState({
      from: date,
      showTime1: false,
    });
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
              Adding Product
            </Text>
          </View>
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
                    <View style={{ width: '100%', flex: 1 }}>
                      <View style={styles.header}>
                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                          <TouchableOpacity
                            style={styles.action}
                            onPress={() => this.props.navigation.pop()}>
                            <Ionicons
                              name="ios-close"
                              size={30}
                              style={{ color: colors.baseline }}
                            />
                          </TouchableOpacity>
                          <Text style={styles.headerText}>Add Product</Text>
                        </View>
                        <TouchableOpacity onPress={this.handleSubmit}>
                          <Ionicons
                            name="ios-checkmark"
                            size={35}
                            color={colors.baseline}
                          />
                        </TouchableOpacity>
                      </View>

                      <ScrollView
                        keyboardShouldPersistTaps="handled"
                        style={{ width: '100%' }}>
                        <View
                          style={{
                            width: '100%',
                            alignItems: 'center',
                            paddingVertical: 10,
                          }}>
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
                          {this.state.type === 2 ? (
                            <>
                              <View style={styles.DateGroup}>
                                <View style={styles.inputGroupRow}>
                                  <Text style={styles.inputGroupText}>
                                    Share from
                              </Text>
                                  <DatePicker
                                    style={{ width: width * 0.4, marginTop: 5 }}
                                    date={this.state.sfd}
                                    mode="date"
                                    placeholder="select date"
                                    format="DD-MM-YYYY"
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
                                        backgroundColor: colors.white,
                                        borderRadius: 3,
                                        borderWidth: 0,
                                      },
                                      // ... You can check the source to find the other keys.
                                    }}
                                    onDateChange={(date) => {
                                      this.setState({ sfd: date });
                                    }}
                                  />
                                </View>
                                <View>
                                  <Text style={styles.inputGroupText}>
                                    Share to
                              </Text>
                                  <DatePicker
                                    style={{ width: width * 0.4, marginTop: 5 }}
                                    date={this.state.std}
                                    mode="date"
                                    placeholder="select date"
                                    format="DD-MM-YYYY"
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
                                        backgroundColor: colors.white,
                                        borderRadius: 3,
                                        borderWidth: 0,
                                      },
                                      // ... You can check the source to find the other keys.
                                    }}
                                    onDateChange={(date) => {
                                      this.setState({ std: date });
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
                          </View>
                          {this.state.category === 'Books' ? (
                            <View
                              style={{
                                width: '90%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                              <View style={styles.inputGroup2}>
                                <Text style={styles.inputGroupText}>
                                  Sub-Category
                            </Text>
                                <View style={{ width: '100%' }}>
                                  <SelectInput
                                    value={this.state.subcategory}
                                    options={this.state.bcategories}
                                    onCancelEditing={() => console.log('onCancel')}
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
                            </View>
                          ) : null}
                          {this.state.type === 3 &&
                            this.state.category === 'Food' ? (
                              <View style={styles.expiry}>
                                <Text style={styles.inputGroupText}>Pickup Date</Text>
                                <TouchableOpacity
                                  style={styles.input}
                                  onPress={() => {
                                    this.setState({
                                      showTime: true,
                                    });
                                  }}>
                                  <Text style={styles.fvi}>
                                    <Moment element={Text} format={'MMMM Do YYYY'}>
                                      {this.state.expiry}
                                    </Moment>
                                  </Text>
                                </TouchableOpacity>
                                {this.state.showTime ? (
                                  <DateTimePicker
                                    testID="dateTimePicker"
                                    value={this.state.expiry}
                                    mode={'date'}
                                    is24Hour={false}
                                    display="default"
                                    onChange={this.handleDate}
                                  />
                                ) : null}
                              </View>
                            ) : null}
                          {this.state.type === 3 &&
                            this.state.category === 'Food' ? (
                              <View style={styles.DateGroup}>
                                <View style={styles.inputGroupRow2}>
                                  <Text style={styles.inputGroupText}>From</Text>
                                  <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => {
                                      this.setState({
                                        showTime1: true,
                                      });
                                    }}>
                                    <Text style={styles.fvi}>
                                      <Moment element={Text} format={'h:mm:ss a'}>
                                        {this.state.from}
                                      </Moment>
                                    </Text>
                                  </TouchableOpacity>
                                  {this.state.showTime1 ? (
                                    <DateTimePicker
                                      testID="dateTimePicker"
                                      value={this.state.from}
                                      mode={'time'}
                                      is24Hour={false}
                                      display="default"
                                      onChange={this.handleFrom}
                                    />
                                  ) : null}
                                </View>
                                <View style={styles.inputGroupRow2}>
                                  <Text style={styles.inputGroupText}>To</Text>
                                  <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => {
                                      this.setState({
                                        showTime2: true,
                                      });
                                    }}>
                                    <Text style={styles.fvi}>
                                      <Moment element={Text} format={'h:mm:ss a'}>
                                        {this.state.to}
                                      </Moment>
                                    </Text>
                                  </TouchableOpacity>
                                  {this.state.showTime2 ? (
                                    <DateTimePicker
                                      testID="dateTimePicker"
                                      value={this.state.to}
                                      mode={'time'}
                                      is24Hour={false}
                                      display="default"
                                      onChange={this.handleTo}
                                    />
                                  ) : null}
                                </View>
                              </View>
                            ) : null}
                          <View style={styles.inputGroup}>
                            <Text style={styles.inputGroupText}>
                              What do you have ?
                        </Text>
                            <Text style={this.state.wyh.replace(/ /g, '').length >= 5 ? styles.right : styles.wrong}>{this.state.wyh.replace(/ /g, '').length}/{this.state.wyh.replace(/ /g, '').length >= 5 ? "100" : "5"}</Text>
                            <TextInput
                              style={styles.input}
                              autoCapitalize="none"
                              maxLength={100}
                              placeholder={this.state.category==='Books'?"Book Title":""}
                              onChangeText={(wyh) => this.setState({ wyh })}
                              value={this.state.wyh}>
                            </TextInput>
                          </View>
                          <View style={styles.inputGroup}>
                            <Text style={styles.inputGroupText}>
                              Describe what you have
                        </Text>
                            <Text style={this.state.desc.replace(/ /g, '').length >= 10 ? styles.right : styles.wrong}>{this.state.desc.replace(/ /g, '').length}/{this.state.desc.replace(/ /g, '').length >= 10 ? "400" : "10"}</Text>
                            <TextInput
                              style={styles.inputArea}
                              autoCapitalize="none"
                              multiline={true}
                              maxLength={400}
                              placeholder={this.state.category==='Books'?"Few words about books/edition/etc..":""}
                              onChangeText={(desc) => this.setState({ desc })}
                              value={this.state.desc}></TextInput>
                          </View>
                          {this.state.type === 1 ? (
                            <>
                              <View style={styles.inputGroup}>
                                <Text style={styles.inputGroupText}>
                                  What do you want to exchange with ?
                            </Text>
                                <Text style={this.state.wye.replace(/ /g, '').length >= 5 ? styles.right : styles.wrong}>{this.state.wye.replace(/ /g, '').length}/{this.state.wye.replace(/ /g, '').length >= 5 ? "100" : "5"}</Text>
                                <TextInput
                                  style={styles.input}
                                  autoCapitalize="none"
                                  maxLength={100}
                                  placeholder={this.state.category==='Books'?"Book Title":""}
                                  onChangeText={(wye) => this.setState({ wye })}
                                  value={this.state.wye}></TextInput>
                              </View>
                              <View style={styles.inputGroup}>
                                <Text style={styles.inputGroupText}>
                                  Value of your item ? (in $)
                              </Text>
                                <TextInput
                                  style={styles.input}
                                  autoCapitalize="none"
                                  maxLength={100}
                                  keyboardType="numeric"
                                  onChangeText={(value) => this.setState({ value })}
                                  value={this.state.value}></TextInput>
                              </View>
                            </>
                          ) : null}

                          {this.state.loadingLocation ? (
                            <View
                              style={{
                                width: '90%',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View style={{ width: '10%' }}>
                                <ActivityIndicator size="large" color={colors.baseline} />
                              </View>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: colors.white,
                                  marginLeft: 10,
                                }}>
                                Finding your location
                          </Text>
                            </View>
                          ) : (
                              <>
                                {this.state.city.length > 0 &&
                                  this.state.neighbourhood.length > 0 ? (
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
                                        style={{ fontSize: 30, color: colors.baseline }}
                                      />
                                      <Text
                                        style={{
                                          fontSize: 16,
                                          color: colors.white,
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
                              { marginTop: 20, marginBottom: 30 },
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
                                      <View styles={{ position: 'relative' }}>
                                        <Image
                                          source={{ uri: image.uri }}
                                          style={styles.imagePicker}
                                        />
                                        <TouchableOpacity
                                          onPress={this.handlePicker}
                                          style={styles.editLogo}>
                                          <AntDesign
                                            name="edit"
                                            style={{ fontSize: 16, color: colors.white }}
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
  DateGroup: {
    width: '90%',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expiry: {
    width: '90%',
    marginBottom: 15,
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
    color: colors.white,
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
  fvi: {
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    color: colors.darkText,
  },
  inputGroupRow2: {
    width: '45%',
  },
});
