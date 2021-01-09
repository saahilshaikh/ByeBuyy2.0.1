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
import Modal from 'react-native-modal';

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
      menu: false,
      menu2: false,
    };
  }

  async componentDidMount() {
    if (auth().currentUser) {
      // var id = null;
      // this.props.item.participants.map((e) => {
      //   if (e !== auth().currentUser.email) {
      //     id = e;
      //   }
      // });
      // var chatcardValue = await AsyncStorage.getItem(
      //   this.props.item.id + 'chat',
      // );
      // var chatcardValue2 = await AsyncStorage.getItem(
      //   this.props.item.id + 'user',
      // );
      // var show = true;
      // var c = JSON.parse(chatcardValue);
      // if (
      //   c.messages.length === 0 ||
      //   Math.floor(
      //     (new Date(
      //       c['clear' + (c.participants.indexOf(auth().currentUser.email) + 1)],
      //     ).getTime() -
      //       new Date(c.messages[c.messages.length - 1].date).getTime()) /
      //       1000,
      //   ) > 0
      // ) {
      //   show = false;
      // }
      // if (
      //   chatcardValue !== null &&
      //   chatcardValue2 !== null &&
      //   JSON.parse(chatcardValue2).name &&
      //   show
      // ) {
      //   console.log('Found local chat card');
      //   this.setState({
      //     chat: JSON.parse(chatcardValue),
      //     user: JSON.parse(chatcardValue2),
      //     loading: false,
      //     NF: false,
      //   });
      // } else {
      //   console.log('No local chat card found');
      //   this.setState({
      //     chat: [],
      //     user: [],
      //     loading: false,
      //     NF: true,
      //   });
      // }
      this.handleInit();
      this.inter = setInterval(() => {
        this.handleInit();
      }, 2000);
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
      if (res.data.participants) {
        var data2 = {
          id: id,
        };
        var res2 = await axios.post(link + '/api/user/single', data2);
        if (res.data !== null && res2.data !== null && res2.data.name) {
          var uncount = 0;
          res.data.messages.map((m) => {
            if (m.read !== true && m.id !== auth().currentUser.email) {
              uncount += 1;
            }
          });
          var show = true;
          if (
            res.data.messages.length === 0 ||
            Math.floor(
              (new Date(
                res.data[
                  'clear' +
                    (res.data.participants.indexOf(auth().currentUser.email) +
                      1)
                ],
              ).getTime() -
                new Date(
                  res.data.messages[res.data.messages.length - 1].date,
                ).getTime()) /
                1000,
            ) > 0
          ) {
            show = false;
          }
          if (show) {
            this.storeData(this.props.item.id + 'chat', res.data);
            this.storeData(this.props.item.id + 'user', res2.data);
            this.setState({
              chat: res.data,
              user: res2.data,
              loading: false,
              unread: uncount,
              NF: false,
            });
          } else {
            this.setState({
              chat: [],
              user: [],
              loading: false,
              unread: 0,
              NF: true,
            });
          }
        } else {
          this.storeData(this.props.item.id + 'chat', {});
          this.storeData(this.props.item.id + 'user', {});
          this.setState({
            chat: [],
            user: [],
            loading: false,
            unread: 0,
            NF: true,
          });
        }
      } else {
        this.storeData(this.props.item.id + 'chat', {});
        this.storeData(this.props.item.id + 'user', {});
        this.setState({
          chat: [],
          user: [],
          loading: false,
          unread: 0,
          NF: true,
        });
      }
    } else {
      clearInterval(this.inter);
    }
  };

  handleClear = async () => {
    this.setState({
      menu2: false,
    });
    var data = {
      id: this.state.chat._id,
      user: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/clearChat', data);
    if (res.data !== null) {
      this.handleInit();
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

  handleOpen = () => {
    this.props.handleRefreshCount();
    this.props.navigation.navigate('Chat', {
      id: this.state.chat._id,
      location: this.props.location,
    });
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
          <>
            {this.state.NF ? null : (
              <TouchableOpacity
                onPress={this.handleOpen}
                onLongPress={() => {
                  this.setState({menu: true});
                }}
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
                      <>
                        {Math.floor(
                          (new Date(
                            this.state.chat[
                              'clear' +
                                (this.state.chat.participants.indexOf(
                                  auth().currentUser.email,
                                ) +
                                  1)
                            ],
                          ).getTime() -
                            new Date(
                              this.state.chat.messages[
                                this.state.chat.messages.length - 1
                              ].date,
                            ).getTime()) /
                            1000,
                        ) < 0 &&
                        !this.state.chat.messages[
                          this.state.chat.messages.length - 1
                        ].hide.includes(auth().currentUser.email) ? (
                          <Text style={styles.chatMessage}>
                            {this.state.chat.messages[
                              this.state.chat.messages.length - 1
                            ].message.length > 10
                              ? this.state.chat.messages[
                                  this.state.chat.messages.length - 1
                                ].message.substring(0, 30) + '...'
                              : this.state.chat.messages[
                                  this.state.chat.messages.length - 1
                                ].message}
                          </Text>
                        ) : (
                          <Text style={styles.chatMessage}></Text>
                        )}
                      </>
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
          </>
        )}
        <Modal isVisible={this.state.menu}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                menu: false,
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
                width: '80%',
                backgroundColor: colors.secondary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    menu: false,
                    menu2: true,
                  });
                }}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 20,
                  justifyContent: 'center',
                  textAlign: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Muli-Bold',
                    color: colors.white,
                    fontSize: 16,
                  }}>
                  Clear conversation
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal isVisible={this.state.menu2}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                menu2: false,
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
                width: '80%',
                backgroundColor: colors.secondary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={this.handleClear}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 20,
                  justifyContent: 'center',
                  borderBottomColor: colors.grey,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}>
                <Text
                  style={{
                    fontFamily: 'Muli-Bold',
                    color: colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  Yes, clear Conversation
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    menu2: false,
                  });
                }}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 20,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Muli-Bold',
                    color: colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  No, dont clear conversation
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
    fontSize: 12,
    fontFamily: 'Muli-Bold',
    color: colors.white,
    backgroundColor: colors.baseline,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});
