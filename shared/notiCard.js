import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Moment from 'react-moment';
import colors from '../appTheme';
import axios from 'axios';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import link from '../fetchPath';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');
export default class NotiCard extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: true,
      user: [],
      hide: false,
      read: false,
    };
  }
  async componentDidMount() {
    this.handleInit();
  }

  handleInit = async () => {
    var data = {
      id: this.props.id,
    };
    var res = await axios.post(link + '/api/notifications', data);
    var data2 = {
      id: res.data.user,
    };
    var res2 = await axios.post(link + '/api/user/single', data2);
    if (res.data !== null && res2.data !== null) {
      if (res.data.user !== auth().currentUser.email && res2.data.name) {
        this.setState({
          data: res.data,
          loading: false,
          user: res2.data,
          hide: false,
          read: res.data.read,
        });
      } else {
        this.setState({
          loading: false,
          hide: true,
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

  handleOpen = async () => {
    var data = {
      id: this.props.id,
    };
    this.setState({
      read: true,
    });

    if (this.state.data.read === false) {
      this.props.handleRefresh();
      var res3 = await axios.post(link + '/api/notifications/update', data);
      if (res3.data.type === 'success') {
        console.log('Update Noti Card');
      }
    }
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <View
            style={{
              width: '100%',
              paddingVertical: 10,
              paddingHorizontal: 15,
              alignItems: 'center',
              backgroundColor: colors.secondary,
              justifyContent: 'space-between',
              borderRadius: 10,
              marginVertical: 5,
              elevation: 3,
            }}>
            <SkeletonContent
              containerStyle={{width: '100%'}}
              boneColor={colors.primary}
              highlightColor={colors.darkText}
              isLoading={true}
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
              ]}></SkeletonContent>
          </View>
        ) : (
          <>
            {this.state.hide === false ? (
              <View style={this.state.read ? styles.itemRead : styles.item}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('viewProfile', {
                      id: this.state.user._id,
                      location: {},
                    });
                  }}
                  style={styles.profileBox}>
                  {this.state.user.photo ? (
                    <Image
                      source={{uri: this.state.user.photo}}
                      style={styles.profileImage}
                    />
                  ) : (
                    <View style={styles.profileImageBox}>
                      <Text style={styles.imageText}>
                        {this.state.user.name &&
                          this.state.user.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                {this.state.data.type === 'Product' ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.handleOpen();
                      this.state.data.action === 'Comment' ||
                      this.state.data.action === 'Reply'
                        ? this.props.navigation.navigate('viewComment', {
                            id: this.state.data.id,
                            location: this.props.location,
                          })
                        : this.props.navigation.navigate('viewProduct', {
                            id: this.state.data.id,
                            location: this.props.location,
                          });
                    }}
                    style={{width: '85%'}}>
                    {this.state.data.action === 'Like' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} liked your product
                      </Text>
                    ) : null}
                    {this.state.data.action === 'Reply' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} replied to your comment
                      </Text>
                    ) : null}
                    {this.state.data.action === 'Comment' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} commented on your product
                      </Text>
                    ) : null}
                    {this.state.data.action === 'Tag' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} tagged in a product
                      </Text>
                    ) : null}
                    <Text style={styles.time}>
                      <Moment element={Text} fromNow>
                        {this.state.data.date}
                      </Moment>
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.data.type === 'Request' ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.handleOpen();
                      this.state.data.action === 'Comment' ||
                      this.state.data.action === 'Reply'
                        ? this.props.navigation.navigate('viewComment', {
                            id: this.state.data.id,
                            location: this.props.location,
                          })
                        : this.props.navigation.navigate('viewRequest', {
                            id: this.state.data.id,
                            location: this.props.location,
                          });
                    }}
                    style={{width: '85%'}}>
                    {this.state.data.action === 'Like' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} liked your request
                      </Text>
                    ) : null}
                    {this.state.data.action === 'Comment' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} commented on your request
                      </Text>
                    ) : null}
                    {this.state.data.action === 'Reply' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} replied to your comment
                      </Text>
                    ) : null}
                    {this.state.data.action === 'Tag' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} tagged you in a post
                      </Text>
                    ) : null}
                    <Text style={styles.time}>
                      <Moment element={Text} fromNow>
                        {this.state.data.date}
                      </Moment>
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.data.type === 'Chat' ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.handleOpen();
                      this.props.navigation.navigate('Chat', {
                        id: this.state.data.id,
                        location: this.props.location,
                      });
                    }}
                    style={{width: '85%'}}>
                    {this.state.data.action === 'message' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} send you a message
                      </Text>
                    ) : null}
                    {this.state.data.action === 'photo' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} send you a photo
                      </Text>
                    ) : null}
                    {this.state.data.action === 'video' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} send you a video
                      </Text>
                    ) : null}
                    {this.state.data.action === 'document' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} send you a document
                      </Text>
                    ) : null}
                    {this.state.data.action === 'request' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} requested one of your product
                      </Text>
                    ) : null}
                    {this.state.data.action === 'accepted' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} accepted your request
                      </Text>
                    ) : null}
                    {this.state.data.action === 'rejected' ? (
                      <Text style={styles.title}>
                        {this.state.user.name} is no longer interested on your
                        request
                      </Text>
                    ) : null}
                    <Text style={styles.time}>
                      <Moment element={Text} fromNow>
                        {this.state.data.date}
                      </Moment>
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,

    backgroundColor: colors.secondary,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
    paddingHorizontal: 15,
  },
  itemRead: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: colors.darkText,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
    paddingHorizontal: 15,
  },
  profileBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    color: colors.darkText,
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    marginBottom: 10,
  },
  time: {
    color: colors.grey,
    fontSize: 10,
    fontFamily: 'Muli-Regular',
  },
});
