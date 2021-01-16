import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  SafeAreaView,
  Share,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import link from '../fetchPath';
import axios from 'axios';
import colors from '../appTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import OtherPostScreen from './otherPostScreen';
import OtherRatingScreen from './otherRatingScreen';
import ShowSimilar from '../shared/showSimilar';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

const {width, height} = Dimensions.get('window');

export default class ViewProfileScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUser: {},
      loading: true,
      refreshing: false,
      location: {
        lat: '',
        long: '',
      },
      tab: 'Posts',
      follow: false,
      initiatingChat: false,
      sameList: [],
      ratings: [],
      refreshing: false,
      followers: 0,
    };
  }

  async componentDidMount() {
    this.setState({
      location: this.props.location,
    });
    var data = {
      id: this.props.route.params.id,
    };
    var res = await axios.post(link + '/api/user/singleId', data);
    if (res.data !== null) {
      var ratings = [];
      res.data.ratings.map((item) => {
        if (ratings.length < 5) {
          ratings.push(item);
        }
      });
      this.setState({
        ratings: ratings,
        currentUser: res.data,
        followers: res.data.followers.length,
        loading: false,
      });
      if (auth().currentUser) {
        var data2 = {
          id: auth().currentUser.email,
        };
        var res2 = await axios.post(link + '/api/user/single', data2);
        if (res2.data !== null) {
          var same = [];
          res2.data.following.map((item1) => {
            res.data.followers.map((item2) => {
              if (item1 === item2) {
                same.push(item2);
              }
            });
          });
          this.setState({
            authUser: res2.data,
            sameList: same,
            follow: res.data.followers.includes(auth().currentUser.email),
          });
        }
      }
    }
  }

  handleRefresh = async () => {
    this.setState({
      loading: true,
      refreshing: true,
    });
    var data = {
      id: this.props.route.params.id,
    };
    var res = await axios.post(link + '/api/user/singleId', data);
    if (res.data !== null) {
      var ratings = [];
      res.data.ratings.map((item) => {
        if (ratings.length < 5) {
          ratings.push(item);
        }
      });
      this.setState({
        ratings: ratings,
        currentUser: res.data,
        loading: false,
        refreshing: false,
        followers: res.data.followers.length,
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

  handleShare = (e) => {
    console.log('110', e);
    const result = Share.share({
      message: 'https://www.byebuyy.com/viewProfile/' + e,
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

  handleFollow = async () => {
    this.setState(
      {
        follow: !this.state.follow,
      },
      async () => {
        if (this.state.follow) {
          this.setState({
            followers: this.state.followers + 1,
          });
        } else {
          this.setState({
            followers: this.state.followers - 1,
          });
        }
        var data = {
          email1: this.state.currentUser.email,
          email2: auth().currentUser.email,
        };
        var res = await axios.post(link + '/api/user/follow', data);
        if (res.data !== null) {
          console.log('Foll', this.state.currentUser.pushToken);
          if (this.state.follow) {
            this.sendFollowPushNotification('Follow', this.state.authUser._id);
          }
        }
      },
    );
  };

  sendFollowPushNotification = async (e, f) => {
    const FIREBASE_API_KEY =
      'AAAA-x7BxpY:APA91bGm_UWNpbo0o6aOfVkEaIqRLZAhdh0oCjs-RCxA2qsrYy3LjTzSRzVeoBycvhXT2w2qRZEL2e7nmKa3-kgBRCfUZEyffWlpU8fhOhwaELLC0RpNvUtM6GAdcdC8jhhfaWxq6req';
    const message = {
      registration_ids: [this.state.currentUser.pushToken],
      notification: {
        title: this.state.authUser.name + ' started following you',
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

  handleChat = async () => {
    this.setState({
      initiatingChat: true,
    });
    var data = {
      email1: this.state.currentUser.email,
      email2: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/user/chat', data);
    if (res.data !== null) {
      this.setState({
        initiatingChat: false,
      });
      this.props.navigation.navigate('Chat', {id: res.data.toString()});
    }
  };

  handleShowOthers = () => {
    var data = this.state.sameList;
    this.props.navigation.push('viewOtherUsers', {data: data});
  };

  render() {
    return (
      <SafeAreaView
        style={styles.container}>
        <View style={styles.head}>
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
            <Text style={styles.headText}>User Info</Text>
          </View>
          <TouchableOpacity
            style={styles.action}
            onPress={() =>
              this.handleShare(
                this.props.route.params.screen
                  ? this.props.route.params.screen
                  : this.props.route.params.id,
              )
            }>
            <Ionicons
              name="ios-share-social-outline"
              size={26}
              style={{color: colors.baseline}}
            />
          </TouchableOpacity>
        </View>
        {this.state.loading === false ? (
          <ScrollView
            style={{width: '100%', flex: 1}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
              />
            }>
            <View style={{width: '100%', alignItems: 'center', flex: 1}}>
              <View style={styles.profileBox}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={styles.profileImageContainer}>
                    {this.state.currentUser.photo ? (
                      <Image
                        source={{uri: this.state.currentUser.photo}}
                        style={styles.profileImage}
                        onError={() => {
                          var currentUser = this.state.currentUser;
                          currentUser['photo'] = '';
                          this.setState({
                            currentUser,
                          });
                        }}
                      />
                    ) : (
                      <View style={styles.profileImageBox}>
                        <Text style={styles.imageText}>
                          {this.state.currentUser.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  {this.state.ratings && this.state.ratings.length > 0 ? (
                    <View
                      style={{
                        width: width * 0.6,
                        height: 80,
                        alignItems: 'center',
                      }}>
                      <Swiper
                        paginationStyle={{bottom: 0}}
                        activeDotColor={colors.baseline}
                        showsButtons={false}>
                        {this.state.ratings.map((item) => {
                          return (
                            <View style={styles.rating}>
                              <Text style={styles.ratingNumber}>
                                {item.rate}.0{' '}
                                <Ionicons
                                  name="ios-star"
                                  size={24}
                                  color={colors.baseline}
                                />
                              </Text>
                              {item.comment ? (
                                <Text style={styles.ratingText}>
                                  "{item.comment}"
                                </Text>
                              ) : null}
                            </View>
                          );
                        })}
                      </Swiper>
                    </View>
                  ) : null}
                </View>
                <View style={styles.profileInfo}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.name}>
                      {this.state.currentUser.name}
                    </Text>
                  </View>
                  {this.state.currentUser.uname ? (
                    <Text style={styles.uname}>
                      @{this.state.currentUser.uname}
                    </Text>
                  ) : null}
                  {this.state.currentUser.prof ? (
                    <Text style={styles.profession}>
                      {this.state.currentUser.prof}
                    </Text>
                  ) : null}
                  {this.state.currentUser.institution &&
                  this.state.currentUser.prof === 'Student' ? (
                    <Text style={styles.uname}>
                      {this.state.currentUser.institution}
                    </Text>
                  ) : null}
                </View>
                {this.state.sameList && this.state.sameList.length > 0 ? (
                  <TouchableOpacity
                    onPress={this.handleShowOthers}
                    style={{
                      width: '90%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 5,
                    }}>
                    <Text style={styles.followedText}>Mutual friends </Text>
                    <ShowSimilar
                      navigation={this.props.navigation}
                      sameList={this.state.sameList}
                    />
                    <Text style={styles.followedText}>
                      {this.state.sameList.length - 5 > 0 ? '+' : null}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              <View style={styles.profileStats}>
                <View style={styles.stat}>
                  <Text style={styles.statHeader}>
                    {this.state.currentUser.posts.length}
                  </Text>
                  <Text style={styles.statSubHeader}>Posts</Text>
                </View>
                <TouchableOpacity
                  style={styles.stat}
                  onPress={() =>
                    this.props.navigation.push('viewUsers', {
                      id: this.state.currentUser._id,
                      type: 'followers',
                      location: this.props.location,
                      handleRefresh: this.handleRefresh,
                    })
                  }>
                  <Text style={styles.statHeader}>{this.state.followers}</Text>
                  <Text style={styles.statSubHeader}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stat}
                  onPress={() =>
                    this.props.navigation.push('viewUsers', {
                      id: this.state.currentUser._id,
                      type: 'following',
                      location: this.props.location,
                      handleRefresh: this.handleRefresh,
                    })
                  }>
                  <Text style={styles.statHeader}>
                    {this.state.currentUser.following.length}
                  </Text>
                  <Text style={styles.statSubHeader}>Following</Text>
                </TouchableOpacity>
              </View>
              {auth().currentUser ? (
                <>
                  {auth().currentUser.email ===
                  this.state.currentUser.email ? null : (
                    <View style={styles.actionProfile}>
                      {this.state.follow ? (
                        <TouchableOpacity
                          onPress={this.handleFollow}
                          style={styles.followAction}>
                          <Ionicons
                            name="ios-person-remove"
                            size={20}
                            color={colors.white}
                            style={{marginRight: 10}}
                          />
                          <Text style={styles.followActionText}>Unfollow</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={this.handleFollow}
                          style={styles.followAction}>
                          <Ionicons
                            name="ios-person-add"
                            size={20}
                            color={colors.white}
                            style={{marginRight: 10}}
                          />
                          <Text style={styles.followActionText}>Follow</Text>
                        </TouchableOpacity>
                      )}
                      {this.state.initiatingChat ? (
                        <View style={styles.chatAction}>
                          <ActivityIndicator
                            color={colors.baseline}
                            size="small"
                          />
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={this.handleChat}
                          style={styles.chatAction}>
                          <Ionicons
                            name="ios-chatbubble-ellipses"
                            size={26}
                            color={colors.baseline}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </>
              ) : null}
              <View style={{width: '100%', flex: 1, alignItems: 'center'}}>
                <View style={styles.tabbar}>
                  {this.state.tab === 'Posts' ? (
                    <View style={styles.activeTab}>
                      <Text style={styles.activeTabText}>Posts</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.setState({tab: 'Posts'})}
                      style={styles.tab}>
                      <Text style={styles.tabText}>Posts</Text>
                    </TouchableOpacity>
                  )}
                  {this.state.tab === 'Ratings' ? (
                    <View style={styles.activeTab}>
                      <Text style={styles.activeTabText}>Ratings</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.setState({tab: 'Ratings'})}
                      style={styles.tab}>
                      <Text style={styles.tabText}>Ratings</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {this.state.tab === 'Posts' ? (
                  <OtherPostScreen
                    id={this.state.currentUser._id}
                    navigation={this.props.navigation}
                    location={this.props.route.params.location}
                  />
                ) : null}
                {this.state.tab === 'Ratings' ? (
                  <OtherRatingScreen
                    id={this.state.currentUser._id}
                    navigation={this.props.navigation}
                  />
                ) : null}
              </View>
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              width: '100%',
              paddingVertical: 10,
              paddingHorizontal: 15,
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 10,
              marginBottom: 10,
              backgroundColor:colors.primary2
            }}>
            <SkeletonContent
              containerStyle={{width: '100%'}}
              boneColor={colors.primary}
              highlightColor={colors.darkText}
              isLoading={true}
              layout={[
                {
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  children: [
                    {
                      width: 80,
                      height: 80,
                      marginRight: 10,
                      borderRadius: 40,
                    },
                    {
                      width: 150,
                      height: 20,
                    },
                  ],
                },
                {
                  flexDirection: 'row',
                  marginTop: 10,
                  justifyContent: 'space-around',
                  children: [
                    {
                      width: '30%',
                      height: 30,
                    },
                    {
                      width: '30%',
                      height: 30,
                    },
                    {
                      width: '30%',
                      height: 30,
                    },
                  ],
                },
                {
                  width: '100%',
                  flexDirection: 'column',
                  marginTop: 10,
                  alignItems: 'center',
                  children: [
                    {
                      width: '100%',
                      height: 200,
                      marginBottom: 20,
                    },
                    {
                      width: '100%',
                      height: 300,
                    },
                  ],
                },
              ]}></SkeletonContent>
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
    backgroundColor:colors.primary
  },
  head: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: colors.primary2,
    elevation: 3,
    justifyContent: 'space-between',
  },
  headText: {
    fontSize: 18,
    marginLeft: 10,
    color: colors.baseline,
    fontFamily: 'Muli-Bold',
  },
  profileBox: {
    width: '90%',
    marginVertical: 20,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  profileImageBox: {
    width: 80,
    height: 80,
    backgroundColor: colors.grey,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  imageText: {
    fontFamily: 'Muli-Bold',
    fontSize: 24,
    color: colors.darkText,
  },
  rating: {
    alignItems: 'center',
    width: '100%',
  },
  ratingNumber: {
    fontFamily: 'Muli-Bold',
    fontSize: 20,
    color: colors.grey,
    marginLeft: 15,
  },
  ratingText: {
    fontFamily: 'Muli-Regular',
    fontSize: 12,
    color: colors.grey,
    marginLeft: 15,
    textAlign: 'right',
  },
  profileInfo: {
    width: '100%',
    marginTop: 5,
  },
  name: {
    fontFamily: 'Muli-Bold',
    fontSize: 20,
    color: colors.white,
  },
  uname: {
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    color: colors.baseline,
  },
  profession: {
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    color: colors.grey,
  },
  bio: {
    fontFamily: 'Muli-Bold',
    fontSize: 14,
    color: colors.grey,
  },
  profileStats: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stat: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
    width: '25%',
  },
  statHeader: {
    fontSize: 18,
    fontFamily: 'Muli-Bold',
    color: colors.white,
  },
  statSubHeader: {
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    color: colors.grey,
  },
  tabbar: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary2,
  },
  tab: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabText: {
    fontFamily: 'Muli-Regular',
    textTransform: 'uppercase',
    color: colors.grey,
    fontSize: 14,
  },
  activeTab: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderBottomColor: colors.baseline,
    borderBottomWidth: 4,
  },
  activeTabText: {
    fontFamily: 'Muli-Regular',
    textTransform: 'uppercase',
    color: colors.baseline,
    fontSize: 16,
  },
  imageBox: {
    width: 300,
    height: 300,
  },
  actionProfile: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  followAction: {
    width: 120,
    height: 45,
    borderRadius: 5,
    backgroundColor: colors.baseline,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexDirection: 'row',
  },
  followActionText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Muli-Bold',
  },
  chatAction: {
    width: 60,
    height: 45,
    borderRadius: 5,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation:2
  },
  followedText: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
  },
});
