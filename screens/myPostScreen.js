import React from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import Card from '../shared/card';
import Card2 from '../shared/card2';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import link from '../fetchPath';
import LottieView from 'lottie-react-native';
import colors from '../appTheme';

export default class MyPostScreen extends React.PureComponent {
  inter = null;
  constructor() {
    super();
    this.state = {
      data: [],
      loading: true,
    }
  }

  componentDidMount() {
    this.handleInit();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  handleInit = async () => {
    if (auth().currentUser) {
      var data = {
        id: auth().currentUser.email
      }
      var res = await axios.post(link + '/api/user/single', data);
      if (res.data) {
        var current = res.data;
        this.setState({
          data: current.posts.reverse(),
          loading: false
        })
      }
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.data.map(item => {
            if (item.type.toLowerCase() === 'product') {
              return (
                <Card handleCardImageClick={(e, f) => this.props.handleCardImageClick(e, f)}
                  item={item}
                  location={this.props.location}
                  navigation={this.props.navigation} />
              )
            }
            else if (item.type.toLowerCase() === 'request') {
              return (
                <Card2
                  item={item}
                  location={this.props.location}
                  navigation={this.props.navigation} />
              )
            }
          })
        }
        {
          this.state.data.length === 0 && this.state.loading === false
            ?
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
                  color: colors.white,
                  fontSize: 20,
                }}>
                No Posts Found
            </Text>
            </View>
            :
            null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    paddingVertical: 20
  },
});
