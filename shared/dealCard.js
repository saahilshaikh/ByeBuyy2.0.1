import React from 'react';
import MiniCard from './mincard';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../appTheme';
import Moment from 'react-moment';

const { width, height } = Dimensions.get('window');

export default class DealCard extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <View style={styles.item}>
        <View
          style={{
            width: '90%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text style={styles.itemDate}>
            Deal accomplished on{' \n'}
            <Moment element={Text} format="DD-MM-YYYY, hh:mm a">
              {this.props.item.date}
            </Moment>
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('DealInfo', {
                item: this.props.item,
              })
            }>
            <Ionicons
              name="ios-information-circle-outline"
              size={26}
              color={colors.baseline}
            />
          </TouchableOpacity>
        </View>
        <MiniCard id={this.props.item.id1} navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    width: '95%',
    alignItems: 'center',
    backgroundColor: colors.primary2,
    justifyContent: 'space-between',
    elevation: 3,
    borderRadius: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: colors.grey
  },
  itemDate: {
    fontFamily: 'Muli-Bold',
    color: colors.darkText,
    fontSize: 14,
  },
});
