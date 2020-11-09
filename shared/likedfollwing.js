import React from 'react';
import LottieView from 'lottie-react-native';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native';
import colors from '../appTheme';
import axios from 'axios';
import link from '../fetchPath';
import ActivityCard from './activityCard';
import auth from '@react-native-firebase/auth';

export default class LikedFollowing extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      categories: [],
      showLiked: [],
      refreshing: false,
    };
  }

  async componentDidMount() {
    console.log('LF 36', this.props.location);
    var res = await axios.get(link + '/api/categories');
    this.setState({
      categories: res.data,
    });
    if (auth().currentUser) {
      var data2 = {
        id: auth().currentUser.email,
      };
      var res2 = await axios.post(link + '/api/user/single', data2);
      if (res2.data !== null) {
        var following = res2.data.following;
        var data3 = {
          id: following,
        };
        var res3 = await axios.post(link + '/api/user/liked', data3);
        if (res3.data !== null) {
          this.setState({
            showLiked: res3.data,
            loading: false,
          });
        }
      }
    } else {
      this.setState({
        showLiked: [],
        loading: false,
      });
    }
  }

  handleRefresh = async () => {
    if (auth().currentUser) {
      this.setState({
        refreshing: true,
      });
      var data2 = {
        id: auth().currentUser.email,
      };
      var res2 = await axios.post(link + '/api/user/single', data2);
      if (res2.data !== null) {
        var following = res2.data.following;
        var data3 = {
          id: following,
        };
        var res3 = await axios.post(link + '/api/user/liked', data3);
        if (res3.data !== null) {
          this.setState({
            showLiked: res3.data,
            refreshing: false,
          });
        }
      }
    }
  };

  renderHeader = () => {
    return (
      <View style={{width: '100%', marginVertical: 10, alignItems: 'center'}}>
        <Text style={styles.header}>Recent activities by users you follow</Text>
      </View>
    );
  };

  renderListEmpty = () => {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          alignItems: 'center',
        }}>
        <LottieView
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
    );
  };

  renderFooter = () => {
    return (
      <View style={{width: '100%', alignItems: 'center'}}>
        {this.state.loadingMore ? (
          <View style={{marginBottom: 20}}>
            <View style={{width: 60, height: 60}}>
              <LottieView
                source={require('../assets/loading.json')}
                autoPlay={true}
                loop={true}
              />
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    const keyExtractor = (item) => item._id;
    return (
      <View style={{width: '100%', alignItems: 'center', flex: 1}}>
        {this.state.loading ? (
          <View
            style={{
              width: '100%',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{width: 120, height: 120}}>
              <LottieView
                source={require('../assets/loading.json')}
                autoPlay={true}
                loop={true}
              />
            </View>
          </View>
        ) : (
          <View style={{width: '100%', flex: 1, alignItems: 'center'}}>
            <FlatList
              ListHeaderComponent={this.renderHeader}
              ListEmptyComponent={this.renderListEmpty}
              ListFooterComponent={this.renderFooter}
              style={{width: '100%', flex: 1}}
              data={this.state.showLiked}
              keyExtractor={_renderMyKeyExtractor}
              initialNumToRender={10}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.handleRefresh}
                />
              }
              renderItem={({item}) => {
                return (
                  <View style={{width: '100%', alignItems: 'center'}}>
                    <ActivityCard
                      id={item}
                      navigation={this.props.navigation}
                      location={this.state.location}
                    />
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: '90%',
    fontSize: 14,
    color: colors.grey,
    fontFamily: 'Muli-Bold',
  },
});
