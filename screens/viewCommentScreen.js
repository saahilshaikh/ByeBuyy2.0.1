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
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Snackbar from 'react-native-snackbar';
import ImageView from 'react-native-image-viewing';
import Lottieview from 'lottie-react-native';
import Card3 from '../shared/card3';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import link from '../fetchPath';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommentCard from '../shared/commentCard';
import colors from '../appTheme';

const {width, height} = Dimensions.get('window');

export default class ViewCommentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      loading: true,
      NF: false,
      commenting: false,
      tags: [],
      comment: '',
      currentUser: [],
      lastTags: [0],
      product: [],
      selection: {start: 0, end: 0},
      pos: null,
      search: '',
    };
  }

  componentDidMount() {
    this.handleInit();
  }

  handleInit = async () => {
    var id = this.props.route.params.id;
    var data = {
      id: id,
    };
    var res = await axios.post(link + '/api/product/single', data);
    var product = res.data;
    product.id = product._id;
    var comments = [];
    product.comments.map((item) => {
      if (comments.length < 10) {
        comments.push(item);
      }
    });
    if (res.data !== null) {
      this.setState({
        comments: comments,
        product: product,
        loading: false,
      });
    } else {
      this.setState({
        comments: [],
        product: [],
        loading: false,
        NF: true,
      });
    }
    if (auth().currentUser) {
      var data2 = {
        id: auth().currentUser.email,
      };
      var res3 = await axios.post(link + '/api/user/single', data2);
      if (res3.data !== null) {
        var currentUser = res3.data;
        currentUser.id = currentUser._id;
        this.setState({
          currentUser: currentUser,
        });
      }
    }
  };

  handleComment = async () => {
    var com = this.state.comment;
    Keyboard.dismiss();
    if (this.state.comment === '') {
      Snackbar.show({
        text: 'Please type a comment',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      var comment = this.state.comment;
      this.setState({
        comment: '',
        commenting: true,
      });
      var data = {
        id: this.state.product.id,
        email: auth().currentUser.email,
        comment: comment,
      };
      var res = await axios.post(link + '/api/product/comment', data);
      if (res.data) {
        this.setState(
          {
            commenting: false,
          },
          () => {
            this.sendCommentActivity();
            this.handleInit();
          },
        );
      }
    }
  };

  sendCommentActivity = async () => {
    var data = {
      id: this.state.product.id,
      action: 'Comment',
      type: this.state.product.varient,
      email1: this.state.product.owner,
      email2: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/notifications/check', data);
    if (res.data.length === 0) {
      this.sendCommentPushNotification(
        this.state.product.varient,
        this.state.product.id,
      );
      var res2 = await axios.post(link + '/api/notifications/add', data);
      if (res2.data !== null) {
        console.log(res.data);
      }
    }
  };

  sendCommentPushNotification = async (e, f) => {
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

  // handleTaggedComment = async (c) => {
  //     var str = c;
  //     var r = str.split("@").length - 1;
  //     var lastscan = 0;
  //     for (var i = 0; i < r; i++) {
  //         var n = str.indexOf("@", lastscan);
  //         var l = str.indexOf(" ", n);
  //         console.log(n, l);
  //         var lastscan = l;
  //         var id = str.substring(n + 1, l);
  //         if (id !== this.state.currentUser.uname) {
  //             await firebase.firestore().collection('testusers').where('uname', '==', id).get().then(snap => {
  //                 snap.forEach(doc => {
  //                     firestore().collection('testnotifications').add({
  //                         type: 'Product',
  //                         id: this.state.product.id,
  //                         action: 'Tag',
  //                         user: this.state.currentUser.name,
  //                         date: new Date()
  //                     })
  //                         .then((res => {
  //                             var notifications = doc.data().notifications;
  //                             notifications.push(res.id);
  //                             console.log(notifications);
  //                             firestore().collection('testusers').doc(doc.id).update({
  //                                 notifications: notifications
  //                             })
  //                                 .then(() => {
  //                                     // this.sendTagPushNotification('Product', this.state.product.id, doc.data().pushToken)
  //                                 })
  //                         }))
  //                 })
  //             })
  //         }
  //     }
  // }

  sendTagPushNotification = async (e, f, p) => {
    const FIREBASE_API_KEY =
      'AAAA-x7BxpY:APA91bGm_UWNpbo0o6aOfVkEaIqRLZAhdh0oCjs-RCxA2qsrYy3LjTzSRzVeoBycvhXT2w2qRZEL2e7nmKa3-kgBRCfUZEyffWlpU8fhOhwaELLC0RpNvUtM6GAdcdC8jhhfaWxq6req';
    console.log(this.state.token);
    const message = {
      registration_ids: [p],
      notification: {
        title: this.state.currentUser.name + ' tagged you in a post',
        body: '',
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
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

  handleChange = async (e) => {
    this.setState({
      comment: e,
    });
    e = e + ' ';
    if (e === '') {
      this.setState({
        tags: [],
        pos: null,
      });
    }
    if (e[this.state.selection.start] === '@') {
      console.log('yes');
      this.setState({
        pos: this.state.selection.start,
      });
    }
    if (this.state.pos !== null) {
      console.log(this.state.pos);
      var search = e.substring(
        this.state.pos + 1,
        e.indexOf(' ', this.state.pos + 1),
      );
      console.log('Search:', search);
      var res = await axios.get(link + '/api/userUname/' + search);
      console.log(res.data);
      this.setState({
        tags: res.data,
        search: search,
      });
    }
  };

  handleTag = (e) => {
    var start = this.state.comment.substr(0, this.state.pos + 1);
    var end = this.state.comment.substr(
      this.state.pos + this.state.search.length + 1,
      this.state.comment.length,
    );
    console.log('Start', start);
    console.log('End', end);
    this.setState({
      comment: start + e.uname + ' ' + end,
      tags: [],
    });
  };

  renderListEmpty = () => {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
        }}>
        <Text
          style={{
            fontFamily: 'Muli-Regular',
            color: colors.grey,
            fontSize: 20,
          }}>
          No comments yet
        </Text>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.action}
              onPress={() => this.props.navigation.pop()}>
              <Ionicons
                name="ios-arrow-back"
                size={30}
                style={{color: colors.baseline}}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Comments</Text>
          </View>
        </View>
        {this.state.tags.length > 0 ? (
          <View style={{width: '100%', alignItems: 'center', flex: 1}}>
            {this.state.tags &&
              this.state.tags.map((tag) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.handleTag(tag)}
                    style={{
                      width: '90%',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginVertical: 10,
                    }}>
                    <View style={styles.profileBox}>
                      {tag.photo ? (
                        <Image
                          source={{uri: tag.photo}}
                          style={styles.profileImage}
                        />
                      ) : (
                        <View style={styles.profileImageBox}>
                          <Text style={styles.imageText}>
                            {tag.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View>
                      <Text style={styles.profileName}>{tag.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        ) : (
          <View style={{width: '100%', flex: 1}}>
            <FlatList
              ListEmptyComponent={this.renderListEmpty}
              style={{width: '100%'}}
              data={this.state.comments}
              onEndReached={this.handleReachedEnd}
              keyExtractor={(item, index) => index.toString()}
              initialNumToRender={10}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.handleRefresh}
                />
              }
              renderItem={({item}) => (
                <CommentCard item={item} navigation={this.props.navigation} />
              )}
            />
          </View>
        )}
        {auth().currentUser && this.state.NF === false ? (
          <View style={styles.commentContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onSelectionChange={({nativeEvent: {selection}}) => {
                  console.log(selection);
                  this.setState({selection});
                }}
                value={this.state.comment}
                onChangeText={(e) => this.handleChange(e)}
                maxLength={150}
                placeholder="Type a comment ..."
              />
            </View>
            {this.state.commenting ? (
              <ActivityIndicator size="large" color={colors.baseline} />
            ) : (
              <TouchableOpacity
                onPress={this.handleComment}
                style={styles.bottomButton}>
                <Ionicons name="ios-send" size={25} color={colors.baseline} />
              </TouchableOpacity>
            )}
          </View>
        ) : null}
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
    backgroundColor: colors.primary,
    elevation: 3,
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grey,
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
    backgroundColor: colors.primary,
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
    backgroundColor: colors.baseline,
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
    width: width - 30,
    height: width - 30,
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
  commentView: {
    width: '100%',
    marginVertical: 5,
    padding: 5,
    flexDirection: 'row',
  },
  commentUserPhoto: {
    width: 40,
    height: 40,
    backgroundColor: colors.grey,
    borderRadius: 20,
  },
  commentUserName: {
    fontFamily: 'Muli-Bold',
    fontSize: 14,
    color: colors.white,
    marginRight: 5,
  },
  comment: {
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    color: colors.grey,
  },
  commentDate: {
    fontFamily: 'Muli-Regular',
    fontSize: 12,
    color: colors.grey,
  },
  commentContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 3,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grey,
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
});
