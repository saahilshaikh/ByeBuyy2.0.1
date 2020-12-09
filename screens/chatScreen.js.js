import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
  Keyboard,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Message from '../shared/message';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import UUIDGenerator from 'react-native-uuid-generator';
import Snackbar from 'react-native-snackbar';
import DocumentPicker from 'react-native-document-picker';
import Card3 from '../shared/card3';
import Moment from 'react-moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import LottieView from 'lottie-react-native';
import colors from '../appTheme';
import axios from 'axios';
import link from '../fetchPath';
import AsyncStorage from '@react-native-community/async-storage';

var RNFS = require('react-native-fs');

const {width, height} = Dimensions.get('window');

var mode = 'date';
export default class ChatScreen extends React.PureComponent {
  inter = null;
  constructor() {
    super();
    this.state = {
      user: [],
      chat: [],
      loading: true,
      NF: false,
      showImage: false,
      menu: false,
      message: '',
      sending: false,
      attach: false,
      image: '',
      prevFormat: '',
      prevName: '',
      prevUrl: '',
      prevMessage: '',
      video: '',
      name: '',
      pdf: '',
      showDeal: false,
      showDealInfo: false,
      showDealMenu: false,
      showDealForm: false,
      landmark: '',
      city: '',
      country: '',
      date: '',
      time: '',
      showDate: false,
      rateForm: false,
      rating: 0,
      rateComment: '',
      currentUser: [],
      block: false,
    };
  }

