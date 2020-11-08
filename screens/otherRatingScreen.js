import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import RateCard from '../shared/rateCard';
import axios from 'axios';
import link from '../fetchPath';

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
          this.state.data.map(item=>{
            return (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <RateCard item={item} navigation={this.props.navigation} />
              </View>
            )
          })
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
