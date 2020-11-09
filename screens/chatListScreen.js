import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import ChatCard from '../shared/chatCard';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';
import AsyncStorage from '@react-native-community/async-storage';

export default class ChatListScreen extends React.Component {
  inter = null;
  constructor() {
    super();
    this.state = {
      chats: [],
      acchats: [],
      loading: true,
      refreshing: false,
      location: {
        lat: '',
        long: '',
      },
      refreshing: false,
    };
  }

  async componentDidMount() {
    if (auth().currentUser) {
      var chatListValue = await AsyncStorage.getItem(
        auth().currentUser.email + 'chatList',
      );
      if (chatListValue !== null) {
        console.log('Found local chat list');
        this.setState({
          chats: JSON.parse(chatListValue),
          loading: false,
        });
        this.handleInit();
        this.inter = setInterval(() => {
          this.handleInit();
        }, 2000);
      } else {
        console.log('No local chat list found');
        this.handleInit();
        this.inter = setInterval(() => {
          this.handleInit();
        }, 5000);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.inter);
    this.setState = (state, callback) => {
      return;
    };
  }

  handleInit = async () => {
    if (auth().currentUser) {
      this.setState({
        location: this.props.location,
      });
      var data = {
        id: auth().currentUser.email,
      };
      var res = await axios.post(link + '/api/user/singleChat', data);
      if (res.data !== null) {
        this.storeData(auth().currentUser.email + 'chatList', res.data);
        this.setState({
          chats: res.data,
          loading: false,
        });
      }
    } else {
      clearInterval(this.inter);
    }
  };

  handleRefresh = async () => {
    this.setState({
      refreshing: true,
    });
    var data = {
      id: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/user/singleChat', data);
    if (res.data !== null) {
      this.storeData(auth().currentUser.email + 'chatList', res.data);
      this.setState({
        chats: res.data,
        refreshing: false,
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
          justifyContent: 'center',
          paddingTop: 100,
        }}>
        <LottieView
          source={require('../assets/5830-happy-blob-empty.json')}
          autoPlay={true}
          loop={true}
          style={{
            width: 200,
            height: 200,
            transform: [{scale: 1.3}],
          }}
        />
        <Text
          style={{
            fontFamily: 'Muli-Regular',
            color: colors.grey,
            fontSize: 20,
          }}>
          Empty Inbox
        </Text>
      </View>
    );
  };

  render() {
    _renderMyKeyExtractor = (item, index) => item.id;
    return (
      <View style={styles.container}>
        {auth().currentUser ? (
          <View style={{width: '100%', alignItems: 'center', flex: 1}}>
            {this.state.loading ? (
              <ActivityIndicator
                size="large"
                color={colors.baseline}
                style={{marginTop: 10}}
              />
            ) : (
              <View style={styles.list}>
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.handleRefresh}
                    />
                  }
                  ListEmptyComponent={this.renderListEmpty}
                  style={{width: '100%', flex: 1}}
                  data={this.state.chats}
                  keyExtractor={_renderMyKeyExtractor}
                  renderItem={({item}) => (
                    <View style={{width: '100%', alignItems: 'center'}}>
                      <ChatCard
                        navigation={this.props.navigation}
                        item={item}
                        key={item.id}
                        location={this.state.location}
                      />
                    </View>
                  )}
                />
              </View>
            )}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  searchBar: {
    width: '90%',
    height: 40,
    backgroundColor: colors.primary,
    marginVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  searchBarText: {
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    color: colors.primary,
    width: '80%',
    padding: 0,
  },
  list: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    flex: 1,
  },
  chat: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  chatProfileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.grey,
    marginRight: 10,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    color: colors.white,
  },
  chatMessage: {
    fontSize: 12,
    fontFamily: 'Muli-Regular',
    color: colors.grey,
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
