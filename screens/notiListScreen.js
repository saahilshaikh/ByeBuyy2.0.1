import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import NotiCard from '../shared/notiCard';
import AsyncStorage from '@react-native-community/async-storage';
import link from '../fetchPath';
import axios from 'axios';
import colors from '../appTheme';
import {ScrollView} from 'react-native-gesture-handler';

export default class NotiListScreen extends React.Component {
  inter = null;
  constructor() {
    super();
    this.state = {
      loading: true,
      notiList: [],
      acnotiList: [],
      refreshing: false,
      today: [],
      weekly: [],
      monthly: [],
      earlier: [],
      location: {
        lat: '',
        long: '',
      },
    };
  }

  async componentDidMount() {
    this.setState({
      location: this.props.location,
    });
    if (auth().currentUser) {
      this.handleInit();
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  async handleMount() {
    console.log('NOTI MOUNT');
    this.setState({
      location: this.props.location,
    });
    if (auth().currentUser) {
      this.handleInit();
      this.inter = setInterval(() => {
        this.handleInit();
      }, 15000);
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  handleUnmount() {
    console.log('NOTI UNMOUNT');
    clearInterval(this.inter);
  }

  handleInit = async () => {
    var data = {
      id: auth().currentUser.email,
    };
    const res = await axios.post(link + '/api/user/singleNoti', data);
    if (res.data !== null) {
      var todayList = [];
      var weeklyList = [];
      var monthlyList = [];
      var earlierList = [];
      res.data.map((item) => {
        const diffTime = Math.abs(new Date() - new Date(item.date));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          todayList.push(item);
        } else if (diffDays > 1 && diffDays <= 7) {
          weeklyList.push(item);
        } else if (diffDays > 7 && diffDays <= 30) {
          monthlyList.push(item);
        } else {
          earlierList.push(item);
        }
      });
      this.setState({
        today: todayList,
        weekly: weeklyList,
        monthly: monthlyList,
        earlier: earlierList,
        loading: false,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  };

  handleRefresh = async () => {
    this.setState({
      refreshing: true,
      notiList: [],
      acnotiList: [],
      loading: true,
    });
    var data = {
      id: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/user/singleNoti', data);
    if (res.data !== null) {
      this.props.handleNotiCount();
      var notiList = [];
      res.data.map((item) => {
        if (notiList.length < 10) {
          notiList.push(item);
        }
      });
      this.setState({
        notiList: notiList,
        acnotiList: res.data,
        loading: false,
        refreshing: false,
      });
    }
  };

  handleReachedEnd = () => {
    var newnotiList = [];
    if (this.state.acnotiList.length !== this.state.notiList.length) {
      for (
        var i = this.state.notiList.length;
        i < this.state.acnotiList.length;
        i++
      ) {
        if (newnotiList.length < 10) {
          newnotiList.push(this.state.acnotiList[i]);
        }
      }
      this.setState({
        notiList: [...this.state.notiList, ...newnotiList],
      });
    }
  };

  storeData = async (label, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(label, jsonValue);
    } catch (e) {
      // saving error
      console.log('Error Storing File');
    }
  };

  renderListEmpty = () => {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          alignItems: 'center',
        }}>
        <LottieView
          source={require('../assets/notification.json')}
          autoPlay={true}
          loop={true}
          style={{
            width: 300,
            height: 250,
          }}
        />
        <Text
          style={{
            fontFamily: 'Muli-Bold',
            color: colors.grey,
            fontSize: 20,
          }}>
          No notifications
        </Text>
      </View>
    );
  };

  render() {
    _renderMyKeyExtractor = (item, index) => index.toString();
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <View
            style={{
              marginTop: 30,
              alignItems: 'center',
              width: '100%',
              flex: 1,
            }}>
            <View
              style={{
                marginTop: 20,
                alignItems: 'center',
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                marginBottom: 60,
              }}>
              <View style={{width: 120, height: 120}}>
                <LottieView
                  source={require('../assets/loading.json')}
                  autoPlay={true}
                  loop={true}
                />
              </View>
            </View>
          </View>
        ) : (
          <>
            {auth().currentUser ? (
              <ScrollView
                style={{width: '100%'}}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                  />
                }>
                <View style={styles.list}>
                  {this.state.today.length > 0 ? (
                    <View style={{width: '90%', marginTop: 10}}>
                      <Text style={styles.header}>Today</Text>
                      {this.state.today.map((item, index) => {
                        return (
                          <NotiCard
                            key={index}
                            id={item._id}
                            navigation={this.props.navigation}
                            location={this.state.location}
                            handleRefresh={this.handleRefresh}
                          />
                        );
                      })}
                    </View>
                  ) : null}
                  {this.state.weekly.length > 0 ? (
                    <View style={{width: '90%', marginTop: 10}}>
                      <Text style={styles.header}>This Week</Text>
                      {this.state.weekly.map((item, index) => {
                        return (
                          <NotiCard
                            key={index}
                            id={item._id}
                            navigation={this.props.navigation}
                            location={this.state.location}
                            handleRefresh={this.handleRefresh}
                          />
                        );
                      })}
                    </View>
                  ) : null}
                  {this.state.monthly.length > 0 ? (
                    <View style={{width: '90%', marginTop: 10}}>
                      <Text style={styles.header}>This Month</Text>
                      {this.state.monthly.map((item, index) => {
                        return (
                          <NotiCard
                            key={index}
                            id={item._id}
                            navigation={this.props.navigation}
                            location={this.state.location}
                            handleRefresh={this.handleRefresh}
                          />
                        );
                      })}
                    </View>
                  ) : null}
                  {this.state.earlier.length > 0 ? (
                    <View style={{width: '90%', marginTop: 10}}>
                      <Text style={styles.header}>Earlier</Text>
                      {this.state.earlier.map((item, index) => {
                        return (
                          <NotiCard
                            key={index}
                            id={item._id}
                            navigation={this.props.navigation}
                            location={this.state.location}
                            handleRefresh={this.handleRefresh}
                          />
                        );
                      })}
                    </View>
                  ) : null}
                </View>
                {this.state.today.length === 0 &&
                this.state.weekly.length === 0 &&
                this.state.monthly.length === 0 &&
                this.state.earlier.length === 0 ? (
                  <>{this.renderListEmpty()}</>
                ) : null}
              </ScrollView>
            ) : (
              <View style={{width: '100%', alignItems: 'center'}}>
                <View style={styles.imageBox}>
                  <LottieView
                    source={require('../assets/login.json')}
                    autoPlay
                    loop
                  />
                </View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Login')}
                  style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Login to continue</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  list: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    color: colors.baseline,
    fontFamily: 'Muli-Regular',
    fontSize: 16,
  },
  imageBox: {
    width: 300,
    height: 300,
  },
  loginButton: {
    width: 150,
    height: 50,
    backgroundColor: colors.baseline,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  loginButtonText: {
    color: colors.white,
    fontFamily: 'Muli-Bold',
    fontSize: 14,
  },
});
