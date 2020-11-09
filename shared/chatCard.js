import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import auth from '@react-native-firebase/auth';
import colors from '../appTheme';
import axios from 'axios';
import link from '../fetchPath';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');

export default class ChatCard extends React.Component {
  inter = null;
  constructor() {
    super();
    this.state = {
      user: [],
      chat: [],
      loading: true,
      NF: false,
      unread: 0,
    };
  }

  async componentDidMount() {
    if (auth().currentUser) {
      var id = null;
      this.props.item.participants.map((e) => {
        if (e !== auth().currentUser.email) {
          id = e;
        }
      });
      var chatcardValue = await AsyncStorage.getItem(
        this.props.item.id + 'chat',
      );
      var chatcardValue2 = await AsyncStorage.getItem(
        this.props.item.id + 'user',
      );
      if (chatcardValue !== null && chatcardValue2 !== null) {
        console.log('Found local chat card');
        this.setState({
          chat: JSON.parse(chatcardValue),
          user: JSON.parse(chatcardValue2),
          loading: false,
        });
        this.handleInit();
        this.inter = setInterval(() => {
          this.handleInit();
        }, 2000);
      } else {
        console.log('No local chat card found');
        this.handleInit();
        this.inter = setInterval(() => {
          this.handleInit();
        }, 2000);
      }
    } else {
      clearInterval(this.inter);
    }
  }

  componentWillUnmount() {
    clearInterval(this.inter);
    this.setState = (state, callback) => {
      return;
    };
  }

  handleInit = async () => {
    var id = null;
    if (auth().currentUser) {
      this.props.item.participants.map((e) => {
        if (e !== auth().currentUser.email) {
          id = e;
        }
      });
      var data = {
        id: this.props.item.id,
      };
      var res = await axios.post(link + '/api/chat', data);
      var data2 = {
        id: id,
      };
      var res2 = await axios.post(link + '/api/user/single', data2);
      if (res.data !== null && res2.data !== null) {
        var uncount = 0;
        res.data.messages.map((m) => {
          if (m.read !== true && m.id !== auth().currentUser.email) {
            uncount += 1;
          }
        });
        this.storeData(this.props.item.id + 'chat', res.data);
        this.storeData(this.props.item.id + 'user', res2.data);
        this.setState({
          chat: res.data,
          user: res2.data,
          loading: false,
          unread: uncount,
        });
      }
    } else {
      clearInterval(this.inter);
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

  render() {
    return (
      <View style={{width: '100%', alignItems: 'center'}}>
        {this.state.loading ? (
          <View
            style={{
              width: '90%',
              paddingVertical: 10,
              paddingHorizontal: 15,
              alignItems: 'center',
              backgroundColor: colors.primary,
              justifyContent: 'space-between',
              borderRadius: 5,
              marginVertical: 5,
            }}>
            <SkeletonContent
              containerStyle={{width: '100%'}}
              boneColor={colors.primary}
              highlightColor={colors.darkText}
              isLoading={this.state.loadingProduct || this.state.loadingOwner}
              layout={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  children: [
                    {
                      width: 40,
                      height: 40,
                      marginRight: 10,
                      borderRadius: 20,
                    },
                    {
                      width: 150,
                      height: 20,
                    },
                  ],
                },
              ]}></SkeletonContent>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.push('Chat', {
                id: this.state.chat._id,
                location: this.props.location,
              })
            }
            style={styles.chat}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.chatProfileImageBox}>
                {this.state.user.photo ? (
                  <Image
                    source={{uri: this.state.user.photo}}
                    style={styles.chatProfileImage}
                  />
                ) : (
                  <Text style={styles.imageText}>
                    {this.state.user.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View>
                <Text style={styles.chatName}>{this.state.user.name}</Text>
                {this.state.chat.messages.length > 0 ? (
                  <Text style={styles.chatMessage}>
                    {
                      this.state.chat.messages[
                        this.state.chat.messages.length - 1
                      ].message
                    }
                  </Text>
                ) : null}
              </View>
            </View>
            {this.state.unread > 0 ? (
              <View style={{position: 'relative'}}>
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={30}
                  color={colors.grey}
                />
                <Text style={styles.unread}>{this.state.unread}</Text>
              </View>
            ) : (
              <Ionicons
                name="chatbox-ellipses-outline"
                size={30}
                color={colors.grey}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chat: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  chatProfileImageBox: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.grey,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatProfileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.grey,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grey,
  },
  imageText: {
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    color: colors.darkText,
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
  unread: {
    position: 'absolute',
    right: 0,
    top: -5,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    color: colors.white,
    backgroundColor: colors.baseline,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});
