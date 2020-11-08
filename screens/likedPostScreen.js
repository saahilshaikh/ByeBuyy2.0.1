import React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import Card from '../shared/card';
import Card2 from '../shared/card2';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import link from '../fetchPath';

export default class LikedPostScreen extends React.PureComponent{
  inter=null;
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false
    }
  }

  componentDidMount() {
    this.handleInit();
  }

  componentWillUnmount(){
    this.setState = (state,callback)=>{
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
          data: current.liked.reverse(),
          loading: false
        })
      }
    }
  }

  render() {
    _renderMyKeyExtractor = (item, index) => item._id;
    return (
      <View style={styles.container}>
        {
          this.state.data.map(item=>{
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