  async componentDidMount() {
    if (auth().currentUser) {
      var chatValue = await AsyncStorage.getItem(
        this.props.route.params.id + 'chat',
      );
      var chatValue2 = await AsyncStorage.getItem(
        this.props.route.params.id + 'user',
      );
      if (chatValue !== null && chatValue2 !== null) {
        console.log('Local chat found');
        var ch = JSON.parse(chatValue);
        this.setState({
          user: JSON.parse(chatValue2),
          chat: ch,
          loading: false,
          block: ch.blocked.includes(auth().currentUser.email),
          showDeal: ch.deals.length > 0,
        });
      } else {
        console.log('local chat not found');
      }
      this.handleInit();
      this.inter = setInterval(() => {
        this.handleInit();
      }, 1000);
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
    if (auth().currentUser) {
      var data = {
        id: this.props.route.params.id,
        email: auth().currentUser.email,
      };
      var res = await axios.post(link + '/api/chat/updateMessages', data);
      if (res.data !== null) {
        var userId = null;
        res.data.participants.map((e) => {
          if (e !== auth().currentUser.email) {
            userId = e;
          }
        });
        var data2 = {
          id: userId,
        };
        var res2 = await axios.post(link + '/api/user/single', data2);
        if (res2.data !== null && res2.data.name) {
          this.storeData(this.props.route.params.id + 'chat', res.data);
          this.storeData(this.props.route.params.id + 'user', res2.data);
          this.setState({
            user: res2.data,
            chat: res.data,
            loading: false,
            block: res.data.blocked.includes(auth().currentUser.email),
            showDeal: res.data.deals.length > 0,
          });
        } else {
          this.storeData(this.props.route.params.id + 'chat', {});
          this.storeData(this.props.route.params.id + 'user', {});
          this.setState({
            loading: false,
            NF: !false,
          });
        }
      } else {
        this.storeData(this.props.route.params.id + 'chat', {});
        this.storeData(this.props.route.params.id + 'user', {});
        this.setState({
          loading: false,
          NF: !false,
        });
      }
      var data3 = {
        id: auth().currentUser.email,
      };
      var res3 = await axios.post(link + '/api/user/single', data3);
      if (res3.data !== null) {
        this.setState({
          currentUser: res3.data,
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

  handleMenu = () => {
    this.setState({
      menu: true,
    });
  };

  handleBlock = () => {
    this.setState({
      menu: false,
      block: true,
    });
    var data = {
      id: this.state.chat._id,
      email: auth().currentUser.email,
    };
    var res = axios.post(link + '/api/chat/block', data);
    if (res.data !== null) {
      console.log('Blocked');
    }
  };

  handleUnblock = () => {
    this.setState({
      menu: false,
      block: false,
    });
    var data = {
      id: this.state.chat._id,
      email: auth().currentUser.email,
    };
    var res = axios.post(link + '/api/chat/unblock', data);
    if (res.data !== null) {
      console.log('Unblocked');
    }
  };

  handleCamera = () => {
    this.setState({
      attach: false,
    });
    console.log('Camera Click');
    ImagePicker.openCamera({
      width: 1000,
      height: 1000,
      cropping: true,
    })
      .then((img) => {
        console.log(img);
        this.setState({
          image: img.path,
        });
        this.handleSend(2);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleGallery = () => {
    this.setState({
      attach: false,
    });
    console.log('Gallery Click');
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      multiple: false,
      mediaType: 'photo',
    })
      .then((item) => {
        console.log(item);
        this.setState({
          image: item.path,
          attach: false,
        });
        this.handleSend(2);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleVideoGallery = () => {
    console.log('Gallery Click');
    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then((item) => {
        console.log(item);
        var fileName = item.path;
        var str = fileName.split('react-native-image-crop-picker/');
        var name = str[str.length - 1];
        if (item.size > 5242880) {
          Snackbar.show({
            text: 'Video size is larger than 5mb!',
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          this.setState({
            video: item.path,
            attach: false,
            name: name,
          });
          this.handleSend(3);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleDocument = () => {
    this.setState({
      attach: false,
    });
    DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    })
      .then((item) => {
        console.log(item);
        if (item.size > 5242880) {
          Snackbar.show({
            text: 'Pdf size is larger than 5mb!',
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          this.setState({
            pdf: item.uri,
            attach: false,
            name: item.name,
          });
          this.handleSend(4);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleMessage = (message) => {
    console.log(message);
    this.setState({
      message,
    });
  };

  handleSend = (e) => {
    if (e === 1) {
      this.handleSendSimpleMessage();
      this.sendPushNotification('Chat', this.state.chat._id, 'message');
    } else if (e === 2) {
      this.handleSendImage();
      this.sendPushNotification('Chat', this.state.chat._id, 'photo');
    } else if (e === 3) {
      this.handleSendVideo();
      this.sendPushNotification('Chat', this.state.chat._id, 'video');
    } else if (e === 4) {
      this.handleSendDocument();
      this.sendPushNotification('Chat', this.state.chat._id, 'document');
    } else if (e === 5) {
      this.handleSendAcceptMessage();
      this.sendDealPushNotification('Chat', this.state.chat._id, 'accepted');
    } else if (e === 6) {
      this.handleSendDealDone();
      this.sendDealPushNotification(
        'Chat',
        this.state.chat._id,
        'accomplished',
      );
    } else if (e === 7) {
      this.handleSendRejectMessage();
      this.sendDealPushNotification('Chat', this.state.chat._id, 'rejected');
    } else if (e === 8) {
      this.handleSendMeeting();
      this.sendDealPushNotification(
        'Chat',
        this.state.chat._id,
        'set a new meeting for',
      );
    }
  };

  handleSendSimpleMessage = async () => {
    console.log('RSMS');
    if (this.state.sending === false) {
      var message = this.state.message;
      this.setState({
        sending: true,
        prevMessage: this.state.message,
        prevFormat: 'message',
        prevUrl: '',
        prevName: '',
        message: '',
      });
      var data = {
        name: '',
        url: '',
        message: message,
        id: auth().currentUser.email,
        format: 'message',
        chatId: this.state.chat._id,
      };
      var res = await axios.post(link + '/api/sendMesssage', data);
      if (res.data !== null) {
        this.setState({
          sending: false,
          prevMessage: '',
          prevFormat: '',
          prevUrl: '',
          prevName: '',
        });
        var data2 = {
          email2: auth().currentUser.email,
          email1: this.state.user.email,
          id: this.state.chat._id,
        };
        var res2 = await axios.post(link + '/api/orderChat', data2);
        if (res2.data !== null) {
          console.log(res2.data);
          console.log('Ordered Chat');
        }
      }
    }
  };

  handleSendImage = async () => {
    console.log('RSI');
    if (this.state.sending === false) {
      this.setState({
        sending: true,
        prevMessage: 'Have a look',
        prevFormat: 'attach-photo',
        prevUrl: this.state.image,
        prevName: '',
      });
      var url = await this.handleUploadImage(this.state.image);
      console.log('225', url);
      var data = {
        name: '',
        url: url,
        message: 'Have a look',
        id: auth().currentUser.email,
        format: 'attach-photo',
        chatId: this.state.chat._id,
      };
      var res = await axios.post(link + '/api/sendMesssage', data);
      if (res.data !== null) {
        this.setState({
          sending: false,
          prevMessage: '',
          prevFormat: '',
          prevUrl: '',
          prevName: '',
        });
        var data2 = {
          email2: auth().currentUser.email,
          email1: this.state.user.email,
          id: this.state.chat._id,
        };
        var res2 = await axios.post(link + '/api/orderChat', data2);
        if (res2.data !== null) {
          console.log('Ordered Chat');
        }
      }
    }
  };

  handleUploadImage = async (e) => {
    console.log('Running Upload');
    var y;
    var uid = await UUIDGenerator.getRandomUUID();
    var storageRef = storage().ref(
      `users/${auth().currentUser.email}/chats/${
        this.props.route.params.id
      }/${uid}`,
    );
    await RNFS.readFile(e, 'base64').then(async (result) => {
      await storageRef.putString(result, 'base64', {
        contentType: 'jpg',
      });
    });
    await storageRef.getDownloadURL().then((url) => {
      y = url;
    });
    return y;
  };

  handleSendVideo = async () => {
    console.log('RSI');
    if (this.state.sending === false) {
      var name = this.state.name;
      this.setState({
        sending: true,
        prevMessage: 'Have a look',
        prevFormat: 'attach-video',
        prevUrl: this.state.video,
        prevName: this.state.name,
      });
      var url = await this.handleUploadVideo(this.state.video);
      console.log('225', url);
      var data = {
        name: name,
        url: url,
        message: 'Have a look',
        id: auth().currentUser.email,
        format: 'attach-video',
        chatId: this.state.chat._id,
      };
      var res = await axios.post(link + '/api/sendMesssage', data);
      if (res.data !== null) {
        this.setState({
          sending: false,
          prevMessage: '',
          prevFormat: '',
          prevUrl: '',
          prevName: '',
        });
        var data2 = {
          email2: auth().currentUser.email,
          email1: this.state.user.email,
          id: this.state.chat._id,
        };
        var res2 = await axios.post(link + '/api/orderChat', data2);
        if (res2.data !== null) {
          console.log('Ordered Chat');
        }
      }
    }
  };

  handleUploadVideo = async (e) => {
    console.log('Running Upload');
    var y;
    var uid = await UUIDGenerator.getRandomUUID();
    var storageRef = storage().ref(
      `users/${auth().currentUser.email}/chats/${
        this.props.route.params.id
      }/${uid}`,
    );
    await RNFS.readFile(e, 'base64').then(async (result) => {
      await storageRef.putString(result, 'base64', {
        contentType: 'mp4',
      });
    });
    await storageRef.getDownloadURL().then((url) => {
      y = url;
    });
    return y;
  };

  handleSendDocument = async () => {
    console.log('RSI');
    if (this.state.sending === false) {
      var name = this.state.name;
      this.setState({
        sending: true,
        prevMessage: 'Have a look',
        prevFormat: 'attach-doc',
        prevUrl: this.state.pdf,
        prevName: this.state.name,
      });
      var url = await this.handleUploadDocument(this.state.pdf);
      console.log('225', url);
      var data = {
        name: name,
        url: url,
        message: 'Have a look',
        id: auth().currentUser.email,
        format: 'attach-doc',
        chatId: this.state.chat._id,
      };
      var res = await axios.post(link + '/api/sendMesssage', data);
      if (res.data !== null) {
        this.setState({
          sending: false,
          prevMessage: '',
          prevFormat: '',
          prevUrl: '',
          prevName: '',
        });
        var data2 = {
          email2: auth().currentUser.email,
          email1: this.state.user.email,
          id: this.state.chat._id,
        };
        var res2 = await axios.post(link + '/api/orderChat', data2);
        if (res2.data !== null) {
          console.log('Ordered Chat');
        }
      }
    }
  };

  handleUploadDocument = async (e) => {
    console.log('Running Upload');
    var y;
    var uid = await UUIDGenerator.getRandomUUID();
    var storageRef = storage().ref(
      `users/${auth().currentUser.email}/chats/${
        this.props.route.params.id
      }/${uid}`,
    );
    await RNFS.readFile(e, 'base64').then(async (result) => {
      await storageRef.putString(result, 'base64', {
        contentType: 'pdf',
      });
    });
    await storageRef.getDownloadURL().then((url) => {
      y = url;
    });
    return y;
  };

  handleSendAcceptMessage = async () => {
    console.log('ASMS');
    var data = {
      name: '',
      url: '',
      message: 'deal accepted',
      id: auth().currentUser.email,
      format: 'accept',
      chatId: this.state.chat._id,
    };
    var res = await axios.post(link + '/api/sendMesssage', data);
    if (res.data !== null) {
      console.log('Accepted');
      var data2 = {
        email2: auth().currentUser.email,
        email1: this.state.user.email,
        id: this.state.chat._id,
      };
      var res2 = await axios.post(link + '/api/orderChat', data2);
      if (res2.data !== null) {
        console.log('Ordered Chat');
      }
    }
  };

  handleSendRejectMessage = async () => {
    console.log('ASMS');
    var data = {
      name: '',
      url: '',
      message: 'deal rejected',
      id: auth().currentUser.email,
      format: 'reject',
      chatId: this.state.chat._id,
    };
    var res = await axios.post(link + '/api/sendMesssage', data);
    if (res.data !== null) {
      console.log('Rejected');
      var data2 = {
        email2: auth().currentUser.email,
        email1: this.state.user.email,
        id: this.state.chat._id,
      };
      var res2 = await axios.post(link + '/api/orderChat', data2);
      if (res2.data !== null) {
        console.log('Ordered Chat');
      }
    }
  };

  handleSendDealDone = async () => {
    console.log('ASMS');
    var data = {
      name: '',
      url: '',
      message: 'deal accomplished',
      id: auth().currentUser.email,
      format: 'deal-done',
      chatId: this.state.chat._id,
    };
    var res = await axios.post(link + '/api/sendMesssage', data);
    if (res.data !== null) {
      console.log('deal-done');
      var data2 = {
        email2: auth().currentUser.email,
        email1: this.state.user.email,
        id: this.state.chat._id,
      };
      var res2 = await axios.post(link + '/api/orderChat', data2);
      if (res2.data !== null) {
        console.log('Ordered Chat');
      }
    }
  };

  handleDocumentView = (url, type) => {
    console.log(type);
    this.props.navigation.navigate('ViewDocument', {
      documenttype: type,
      documentData: url,
    });
  };

  handleRejectDeal = async () => {
    this.setState({
      showDealMenu: false,
    });
    var data = {
      id: this.state.chat._id,
    };
    var res = await axios.post(link + '/api/cancelDeal', data);
    if (res.data !== null) {
      if (res.data.type === 'success') {
        this.handleSend(7);
      }
    }
  };

  handleAcceptDeal = async () => {
    this.setState({
      showDealMenu: false,
    });
    var data = {
      id: this.state.chat._id,
    };
    var res = await axios.post(link + '/api/acceptDeal', data);
    if (res.data !== null) {
      if (res.data.type === 'success') {
        this.handleSend(5);
      }
    }
  };

  handleLetsMakeADeal = () => {
    this.setState({
      showDealForm: true,
    });
  };

  handleConfirmDeal = async () => {
    this.setState({
      showDealForm: false,
      showDealMenu: false,
    });
    var data = {
      location: this.state.city + ',' + this.state.country,
      landmark: this.state.landmark,
      date: this.state.date,
      time: this.state.time,
      status: true,
      chatId: this.state.chat._id,
    };
    var res = await axios.post(link + '/api/meetingDeal', data);
    if (res.data !== null) {
      if (res.data.type === 'success') {
        this.setState(
          {
            showDealInfo: false,
            showDealMenu: false,
            showDealForm: false,
          },
          () => {
            this.handleSend(8);
          },
        );
      }
    }
  };

  handleSendMeeting = async () => {
    console.log('ASMS');
    var data = {
      name: '',
      url: '',
      message: 'new meeting set',
      id: auth().currentUser.email,
      format: 'meeting',
      chatId: this.state.chat._id,
    };
    var res = await axios.post(link + '/api/sendMesssage', data);
    if (res.data !== null) {
      console.log('Meeting Set');
      var data2 = {
        email2: auth().currentUser.email,
        email1: this.state.user.email,
        id: this.state.chat._id,
      };
      var res2 = await axios.post(link + '/api/orderChat', data2);
      if (res2.data !== null) {
        console.log('Ordered Chat');
      }
    }
  };

  onChangeDatePicker = (e, date) => {
    console.log(date);
    if (mode === 'date') {
      mode = 'time';
      this.setState({
        date: new Date(date),
        showDate: true,
      });
    } else if (mode === 'time') {
      mode = 'date';
      this.setState({
        time: new Date(date),
        showDate: false,
      });
    }
  };

  handleChangeMeeting = (meet) => {
    var city = meet.location.split(',')[0];
    var country = meet.location.split(',')[1];
    this.setState({
      landmark: meet.landmark,
      city: city,
      country: country,
      time: meet.time,
      date: meet.date,
      showDealForm: true,
    });
  };

  handleDealDone = async () => {
    this.setState({
      showDealMenu: false,
    });
    console.log('SECOND DEAL DONE');
    var data = {
      email: auth().currentUser.email,
      chatId: this.state.chat._id,
    };
    var res = await axios.post(link + '/api/dealDone', data);
    if (res.data !== null) {
      if (res.data.type === 'success') {
        this.setState({
          rateForm: true,
        });
      }
    }
  };

  handleRating = async () => {
    this.setState({
      rateForm: false,
    });
    Keyboard.dismiss();
    var data = {
      userEmail: auth().currentUser.email,
      comment: this.state.rateComment,
      rate: this.state.rating,
      date: new Date(),
      email: this.state.user.email,
    };
    var res = await axios.post(link + '/api/user/rate', data);
    if (res.data !== null) {
      console.log(res.data);
      if (res.data.type === 'success') {
        Snackbar.show({
          text: 'Rated User!',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    }
  };

  sendPushNotification = async (e, f, m) => {
    console.log(this.state.currentUser);
    const FIREBASE_API_KEY =
      'AAAA-x7BxpY:APA91bGm_UWNpbo0o6aOfVkEaIqRLZAhdh0oCjs-RCxA2qsrYy3LjTzSRzVeoBycvhXT2w2qRZEL2e7nmKa3-kgBRCfUZEyffWlpU8fhOhwaELLC0RpNvUtM6GAdcdC8jhhfaWxq6req';
    const message = {
      registration_ids: [this.state.user.pushToken],
      notification: {
        title: this.state.currentUser.name + ' send you a ' + m,
        body: this.state.message,
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

  sendDealPushNotification = async (e, f, m) => {
    console.log(this.state.currentUser);
    const FIREBASE_API_KEY =
      'AAAA-x7BxpY:APA91bGm_UWNpbo0o6aOfVkEaIqRLZAhdh0oCjs-RCxA2qsrYy3LjTzSRzVeoBycvhXT2w2qRZEL2e7nmKa3-kgBRCfUZEyffWlpU8fhOhwaELLC0RpNvUtM6GAdcdC8jhhfaWxq6req';
    console.log(this.state.token);
    const message = {
      registration_ids: [this.state.user.pushToken],
      notification: {
        title: this.state.currentUser.name + ' ' + m + ' the request.',
        body: this.state.message,
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

  renderFooter = () => {
    return (
      <View style={{width: '100%'}}>
        {this.state.sending ? (
          <Message
            navigation={this.props.navigation}
            handleDocumentView={(url, type) =>
              this.handleDocumentView(url, type)
            }
            loading={this.state.sending}
            type={true}
            message={this.state.prevMessage}
            format={this.state.prevFormat}
            url={this.state.prevUrl}
            name={this.state.prevName}
          />
        ) : null}
      </View>
    );
  };

  handleClear = async () => {
    this.setState({
      menu: false,
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

  render() {
    var i = 0;
    var stars = [];
    for (var j = 1; j <= 5; j++) {
      var star = {
        key: j,
        active: this.state.rating >= j ? true : false,
      };
      stars.push(star);
    }
    return (
      <SafeAreaView style={styles.container}>
        {this.state.NF ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              source={require('../assets/chatload.json')}
              autoPlay={true}
              loop={true}
              style={{width: 250, height: 250}}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Muli-Bold',
                color: colors.white,
                marginBottom: 20,
              }}>
              Sorry the chat doesn't exist
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.pop()}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: colors.baseline,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Ionicons
                name="ios-close"
                size={30}
                style={{color: colors.white, marginRight: 10}}
              />
              <Text style={{fontSize: 16, color: colors.white}}>
                Close Chat
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{width: '100%', flex: 1}}>
            <View
              style={{
                backgroundColor: colors.secondary,
                paddingHorizontal: 10,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={styles.headerIcon}
                  onPress={() => this.props.navigation.pop()}>
                  <Ionicons name="ios-close" size={30} color={colors.grey} />
                </TouchableOpacity>
                {this.state.loading ? (
                  <View
                    style={{
                      width: '60%',
                      paddingHorizontal: 5,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 5,
                    }}>
                    <SkeletonContent
                      containerStyle={{width: '100%'}}
                      boneColor={colors.primary}
                      highlightColor={colors.darkText}
                      isLoading={
                        this.state.loadingProduct || this.state.loadingOwner
                      }
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
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.grey,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 5,
                      }}>
                      {this.state.user.photo ? (
                        <Image
                          source={{uri: this.state.user.photo}}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: colors.grey,
                          }}
                        />
                      ) : (
                        <Text style={styles.imageText}>
                          {this.state.user.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text style={styles.header}>{this.state.user.name}</Text>
                      {this.state.user.active && !this.state.user.logout ? (
                        <Text style={styles.headerStatus}>Online</Text>
                      ) : null}
                    </View>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={this.handleMenu}
                style={styles.headerIcon}>
                <Ionicons
                  name="ios-ellipsis-vertical-outline"
                  size={26}
                  color={colors.grey}
                />
              </TouchableOpacity>
            </View>
            <View style={{width: '100%', flex: 1, marginVertical: 2}}>
              {this.state.loading ? (
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 5,
                    marginTop: 10,
                  }}>
                  <SkeletonContent
                    containerStyle={{width: '100%', alignItems: 'center'}}
                    boneColor={colors.primary}
                    highlightColor={colors.darkText}
                    isLoading={
                      this.state.loadingProduct || this.state.loadingOwner
                    }
                    layout={[
                      {
                        width: '95%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        children: [
                          {
                            width: 120,
                            height: 50,
                          },
                        ],
                      },
                      {
                        width: '95%',
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        children: [
                          {
                            width: 120,
                            height: 50,
                          },
                        ],
                      },
                    ]}></SkeletonContent>
                </View>
              ) : (
                <View style={styles.list}>
                  <FlatList
                    ListFooterComponent={this.renderFooter}
                    initialNumToRender={500}
                    ref={(ref) => (this.flatList = ref)}
                    onContentSizeChange={() =>
                      this.flatList.scrollToEnd({animated: true})
                    }
                    onLayout={() => this.flatList.scrollToEnd({animated: true})}
                    style={{width: '100%', flex: 1}}
                    data={this.state.chat.messages}
                    windowSize={10}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{
                      flexGrow: 1,
                      justifyContent: 'flex-end',
                    }}
                    renderItem={({item, index}) => {
                      if (
                        Math.floor(
                          (new Date(
                            this.state.chat[
                              'clear' +
                                (this.state.chat.participants.indexOf(
                                  auth().currentUser.email,
                                ) +
                                  1)
                            ],
                          ).getTime() -
                            new Date(item.date).getTime()) /
                            1000,
                        ) < 0
                      ) {
                        if (
                          item.format !== 'deal-done' &&
                          item.format !== 'accept' &&
                          item.format !== 'reject' &&
                          item.format !== 'meeting'
                        ) {
                          return (
                            <Message
                              key={index}
                              location={this.props.route.params.location}
                              navigation={this.props.navigation}
                              loading={false}
                              handleDocumentView={(url, type) =>
                                this.handleDocumentView(url, type)
                              }
                              type={item.id === auth().currentUser.email}
                              message={item.message}
                              format={item.format}
                              url={item.url}
                              name={item.name}
                              date={item.date}
                            />
                          );
                        } else if (item.format === 'accept') {
                          return (
                            <View
                              key={index}
                              style={{
                                marginVertical: 5,
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: colors.secondary,
                                paddingVertical: 12,
                              }}>
                              <Ionicons
                                name="ios-megaphone"
                                size={16}
                                color="#acadaa"
                              />
                              <Text style={styles.dealstatusMessage}>
                                Request accepted on{' '}
                                <Moment element={Text} format="MMMM Do YYYY">
                                  {item.date}
                                </Moment>
                              </Text>
                            </View>
                          );
                        } else if (item.format === 'reject') {
                          return (
                            <View
                              key={index}
                              style={{
                                marginVertical: 5,
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: colors.secondary,
                                paddingVertical: 12,
                              }}>
                              <Ionicons
                                name="ios-megaphone"
                                size={16}
                                color="#acadaa"
                              />
                              <Text style={styles.dealstatusMessage}>
                                Request rejected on{' '}
                                <Moment element={Text} format="MMMM Do YYYY">
                                  {item.date}
                                </Moment>
                              </Text>
                            </View>
                          );
                        } else if (item.format === 'meeting') {
                          return (
                            <View
                              key={index}
                              style={{
                                marginVertical: 5,
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: colors.secondary,
                                paddingVertical: 12,
                              }}>
                              <Ionicons
                                name="ios-megaphone"
                                size={16}
                                color="#acadaa"
                              />
                              <Text style={styles.dealstatusMessage}>
                                New Meeting set
                              </Text>
                            </View>
                          );
                        } else if (item.format === 'deal-done') {
                          return (
                            <View
                              key={index}
                              style={{
                                marginVertical: 5,
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: colors.secondary,
                                paddingVertical: 12,
                              }}>
                              <Ionicons
                                name="ios-megaphone"
                                size={16}
                                color="#acadaa"
                              />
                              <Text style={styles.dealstatusMessage}>
                                Deal accomplished on{' '}
                                <Moment element={Text} format="MMMM Do YYYY">
                                  {item.date}
                                </Moment>
                              </Text>
                            </View>
                          );
                        }
                      }
                    }}
                  />
                </View>
              )}
            </View>
            {this.state.showDeal && this.state.chat.deals.length > 0 ? (
              <>
                {this.state.chat.deals[0].initiate !==
                auth().currentUser.email ? (
                  <View style={styles.dealPop}>
                    <View style={styles.dealPopLeft}>
                      <View>
                        <Text style={styles.dname}>{this.state.user.name}</Text>
                        {this.state.chat.deals[0].dealStatus ? (
                          <>
                            {this.state.chat.deals[0].dealDone.includes(
                              auth().currentUser.email,
                            ) ? (
                              <Text style={styles.dtype}>
                                Deal successfully finished from your side
                              </Text>
                            ) : (
                              <Text style={styles.dtype}>
                                Meeting Set, have a look
                              </Text>
                            )}
                          </>
                        ) : (
                          <>
                            {this.state.chat.deals[0].status ? (
                              <Text style={styles.dtype}>Ongoing deal</Text>
                            ) : (
                              <Text style={styles.dtype}>
                                {this.state.chat.deals[0].varient === 'request'
                                  ? 'Requested one of your product'
                                  : 'Wants to exchnage with your product'}
                              </Text>
                            )}
                          </>
                        )}
                      </View>
                    </View>
                    <View style={styles.dealPopRight}>
                      <TouchableOpacity
                        style={styles.daction}
                        onPress={() => {
                          this.setState({showDealInfo: true});
                        }}>
                        <Ionicons
                          name="ios-information-circle"
                          size={30}
                          color={colors.white}
                        />
                      </TouchableOpacity>
                      {this.state.chat.deals[0].dealDone.includes(
                        auth().currentUser.email,
                      ) ? null : (
                        <TouchableOpacity
                          style={styles.daction}
                          onPress={() => {
                            this.setState({showDealMenu: true});
                          }}>
                          <Ionicons
                            name="ios-ellipsis-vertical-outline"
                            size={30}
                            color={colors.baseline}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.dealPop}>
                    <View style={styles.dealPopLeft}>
                      <View>
                        <Text style={styles.dname}>{this.state.user.name}</Text>
                        {this.state.chat.deals[0].dealStatus ? (
                          <>
                            {this.state.chat.deals[0].dealDone.includes(
                              auth().currentUser.email,
                            ) ? (
                              <Text style={styles.dtype}>
                                Deal successfully finished from your side
                              </Text>
                            ) : (
                              <Text style={styles.dtype}>
                                Meeting Set, have a look
                              </Text>
                            )}
                          </>
                        ) : (
                          <Text style={styles.dtype}>
                            {this.state.chat.deals[0].status
                              ? 'Ongoing deal'
                              : 'Request Pending'}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.dealPopRight}>
                      <TouchableOpacity
                        style={styles.daction}
                        onPress={() => {
                          this.setState({showDealInfo: true});
                        }}>
                        <Ionicons
                          name="ios-information-circle"
                          size={30}
                          color={colors.white}
                        />
                      </TouchableOpacity>
                      {this.state.chat.deals[0].dealDone.includes(
                        auth().currentUser.email,
                      ) ? null : (
                        <TouchableOpacity
                          style={styles.daction}
                          onPress={() => {
                            this.setState({showDealMenu: true});
                          }}>
                          <Ionicons
                            name="ios-ellipsis-vertical-outline"
                            size={30}
                            color={colors.baseline}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </>
            ) : null}
            {this.state.block ? (
              <View style={styles.blocked}>
                <Text style={styles.blockedText}>User Blocked</Text>
                <Text onPress={this.handleUnblock} style={styles.unblockedText}>
                  Unblock
                </Text>
              </View>
            ) : null}
            {this.state.chat.blocked &&
            this.state.chat.blocked.length > 0 &&
            !this.state.chat.blocked.includes(auth().currentUser.email) ? (
              <View style={styles.blocked}>
                <Text style={styles.blockedText}>
                  You cannot send message to this user
                </Text>
              </View>
            ) : null}
            {this.state.block ||
            (this.state.chat.blocked &&
              this.state.chat.blocked.length > 0) ? null : (
              <View style={styles.bottomBar}>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      width:
                        this.state.message.length > 0
                          ? width * 0.8
                          : width * 0.7,
                    },
                  ]}>
                  <TextInput
                    style={styles.input}
                    value={this.state.message}
                    onChangeText={(text) => this.handleMessage(text)}
                    placeholder="Type a message"
                  />
                </View>
                {this.state.message.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => this.handleSend(1)}
                    style={styles.bottomButton}>
                    <Ionicons name="ios-send" size={26} color={colors.grey} />
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => this.setState({attach: true})}
                      style={styles.bottomButton}>
                      <Ionicons
                        name="ios-attach"
                        size={35}
                        color={colors.grey}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this.handleCamera}
                      style={styles.bottomButton}>
                      <Ionicons
                        name="ios-camera"
                        size={35}
                        color={colors.grey}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
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
                  <View style={{width: '100%'}}>
                    {this.state.chat.blocked &&
                    this.state.chat.blocked.includes(
                      auth().currentUser.email,
                    ) ? (
                      <TouchableOpacity
                        onPress={this.handleUnblock}
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
                          }}>
                          Unblock
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={this.handleBlock}
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
                          }}>
                          Block
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={this.handleClear}
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
                      }}>
                      Clear Conversation
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
            <Modal isVisible={this.state.attach}>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '80%',
                    backgroundColor: colors.secondary,
                    borderRadius: 10,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={this.handleGallery}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 15,
                      justifyContent: 'center',
                      borderBottomColor: colors.grey,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Muli-Bold',
                        color: colors.white,
                        fontSize: 16,
                        marginRight: 5,
                      }}>
                      Send Photo
                    </Text>
                    <Ionicons
                      name="ios-image"
                      size={24}
                      color={colors.baseline}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.handleVideoGallery}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 15,
                      justifyContent: 'center',
                      borderBottomColor: colors.grey,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Muli-Bold',
                        color: colors.white,
                        fontSize: 16,
                        marginRight: 5,
                      }}>
                      Send Video
                    </Text>
                    <Ionicons
                      name="ios-videocam"
                      size={24}
                      color={colors.baseline}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.handleDocument}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 15,
                      justifyContent: 'center',
                      borderBottomColor: colors.grey,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Muli-Bold',
                        color: colors.white,
                        fontSize: 16,
                        marginRight: 5,
                      }}>
                      Send Document
                    </Text>
                    <Ionicons
                      name="ios-document-text"
                      size={24}
                      color={colors.baseline}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        attach: false,
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
                        fontSize: 16,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {this.state.showDeal ? (
              <>
                <Modal isVisible={this.state.showDealInfo}>
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
                              showDealInfo: false,
                            })
                          }>
                          <Ionicons
                            name="ios-close"
                            size={30}
                            color={colors.baseline}
                          />
                        </TouchableOpacity>
                        <Text style={styles.dealInfoHeader}>Deal Info</Text>
                      </View>
                      {this.state.chat.deals ? (
                        <>
                          {this.state.chat.deals[0].initiate !==
                          auth().currentUser.email ? (
                            <ScrollView
                              style={{
                                width: '100%',
                                paddingVertical: 2,
                                maxHeight: 0.7 * height,
                              }}>
                              {this.state.chat.deals[0].meeting.landmark ? (
                                <View
                                  style={{
                                    width: '100%',
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                  }}>
                                  <Text style={styles.dSubHeader}>Meeting</Text>
                                  <View
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text style={styles.dlogHead}>
                                      Location
                                    </Text>
                                    <Text style={styles.dlogHead}>:</Text>
                                    <Text style={styles.dlogDate}>
                                      {
                                        this.state.chat.deals[0].meeting
                                          .location
                                      }
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text style={styles.dlogHead}>
                                      Landmark
                                    </Text>
                                    <Text style={styles.dlogHead}>:</Text>
                                    <Text style={styles.dlogDate}>
                                      {
                                        this.state.chat.deals[0].meeting
                                          .landmark
                                      }
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text style={styles.dlogHead}>Date</Text>
                                    <Text style={styles.dlogHead}>:</Text>
                                    <Text style={styles.dlogDate}>
                                      {this.state.chat.deals[0].meeting.date}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text style={styles.dlogHead}>Time</Text>
                                    <Text style={styles.dlogHead}>:</Text>
                                    <Text style={styles.dlogDate}>
                                      {this.state.chat.deals[0].meeting.time}
                                    </Text>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.handleChangeMeeting(
                                        this.state.chat.deals[0].meeting,
                                      )
                                    }
                                    style={{
                                      width: 100,
                                      height: 36,
                                      borderRadius: 18,
                                      justifyContent: 'center',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      borderColor: colors.grey,
                                      borderWidth: StyleSheet.hairlineWidth,
                                      marginTop: 10,
                                    }}>
                                    <Ionicons
                                      name="ios-color-wand"
                                      size={18}
                                      color={colors.grey}
                                      style={{marginRight: 5}}
                                    />
                                    <Text
                                      style={{
                                        fontFamily: 'Muli-Bold',
                                        color: colors.grey,
                                        fontSize: 10,
                                      }}>
                                      Change
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              ) : null}
                              {this.state.chat.deals[0].varient ===
                              'exchange' ? (
                                <View
                                  style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                  }}>
                                  <Card3
                                    key={this.state.chat.deals[0].id2}
                                    handleCardImageClick={(e, f) =>
                                      this.handleCardImageClick(e, f)
                                    }
                                    id={this.state.chat.deals[0].id2}
                                    navigation={this.props.navigation}
                                  />
                                  <View style={{marginVertical: 10}}>
                                    <Ionicons
                                      name="ios-repeat"
                                      size={40}
                                      color={colors.baseline}
                                      style={{transform: [{rotate: '90deg'}]}}
                                    />
                                  </View>
                                  <Card3
                                    key={this.state.chat.deals[0].id1}
                                    handleCardImageClick={(e, f) =>
                                      this.handleCardImageClick(e, f)
                                    }
                                    id={this.state.chat.deals[0].id1}
                                    navigation={this.props.navigation}
                                  />
                                </View>
                              ) : (
                                <View
                                  style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                  }}>
                                  <View style={{width: '100%', padding: 20}}>
                                    <Text style={styles.dSubHeader}>
                                      Reason why{' '}
                                      <Text style={{color: colors.white}}>
                                        {this.state.user.name}
                                      </Text>
                                      {'\n'}wants this product :
                                    </Text>
                                    <Text style={styles.dMessage}>
                                      {this.state.chat.deals[0].message}
                                    </Text>
                                  </View>
                                  <View style={{marginVertical: 10}}>
                                    <Ionicons
                                      name="ios-return-down-back"
                                      size={40}
                                      color={colors.baseline}
                                      style={{transform: [{rotate: '-90deg'}]}}
                                    />
                                  </View>
                                  <Card3
                                    key={this.state.chat.deals[0].id1}
                                    handleCardImageClick={(e, f) =>
                                      this.handleCardImageClick(e, f)
                                    }
                                    id={this.state.chat.deals[0].id1}
                                    navigation={this.props.navigation}
                                  />
                                </View>
                              )}

                              <View
                                style={{
                                  width: '100%',
                                  paddingHorizontal: 20,
                                  paddingVertical: 10,
                                }}>
                                <Text style={styles.dSubHeader}>Logs</Text>
                                {this.state.chat.deals[0].logs.map((item) => {
                                  return (
                                    <View
                                      style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <Text style={styles.dlogHead}>
                                        {item.name}
                                      </Text>
                                      <Text style={styles.dlogHead}>:</Text>
                                      <Text style={styles.dlogDate}>
                                        <Moment
                                          element={Text}
                                          format={'MMMM Do YYYY'}>
                                          {item.date}
                                        </Moment>
                                      </Text>
                                    </View>
                                  );
                                })}
                              </View>
                            </ScrollView>
                          ) : (
                            <ScrollView
                              style={{
                                width: '100%',
                                paddingVertical: 2,
                                maxHeight: 0.7 * height,
                              }}>
                              {this.state.chat.deals[0].meeting.landmark ? (
                                <View
                                  style={{
                                    width: '100%',
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                  }}>
                                  <Text style={styles.dSubHeader}>Meeting</Text>
                                  <View
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text style={styles.dlogHead}>
                                      Location
                                    </Text>
                                    <Text style={styles.dlogHead}>:</Text>
                                    <Text style={styles.dlogDate}>
                                      {
                                        this.state.chat.deals[0].meeting
                                          .location
                                      }
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text style={styles.dlogHead}>
                                      Landmark
                                    </Text>
                                    <Text style={styles.dlogHead}>:</Text>
                                    <Text style={styles.dlogDate}>
                                      {
                                        this.state.chat.deals[0].meeting
                                          .landmark
                                      }
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text style={styles.dlogHead}>Date</Text>
                                    <Text style={styles.dlogHead}>:</Text>
                                    <Text style={styles.dlogDate}>
                                      {this.state.chat.deals[0].meeting.date}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text style={styles.dlogHead}>Time</Text>
                                    <Text style={styles.dlogHead}>:</Text>
                                    <Text style={styles.dlogDate}>
                                      {this.state.chat.deals[0].meeting.time}
                                    </Text>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.handleChangeMeeting(
                                        this.state.chat.deals[0].meeting,
                                      )
                                    }
                                    style={{
                                      width: 100,
                                      height: 36,
                                      borderRadius: 18,
                                      justifyContent: 'center',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      borderColor: colors.grey,
                                      borderWidth: StyleSheet.hairlineWidth,
                                      marginTop: 10,
                                    }}>
                                    <Ionicons
                                      name="ios-color-wand"
                                      size={18}
                                      color={colors.grey}
                                      style={{marginRight: 5}}
                                    />
                                    <Text
                                      style={{
                                        fontFamily: 'Muli-Bold',
                                        color: colors.grey,
                                        fontSize: 10,
                                      }}>
                                      Change
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              ) : null}
                              {this.state.chat.deals[0].varient ===
                              'exchange' ? (
                                <View
                                  style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                  }}>
                                  <Card3
                                    key={this.state.chat.deals[0].id1}
                                    handleCardImageClick={(e, f) =>
                                      this.handleCardImageClick(e, f)
                                    }
                                    id={this.state.chat.deals[0].id1}
                                    navigation={this.props.navigation}
                                  />
                                  <View style={{marginVertical: 10}}>
                                    <Ionicons
                                      name="ios-repeat"
                                      size={40}
                                      color={colors.baseline}
                                      style={{transform: [{rotate: '90deg'}]}}
                                    />
                                  </View>
                                  <Card3
                                    key={this.state.chat.deals[0].id2}
                                    handleCardImageClick={(e, f) =>
                                      this.handleCardImageClick(e, f)
                                    }
                                    id={this.state.chat.deals[0].id2}
                                    navigation={this.props.navigation}
                                  />
                                </View>
                              ) : (
                                <View
                                  style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                  }}>
                                  <View style={{width: '100%', padding: 20}}>
                                    <Text style={styles.dSubHeader}>
                                      Reason you stated for this product :
                                    </Text>
                                    <Text style={styles.dMessage}>
                                      {this.state.chat.deals[0].message}
                                    </Text>
                                  </View>
                                  <View style={{marginVertical: 10}}>
                                    <Ionicons
                                      name="ios-return-down-back"
                                      size={40}
                                      color={colors.baseline}
                                      style={{transform: [{rotate: '-90deg'}]}}
                                    />
                                  </View>
                                  <Card3
                                    key={this.state.chat.deals[0].id1}
                                    handleCardImageClick={(e, f) =>
                                      this.handleCardImageClick(e, f)
                                    }
                                    id={this.state.chat.deals[0].id1}
                                    navigation={this.props.navigation}
                                  />
                                </View>
                              )}

                              <View
                                style={{
                                  width: '100%',
                                  paddingHorizontal: 20,
                                  paddingVertical: 10,
                                }}>
                                <Text style={styles.dSubHeader}>Logs</Text>
                                {this.state.chat.deals[0].logs.map((item) => {
                                  return (
                                    <View
                                      style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <Text style={styles.dlogHead}>
                                        {item.name}
                                      </Text>
                                      <Text style={styles.dlogHead}>:</Text>
                                      <Text style={styles.dlogDate}>
                                        <Moment
                                          element={Text}
                                          format={'MMMM Do YYYY'}>
                                          {item.date}
                                        </Moment>
                                      </Text>
                                    </View>
                                  );
                                })}
                              </View>
                            </ScrollView>
                          )}
                        </>
                      ) : null}
                    </View>
                  </View>
                </Modal>
                <Modal isVisible={this.state.showDealMenu}>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: '80%',
                        backgroundColor: colors.secondary,
                        borderRadius: 10,
                        alignItems: 'center',
                      }}>
                      <View style={{width: '100%'}}>
                        {this.state.chat.deals[0].initiate !==
                        auth().currentUser.email ? (
                          <>
                            {this.state.chat.deals &&
                            this.state.chat.deals[0].status ? (
                              <>
                                {this.state.chat.deals[0].dealStatus ? (
                                  <TouchableOpacity
                                    onPress={this.handleDealDone}
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      paddingVertical: 15,
                                      justifyContent: 'center',
                                      borderBottomColor: colors.grey,
                                      borderBottomWidth:
                                        StyleSheet.hairlineWidth,
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily: 'Muli-Bold',
                                        color: colors.white,
                                        fontSize: 16,
                                      }}>
                                      Deal Done
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    onPress={this.handleLetsMakeADeal}
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      paddingVertical: 15,
                                      justifyContent: 'center',
                                      borderBottomColor: colors.grey,
                                      borderBottomWidth:
                                        StyleSheet.hairlineWidth,
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily: 'Muli-Bold',
                                        color: colors.white,
                                        fontSize: 16,
                                      }}>
                                      Lets make a deal
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </>
                            ) : (
                              <TouchableOpacity
                                onPress={this.handleAcceptDeal}
                                style={{
                                  width: '100%',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  paddingVertical: 15,
                                  justifyContent: 'center',
                                  borderBottomColor: colors.grey,
                                  borderBottomWidth: StyleSheet.hairlineWidth,
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'Muli-Bold',
                                    color: colors.white,
                                    fontSize: 16,
                                  }}>
                                  Accept deal
                                </Text>
                              </TouchableOpacity>
                            )}
                          </>
                        ) : null}
                        {this.state.chat.deals[0].status &&
                        this.state.chat.deals[0].initiate ===
                          auth().currentUser.email ? (
                          <>
                            {this.state.chat.deals[0].dealStatus ? (
                              <TouchableOpacity
                                onPress={this.handleDealDone}
                                style={{
                                  width: '100%',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  paddingVertical: 15,
                                  justifyContent: 'center',
                                  borderBottomColor: colors.grey,
                                  borderBottomWidth: StyleSheet.hairlineWidth,
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'Muli-Bold',
                                    color: colors.white,
                                    fontSize: 16,
                                  }}>
                                  Deal Done
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={this.handleLetsMakeADeal}
                                style={{
                                  width: '100%',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  paddingVertical: 15,
                                  justifyContent: 'center',
                                  borderBottomColor: colors.grey,
                                  borderBottomWidth: StyleSheet.hairlineWidth,
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'Muli-Bold',
                                    color: colors.white,
                                    fontSize: 16,
                                  }}>
                                  Lets make a deal
                                </Text>
                              </TouchableOpacity>
                            )}
                          </>
                        ) : null}
                        <TouchableOpacity
                          onPress={this.handleRejectDeal}
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 16,
                            justifyContent: 'center',
                            borderBottomColor: colors.grey,
                            borderBottomWidth: StyleSheet.hairlineWidth,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Muli-Bold',
                              color: colors.white,
                              fontSize: 16,
                            }}>
                            Reject deal
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            showDealMenu: false,
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
                            fontSize: 16,
                          }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                <Modal isVisible={this.state.showDealForm}>
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
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'center',
                          paddingVertical: 10,
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
                                showDealForm: false,
                              })
                            }>
                            <Ionicons
                              name="ios-close"
                              size={30}
                              color={colors.baseline}
                            />
                          </TouchableOpacity>
                          <Text style={styles.dealInfoHeader}>
                            Set Up Meeting
                          </Text>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            alignItems: 'center',
                            paddingVertical: 10,
                          }}>
                          <View style={styles.inputGroup}>
                            <Text style={styles.inputGroupText}>Landmark</Text>
                            <TextInput
                              style={styles.input2}
                              autoCapitalize="none"
                              maxLength={40}
                              onChangeText={(landmark) =>
                                this.setState({landmark})
                              }
                              value={this.state.landmark}></TextInput>
                          </View>
                          <View style={styles.inputGroup}>
                            <Text style={styles.inputGroupText}>City</Text>
                            <TextInput
                              style={styles.input2}
                              autoCapitalize="none"
                              maxLength={40}
                              onChangeText={(city) => this.setState({city})}
                              value={this.state.city}></TextInput>
                          </View>
                          <View style={styles.inputGroup}>
                            <Text style={styles.inputGroupText}>Country</Text>
                            <TextInput
                              style={styles.input2}
                              autoCapitalize="none"
                              maxLength={40}
                              onChangeText={(country) =>
                                this.setState({country})
                              }
                              value={this.state.country}></TextInput>
                          </View>
                          <View style={styles.inputGroup}>
                            <Text style={styles.inputGroupText}>Date</Text>
                            <TextInput
                              style={styles.input2}
                              autoCapitalize="none"
                              maxLength={40}
                              onChangeText={(date) => this.setState({date})}
                              value={this.state.date}></TextInput>
                          </View>
                          <View style={styles.inputGroup}>
                            <Text style={styles.inputGroupText}>Time</Text>
                            <TextInput
                              style={styles.input2}
                              autoCapitalize="none"
                              maxLength={40}
                              onChangeText={(time) => this.setState({time})}
                              value={this.state.time}></TextInput>
                          </View>
                          <TouchableOpacity
                            onPress={this.handleConfirmDeal}
                            style={styles.confirmButton}>
                            <Text style={styles.confirmButtonText}>
                              Confirm
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </Modal>
                <Modal isVisible={this.state.rateForm}>
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
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'center',
                          paddingVertical: 10,
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
                                rateForm: false,
                              })
                            }>
                            <Ionicons
                              name="ios-close"
                              size={30}
                              color={colors.baseline}
                            />
                          </TouchableOpacity>
                          <Text style={styles.dealInfoHeader}>
                            Rate {this.state.user.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            alignItems: 'center',
                            paddingVertical: 10,
                          }}>
                          {this.state.rating > 0 ? (
                            <Text
                              style={{
                                fontSize: 30,
                                color: colors.white,
                                fontFamily: 'Muli-Bold',
                                marginTop: 5,
                              }}>
                              {this.state.rating}.0
                            </Text>
                          ) : null}
                          <View style={styles.stars}>
                            {stars.map((star) => {
                              if (star.active) {
                                return (
                                  <TouchableOpacity
                                    key={star.key}
                                    onPress={() =>
                                      this.setState({
                                        rating: star.key,
                                      })
                                    }>
                                    <FontAwesome
                                      name="star"
                                      style={styles.star}
                                    />
                                  </TouchableOpacity>
                                );
                              } else {
                                return (
                                  <TouchableOpacity
                                    key={star.key}
                                    onPress={() =>
                                      this.setState({
                                        rating: star.key,
                                      })
                                    }>
                                    <FontAwesome
                                      name="star-o"
                                      style={styles.star}
                                    />
                                  </TouchableOpacity>
                                );
                              }
                            })}
                          </View>
                          <View style={styles.inputGroup}>
                            <Text style={styles.inputGroupText}>
                              Few words regarding the experience ?
                            </Text>
                            <TextInput
                              style={styles.inputArea}
                              autoCapitalize="none"
                              multiline={true}
                              maxLength={300}
                              onChangeText={(rateComment) =>
                                this.setState({rateComment})
                              }
                              value={this.state.rateComment}></TextInput>
                          </View>
                          <TouchableOpacity
                            onPress={this.handleRating}
                            style={styles.confirmButton}>
                            <Text style={styles.confirmButtonText}>
                              Rate User
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </Modal>
              </>
            ) : null}
            <Modal isVisible={this.state.rateForm}>
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
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      paddingVertical: 10,
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
                            rateForm: false,
                          })
                        }>
                        <Ionicons
                          name="ios-close"
                          size={30}
                          color={colors.baseline}
                        />
                      </TouchableOpacity>
                      <Text style={styles.dealInfoHeader}>
                        Rate the experience
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        alignItems: 'center',
                        paddingVertical: 10,
                      }}>
                      {this.state.rating > 0 ? (
                        <Text
                          style={{
                            fontSize: 30,
                            color: colors.white,
                            fontFamily: 'Muli-Bold',
                            marginTop: 5,
                          }}>
                          {this.state.rating}.0
                        </Text>
                      ) : null}
                      <View style={styles.stars}>
                        {stars.map((star) => {
                          if (star.active) {
                            return (
                              <TouchableOpacity
                                key={star.key}
                                onPress={() =>
                                  this.setState({
                                    rating: star.key,
                                  })
                                }>
                                <FontAwesome name="star" style={styles.star} />
                              </TouchableOpacity>
                            );
                          } else {
                            return (
                              <TouchableOpacity
                                key={star.key}
                                onPress={() =>
                                  this.setState({
                                    rating: star.key,
                                  })
                                }>
                                <FontAwesome
                                  name="star-o"
                                  style={styles.star}
                                />
                              </TouchableOpacity>
                            );
                          }
                        })}
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputGroupText}>
                          Few words regarding the experience ?
                        </Text>
                        <TextInput
                          style={styles.inputArea}
                          autoCapitalize="none"
                          multiline={true}
                          maxLength={300}
                          onChangeText={(rateComment) =>
                            this.setState({rateComment})
                          }
                          value={this.state.rateComment}></TextInput>
                      </View>
                      <TouchableOpacity
                        onPress={this.handleRating}
                        style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Rate User</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
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
    position: 'relative',
    backgroundColor: colors.primary,
  },
  header: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  headerStatus: {
    color: colors.active,
    fontSize: 12,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  imageText: {
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    color: colors.darkText,
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  list: {
    width: '100%',
    flex: 1,
  },
  blocked: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  blockedText: {
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    color: colors.grey,
  },
  unblockedText: {
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    color: colors.baseline,
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  dealPop: {
    width: '100%',
    height: 60,
    backgroundColor: colors.darkText,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  dealPopLeft: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dname: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  dtype: {
    color: colors.grey,
    fontSize: 12,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  dealPopRight: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  daction: {
    marginHorizontal: 4,
  },
  dealInfoHeader: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  dSubHeader: {
    color: colors.baseline,
    fontSize: 16,
    fontFamily: 'Muli-Bold',
  },
  dMessage: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
  },
  dlogHead: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    marginRight: 5,
  },
  dlogDate: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    marginLeft: 5,
  },
  bottomBar: {
    width: '100%',
    padding: 10,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 3,
  },
  inputContainer: {
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 5,
  },
  input: {
    width: '100%',
    height: '100%',
    fontFamily: 'Muli-Regular',
    fontSize: 16,
  },
  bottomButton: {
    width: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  inputGroup: {
    width: '90%',
    marginBottom: 15,
  },
  inputGroupText: {
    fontSize: 14,
    color: colors.grey,
    fontFamily: 'Muli-Bold',
  },
  input2: {
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
  inputArea: {
    marginTop: 5,
    backgroundColor: colors.white,
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    color: colors.darkText,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    borderRadius: 3,
  },
  confirmButton: {
    elevation: 3,
    borderRadius: 5,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 45,
    backgroundColor: colors.baseline,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    color: colors.white,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    marginVertical: 10,
  },
  star: {
    marginHorizontal: 2,
    color: colors.baseline,
    fontSize: width * 0.1,
  },
  dealstatusMessage: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    marginHorizontal: 5,
  },
});
