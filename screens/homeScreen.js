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
  Linking,
  Platform,
  StatusBar
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
import auth, { firebase } from '@react-native-firebase/auth';
import NoInternetScreen from './noInternetScreen';
import CustomDrawer from '../shared/customDrawer';
import { CommonActions } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-community/google-signin';
import colors from '../appTheme';
import axios from 'axios';
import link from '../fetchPath';
import Geocoder from 'react-native-geocoding';
import { fcmService } from '../shared/FCMService';
import { localNotificationService } from '../shared/LocalNotificationService';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import {
  TabView,
  TabBar,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import Rate, { AndroidMarket } from 'react-native-rate';

type Route = {
  key: string,
  icon: string,
};

type State = NavigationState<Route>;

const { width, height } = Dimensions.get('window');

Geocoder.init('AIzaSyD12ob7WRZs6OttEQQ9C8NMPai-WlraopQ');

export default class HomeScreen extends React.Component {
  inter = null;

  constructor() {
    super();
    this.child1 = React.createRef();
    this.child2 = React.createRef();
    this.child3 = React.createRef();
    this.child4 = React.createRef();
    this.state = {
      index: 0,
      routes: [
        {
          key: 'home',
          index: 0,
          active: require('../assets/images/homeActive.png'),
          inactive: require('../assets/images/home.png'),
        },
        {
          key: 'chats',
          index: 1,
          active: require('../assets/images/chatActive.png'),
          inactive: require('../assets/images/chat.png'),
        },
        {
          key: 'notifications',
          index: 2,
          active: require('../assets/images/notificationActive.png'),
          inactive: require('../assets/images/notification.png'),
        },
        {
          key: 'profile',
          index: 3,
          active: require('../assets/images/userActive.png'),
          inactive: require('../assets/images/user.png'),
        },
      ],
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
      update: false,
      showExit: false,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  async componentDidMount() {
    firestore()
      .collection('settings')
      .onSnapshot((snap) => {
        snap.forEach((doc) => {
          console.log('75', Platform.OS);
          if (Platform.OS === 'android') {
            if (doc.data().android !== '2.2.2') {
              this.setState({
                update: true,
                showLocationAccess: true,
              });
            } else {
              this.setState({
                update: false,
              });
            }
          } else {
            if (doc.data().ios !== '2.1.3') {
              this.setState({
                update: true,
              });
            } else {
              this.setState({
                update: false,
              });
            }
          }
        });
      });
    if (auth().currentUser) {
      this.handleNotiCount();
      this.handleChatCount();
      this.inter = setInterval(() => {
        this.handleNotiCount();
        this.handleChatCount();
      }, 2000);
    }
    fcmService.registerAppWithFCM();
    fcmService.register(
      this.onRegister,
      this.onNotification,
      this.onOpenNotification,
    );
    localNotificationService.configure(this.onOpenNotification);
    AppState.addEventListener('change', this.handleAppStateChange);
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    this.handlePermissionAndroid();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    console.log();
    if (this.props.navigation.isFocused()) {
      if (this.state.showExit) {
        BackHandler.exitApp();
      } else {
        this.setState({
          showExit: true,
        });
        return true;
      }
    } else {
      return false;
    }
  }

  handleRate = () => {
    const options = {
      GooglePackageName: 'com.byebuyy',
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
      fallbackPlatformURL: 'https://www.byebuyy.com',
    };
    Rate.rate(options, (success) => {
      if (success) {
        console.log(success);
      }
    });
  };

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
            count = count + 1;
            this.setState({
              tab3Count: count,
            });
          }
        }
      }
    }
  };

  handleChatCount = async () => {
    if (auth().currentUser) {
      var data = {
        id: auth().currentUser.email,
      };
      var res = await axios.post(link + '/api/user/singleChat', data);
      if (res.data !== null) {
        var count = 0;
        for (var i = 0; i < res.data.length; i++) {
          var data2 = {
            id: res.data[i].id,
          };
          var res2 = await axios.post(link + '/api/chat', data2);
          var unread = false;
          if (
            res2.data !== null && res2.data.messages &&
            res2.data.messages.length > 0 &&
            new Date(
              res2.data[
              'clear' +
              (res2.data.participants.indexOf(auth().currentUser.email) + 1)
              ],
            ) < new Date(res2.data.messages[res2.data.messages.length - 1].date)
          ) {
            res2.data.messages.map((m) => {
              if (m.read !== true && m.id !== auth().currentUser.email) {
                unread = true;
                console.log(res2.data.messages.length)
              }
            });
          }
          if (unread) {
            count = count + 1;
          }
          this.setState({
            tab2Count: count,
          }, () => {
            console.log(this.state.tab2Count);
          });
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
      console.log(e);
      if (e.data.action === 'Comment') {
        this.props.navigation.push('viewComment', {
          id: e.data.id,
          location: location,
        });
      } else {
        this.props.navigation.push('viewProduct', {
          id: e.data.id,
          location: location,
        });
      }
    } else if (e.data.type === 'Request') {
      console.log(e);
      if (e.data.action === 'Comment') {
        this.props.navigation.push('viewComment', {
          id: e.data.id,
          location: location,
        });
      } else {
        this.props.navigation.push('viewRequest', {
          id: e.data.id,
          location: location,
        });
      }
    } else if (e.data.type === 'Chat') {
      this.props.navigation.push('Chat', { id: e.data.id, location: location });
    } else if (e.data.type === 'ViewProfile') {
      this.props.navigation.push('viewProfile', {
        id: e.data.id,
        location: location,
      });
    } else if (e.data.type === 'Follow') {
      this.props.navigation.push('viewProfile', {
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
      this.props.navigation.push('Deal', { handleBack: this.handleBackHome });
      this.setState(
        {
          activeMenu: e,
        },
        () => {
          this.handleToggleClose();
        },
      );
    } else if (e === 'Refer') {
      this.props.navigation.push('Refer', { handleBack: this.handleBackHome });
      this.setState(
        {
          activeMenu: e,
        },
        () => {
          this.handleToggleClose();
        },
      );
    } else if (e === 'About') {
      this.props.navigation.push('About', { handleBack: this.handleBackHome });
      this.setState(
        {
          activeMenu: e,
        },
        () => {
          this.handleToggleClose();
        },
      );
    } else if (e === 'Feedback') {
      this.props.navigation.push('Feedback', { handleBack: this.handleBackHome });
      this.setState(
        {
          activeMenu: e,
        },
        () => {
          this.handleToggleClose();
        },
      );
    } else if (e === 'Privacy') {
      this.props.navigation.push('Privacy', { handleBack: this.handleBackHome });
      this.setState(
        {
          activeMenu: e,
        },
        () => {
          this.handleToggleClose();
        },
      );
    } else if (e === 'Terms') {
      this.props.navigation.push('Terms', { handleBack: this.handleBackHome });
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
    var data = {
      email: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/user/deactive', data);
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
          routes: [{ name: 'Main' }],
        }),
      );
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
            this.setState({
              location: location,
              locationLoading: false,
            });
          },
          async (error) => {
            console.log('Error in Location Access Settings');
            this.setState({
              location: {},
              locationLoading: false,
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 1000,
          },
        );
      } else {
        this.setState({
          location: {},
          locationLoading: false,
        });
      }
    } else {
      console.log('Error in Location Access');
      this.setState({
        location: {},
        locationLoading: false,
      });
    }
  };

  handleDeniedLocationPermission = () => {
    console.log('LOCATION ACCESS DENIED');
    this.setState({
      location: {},
      locationLoading: false,
      showLocationAccess: false,
    });
  };

  handleSearch = () => {
    var location = this.state.location;
    console.log('Handling Search');
    this.props.navigation.navigate('Search', { location: location });
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

  handleIndexChange = (index) => {
    if (index === 0) {
      console.log('INDEX 0');
      this.child1.current.handleMount();
      this.child2.current.handleUnmount();
      this.child3.current.handleUnmount();
    } else if (index === 1) {
      console.log('INDEX 1');
      this.child1.current.handleUnmount();
      this.child2.current.handleMount();
      this.child3.current.handleUnmount();
    } else if (index === 2) {
      console.log('INDEX 2');
      this.child1.current.handleUnmount();
      this.child2.current.handleUnmount();
      this.child3.current.handleMount();
    } else if (index === 3) {
      console.log('INDEX 3');
      this.child1.current.handleUnmount();
      this.child2.current.handleUnmount();
      this.child3.current.handleUnmount();
    }
    this.setState({
      index: index,
    });
  };

  renderIcon = ({ route, color }: { route: Route, color: string }) => {
    return (
      <View style={{ width: 25, height: 25, position: 'relative' }}>
        <Image source={route.inactive} style={{ width: '100%', height: '100%' }} />
        {route.key === 'chats' && this.state.tab2Count > 0 ? (
          <View style={styles.tabCount}>
            <Text style={styles.tabCountText}>{this.state.tab2Count}</Text>
          </View>
        ) : null}
        {route.key === 'notifications' && this.state.index !== 2 &&
          this.state.tab3Count > 0 ? (
            <View style={styles.tabCount}>
              <Text style={styles.tabCountText}>{this.state.tab3Count}</Text>
            </View>
          ) : null}
      </View>
    )
  };

  renderTabBar = (props: SceneRendererProps & { navigationState: State }) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        renderIcon={this.renderIcon}
        style={styles.tabbar}
      />
    );
  };

  renderScene = SceneMap({
    home: () => (
      <ProductListScreen
        handleRequestTab={this.handleRequestTab}
        navigation={this.props.navigation}
        location={this.state.location}
        index={this.state.index}
        ref={this.child1}
      />
    ),
    chats: () => (
      <ChatListScreen
        handleRequestTab={this.handleRequestTab}
        navigation={this.props.navigation}
        location={this.state.location}
        index={this.state.index}
        ref={this.child2}
        handleRefreshCount={this.handleChatCount}
      />
    ),
    notifications: () => (
      <NotiListScreen
        handleRequestTab={this.handleRequestTab}
        navigation={this.props.navigation}
        location={this.state.location}
        index={this.state.index}
        ref={this.child3}
      />
    ),
    profile: () => (
      <ProfileScreen
        handleRequestTab={this.handleRequestTab}
        navigation={this.props.navigation}
        location={this.state.location}
        index={this.state.index}
        ref={this.child4}
      />
    ),
  });

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
                          <StatusBar backgroundColor={colors.primary2} />
                          <View
                            style={{
                              backgroundColor: colors.primary2,
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
                              <View style={{ width: 30, height: 30 }}>
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
                          <TabView
                            navigationState={this.state}
                            renderScene={this.renderScene}
                            renderTabBar={this.renderTabBar}
                            onIndexChange={this.handleIndexChange}
                          />
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
                                backgroundColor: 'rgba(0,0,0,0.5)',
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
                                  backgroundColor: colors.primary2,
                                  elevation: 10,
                                  borderBottomLeftRadius: 5,
                                  borderTopLeftRadius: 5,
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
        <Modal isVisible={this.state.update}>
          <View
            style={{
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              flex: 1,
            }}>
            <View
              style={{
                width: '80%',
                backgroundColor: colors.primary2,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <Text style={styles.updateHeader}>New Update Available</Text>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    'https://play.google.com/store/apps/details?id=com.byebuyy',
                  );
                }}
                style={styles.updateButton}>
                <Text style={styles.updateButtonText}>Update App</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.showExit}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                showExit: false,
              });
            }}
            style={{
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              flex: 1,
            }}>
            <View
              style={{
                width: '85%',
                backgroundColor: colors.primary2,
                borderRadius: 10,
                alignItems: 'center',
                paddingVertical: 20,
              }}>
              <Image
                source={require('../assets/images/icon.png')}
                style={{ width: 50, height: 50, marginBottom: 10 }}
              />
              <Text
                style={{
                  color: colors.white,
                  fontSize: 20,
                  fontFamily: 'Muli-Bold',
                }}>
                How was your experience ?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={this.handleBackButtonClick}
                  style={{
                    width: 120,
                    borderColor: colors.baseline,
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 40,
                    borderRadius: 5,
                    marginHorizontal: 10,
                  }}>
                  <Text style={[styles.updateButtonText, { color: colors.baseline }]}>Exit App</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.handleRate}
                  style={{
                    width: 120,
                    borderColor: colors.baseline,
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 40,
                    borderRadius: 5,
                    marginHorizontal: 10,
                    backgroundColor: colors.baseline,
                  }}>
                  <Text style={styles.updateButtonText}>Rate Us</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
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
    backgroundColor: colors.primary2,
    elevation: 1,
  },
  indicator: {
    backgroundColor: colors.baseline,
    height: 4,
    borderRadius: 2,
  },
  tabCount: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: colors.baseline,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabCountText: {
    color: colors.white,
    fontFamily: 'Muili-Bold',
    fontSize: 12,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  updateHeader: {
    color: colors.white,
    fontFamily: 'Muili-Bold',
    fontSize: 20,
    marginVertical: 10,
    marginTop: 20
  },
  updateButton: {
    backgroundColor: colors.baseline,
    width: 250,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginBottom: 20,
  },
  updateButtonText: {
    color: colors.white,
    fontFamily: 'Muili-Bold',
    fontSize: 18,
  },
});
