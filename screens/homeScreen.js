import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler,
  AppState,
  PermissionsAndroid,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductListScreen from './productListScreen';
import ChatListScreen from './chatListScreen';
import NotiListScreen from './notiListScreen';
import ProfileScreen from './profileScreen';
import Geolocation from 'react-native-geolocation-service';
import AskLocationPermissionScreen from './askLocationPermissionScreen';
import LocationLoadingScreen from './locationLoadingScreen';
import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import NoInternetScreen from './noInternetScreen';
import messaging from '@react-native-firebase/messaging';
import CustomDrawer from '../shared/customDrawer';
import {CommonActions} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-community/google-signin';
import colors from '../appTheme';
import axios from 'axios';
import link from '../fetchPath';
import Geocoder from 'react-native-geocoding';
import {fcmService} from '../shared/FCMService';
import {localNotificationService} from '../shared/LocalNotificationService';

const {width, height} = Dimensions.get('window');

Geocoder.init('AIzaSyD12ob7WRZs6OttEQQ9C8NMPai-WlraopQ');

export default class HomeScreen extends React.Component {
  inter = null;
  constructor() {
    super();
    this.state = {
      tab: 'Posts',
      showLocationAccess: false,
      location: {
        lat: '',
        long: '',
      },
      locationLoading: true,
      NoInternetScreen: false,
      token: '',
      changingLocation: false,
      checking: false,
      showOffline: false,
      toggleValue: new Animated.Value(-200),
      showDrawer: false,
      activeMenu: 'Home',
      showHome: false,
      tab2Count: 0,
      tab3Count: 0,
    };
  }

  async componentDidMount() {
    fcmService.registerAppWithFCM();
    fcmService.register(
      this.onRegister,
      this.onNotification,
      this.onOpenNotification,
    );
    localNotificationService.configure(this.onOpenNotification);
    AppState.addEventListener('change', this.handleAppStateChange);
    this.handlePermissionAndroid();
    this.handleNotiCount();
    this.inter = setInterval(() => {
      this.handleNotiCount();
    }, 5000);
  }

  handleNotiCount = async () => {
    if (auth().currentUser) {
      var data = {
        id: auth().currentUser.email,
      };
      const res = await axios.post(link + '/api/user/singleNoti', data);
      if (res.data !== null) {
        var count = 0;
        for (var i = 0; i < res.data.length; i++) {
          var data2 = {
            id: res.data[i],
          };
          var res2 = await axios.post(link + '/api/notifications', data2);
          if (
            res2.data !== null &&
            res2.data.user !== auth().currentUser.email &&
            res2.data.read !== true
          ) {
            console.log('96', res2.data);
            count = count + 1;
            console.log('count', count);
            this.setState({
              tab3Count: count,
            });
          }
        }
      }
    }
  };

  onRegister = async (token) => {
    console.log('[App] onRegister:', token);
    if (auth().currentUser) {
      var data = {
        email: auth().currentUser.email,
        token: token,
      };
      var res = await axios.post(link + '/api/user/pushToken', data);
      if (res.data !== null) {
        console.log('push token added to user');
      }
    }
  };

  onNotification = (notify) => {
    console.log('[App] onNotification:', notify);
    const options = {
      soundName: 'default',
      playSound: true,
    };
    localNotificationService.showNotification(
      0,
      notify.notification.title,
      notify.notification.body,
      notify,
      options,
    );
  };

  onOpenNotification = (notify) => {
    console.log('[App] onOpenNotification:', notify);
    this.handleGo(notify);
  };

  handleGo = (e) => {
    console.log('159', e.data);
    var location = {
      city: '',
      lat: '',
      long: '',
      country: '',
    };
    if (e.data.type === 'Product') {
      this.props.navigation.navigate('viewProduct', {
        id: e.data.id,
        location: location,
      });
    } else if (e.data.type === 'Request') {
      this.props.navigation.navigate('viewRequest', {
        id: e.data.id,
        location: location,
      });
    } else if (e.data.type === 'Chat') {
      this.props.navigation.navigate('Chat', {id: e.id, location: location});
    } else if (e.data.type === 'Follow') {
      this.props.navigation.navigate('viewProfile', {
        id: e.data.id,
        location: location,
      });
    }
  };

  handleMenu = (e) => {
    console.log(e);
    if (e === 'Home') {
      this.setState(
        {
          activeMenu: e,
        },
        () => {
          this.handleToggleClose();
        },
      );
    } else if (e === 'Deal') {
      this.props.navigation.push('Deal', {handleBack: this.handleBackHome});
      this.setState(
        {
          activeMenu: e,
        },
        () => {
          this.handleToggleClose();
        },
      );
    } else if (e === 'Refer') {
      this.props.navigation.push('Refer', {handleBack: this.handleBackHome});
      this.setState(
        {
          activeMenu: e,
        },
        () => {
          this.handleToggleClose();
        },
      );
    } else if (e === 'About') {
      this.props.navigation.push('About', {handleBack: this.handleBackHome});
      this.setState(
        {
          activeMenu: e,
        },
        () => {
          this.handleToggleClose();
        },
      );
    } else if (e === 'Privacy') {
      this.props.navigation.push('Privacy', {handleBack: this.handleBackHome});
      this.setState(
        {
          activeMenu: e,
        },
        () => {
          this.handleToggleClose();
        },
      );
    } else if (e === 'Terms') {
      this.props.navigation.push('Terms', {handleBack: this.handleBackHome});
      this.setState(
        {
          activeMenu: e,
        },
        () => {
          this.handleToggleClose();
        },
      );
    } else if (e === 'Logout') {
      this.signout();
    } else if (e === 'Login') {
      this.props.navigation.push('Login');
      this.handleToggleClose();
    }
  };

