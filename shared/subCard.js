import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'react-moment';
import NetworkImage from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

const {width, height} = Dimensions.get('window');
export default class SubCard extends React.Component {
  render() {
    var subtopic = '';
    if (this.props.item.type.toLowerCase().includes('exchange')) {
      subtopic =
        'Ready to ' +
        this.props.item.type +
        ' ' +
        this.props.item.what +
        ' with ' +
        this.props.item.with;
    } else {
      subtopic =
        'Ready to ' + this.props.item.type + ' ' + this.props.item.what;
    }
    if (subtopic.length > 40) {
      subtopic = subtopic.slice(0, 37);
      subtopic = subtopic + '...';
    }
    return (
      <>
        <View
          style={{
            width: (85 / 100) * width,
            alignItems: 'center',
            marginHorizontal: 10,
          }}>
          <View style={styles.item}>
            <View style={styles.itemTop}>
              <NetworkImage
                source={{uri: this.props.item.images[0].image}}
                indicator={ProgressBar}
                indicatorProps={{
                  width: 40,
                  borderWidth: 0,
                  color: '#d65a31',
                  unfilledColor: '#e5e5e5',
                }}
                threshold={100}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 5,
                }}
                imageStyle={{
                  width: 90,
                  height: 90,
                  borderRadius: 5,
                }}
              />
              <View style={styles.itemContent}>
                <Text style={styles.itemContentHeader}>{subtopic}</Text>
                <Text style={styles.itemContentLocation}>
                  {this.props.item.neighbourhood
                    ? this.props.item.neighbourhood +
                      ' , ' +
                      this.props.item.city
                    : this.props.item.city}
                </Text>
                <View style={styles.itemContentStats}>
                  <Text style={styles.itemContentDate}>
                    <Moment element={Text} fromNow>
                      {this.props.item.date.toDate()}
                    </Moment>
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.itemBottom}>
              {this.props.item.views !== 0 ? (
                <>
                  <View style={styles.itemView}>
                    <Ionicons
                      name="ios-eye"
                      size={(5 / 100) * width}
                      style={styles.view}
                    />
                    <Text style={styles.itemViewCount}>
                      {this.props.item.views} views
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.itemView}>
                    <Ionicons
                      name="ios-eye"
                      size={(5 / 100) * width}
                      style={styles.view}
                    />
                    <Text style={styles.itemViewCount}>0 views</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    width: '100%',
    height: 140,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#192734',
  },
  itemTop: {
    width: '100%',
    height: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  itemContent: {
    width: '65%',
    height: '100%',
  },
  itemContentHeader: {
    width: '100%',
    fontSize: 14,
    marginBottom: 2,
    color: '#e5e5e5',
    fontFamily: 'Muli-Bold',
  },
  itemContentLocation: {
    fontSize: 12,
    color: '#ACADAA',
    fontFamily: 'Muli-Regular',
  },
  itemContentStats: {
    flexDirection: 'row',
  },
  itemContentDate: {
    fontSize: 12,
    color: '#ACADAA',
    fontFamily: 'Muli-Regular',
  },
  itemBottom: {
    width: '90%',
    height: '20%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  view: {
    color: '#ACADAA',
    fontSize: 14,
    marginHorizontal: 5,
  },
  itemViewCount: {
    fontSize: 12,
    color: '#ACADAA',
    fontFamily: 'Muli-Regular',
  },
});
