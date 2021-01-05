import React from 'react';
import {TouchableOpacity, Image, StyleSheet, View} from 'react-native';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';

export default class ShowSimilar extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      data: [],
    };
  }
  async componentDidMount() {
    var count = this.props.sameList.length > 5 ? 5 : this.props.sameList.length;
    for (var i = 0; i < count; i++) {
      var data = {
        id: this.props.sameList[i],
      };
      var res = await axios.post(link + '/api/user/single', data);
      if (res.data !== null) {
        var data = res.data;
        data.id = data._id;
        var items = this.state.data;
        items.push(data);
        this.setState({
          data: items,
        });
      }
    }
  }

  handleClick = (item) => {
    this.props.navigation.push('viewProfile', {id: item._id});
  };

  render() {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {this.state.data.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => this.handleClick(item)}
              style={styles.click}>
              <Image source={{uri: item.photo}} style={styles.image} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  click: {
    width: 25,
    height: 25,
    borderRadius: 25,
    margin: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
