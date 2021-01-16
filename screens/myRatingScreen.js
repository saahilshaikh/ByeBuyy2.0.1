import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text
} from 'react-native';
import auth from '@react-native-firebase/auth';
import RateCard from '../shared/rateCard';
import axios from 'axios';
import link from '../fetchPath';
import LottieView from 'lottie-react-native';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

export default class MyRatingScreen extends React.PureComponent {
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
          data: current.ratings.reverse(),
          loading: false
        })
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.data.map(item => {
            return (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <RateCard item={item} navigation={this.props.navigation} />
              </View>
            )
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
                No Ratings Found
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
