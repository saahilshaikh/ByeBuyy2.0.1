import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Share,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'react-moment';
import MiniCard from './mincard';
import MiniCard2 from './minicard2';
import colors from '../appTheme';
import axios from 'axios';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import link from '../fetchPath';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');
export default class ActivityCard extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: true,
      user: [],
      hide: false,
    };
  }
  async componentDidMount() {
    var data = {
      id: this.props.id,
    };
    var res = await axios.post(link + '/api/notifications', data);
    var data2 = {
      id: res.data.user,
    };
    var res2 = await axios.post(link + '/api/user/single', data2);
    if (res.data !== null && res2.data !== null) {
      if (res.data.user !== auth().currentUser.email) {
        this.setState({
          data: res.data,
          loading: false,
          user: res2.data,
          hide: false,
        });
      } else {
        this.setState({
          loading: false,
          hide: true,
        });
      }
    } else {
      this.setState({
        loading: false,
        hide: true,
      });
    }
  }
  render() {
    return (
      <>
        {this.state.loading ? (
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
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  marginLeft: 50,
                  children: [
                    {
                      width: 80,
                      height: 30,
                    },
                  ],
                },
              ]}></SkeletonContent>
          </View>
        ) : (
          <>
            {this.state.hide === false ? (
              <View style={styles.item}>
                {this.state.data.type === 'Product' ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('viewProduct', {
                        id: this.state.data.id,
                        location: this.props.location,
                      })
                    }
                    style={{width: '100%'}}>
                    {this.state.data.action === 'Like' ? (
                      <Text style={styles.title}>
                        {this.state.user.email === auth().currentUser.email
                          ? 'You'
                          : this.state.user.name}{' '}
                        liked a product
                      </Text>
                    ) : null}
                    {this.state.data.action === 'Comment' ? (
                      <Text style={styles.title}>
                        {this.state.user.email === auth().currentUser.email
                          ? 'You'
                          : this.state.user.name}{' '}
                        commented a product
                      </Text>
                    ) : null}
                    {this.state.data.action === 'Tag' ? (
                      <Text style={styles.title}>
                        {this.state.user.email === auth().currentUser.email
                          ? 'You'
                          : this.state.user.name}{' '}
                        tagged a product
                      </Text>
                    ) : null}
                    <MiniCard
                      location={this.props.location}
                      id={this.state.data.id}
                      navigation={this.props.navigation}
                    />
                    <Text style={styles.time}>
                      <Moment element={Text} fromNow>
                        {this.state.data.date}
                      </Moment>
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.data.type === 'Request' ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('viewRequest', {
                        id: this.state.data.id,
                        location: this.props.location,
                      })
                    }
                    style={{width: '100%'}}>
                    {this.state.data.action === 'Like' ? (
                      <Text style={styles.title}>
                        {this.state.user.email === auth().currentUser.email
                          ? 'You'
                          : this.state.user.name}{' '}
                        liked a request
                      </Text>
                    ) : null}
                    {this.state.data.action === 'Comment' ? (
                      <Text style={styles.title}>
                        {this.state.user.email === auth().currentUser.email
                          ? 'You'
                          : this.state.user.name}{' '}
                        commented a request
                      </Text>
                    ) : null}
                    {this.state.data.action === 'Tag' ? (
                      <Text style={styles.title}>
                        {this.state.user.email === auth().currentUser.email
                          ? 'You'
                          : this.state.user.name}{' '}
                        tagged in a post
                      </Text>
                    ) : null}
                    <MiniCard2
                      location={this.props.location}
                      id={this.state.data.id}
                      navigation={this.props.navigation}
                    />
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
    width: '95%',
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: colors.secondary,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
    paddingHorizontal: 15,
  },
  icon: {
    backgroundColor: colors.darkText,
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
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
