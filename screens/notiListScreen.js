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

export default class NotiListScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      notiList: [],
      acnotiList: [],
      refreshing: false,
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
      const notisValue = await AsyncStorage.getItem(
        auth().currentUser.email + 'notiList',
      );
      if (notisValue !== null) {
        console.log('Found local noti list');
        var notis = JSON.parse(notisValue);
        var notiList = [];
        notis.map((item) => {
          if (notiList.length < 10) {
            notiList.push(item);
          }
        });
        this.setState({
          notiList: notiList,
          acnotiList: notis,
          loading: false,
        });
        this.handleInit();
      } else {
        console.log('No local noti list found');
        this.handleInit();
      }
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  handleInit = async () => {
    var data = {
      id: auth().currentUser.email,
    };
    const res = await axios.post(link + '/api/user/singleNoti', data);
    console.log('44', res.data);
    if (res.data !== null) {
      this.storeData(auth().currentUser.email + 'notiList', res.data);
      console.log(res.data);
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
    });
    var data = {
      id: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/user/singleNoti', data);
    if (res.data !== null) {
      this.storeData(auth().currentUser.email + 'notiList', res.data);
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
      console.log(newnotiList);
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
              <View style={styles.list}>
                <FlatList
                  ListEmptyComponent={this.renderListEmpty}
                  style={{width: '100%'}}
                  data={this.state.notiList}
                  onEndReached={this.handleReachedEnd}
                  keyExtractor={_renderMyKeyExtractor}
                  initialNumToRender={10}
                  onEndReachedThreshold={0.5}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.handleRefresh}
                    />
                  }
                  renderItem={({item}) => {
                    return (
                      <View style={{width: '100%', alignItems: 'center'}}>
                        <NotiCard
                          id={item}
                          navigation={this.props.navigation}
                          location={this.state.location}
                        />
                      </View>
                    );
                  }}
                />
              </View>
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
