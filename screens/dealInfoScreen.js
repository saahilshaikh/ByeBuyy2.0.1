import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../appTheme';
import MiniCard from '../shared/mincard';
import Moment from 'react-moment';

const { width, height } = Dimensions.get('window');

export default class DealInfoScreen extends React.Component {
  handleBack = () => {
    this.props.navigation.pop();
  }
  render() {
    return (
      <>
      <SafeAreaView></SafeAreaView>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 20,
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            borderBottomColor: colors.grey,
            borderBottomWidth: StyleSheet.hairlineWidth
          }}>
          <TouchableOpacity
            onPress={this.handleBack}>
            <Ionicons
              name="ios-arrow-back"
              size={30}
              color={colors.baseline}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 10
            }}>
            <Text style={styles.header}>Deal Info</Text>
          </View>
        </View>
        <View style={{width:'100%',alignItems:'center'}}>
            <View style={{width:'95%',alignItems:'center',backgroundColor:'#1B1F22',marginVertical:10,borderRadius:10,paddingVertical:10}}>
                {
                this.props.route.params.item.varient === 'exchange'
                ?
                <View style={{ width: '90%', alignItems: 'center', paddingVertical: 10 }}>
                    <MiniCard id={this.props.route.params.item.id1} navigation={this.props.navigation} />
                    <View style={{ marginVertical: 10 }}>
                        <Ionicons name="ios-repeat" size={40} color={colors.baseline} style={{ transform: [{ rotate: '90deg' }] }} />
                    </View>
                    <MiniCard id={this.props.route.params.item.id2} navigation={this.props.navigation} />
                </View>
                :
                <View style={{ width: '90%', alignItems: 'center', paddingVertical: 10 }}>
                    <View style={{ width: '100%', padding: 10 }}>
                        <Text style={styles.dSubHeader}>Reason stated for this product :</Text>
                        <Text style={styles.dMessage}>{this.props.route.params.item.message}</Text>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                    <Ionicons name="ios-return-down-back" size={40} color={colors.baseline} style={{ transform: [{ rotate: '-90deg' }] }} />
                    </View>
                    <MiniCard id={this.props.route.params.item.id1} navigation={this.props.navigation} />
                </View>
                }
                <View style={{ width: '90%', paddingVertical: 10 }}>
                    <Text style={styles.dSubHeader}>Logs</Text>
                    {
                        this.props.route.params.item.logs.map(item => {
                        return (
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.dlogHead}>{item.name}</Text>
                            <Text style={styles.dlogHead}>:</Text>
                            <Text style={styles.dlogDate}><Moment element={Text} format={'MMMM Do YYYY'}>{item.date}</Moment></Text>
                            </View>
                        )
                        })
                    }
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.dlogHead}>Deal Accomplished</Text>
                        <Text style={styles.dlogHead}>:</Text>
                        <Text style={styles.dlogDate}><Moment element={Text} format={'MMMM Do YYYY'}>{this.props.route.params.item.date}</Moment></Text>
                    </View>
                </View>
                <View style={{ width: '90%', paddingVertical: 10 }}>
                    <Text style={styles.dSubHeader}>Meeting Info</Text>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.dlogHead}>Landmark</Text>
                        <Text style={styles.dlogHead}>:</Text>
                        <Text style={styles.dlogDate}>{this.props.route.params.item.meeting.landmark}</Text>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.dlogHead}>Location</Text>
                        <Text style={styles.dlogHead}>:</Text>
                        <Text style={styles.dlogDate}>{this.props.route.params.item.meeting.location}</Text>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.dlogHead}>Date</Text>
                        <Text style={styles.dlogHead}>:</Text>
                        <Text style={styles.dlogDate}>{this.props.route.params.item.meeting.date}</Text>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.dlogHead}>Location</Text>
                        <Text style={styles.dlogHead}>:</Text>
                        <Text style={styles.dlogDate}>{this.props.route.params.item.meeting.time}</Text>
                    </View>
                </View>
            </View>
        </View>
      </SafeAreaView>
      <SafeAreaView></SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: colors.primary,
  },
  header: {
    color: colors.baseline,
    fontSize: 20,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  header2: {
    color: colors.baseline,
    fontSize: 20,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginLeft: 10,
  },
  dealPop: {
    width: '100%',
    height: 60,
    backgroundColor: colors.darkText,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5
  },
  dealPopLeft: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  dname: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  dtype: {
    color: colors.grey,
    fontSize: 12,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  dealPopRight: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  daction: {
    marginHorizontal: 4
  },
  dealInfoHeader: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  dSubHeader: {
    color: colors.baseline,
    fontSize: 16,
    fontFamily: 'Muli-Bold',
  },
  dMessage: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
  },
  dlogHead: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    marginRight: 5
  },
  dlogDate: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    marginLeft: 5
  },
});
