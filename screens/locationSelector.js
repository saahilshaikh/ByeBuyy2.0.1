import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../appTheme';
import AsyncStorage from '@react-native-community/async-storage';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import link from '../fetchPath';
import Snackbar from 'react-native-snackbar';

const {width, height} = Dimensions.get('window');

export default class LocationSelectorScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: '',
      long: '',
      city: '',
      country: '',
      showResult: false,
      loading: false,
      place: '',
      result: [],
      recentLocations: [],
      home: {},
    };
  }

  async componentDidMount() {
    if (auth().currentUser) {
      var data = {
        id: auth().currentUser.email,
      };
      var res = await axios.post(link + '/api/user/single', data);
      if (res.data !== null) {
        this.setState({
          home: res.data.home ? res.data.home : {},
        });
      }
    }
    this.handlePosition();
    const locationsValue = await AsyncStorage.getItem('bblocations');
    if (locationsValue !== null) {
      console.log('Local Locations Found');
      this.setState({
        recentLocations: JSON.parse(locationsValue),
      });
    }
  }

  storeData = async (label, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(label, jsonValue);
    } catch (e) {
      // saving error
      console.log('Error Storing File', label, e);
    }
  };

  handleAutoComplete = async (e) => {
    this.setState(
      {
        place: e,
      },
      () => {
        if (this.state.place.length > 2) {
          this.setState({
            loading: true,
          });
          fetch(
            'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
              this.state.place +
              '&types=(cities)&key=AIzaSyD12ob7WRZs6OttEQQ9C8NMPai-WlraopQ',
          )
            .then((response) => response.json())
            .then(async (json) => {
              var result = [];
              json.predictions.map((item) => {
                result.push(item.description);
              });
              this.setState({
                loading: false,
                result: result,
              });
            });
        } else {
          this.setState({
            result: [],
          });
        }
      },
    );
  };

  handleLocation = (e) => {
    if (e !== '' && !this.state.recentLocations.includes(e)) {
      var recents = this.state.recentLocations;
      recents.push(e);
      this.storeData('bblocations', recents);
    }
    var city = e.split(',')[0].replace(/\s/g, '');
    var country = e.split(',')[e.split(',').length - 1].replace(/\s/g, '');
    this.props.route.params.handleLocation(
      city,
      country,
      this.props.route.params.location.lat,
      this.props.route.params.location.long,
      'other',
    );
    this.props.navigation.pop();
  };

  handleSetHome = async () => {
    var home = {
      lat: this.state.lat,
      long: this.state.long,
      city: this.state.city,
      country: this.state.country,
    };
    var data = {
      email: auth().currentUser.email,
      home: home,
    };
    var res = await axios.post(link + '/api/user/setHome', data);
    if (res.data !== null) {
      if (res.data.type === 'success') {
        this.setState({
          home: home,
        });
      }
    }
  };

  handleRemoveHome = async () => {
    var home = {};
    var data = {
      email: auth().currentUser.email,
      home: home,
    };
    var res = await axios.post(link + '/api/user/setHome', data);
    if (res.data !== null) {
      if (res.data.type === 'success') {
        this.setState({
          home: home,
        });
      }
    }
  };

  handleHome = () => {
    this.props.route.params.handleLocation(
      this.state.home.city,
      this.state.home.country,
      this.state.home.lat,
      this.state.home.long,
      'home',
    );
    this.props.navigation.pop();
  };

  handleCurrentLocation = () => {
    this.props.route.params.handleLocation(
      this.state.city,
      this.state.country,
      this.state.lat,
      this.state.long,
      'current',
    );
    this.props.navigation.pop();
  };

  handleAllLocations = () => {
    this.props.route.params.handleLocation(
      '',
      '',
      this.props.route.params.location.lat,
      this.props.route.params.location.long,
      'world',
    );
    this.props.navigation.pop();
  };

  handlePosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
        this.handleGeoCoder(position);
      },
      (error) => {
        Snackbar.show({
          text: 'Please turn on location services',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 1500,
        maximumAge: 5000,
        showLocationDialog: false,
      },
    );
  };

  handleGeoCoder = async (position) => {
    await Geocoder.from(position.coords.latitude, position.coords.longitude)
      .then((json) => {
        var country = '',
          city = '';
        json.results[0].address_components.map((item) => {
          if (item.types.includes('administrative_area_level_2')) {
            city = item.long_name;
          } else if (item.types.includes('country')) {
            country = item.long_name;
          }
        });
        this.setState({
          city: city,
          country: country,
        });
      })
      .catch((error) => console.warn(error));
  };

  render() {
    return (
      <>
        <SafeAreaView></SafeAreaView>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                {this.state.loading ? (
                  <ActivityIndicator size="small" color={colors.baseline} />
                ) : (
                  <Ionicons
                    name="ios-location-outline"
                    size={26}
                    color={colors.grey}
                  />
                )}
              </View>
              <TextInput
                style={styles.input}
                value={this.state.place}
                placeholder="Enter a city name"
                placeholderTextColor={colors.grey}
                onChangeText={(e) => this.handleAutoComplete(e)}
              />
              <TouchableOpacity
                onPress={() => this.props.navigation.pop()}
                style={{
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Ionicons name="ios-close" size={35} color={colors.baseline} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            style={{width: '100%', flex: 1}}
            keyboardShouldPersistTaps="handled">
            <View style={styles.box}>
              {this.state.result.map((item) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.handleLocation(item)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 10,
                    }}>
                    <Text style={styles.topic}>{item}</Text>
                    <Ionicons
                      style={{marginLeft: 5}}
                      name="ios-location-outline"
                      size={20}
                      color={colors.baseline}
                    />
                  </TouchableOpacity>
                );
              })}
              {this.state.result.length == 0 ? (
                <>
                  <TouchableOpacity
                    onPress={this.handleAllLocations}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 10,
                    }}>
                    <Text style={styles.topic}>All locations</Text>
                    <Ionicons
                      style={{marginLeft: 5}}
                      name="ios-location-outline"
                      size={20}
                      color={colors.baseline}
                    />
                  </TouchableOpacity>
                  {auth().currentUser && this.state.lat ? (
                    <>
                      {this.state.home.lat ? (
                        <TouchableOpacity
                          onPress={this.handleHome}
                          style={{
                            marginVertical: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}>
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text style={styles.topic}>Home</Text>
                              <Ionicons
                                style={{marginLeft: 5}}
                                name="ios-location-outline"
                                size={20}
                                color={colors.baseline}
                              />
                            </View>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: 'Muli-Regular',
                                color: '#acadaa',
                                marginLeft: 10,
                              }}>
                              {this.state.home.city}, {this.state.home.country}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={this.handleRemoveHome}
                            style={{
                              width: 30,
                              height: 30,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 3,
                            }}>
                            <Ionicons
                              name="ios-trash"
                              size={20}
                              color={colors.baseline}
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={this.handleSetHome}
                          style={{
                            marginVertical: 5,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={styles.topic}>Home</Text>
                            <Ionicons
                              style={{marginLeft: 5}}
                              name="ios-location-outline"
                              size={20}
                              color={colors.baseline}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'Muli-Regular',
                              color: '#acadaa',
                              marginLeft: 10,
                            }}>
                            Home not set, set current location as home
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : null}
                  {this.state.city ? (
                    <TouchableOpacity
                      onPress={this.handleCurrentLocation}
                      style={{
                        marginVertical: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.topic}>Current City</Text>
                        <Ionicons
                          style={{marginLeft: 5}}
                          name="ios-location-outline"
                          size={20}
                          color={colors.baseline}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Muli-Regular',
                          color: '#acadaa',
                          marginLeft: 10,
                        }}>
                        {this.state.city}, {this.state.country}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  {this.state.recentLocations.length > 0 ? (
                    <>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Muli-Bold',
                          color: colors.baseline,
                        }}>
                        Recent Accesed Locations
                      </Text>
                      {this.state.recentLocations.map((item) => {
                        return (
                          <TouchableOpacity
                            onPress={() => this.handleLocation(item)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginVertical: 10,
                            }}>
                            <Text style={styles.topic}>{item}</Text>
                            <Ionicons
                              style={{marginLeft: 5}}
                              name="ios-location-outline"
                              size={20}
                              color={colors.baseline}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </>
                  ) : null}
                </>
              ) : null}
            </View>
          </ScrollView>
        </SafeAreaView>
        <SafeAreaView></SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    width: '100%',
    paddingVertical: 5,
    backgroundColor: '#1B1F22',
    alignItems: 'center',
    borderBottomColor: colors.grey,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  input: {
    width: width - 110,
    height: 40,
    padding: 0,
    fontSize: 16,
    color: colors.white,
    fontFamily: 'Muli-Regular',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  box: {
    width: '100%',
    flex: 1,
    marginVertical: 5,
    padding: 15,
  },
  boxHeader: {
    fontSize: 20,
    color: colors.baseline,
    fontFamily: 'Muli-Bold',
  },
  topic: {
    fontSize: 18,
    color: colors.white,
    fontFamily: 'Muli-Regular',
    marginLeft: 10,
  },
});
