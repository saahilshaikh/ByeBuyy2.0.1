import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
  Share,
  Keyboard,
} from 'react-native';
import Moment from 'react-moment';
import Modal from 'react-native-modal';
import auth, {firebase} from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Snackbar from 'react-native-snackbar';
import ImageView from 'react-native-image-viewing';
import Lottieview from 'lottie-react-native';
import Card3 from '../shared/card3';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import link from '../fetchPath';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../appTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

var inter;

export default class ViewProductScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      productList: [],
      owner: [],
      loadingProduct: true,
      loadingOwner: true,
      loadingProductList: true,
      comment: '',
      commenting: false,
      images: [],
      imageIndex: 0,
      showImage: false,
      menu: false,
      NF: false,
      request: false,
      tab: 1,
      selectId: '',
      lastTags: [0],
      tags: [],
      desc: '',
      reportForm: false,
      like: false,
      save: false,
    };
  }

  async componentDidMount() {
    if (
      this.props.route.params &&
      this.props.route.params.screen !== undefined
    ) {
      var id = this.props.route.params.screen;
    } else {
      var id = this.props.route.state
        ? this.props.route.state.routes[0].name
        : this.props.route.params.id;
    }
    const cardValue = await AsyncStorage.getItem(id + 'product');
    const cardValue2 = await AsyncStorage.getItem(id + 'owner');
    if (cardValue !== null && cardValue2 !== null) {
      console.log('Card Details local found');
      var product = JSON.parse(cardValue);
      if (product.varient === 'Product') {
        this.setState({
          product: product,
          owner: JSON.parse(cardValue2),
          loadingProduct: false,
          loadingOwner: false,
          NF: false,
        });
        this.handleInit();
      } else {
        this.setState({
          product: [],
          owner: [],
          loadingProduct: false,
          loadingOwner: false,
          NF: true,
        });
      }
    } else {
      console.log('Card Details local not found');
      this.handleInit();
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  handleInit = async () => {
    if (
      this.props.route.params &&
      this.props.route.params.screen !== undefined
    ) {
      console.log('running screen');
      var data = {
        id: this.props.route.params.screen,
      };
      var res = await axios.post(link + '/api/product/single', data);
      console.log(res.data);
      if (res.data.varient === 'Product') {
        var data2 = {
          id: res.data.owner,
        };
        console.log(data2);
        var res2 = await axios.post(link + '/api/user/single', data2);
        var owner = res2.data;
        var product = res.data;
        product.id = product._id;
        product.tag = '';
        if ((res.data !== null) & (res2.data !== null)) {
          this.storeData(this.props.route.params.screen + 'product', product);
          this.storeData(this.props.route.params.screend + 'owner', owner);
          this.setState({
            product: product,
            owner: owner,
            loadingProduct: false,
            loadingOwner: false,
          });
        }
      } else {
        this.setState({
          product: [],
          owner: [],
          loadingProduct: false,
          loadingOwner: false,
          NF: true,
        });
      }
    } else {
      var id = this.props.route.state
        ? this.props.route.state.routes[0].name
        : this.props.route.params.id;
      console.log(id);
      var data = {
        id: id,
      };
      var res = await axios.post(link + '/api/product/single', data);
      var data2 = {
        id: res.data.owner,
      };
      console.log(data2);
      var res2 = await axios.post(link + '/api/user/single', data2);
      if (res.data.varient === 'Product') {
        var owner = res2.data;
        var product = res.data;
        product.id = product._id;
        if ((res.data !== null) & (res2.data !== null)) {
          this.storeData(id + 'product', product);
          this.storeData(id + 'owner', owner);
          this.setState({
            product: product,
            owner: owner,
            loadingProduct: false,
            loadingOwner: false,
          });
        }
      } else {
        this.setState({
          product: [],
          owner: [],
          loadingProduct: false,
          loadingOwner: false,
          NF: true,
        });
      }
    }
    if (auth().currentUser) {
      var data3 = {
        id: auth().currentUser.email,
      };
      var res3 = await axios.post(link + '/api/user/single', data3);
      if (res3.data !== null) {
        var currentUser = res3.data;
        currentUser.id = currentUser._id;
        var productList = [];
        currentUser.posts.map((item) => {
          if (item.type.toLowerCase() === 'product') {
            productList.push(item);
          }
        });
        console.log(productList);
        this.setState({
          currentUser: currentUser,
          productList: productList,
          like: auth().currentUser
            ? product.likes.includes(auth().currentUser.email)
            : false,
          save: auth().currentUser
            ? product.saves.includes(auth().currentUser.email)
            : false,
        });
      }
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

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  handleDistance = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

  handleMenu = () => {
    this.setState({menu: !this.state.menu});
  };

  handleRequest = () => {
    if (auth().currentUser) {
      if (this.state.product.quantity > 0) {
        this.setState({request: !this.state.request});
      } else {
        Snackbar.show({
          text: 'Sorry, the transaction is already done for this product',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  handleCardImageClick = (e, f) => {
    var images = [];
    e.map((image) => {
      var img = {};
      img.uri = image.image;
      images.push(img);
    });
    this.setState({
      showImage: true,
      imageIndex: f - 1,
      images: images,
    });
  };

  handleLike = async () => {
    var addLike = false;
    if (auth().currentUser) {
      this.setState({
        like: !this.state.like,
      });
      var data = {
        id: this.state.product.id,
        email: auth().currentUser.email,
        type: this.state.product.varient,
      };
      var res = await axios.post(link + '/api/product/toggleLike', data);
      console.log(res.data);
      if (res.data !== null) {
        if (res.data.type === 'success') {
          if (
            this.state.like &&
            auth().currentUser.email !== this.state.owner.email
          ) {
            this.sendLikeActivity();
            this.sendLikedPushNotification('Product', this.state.product.id);
          }
        }
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  sendLikeActivity = async () => {
    var data = {
      id: this.state.product.id,
      action: 'Like',
      type: 'Product',
      email1: this.state.owner.email,
      email2: this.state.currentUser.email,
    };
    var res = await axios.post(link + '/api/notifications/check', data);
    if (res.data.length === 0) {
      this.sendLikedPushNotification('Product', this.state.product.id);
      var res2 = await axios.post(link + '/api/notifications/add', data);
      if (res2.data !== null) {
        console.log(res.data);
      }
    }
  };

  handleShare = (e) => {
    const result = Share.share({
      message: 'https://www.byebuyy.com/viewProduct/' + e,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
        console.log(result);
      } else {
        // shared
        console.log(result);
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
      console.log(result);
    }
  };

  handleSave = async () => {
    var addLike = false;
    if (auth().currentUser) {
      this.setState({
        save: !this.state.save,
      });
      var data = {
        id: this.state.product.id,
        email: auth().currentUser.email,
        type: this.state.product.varient,
      };
      var res = await axios.post(link + '/api/product/toggleSave', data);
      console.log(res.data);
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  handleShare = (e) => {
    console.log('110', e);
    const result = Share.share({
      message: 'https://www.byebuyy.com/viewProduct/' + e,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
        console.log(result);
      } else {
        // shared
        console.log(result);
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
      console.log(result);
    }
  };

  handleSelectCard = (e) => {
    if (e !== this.state.selectId) {
      this.setState({
        selectId: e,
      });
    } else {
      this.setState({
        selectId: '',
      });
    }
  };

  handleRequestProduct = () => {
    if (this.state.tab === 1) {
      this.handleRequestProductWithMessage();
    } else if (this.state.tab === 2) {
      this.handleRequestProductWithExchange();
    }
  };

  handleRequestProductWithMessage = () => {
    console.log('REQ 1');
    if (this.state.desc === '') {
      Snackbar.show({
        text: 'Please state a reason',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      this.handleChat();
    }
  };

  handleRequestProductWithExchange = () => {
    console.log('REQ 2');
    if (this.state.selectId === '') {
      Snackbar.show({
        text: 'Please select one of your product',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      this.handleChat();
    }
  };

  handleChat = async () => {
    var data = {
      email1: this.state.product.owner,
      email2: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/user/chat', data);
    if (res.data !== null) {
      var id = res.data.toString();
      var chatData = {
        id: id,
      };
      var resChat = await axios.post(link + '/api/chat', chatData);
      console.log('CHAT DATA:', resChat.data);
      if (resChat.data !== null) {
        if (resChat.data.deals.length > 0) {
          Snackbar.show({
            text: 'A deal is already in progress with this user!',
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          var logs = [];
          var log = {
            name: 'Deal Initialized',
            date: new Date(),
          };
          logs.push(log);
          if (this.state.tab === 1) {
            var data = {
              date: new Date(),
              message: this.state.desc,
              meeting: [],
              id1: this.state.product.id,
              id2: '',
              initiate: auth().currentUser.email,
              logs: logs,
              status: false,
              varient: 'request',
              dealStatus: false,
              dealDone: [],
              chatId: id,
            };
            var resDeal = await axios.post(link + '/api/makeDeal', data);
            if (resDeal.data !== null) {
              if (resDeal.data.type === 'success') {
                this.setState({
                  request: false,
                });
                this.handleSendSimpleMessage(id);
                this.props.navigation.navigate('Chat', {
                  id: id,
                  location: this.props.route.params.location,
                });
              } else {
                Snackbar.show({
                  text: 'Could not make a deal!',
                  duration: Snackbar.LENGTH_SHORT,
                });
              }
            }
          } else if (this.state.tab === 2) {
            var data = {
              date: new Date(),
              message: '',
              meeting: [],
              id1: this.state.product.id,
              id2: this.state.selectId,
              initiate: auth().currentUser.email,
              logs: logs,
              status: false,
              varient: 'exchange',
              dealStatus: false,
              dealDone: [],
              chatId: id,
            };
            var resDeal = await axios.post(link + '/api/makeDeal', data);
            if (resDeal.data !== null) {
              if (resDeal.data.type === 'success') {
                this.handleSendSimpleMessage(id);
                this.setState({
                  request: false,
                });
                this.props.navigation.navigate('Chat', {
                  id: id,
                  location: this.props.route.params.location,
                });
              } else {
                Snackbar.show({
                  text: 'Could not make a deal!',
                  duration: Snackbar.LENGTH_SHORT,
                });
              }
            }
          }
        }
      }
    }
  };

  handleSendSimpleMessage = async (id) => {
    console.log('RSMS');
    var message = this.state.desc;
    var data = {
      name: '',
      url: '',
      message: message,
      id: auth().currentUser.email,
      format: 'message',
      chatId: id,
    };
    var res = await axios.post(link + '/api/sendMesssage', data);
    if (res.data !== null) {
      this.sendRequestPushNotification('Chat', id);
      console.log('Send Message');
      var data2 = {
        email2: auth().currentUser.email,
        email1: this.state.owner.email,
        id: id,
      };
      var res2 = await axios.post(link + '/api/orderChat', data2);
      if (res2.data !== null) {
        console.log('Ordered Chat');
      }
    }
  };

  handleRemovePost = async (e) => {
    clearInterval(inter);
    this.setState({
      NF: true,
    });
    const data = {
      id: this.state.product.id,
      email: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/product/delete', data);
    if (res.data.type === 'success') {
      Snackbar.show({
        text: 'Post removed!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      Snackbar.show({
        text: res.data.error,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  sendLikedPushNotification = async (e, f) => {
    const FIREBASE_API_KEY =
      'AAAA-x7BxpY:APA91bGm_UWNpbo0o6aOfVkEaIqRLZAhdh0oCjs-RCxA2qsrYy3LjTzSRzVeoBycvhXT2w2qRZEL2e7nmKa3-kgBRCfUZEyffWlpU8fhOhwaELLC0RpNvUtM6GAdcdC8jhhfaWxq6req';
    console.log(this.state.token);
    const message = {
      registration_ids: [this.state.owner.pushToken],
      notification: {
        title: this.state.currentUser.name + ' liked your product',
        body: '',
        vibrate: 1,
        sound: 1,
        show_in_foreground: false,
        priority: 'high',
        content_available: true,
      },
      data: {
        type: e,
        id: f,
        date: new Date(),
      },
    };
    var body = JSON.stringify(message);
    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });

    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: body,
    });
    re = response.json();
    console.log('174', re);
  };

  sendRequestPushNotification = async (e, f) => {
    const FIREBASE_API_KEY =
      'AAAA-x7BxpY:APA91bGm_UWNpbo0o6aOfVkEaIqRLZAhdh0oCjs-RCxA2qsrYy3LjTzSRzVeoBycvhXT2w2qRZEL2e7nmKa3-kgBRCfUZEyffWlpU8fhOhwaELLC0RpNvUtM6GAdcdC8jhhfaWxq6req';
    console.log(this.state.token);
    const message = {
      registration_ids: [this.state.owner.pushToken],
      notification: {
        title: this.state.currentUser.name + ' requested your product',
        body: '',
        vibrate: 1,
        sound: 1,
        show_in_foreground: false,
        priority: 'high',
        content_available: true,
      },
      data: {
        type: e,
        id: f,
        date: new Date(),
      },
    };
    var body = JSON.stringify(message);
    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });

    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: body,
    });
    re = response.json();
    console.log('174', re);
  };

  handleReport = (e) => {
    console.log(e);
    this.setState({
      reportForm: false,
    });
    // if (!this.state.currentUser.reports.includes(this.state.product.id)) {
    //     firestore().collection('testusers').doc(this.state.currentUser.id).get().then(user => {
    //         var reports = user.data().reports;
    //         var report = {
    //             category: e,
    //             id: this.state.product.id,
    //             date: new Date()
    //         }
    //         reports.push(report);
    //         firestore().collection('testusers').doc(this.state.currentUser.id).update({
    //             reports: reports
    //         })
    //             .then(() => {
    //                 firestore().collection('testproducts').doc(this.state.product.id).get().then(product => {
    //                     var reports = product.data().reports;
    //                     var report = {
    //                         category: e,
    //                         email: this.state.currentUser.email,
    //                         date: new Date()
    //                     }
    //                     reports.push(report);
    //                     firestore().collection('testproducts').doc(this.state.product.id).update({
    //                         reports: reports
    //                     })
    //                         .then(() => {
    //                             this.props.navigation.pop()
    //                         })
    //                 })
    //             })
    //     })
    // }
    // else {
    //     Snackbar.show({
    //         text: 'Already reported',
    //         duration: Snackbar.LENGTH_SHORT
    //     })
    // }
  };

  handeGoBack = () => {
    if (this.props.route.state === undefined) {
      console.log('GBack');
      this.props.navigation.pop();
    } else {
      console.log('GMain');
      this.props.navigation.navigate('Main');
    }
  };

  renderHeader = () => {
    return (
      <View style={{width: '100%', alignItems: 'center'}}>
        {!this.state.loadingProduct && !this.state.loadingOwner ? (
          <>
            {this.state.NF === false ? (
              <View style={{width: '100%', alignItems: 'center'}}>
                <View style={styles.item}>
                  <View style={styles.top}>
                    <View style={styles.profile}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('viewProfile', {
                            id: this.state.owner.id,
                          })
                        }
                        style={styles.profileBox}>
                        {this.state.owner.photo ? (
                          <Image
                            source={{uri: this.state.owner.photo}}
                            style={styles.profileImage}
                          />
                        ) : (
                          <View style={styles.profileImageBox}>
                            <Text style={styles.imageText}>
                              {this.state.owner.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}
                        {this.state.owner.active &
                        (this.state.owner.logout === false) ? (
                          <View style={styles.active}></View>
                        ) : null}
                      </TouchableOpacity>
                      <View>
                        <Text style={styles.profileName}>
                          {this.state.owner.name}
                        </Text>
                        {this.state.owner.uname ? (
                          <Text style={styles.profileUName}>
                            @{this.state.owner.uname}
                          </Text>
                        ) : null}
                        <Text style={styles.time}>
                          <Moment element={Text} fromNow>
                            {this.state.product.date}
                          </Moment>
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                      }}
                      onPress={this.handleMenu}>
                      <Ionicons
                        name="ios-ellipsis-horizontal-outline"
                        size={22}
                        color={colors.grey}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.middle}>
                    <Text style={styles.type}>{this.state.product.type}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Ionicons
                        name="ios-location-outline"
                        size={14}
                        color={colors.white}
                        style={{marginRight: 5}}
                      />
                      <Text style={styles.location}>
                        {this.state.product.city +
                          ', ' +
                          this.state.product.country}
                      </Text>
                    </View>
                    <Text style={styles.title}>
                      Ready to {this.state.product.type}{' '}
                      {this.state.product.what}{' '}
                      {this.state.product.withh
                        ? 'with ' + this.state.product.withh
                        : null}
                    </Text>
                    <Text style={styles.subHeader}>Description</Text>
                    <Text style={styles.desc}>
                      {this.state.product.description}
                    </Text>
                    {this.state.product.type === 'share' &&
                    this.state.product.giveaway === false ? (
                      <>
                        <Text style={styles.subHeader}>Sharing Dates</Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Ionicons
                              name="ios-calendar"
                              style={{fontSize: 18, color: colors.white}}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: 'Muli-Bold',
                                color: colors.white,
                                marginLeft: 5,
                              }}>
                              {this.state.product.share_from}
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'Muli-Bold',
                              color: colors.white,
                              marginHorizontal: 5,
                            }}>
                            -
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Ionicons
                              name="ios-calendar"
                              style={{fontSize: 18, color: colors.white}}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: 'Muli-Bold',
                                color: colors.white,
                                marginLeft: 5,
                              }}>
                              {this.state.product.share_till}
                            </Text>
                          </View>
                        </View>
                      </>
                    ) : null}
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={{marginVertical: 10}}>
                      {this.state.product.images.length > 1 ? (
                        <>
                          {this.state.product.images.map((image, index) => {
                            return (
                              <TouchableOpacity
                                key={index}
                                onPress={() =>
                                  this.handleCardImageClick(
                                    this.state.product.images,
                                    image.index,
                                  )
                                }
                                style={styles.imageBox}>
                                <Image
                                  source={{uri: image.image}}
                                  style={styles.imageBox}
                                />
                              </TouchableOpacity>
                            );
                          })}
                        </>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.handleCardImageClick(
                              this.state.product.images,
                              this.state.product.images[0].index,
                            )
                          }
                          style={styles.imageBoxOne}>
                          <Image
                            source={{uri: this.state.product.images[0].image}}
                            style={styles.imageBoxOne}
                          />
                        </TouchableOpacity>
                      )}
                    </ScrollView>
                  </View>
                  <View style={styles.bottom}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        onPress={this.handleLike}
                        style={{
                          flexDirection: 'row',
                          height: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {this.state.like ? (
                          <AntDesign
                            name="like1"
                            size={26}
                            color={colors.baseline}
                            style={{marginRight: 7}}
                          />
                        ) : (
                          <AntDesign
                            name="like2"
                            size={26}
                            color={colors.grey}
                            style={{marginRight: 7}}
                          />
                        )}
                        {this.state.product.likes.length > 0 ? (
                          <Text style={{fontSize: 16, color: colors.grey}}>
                            {this.state.product.likes.length > 1000
                              ? this.state.product.likes.length / 1000 + 'K'
                              : this.state.product.likes.length}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('viewComment', {
                            id: this.state.product.id,
                          })
                        }
                        style={{
                          flexDirection: 'row',
                          height: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Ionicons
                          name="ios-chatbubble-outline"
                          size={28}
                          color={colors.grey}
                          style={{marginHorizontal: 7}}
                        />
                        {this.state.product.comments.length > 0 ? (
                          <Text style={{fontSize: 16, color: colors.grey}}>
                            {this.state.product.comments.length > 1000
                              ? this.state.product.comments.length / 1000 + 'K'
                              : this.state.product.comments.length}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        onPress={() => this.handleShare(this.state.product.id)}
                        style={{
                          width: 40,
                          height: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Ionicons
                          name="share-social-outline"
                          size={28}
                          color={colors.grey}
                          style={{marginHorizontal: 7}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Lottieview
                  source={require('../assets/16656-empty-state.json')}
                  autoPlay={true}
                  loop={false}
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
                  Nothing Found
                </Text>
              </View>
            )}
          </>
        ) : (
          <View
            style={{
              width: '95%',
              paddingVertical: 10,
              paddingHorizontal: 15,
              alignItems: 'center',
              backgroundColor: colors.primary,
              justifyContent: 'space-between',
              borderRadius: 10,
              marginBottom: 10,
              elevation: 3,
              marginTop: 10,
            }}>
            <SkeletonContent
              containerStyle={{width: '100%'}}
              boneColor={colors.primary}
              highlightColor={colors.darkText}
              isLoading={this.state.loadingProduct || this.state.loadingOwner}
              layout={[
                {
                  flexDirection: 'row',
                  marginTop: 10,
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
                {
                  flexDirection: 'column',
                  marginTop: 10,
                  children: [
                    {
                      width: '100%',
                      height: 30,
                    },
                    {
                      flexDirection: 'row',
                      marginVertical: 10,
                      justifyContent: 'space-between',
                      children: [
                        {
                          width: width * 0.42,
                          height: 150,
                        },
                        {
                          width: width * 0.42,
                          height: 150,
                        },
                      ],
                    },
                  ],
                },
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  children: [
                    {
                      width: 80,
                      height: 30,
                    },
                    {
                      width: 80,
                      height: 30,
                    },
                  ],
                },
              ]}></SkeletonContent>
          </View>
        )}
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <TouchableOpacity style={styles.action} onPress={this.handeGoBack}>
              <Ionicons
                name="ios-arrow-back"
                size={30}
                style={{color: colors.baseline}}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Product Info</Text>
          </View>
          {this.state.NF === false && this.state.loadingProduct === false ? (
            <>
              {auth().currentUser ? (
                <>
                  {this.state.product.owner ===
                  auth().currentUser.email ? null : (
                    <View style={styles.requestContainer}>
                      <TouchableOpacity
                        onPress={this.handleRequest}
                        style={{
                          flexDirection: 'row',
                          height: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <MaterialCommunityIcons
                          name="message-processing-outline"
                          size={28}
                          color={colors.grey}
                        />
                      </TouchableOpacity>
                      {this.state.product.quantity === 0 ? (
                        <View style={styles.crossbar}></View>
                      ) : null}
                    </View>
                  )}
                </>
              ) : null}
            </>
          ) : null}
        </View>
        {this.renderHeader()}
        <Modal isVisible={this.state.request}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: colors.secondary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <View style={{width: '100%', marginTop: 10}}>
                <View
                  style={{
                    width: '100%',
                    paddingTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {this.state.product.type === 'exchange' ? (
                    <View
                      style={{
                        width: '90%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            tab: 1,
                          })
                        }
                        style={
                          this.state.tab === 1
                            ? styles.activeTab
                            : styles.inactiveTab
                        }>
                        <Text
                          style={{
                            fontFamily: 'Muli-Bold',
                            color: colors.white,
                            fontSize: 12,
                            textAlign: 'center',
                          }}>
                          Request{'\n'}with a reason
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            tab: 2,
                          })
                        }
                        style={
                          this.state.tab === 2
                            ? styles.activeTab
                            : styles.inactiveTab
                        }>
                        <Text
                          style={{
                            fontFamily: 'Muli-Bold',
                            color: colors.white,
                            fontSize: 12,
                            textAlign: 'center',
                          }}>
                          Exchange{'\n'}with your product
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
                <View style={{width: '100%', alignItems: 'center'}}>
                  {this.state.tab === 1 ? (
                    <View style={{width: '100%', alignItems: 'center'}}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputGroupText}>
                          State a reason why you want this product?
                        </Text>
                        <TextInput
                          style={styles.inputArea}
                          autoCapitalize="none"
                          multiline={true}
                          maxLength={300}
                          onChangeText={(desc) => this.setState({desc})}
                          value={this.state.desc}></TextInput>
                      </View>
                    </View>
                  ) : null}
                  {this.state.tab === 2 &&
                  this.state.product.type === 'exchange' ? (
                    <View
                      style={{
                        width: '100%',
                        alignItems: 'center',
                        height: height * 0.6,
                      }}>
                      <ScrollView
                        style={{width: '100%', flex: 1, paddingVertical: 10}}>
                        {this.state.productList.map((product) => {
                          return (
                            <TouchableOpacity
                              onPress={() => this.handleSelectCard(product._id)}
                              style={styles.activeproduct}>
                              <Card3
                                key={product._id}
                                handleCardImageClick={(e, f) =>
                                  this.handleCardImageClick(e, f)
                                }
                                id={product._id}
                                navigation={this.props.navigation}
                              />
                              {product._id === this.state.selectId ? (
                                <>
                                  <View
                                    style={styles.activeproductOverlay}></View>
                                  <Ionicons
                                    name="checkmark-circle"
                                    size={25}
                                    color={colors.baseline}
                                    style={styles.activeproductIcon}
                                  />
                                </>
                              ) : (
                                <Ionicons
                                  name="checkmark-circle-outline"
                                  size={25}
                                  color={colors.grey}
                                  style={styles.activeproductIcon}
                                />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    style={styles.requestButton}
                    onPress={this.handleRequestProduct}>
                    <Text style={styles.requestButtonText}>Request</Text>
                    <Ionicons
                      name="ios-chatbubble-ellipses"
                      size={20}
                      color={colors.white}
                      style={{marginLeft: 5}}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    request: false,
                  })
                }
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 15,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Muli-Bold',
                    color: colors.white,
                    fontSize: 14,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.reportForm}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '90%',
                backgroundColor: colors.primary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomColor: colors.grey,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  paddingVertical: 10,
                }}>
                <TouchableOpacity
                  style={{marginLeft: 20}}
                  onPress={() =>
                    this.setState({
                      reportForm: false,
                    })
                  }>
                  <Ionicons
                    name="ios-close"
                    size={30}
                    color={colors.baseline}
                  />
                </TouchableOpacity>
                <Text style={styles.reportheader}>Report</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }}>
                <TouchableOpacity
                  onPress={() => this.handleReport('Nudity or sexual activity')}
                  style={styles.reportButton}>
                  <Text style={styles.reportText}>
                    Nudity or sexual activity
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.handleReport('Hate speech or symbols')}
                  style={styles.reportButton}>
                  <Text style={styles.reportText}>Hate speech or symbols</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.handleReport('Violence or dangerous')}
                  style={styles.reportButton}>
                  <Text style={styles.reportText}>Violence or dangerous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.handleReport('Sale of illegal or regulated goods')
                  }
                  style={styles.reportButton}>
                  <Text style={styles.reportText}>
                    Sale of illegal or regulated goods
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.handleReport('Bullying or harassment')}
                  style={styles.reportButton}>
                  <Text style={styles.reportText}>Bullying or harassment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.handleReport('Intellectual property violation')
                  }
                  style={styles.reportButton}>
                  <Text style={styles.reportText}>
                    Intellectual property violation
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.handleReport(
                      'Suicide, self-injury or easting disorders',
                    )
                  }
                  style={styles.reportButton}>
                  <Text style={styles.reportText}>
                    Suicide, self-injury or easting disorders
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.handleReport('Scam or fraud')}
                  style={styles.reportButton}>
                  <Text style={styles.reportText}>Scam or fraud</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.handleReport('False infromation')}
                  style={styles.reportButton}>
                  <Text style={styles.reportText}>False infromation</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <ImageView
          images={this.state.images}
          imageIndex={this.state.imageIndex}
          visible={this.state.showImage}
          onRequestClose={() => this.setState({showImage: false})}
          swipeToCloseEnabled={false}
          doubleTapToZoomEnabled={true}
          presentationStyle="fullScreen"
          animationType="slide"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#1B1F22',
    elevation: 3,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    marginLeft: 10,
    color: colors.white,
    fontFamily: 'Muli-Bold',
  },
  item: {
    padding: 15,
    width: '95%',
    alignItems: 'center',
    backgroundColor: '#1B1F22',
    justifyContent: 'space-between',
    borderColor: colors.darkText,
    borderWidth: 1,
    elevation: 3,
    borderRadius: 10,
    marginTop: 10,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.active,
    bottom: 0,
    right: 0,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    color: colors.darkText,
  },
  profileName: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
  },
  profileUName: {
    color: colors.grey,
    fontSize: 12,
    fontFamily: 'Muli-Bold',
  },
  tagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: colors.darkText,
    paddingHorizontal: 5,
    height: 25,
    borderRadius: 2,
  },
  tag: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Muli-Bold',
  },
  time: {
    color: colors.grey,
    fontSize: 10,
    fontFamily: 'Muli-Regular',
  },
  middle: {
    width: '100%',
  },
  type: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    textTransform: 'capitalize',
  },
  location: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Regular',
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    marginTop: 5,
  },
  desc: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    marginVertical: 10,
  },
  imageBox: {
    marginRight: 20,
    width: 0.5 * width,
    height: 0.5 * width,
    backgroundColor: colors.grey,
    borderRadius: 10,
  },
  imageBoxOne: {
    width: width - 55,
    height: width - 55,
    backgroundColor: colors.grey,
    borderRadius: 10,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  subHeader: {
    color: colors.baseline,
    fontFamily: 'Muli-Regular',
    fontSize: 12,
    marginTop: 5,
  },
  subHeader2: {
    color: colors.baseline,
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    marginTop: 5,
  },
  inputContainer: {
    width: width * 0.8,
    height: 45,
    backgroundColor: colors.white,
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    height: '100%',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
  },
  bottomButton: {
    width: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  activeTab: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    backgroundColor: colors.baseline,
    borderRadius: 5,
    elevation: 3,
  },
  inactiveTab: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  inputGroup: {
    width: '90%',
  },
  inputGroupText: {
    fontSize: 14,
    color: colors.grey,
    fontFamily: 'Muli-Bold',
    marginBottom: 10,
  },
  inputArea: {
    marginTop: 5,
    backgroundColor: colors.white,
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    color: colors.darkText,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
    borderRadius: 3,
  },
  requestButton: {
    elevation: 3,
    borderRadius: 5,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 40,
    backgroundColor: colors.baseline,
  },
  requestButtonText: {
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    color: colors.white,
  },
  product: {
    alignItems: 'center',
    marginBottom: 10,
  },
  activeproduct: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeproductOverlay: {
    position: 'absolute',
    top: 0,
    width: '95%',
    height: '100%',
    backgroundColor: colors.white,
    opacity: 0.35,
    borderRadius: 10,
  },
  activeproductIcon: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  reportheader: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  reportButton: {
    marginVertical: 5,
    width: '100%',
    paddingVertical: 5,
  },
  reportText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
  },
  requestContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  crossbar: {
    position: 'absolute',
    width: 38,
    height: 2,
    transform: [{rotate: '45deg'}],
    backgroundColor: colors.grey,
  },
});
