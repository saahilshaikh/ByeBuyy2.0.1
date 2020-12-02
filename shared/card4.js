import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';

const {width, height} = Dimensions.get('window');

export default class Card4 extends React.Component {
  constructor() {
    super();
    this.state = {
      user: [],
      loading: true,
      follow: false,
    };
  }
  async componentDidMount() {
    var data = {
      id: this.props.id,
    };
    var res = await axios.post(link + '/api/user/single', data);
    if (res.data !== null) {
      var userInfo = res.data;
      userInfo.id = res.data._id;
      this.setState({
        user: userInfo,
        loading: false,
      });
      if (auth().currentUser) {
        this.setState({
          follow: userInfo.followers.includes(auth().currentUser.email),
        });
      }
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  handleFollow = async () => {
    this.setState({
      follow: !this.state.follow,
    });
    var data = {
      email1: this.state.user.email,
      email2: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/user/follow', data);
    if (res.data !== null) {
      console.log('Foll');
      this.props.handleRefresh();
    }
  };

  render() {
    var location = this.props.location;
    return (
      <>
        <View style={{width: '100%', alignItems: 'center'}}>
          {!this.state.loading ? (
            <View style={{width: '100%', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.push('viewProfile', {
                    id: this.state.user.id,
                    location: location,
                  })
                }
                style={styles.item}>
                <View style={styles.profile}>
                  <View
                    onPress={() =>
                      this.props.navigation.push('viewProfile', {
                        id: this.state.user.id,
                        location: location,
                      })
                    }
                    style={styles.profileBox}>
                    {this.state.user.photo ? (
                      <Image
                        source={{uri: this.state.user.photo}}
                        style={styles.profileImage}
                      />
                    ) : (
                      <Text style={styles.imageText}>
                        {this.state.user.name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text style={styles.profileName}>
                      {this.state.user.name}
                    </Text>
                    {this.state.user.uname !== '' ? (
                      <Text style={styles.time}>@{this.state.user.uname}</Text>
                    ) : null}
                  </View>
                </View>
                {auth().currentUser ? (
                  <>
                    {this.state.user.email ===
                    auth().currentUser.email ? null : (
                      <View style={styles.actionProfile}>
                        {this.state.follow ? (
                          <TouchableOpacity
                            onPress={this.handleFollow}
                            style={styles.followAction}>
                            <Ionicons
                              name="ios-person-remove"
                              size={16}
                              color={colors.white}
                              style={{marginRight: 7}}
                            />
                            <Text style={styles.followActionText}>
                              Unfollow
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={this.handleFollow}
                            style={styles.followAction}>
                            <Ionicons
                              name="ios-person-add"
                              size={16}
                              color={colors.white}
                              style={{marginRight: 7}}
                            />
                            <Text style={styles.followActionText}>Follow</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </>
                ) : null}
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                width: '95%',
                paddingVertical: 10,
                paddingHorizontal: 15,
                alignItems: 'center',
                backgroundColor: colors.secondary,
                justifyContent: 'space-between',
                borderRadius: 10,
                marginBottom: 10,
                elevation: 3,
              }}>
              <SkeletonContent
                containerStyle={{width: '100%'}}
                boneColor={colors.primary}
                highlightColor={colors.darkText}
                isLoading={this.state.loading}
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
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 5,
    width: '95%',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    justifyContent: 'space-between',
    borderRadius: 5,
    marginBottom: 10,
    elevation: 3,
    flexDirection: 'row',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grey,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grey,
  },
  imageText: {
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    color: colors.darkText,
  },
  profileName: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Muli-Bold',
  },
  time: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Regular',
  },
  actionProfile: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  followAction: {
    width: 100,
    height: 40,
    borderRadius: 5,
    backgroundColor: colors.darkText,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexDirection: 'row',
  },
  followActionText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
  },
  chatAction: {
    width: 60,
    height: 45,
    borderRadius: 5,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
