import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';
import Card from '../shared/card';
import Card2 from '../shared/card2';
import axios from 'axios';
import link from '../fetchPath';

export default class OtherPostScreen extends React.Component {
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
    var posts = current.posts;
    this.setState({
      data: posts.reverse(),
      loading: false
    })
  }

  renderListEmpty = () => {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Muli-Regular',
            color: '#ACADAA',
            fontSize: 20,
          }}>
          No posts yet
        </Text>
      </View>
    )
  }

  render() {
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
    paddingVertical:20
  },
});
