import React from 'react';
import {View, StyleSheet} from 'react-native';
import Card from '../shared/card';
import Card2 from '../shared/card2';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import link from '../fetchPath';

export default class SavedPostScreen extends React.PureComponent {
  inter = null;
  constructor() {
    super();
    this.state = {
      data: [],
      loading: true,
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
        id: auth().currentUser.email,
      };
      var res = await axios.post(link + '/api/user/single', data);
      if (res.data) {
        var current = res.data;
        this.setState({
          data: current.saved.reverse(),
          loading: false,
        });
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.data.map((item) => {
          if (item.type.toLowerCase() === 'product') {
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
          } else if (item.type.toLowerCase() === 'request') {
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