  signout = async () => {
    GoogleSignin.configure({
      webClientId:
        '1078552807062-oknmc6j1kmuga88qa7psq8a5o238drbr.apps.googleusercontent.com',
      forceConsentPrompt: true,
      offlineAccess: false,
    });
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.revokeAccess();
    }
    console.log(isSignedIn);
    var email = auth().currentUser.email;
    var has = await auth()
      .signOut()
      .then(() => {
        return true;
      })
      .catch((error) => {
        alert('Unable to sign out right now');
      });
    if (has) {
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Main'}],
        }),
      );
      // firestore()
      //     .collection('testusers')
      //     .where('email', '==', email)
      //     .get()
      //     .then((snap) => {
      //         snap.forEach((doc) => {
      //             firestore()
      //                 .collection('testusers')
      //                 .doc(doc.id)
      //                 .update({
      //                     logout: true,
      //                     active: false
      //                 })
      //                 .then(() => {
      //                     console.log('Status Deactive');
      //                 });
      //         });
      //     });
    }
  };

  handleBackHome = () => {
    console.log('Going Back Home');
    this.setState({
      activeMenu: 'Home',
    });
  };

  handleToggle = (e) => {
    this.setState({
      showDrawer: true,
    });
    Animated.timing(this.state.toggleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  };

  handleToggleClose = (e) => {
    Animated.timing(this.state.toggleValue, {
      toValue: -200,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.elastic(1.2),
    }).start();
    setTimeout(() => {
      this.setState({
        showDrawer: false,
      });
    }, 300);
  };

  componentWillUnmount() {
    clearInterval(this.inter);
    AppState.removeEventListener('change', this.handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    fcmService.unRegister();
    localNotificationService.unregister();
    this.setState = (state, callback) => {
      return;
    };
  }

  storeData = async (label, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(label, jsonValue);
    } catch (e) {
      // saving error
      console.log('Error Storing File');
    }
  };

  handleAppStateChange = async (nextAppState) => {
    console.log(AppState.currentState);
    if (AppState.currentState === 'active') {
      if (auth().currentUser) {
        var data = {
          email: auth().currentUser.email,
        };
        var res = await axios.post(link + '/api/user/active', data);
        if (res.data !== null) {
          console.log('Active User');
        } else {
          console.log('User active error');
        }
      }
    } else {
      if (auth().currentUser) {
        var data = {
          email: auth().currentUser.email,
        };
        var res = await axios.post(link + '/api/user/deactive', data);
        if (res.data !== null) {
          console.log('Deactive User');
        } else {
          console.log('User deactive error');
        }
      }
    }
  };

  handlePermissionAndroid = async () => {
    const check = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    console.log('Checking if location permission granted? ans:', check);
    if (check) {
      this.setState({
        showLocationAccess: false,
      });
      this.handleAllowedLocationPermission();
    } else {
      this.setState({
        showLocationAccess: true,
        showHome: false,
      });
    }
  };

  handleNetCheck = () => {
    console.log('Checking Conn..');
    NetInfo.fetch().then(async (state) => {
      if (state.isConnected) {
        if (this.state.showOffline) {
          this.handlePermissionAndroid();
          this.setState({
            showOffline: false,
          });
        }
      } else {
        this.setState({
          showOffline: true,
        });
      }
    });
  };

  handleAllowedLocationPermission = async () => {
    this.setState({
      locationLoading: true,
      showLocationAccess: false,
    });
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === 'granted') {
        Geolocation.getCurrentPosition(
          async (position) => {
            const location = {
              lat: position.coords.latitude,
              long: position.coords.longitude,
            };
            this.setState(
              {
                location: location,
                locationLoading: false,
              },
              () => {
                console.log(this.state.location);
              },
            );
          },
          async (error) => {
            console.log('Error in Location Access Settings');
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 1000,
          },
        );
      }
    } else {
      console.log('Error in Location Access');
    }
  };

  handleSearch = () => {
    var location = this.state.location;
    console.log('Handling Search');
    this.props.navigation.navigate('Search', {location: location});
  };

  handleDrawrOpen = () => {
    this.props.navigation.openDrawer();
  };

  handleRequestTab = () => {
    console.log('RT');
    this.setState({
      index: 1,
    });
  };

  render() {
    return (
      <>
        <SafeAreaView></SafeAreaView>
        {this.state.showLocationAccess ? (
          <AskLocationPermissionScreen
            handleAllowedLocationPermission={
              this.handleAllowedLocationPermission
            }
            handleDeniedLocationPermission={this.handleDeniedLocationPermission}
          />
        ) : (
          <>
            {this.state.showNoInternet ? (
              <NoInternetScreen handleReCheck={this.handlePermissionAndroid} />
            ) : (
              <>
                {this.state.locationLoading ? (
                  <LocationLoadingScreen />
                ) : (
                  <SafeAreaView style={styles.container}>
                    <View
                      style={{
                        backgroundColor: '#1B1F22',
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{width: 30, height: 30}}>
                          <Image
                            style={styles.logo}
                            source={require('../assets/images/icon.png')}
                          />
                        </View>
                        <Text style={styles.header}>
                          bye<Text style={styles.header2}>buyy</Text>
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={this.handleSearch}
                          style={styles.headerIcon}>
                          <Ionicons
                            name="ios-search"
                            size={20}
                            color={colors.white}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.headerIcon}
                          onPress={this.handleToggle}>
                          <Ionicons
                            name="ios-ellipsis-horizontal"
                            size={20}
                            color={colors.white}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.tabbar}>
                      {this.state.tab === 'Posts' ? (
                        <View style={styles.activeTab}>
                          <Image
                            source={require('../assets/images/home.png')}
                            style={styles.tabImage}
                          />
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.setState({tab: 'Posts'})}
                          style={styles.tab}>
                          <Image
                            source={require('../assets/images/home.png')}
                            style={styles.tabImage}
                          />
                        </TouchableOpacity>
                      )}
                      {this.state.tab === 'Chat' ? (
                        <View style={styles.activeTab}>
                          <Image
                            source={require('../assets/images/chat.png')}
                            style={styles.tabImage}
                          />
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({tab: 'Chat', tab2Count: 0})
                          }
                          style={styles.tab}>
                          <Image
                            source={require('../assets/images/chat.png')}
                            style={styles.tabImage}
                          />
                          {this.state.tab2Count > 0 ? (
                            <View style={styles.tabCount}>
                              <Text style={styles.tabCountText}>
                                {this.state.tab2Count}
                              </Text>
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      )}
                      {this.state.tab === 'Activity' ? (
                        <View style={styles.activeTab}>
                          <Image
                            source={require('../assets/images/notification.png')}
                            style={styles.tabImage}
                          />
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({tab: 'Activity', tab3Count: 0})
                          }
                          style={styles.tab}>
                          <Image
                            source={require('../assets/images/notification.png')}
                            style={styles.tabImage}
                          />
                          {this.state.tab3Count ? (
                            <View style={styles.tabCount}>
                              <Text style={styles.tabCountText}>
                                {this.state.tab3Count}
                              </Text>
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      )}
                      {this.state.tab === 'Profile' ? (
                        <View style={styles.activeTab}>
                          <Image
                            source={require('../assets/images/user.png')}
                            style={styles.tabImage}
                          />
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.setState({tab: 'Profile'})}
                          style={styles.tab}>
                          <Image
                            source={require('../assets/images/user.png')}
                            style={styles.tabImage}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {this.state.tab === 'Posts' ? (
                      <ProductListScreen
                        location={this.state.location}
                        navigation={this.props.navigation}
                      />
                    ) : null}
                    {this.state.tab === 'Chat' ? (
                      <ChatListScreen
                        location={this.state.location}
                        navigation={this.props.navigation}
                      />
                    ) : null}
                    {this.state.tab === 'Activity' ? (
                      <NotiListScreen
                        location={this.state.location}
                        navigation={this.props.navigation}
                      />
                    ) : null}
                    {this.state.tab === 'Profile' ? (
                      <ProfileScreen
                        location={this.state.location}
                        navigation={this.props.navigation}
                      />
                    ) : null}
                    {this.state.showDrawer ? (
                      <View
                        style={{
                          width: width,
                          height: '100%',
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: 'rgba(110,110,110,0.1)',
                        }}>
                        <TouchableOpacity
                          onPress={this.handleToggleClose}
                          style={{
                            width: width - 200,
                            height: '100%',
                          }}></TouchableOpacity>
                        <Animated.View
                          style={{
                            width: 200,
                            alignItems: 'center',
                            height: '100%',
                            top: 0,
                            right: this.state.toggleValue,
                            position: 'absolute',
                            backgroundColor: colors.primary,
                            elevation: 10,
                            borderBottomLeftRadius: 10,
                            borderTopLeftRadius: 10,
                          }}>
                          <CustomDrawer
                            handleMenu={(e) => this.handleMenu(e)}
                            active={this.state.activeMenu}
                          />
                        </Animated.View>
                      </View>
                    ) : null}
                  </SafeAreaView>
                )}
              </>
            )}
          </>
        )}
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
    width: 35,
    height: 35,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  tabbar: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B1F22',
  },
  tab: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  activeTab: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderBottomColor: '#d65a31',
    borderBottomWidth: 4,
  },
  tabImage: {
    width: 25,
    height: 25,
  },
  tabCount: {
    position: 'absolute',
    right: 20,
    top: 0,
    backgroundColor: '#d65a31',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabCountText: {
    color: '#fff',
    fontFamily: 'Muili-Bold',
    fontSize: 12,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
