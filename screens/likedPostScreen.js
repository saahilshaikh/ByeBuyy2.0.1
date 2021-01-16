import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Card from '../shared/card';
import Card2 from '../shared/card2';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import link from '../fetchPath';
import LottieView from 'lottie-react-native';
import colors from '../appTheme';

export default class LikedPostScreen extends React.PureComponent {
  inter = null;
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false,
    };
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
      this.setState({
        data: [],
      });
      var data = {
        email: auth().currentUser.email,
      };
      var res = await axios.post(link + '/api/getLiked', data);
      if (res.data !== null) {
        console.log(res.data.length);
        this.setState({
          data: res.data.reverse(),
          loading: false,
        });
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.data.map((item) => {
          if (item.varient.toLowerCase() === 'product') {
            return (
              <Card
                handleCardImageClick={(e, f) =>
                  this.props.handleCardImageClick(e, f)
                }
                item={item}
                location={this.props.location}
                navigation={this.props.navigation}
                handleRefresh={this.handleInit}
              />
            );
          } else if (item.varient.toLowerCase() === 'request') {
            return (
              <Card2
                item={item}
                location={this.props.location}
                navigation={this.props.navigation}
                handleRefresh={this.handleInit}
              />
            );
          }
        })}
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
    paddingVertical: 20,
  },
});
