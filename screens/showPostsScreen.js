import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Card from '../shared/card';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';

export default class ShowPostsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: true,
      categories: [],
      categoriesLoading: false,
      loadingMore: false,
      location: [],
      activeCat: 'All',
      current: 'World',
      loadmore: true,
      loadingMore: false,
      locationType: 'All locations',
    };
  }

  componentDidMount() {
    this.setState({
      location: this.props.location,
    });
    this.handleInit();
  }

  handleInit = async () => {
    this.setState({
      loading: true,
    });
    var search = this.props.searchWord;
    var data = {
      what: search,
      category: this.state.activeCat,
      loc: this.state.current,
    };
    var res = await axios.post(link + '/api/product/what', data);
    if (res.data !== null) {
      this.setState({
        data: res.data,
        loading: false,
      });
    }
    var res2 = await axios.get(link + '/api/categories');
    this.setState({
      categories: res2.data,
      categoriesLoading: false,
    });
  };

  handleLocation = async (city, country, lat, long, type) => {
    console.log(lat, long);
    console.log('PLS 97', city);
    console.log('PLS 98', country);
    if (type === 'other') {
      var location = {
        lat: lat,
        long: long,
      };
      this.setState(
        {
          current: city + ',' + country,
          location: location,
          locationType: city + ',' + country,
        },
        () => {
          this.handleCategory(this.state.activeCat);
        },
      );
    } else {
      if (type === 'world') {
        this.setState(
          {
            current: 'World',
            locationType: 'All locations',
          },
          () => {
            console.log(this.state.current);
            this.handleCategory(this.state.activeCat);
          },
        );
      } else if (type === 'current') {
        var location = {
          lat: lat,
          long: long,
        };
        this.setState(
          {
            current: city + ',' + country,
            location: location,
            locationType: 'Current Location',
          },
          () => {
            this.handleCategory('All');
          },
        );
      } else if (type === 'home') {
        var location = {
          lat: lat,
          long: long,
        };
        this.setState(
          {
            current: city + ',' + country,
            locationType: 'Home',
            location: location,
          },
          () => {
            this.handleCategory('All');
          },
        );
      }
    }
  };

  handleReachedEnd = () => {
    console.log('reached End');
    if (this.state.loadmore && this.state.loadingMore === false) {
      this.handleViewMore();
    }
  };

  handleCategory = async (e) => {
    this.moveToFront(e);
    this.setState({
      activeCat: e,
      loading: true,
      data: [],
      refreshing: false,
      loadmore: true,
    });
    var search = this.props.searchWord;
    if (e === 'All') {
      var data = {
        what: search,
        category: e,
        loc: this.state.current,
      };
      var res = await axios.post(link + '/api/product/what', data);
      res.data.map((item) => {
        console.log(item.city);
      });
      if (res.data) {
        this.setState({
          loading: false,
          data: res.data,
        });
      }
    } else {
      var data = {
        category: e,
        loc: this.state.current,
        what: search,
      };
      var res = await axios.post(link + '/api/product/what', data);
      if (res.data) {
        this.setState({
          loading: false,
          data: res.data,
        });
      }
    }
  };

  moveToFront = (x) => {
    var collection = this.state.categories;
    for (var i = 0; i < collection.length; i++) {
      if (collection[i].name === x) {
        collection = collection.splice(i, 1).concat(collection);
        break;
      }
    }
    this.setState({
      categories: collection,
    });
  };

  handleViewMore = async () => {
    this.setState({
      loadingMore: true,
    });
    var search = this.props.searchWord;
    const data = {
      count: this.state.data.length,
      category: this.state.activeCat,
      loc: this.state.current,
      what: search,
    };
    var res = await axios.post(link + '/api/product/whatNext10', data);
    if (res.data !== null) {
      this.setState({
        loadingMore: false,
      });
      console.log(res.data.length);
      if (res.data.length > 0) {
        console.log('Yup', res.data[res.data.length - 1]._id);
        var products = this.state.data;
        res.data.map((item) => {
          products.push(item);
        });
        this.setState({
          data: products,
        });
      } else {
        this.setState({
          loadmore: false,
        });
      }
    } else {
      this.setState({
        loadingMore: false,
      });
    }
  };

  renderHeader = () => {
    return (
      <View style={{width: '100%'}}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            marginBottom: 15,
            marginTop: 10,
          }}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Loc', {
                handleLocation: this.handleLocation,
                location: this.state.location,
              })
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1B1F22',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}>
            <Text
              style={{
                marginRight: 5,
                color: colors.white,
                fontFamily: 'Muli-Bold',
              }}>
              {this.state.locationType}
            </Text>
            <Ionicons name="ios-caret-down" size={14} color={colors.white} />
          </TouchableOpacity>
        </View>
        {!this.state.categoriesLoading ? (
          <View style={{width: '100%', marginBottom: 15}}>
            <ScrollView
              horizontal={true}
              style={{width: '100%', paddingLeft: 5}}
              showsHorizontalScrollIndicator={false}>
              {this.state.activeCat === 'All' ? (
                <TouchableOpacity
                  onPress={() => this.handleCategory('All')}
                  style={styles.accategory}>
                  <Text style={styles.accategoryText}>All</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.handleCategory('All')}
                  style={styles.category}>
                  <Text style={styles.categoryText}>All</Text>
                </TouchableOpacity>
              )}
              {this.state.categories.map((item) => {
                return (
                  <View key={item._id}>
                    {this.state.activeCat === item.name ? (
                      <TouchableOpacity
                        onPress={() => this.handleCategory(item.name)}
                        style={styles.accategory}>
                        <Text style={styles.accategoryText}>{item.name}</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => this.handleCategory(item.name)}
                        style={styles.category}>
                        <Text style={styles.categoryText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
      </View>
    );
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

  renderFooter = () => {
    return (
      <View style={{width: '100%', alignItems: 'center'}}>
        {this.state.loadingMore ? (
          <View style={{marginBottom: 20}}>
            <View style={{width: 60, height: 60}}>
              <LottieView
                source={require('../assets/loading.json')}
                autoPlay={true}
                loop={true}
              />
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    _renderMyKeyExtractor = (item, index) => item.id;
    return (
      <View style={{width: '100%', flex: 1, paddingVertical: 10}}>
        {!this.state.loading ? (
          <FlatList
            style={{width: '100%'}}
            data={this.state.data}
            ListEmptyComponent={this.renderListEmpty}
            ListFooterComponent={this.renderFooter}
            ListHeaderComponent={this.renderHeader}
            onEndReached={this.handleReachedEnd}
            keyExtractor={_renderMyKeyExtractor}
            initialNumToRender={2}
            onEndReachedThreshold={30}
            renderItem={({item}) => (
              <Card
                key={item.id}
                item={item}
                handleCardImageClick={(e, f) =>
                  this.props.handleCardImageClick(e, f)
                }
                location={this.state.location}
                navigation={this.props.navigation}
              />
            )}
          />
        ) : (
          <View
            style={{
              marginTop: 30,
              alignItems: 'center',
              width: '100%',
              flex: 1,
            }}>
            <View
              style={{
                marginTop: 20,
                alignItems: 'center',
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                marginBottom: 60,
              }}>
              <View style={{width: 120, height: 120}}>
                <LottieView
                  source={require('../assets/loading.json')}
                  autoPlay={true}
                  loop={true}
                />
              </View>
            </View>
          </View>
        )}
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
  category: {
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: '#1B1F22',
    elevation: 5,
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 14,
    color: colors.grey,
    fontFamily: 'Muli-Bold',
  },
  accategory: {
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: '#1B1F22',
    elevation: 5,
    marginBottom: 2,
  },
  accategoryText: {
    fontSize: 14,
    color: colors.baseline,
    fontFamily: 'Muli-Bold',
  },
});
