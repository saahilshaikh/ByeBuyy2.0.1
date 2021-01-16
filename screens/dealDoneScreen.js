import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Linking,
  Image,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../appTheme';
import DealCard from '../shared/dealCard';
import axios from 'axios';
import link from '../fetchPath';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default class DealDoneScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      deals: [],
      loading: true,
    };
  }

  async componentDidMount() {
    var data = {
      id: auth().currentUser.email,
    };
    var res = await axios.post(link + '/api/dealList', data);
    if (res.data !== null) {
      this.setState({
        deals: res.data,
        loading: false,
      });
    }
  }

  handleBack = () => {
    this.props.navigation.pop();
    this.props.route.params.handleBack();
  };

  renderListEmpty = () => {
    return (
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
          Nothing Found
        </Text>
      </View>
    );
  };

  render() {
    return (
      <>
        <SafeAreaView></SafeAreaView>
        <SafeAreaView style={styles.container}>
          <View
            style={{
              backgroundColor: colors.secondary,
              paddingHorizontal: 20,
              height: 60,
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              elevation: 3
            }}>
            <TouchableOpacity onPress={this.handleBack}>
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
                marginLeft: 10,
              }}>
              <View style={{ width: 30, height: 30 }}>
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={require('../assets/images/icon.png')}
                />
              </View>
              <Text style={styles.header}>My Deals</Text>
            </View>
          </View>
          <View style={{ width: '100%', alignItems: 'center', flex: 1 }}>
            {!this.state.loading ? (
              <FlatList
                ListEmptyComponent={this.renderListEmpty}
                keyboardShouldPersistTaps={'handled'}
                style={{ width: '100%' }}
                data={this.state.deals}
                onEndReached={this.handleReachedEnd}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      marginVertical: 10,
                    }}>
                    <DealCard item={item} navigation={this.props.navigation} />
                  </View>
                )}
              />
            ) : (
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <View style={{ width: 100, height: 100 }}>
                    <LottieView
                      source={require('../assets/loading.json')}
                      autoPlay={true}
                      loop={true}
                    />
                  </View>
                </View>
              )}
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
    backgroundColor: colors.secondary,
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
  box: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    borderBottomColor: colors.grey,
    borderBottomWidth: StyleSheet.hairlineWidth,
    elevation: 3,
  },
  boxText: {
    fontSize: 16,
    color: '#e5e5e5',
    fontFamily: 'Muli-Regular',
  },
});
