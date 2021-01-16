import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text
} from 'react-native';
import RateCard from '../shared/rateCard';
import axios from 'axios';
import link from '../fetchPath';
import LottieView from 'lottie-react-native';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

export default class OtherRatingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false
    }
  }

  async componentDidMount() {
    var data = {
      id: this.props.id
    }
    var res = await axios.post(link + '/api/user/singleId', data);
    var current = res.data;
    current.id = current._id;
    var ratings = current.ratings;
    this.setState({
      data: ratings.reverse(),
      loading: false
    })
  }

  render() {
    var location = {
      city: "",
      lat: '',
      long: ''
    }
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
                  color: colors.grey,
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
  }
});
