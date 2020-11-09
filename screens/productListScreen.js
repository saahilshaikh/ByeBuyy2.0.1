import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import HomeCard from '../shared/homeCard';
import HomeCard2 from '../shared/homeCard2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import { FloatingAction } from "react-native-floating-action";
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import link from '../fetchPath';
import LottieView from 'lottie-react-native';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

export default class ProductListScreen extends React.Component {
  inter=null;
  constructor() {
    super();
    this.state = {
      categories: [],
      images: [],
      imageIndex: 0,
      showImage: false,
      activeCat: 'All',
      isModalVisible: false,
      products: [],
      restProducts: [],
      initialLoading: true,
      add: false,
      loadingProducts: false,
      categories: [],
      loadingMore: false,
      tp: 0,
      last: {},
      location: {},
      spinValue: 0,
      showType: 'All',
      loadingNew: false,
      refreshing: false,
      categoriesLoading: true,
      actions: [
        {
          text: "Add Product",
          icon: require("../assets/images/product.png"),
          name: "add",
          position: 3,
          color: colors.baseline,
          buttonSize: 50,
        },
        {
          text: "Request Product",
          icon: require("../assets/images/requestIcon.png"),
          name: "request",
          position: 4,
          color: colors.baseline,
          buttonSize: 50,
        }
      ],
      showMode: 'A',
      current:"All locations",
      loadmore:true,
      showNew:false
    };
  }

  async componentDidMount() {
    this.setState({
      location: this.props.location
    });
    const postsValue = await AsyncStorage.getItem('bbposts');
    const catValue = await AsyncStorage.getItem('bbcats');
    if(postsValue!==null && catValue!==null)
    {
      console.log('Found local posts list');
      this.setState({
        initialLoading: false,
        products:JSON.parse(postsValue),
        showProducts: JSON.parse(postsValue),
        categories:JSON.parse(catValue),
        categoriesLoading: false
      })
    }
    else{
      console.log('No local posts list found');
      this.handleInit();
    }
    this.handleNew();
    this.inter=setInterval(() => {
      this.handleNew();
    }, 20000);
  }

  componentWillUnmount() {
    clearInterval(this.inter);
      this.setState = (state,callback)=>{
      return;
    };
  }

  handleNew=async ()=>{
    if(this.state.mode==="A" && this.state.loc==='All locations' && this.state.category==='All')
    {
      var data = {
        mode: "A",
        category:"All",
        loc:'World'
      }
      var res = await axios.post(link + '/api/showProducts10/filter',data);
      if(res.data!==null)
      {
        if(this.state.products.length>0 && res.data.length>0 && res.data[0]._id!==this.state.products[0]._id)
        {
          this.setState({
            showNew:true
          })
        }
      }
    }
  }

  handleInit = async () => {
    var data = {
      mode: 'A',
      category: 'All',
      loc:'World'
    }
    var res = await axios.post(link + '/api/showProducts10/filter',data);
    var res2 = await axios.get(link + '/api/categories');
    if (res.data) {
      this.storeData('bbposts',res.data);
      this.setState({
        initialLoading: false,
        products: res.data,
        showProducts: res.data,
      })
    }
    if (res2.data) {
      this.storeData('bbcats',res2.data);
      this.setState({
        categories: res2.data,
        categoriesLoading: false
      })
    }
  }

  storeData = async (label, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(label, jsonValue)
    } catch (e) {
      // saving error
      console.log('Error Storing File', label, e);
    }
  }

  handleRefresh = async () => {
    this.setState({
      refreshing: true,
      showNew:false,
    })
    var data = {
      mode: 'A',
      category: 'All',
      loc:'World'
    }
    var res = await axios.post(link + '/api/showProducts10/filter', data);
    if (res.data) {
      this.storeData('bbposts',res.data);
      this.setState({
        products: res.data,
        showProducts: res.data,
        loadmore:true,
        activeCat:'All',
        current:'All locations',
        showMode:'A',
        refreshing:false
      })
    }
  }

  handleShow = (e) => {
    this.setState({
      isModalVisible: false
    })
    if (e === 'Product') {
      this.setState({
        showMode: 'P'
      }, () => {
        this.handleCategory(this.state.activeCat);
      })
    }
    else if (e === 'Request') {
      this.setState({
        showMode: 'R'
      }, () => {
        this.handleCategory(this.state.activeCat);
      })
    }
    else {
      this.setState({
        showMode: 'A'
      }, () => {
        this.handleCategory(this.state.activeCat);
      })
    }
  }

  handleLocation = async (city, country,lat,long) => {
    console.log("PLS 97", city);
    console.log("PLS 98", country);
    if(city!=='' && country!=='')
    {
      var location={
        lat:lat,
        long:long
      };
      this.setState({
        current:city+','+country,
        location:location
      },()=>{
        this.handleCategory(this.state.activeCat);
      })
    }
    else{
      this.setState({
        current:'All locations'
      },()=>{
        console.log(this.state.current)
        this.handleCategory(this.state.activeCat);
      })
    }
  }

  handleAdd = (name) => {
    if (auth().currentUser) {
      console.log(name);
      if (name === 'add') {
        this.props.navigation.push('AddItem');
      }
      else if (name === 'request') {
        this.props.navigation.push('AddReq');
      }
    }
    else {
      console.log("USER DOESNT EXIST");
      this.props.navigation.navigate('Login');
    }
  }

  handleAfterAdding = () => {
    console.log('Done Adding');
    this.handleRefresh();
  }



  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  handleReachedEnd = () => {
    console.log("reached End");
    if (this.state.loadmore && !this.state.loadingMore) {
      this.handleViewMore();
    }
  }

  handleCategory = async (e) => {
    this.moveToFront(e);
    this.setState({
      activeCat: e,
      initialLoading: true,
      products: [],
      showProducts: [],
      refreshing: false,
      loadmore:true
    })
    if (e === "All") {
      var data = {
        mode: this.state.showMode,
        category: e,
        loc:this.state.current==="All locations"?'World':this.state.current
      }
      var res = await axios.post(link + '/api/showProducts10/filter', data);
      res.data.map(item=>{
        console.log(item.city);
      })
      if (res.data) {
        this.setState({
          initialLoading: false,
          products: res.data,
          showProducts: res.data,
        })
      }
    }
    else {
      var data = {
        category: e,
        mode: this.state.showMode,
        loc:this.state.current==="All locations"?'World':this.state.current
      }
      var res = await axios.post(link + '/api/showProducts10/filter', data);
      if (res.data) {
        this.setState({
          initialLoading: false,
          products: res.data,
          showProducts: res.data,
        })
      }
    }
  }

  moveToFront=(x)=> {
    var collection=this.state.categories;
    for (var i = 0; i < collection.length; i++) {
      if (collection[i].name === x) {
        collection = collection.splice(i, 1).concat(collection);
        break;
      }
    }
    this.setState({
      categories:collection
    })
  }

  handleViewMore = async () => {
    this.setState({
      loadingMore: true
    })
    const data = {
      count: this.state.products.length,
      category: this.state.activeCat,
      mode: this.state.showMode,
      loc:this.state.current==="All locations"?'World':this.state.current
    }
    var res = await axios.post(link + '/api/showProductsNext10/filter', data);
    if (res.data) {
      this.setState({
        loadingMore: false
      })
      if (res.data.length > 0) {
        var products = this.state.products;
        res.data.map(item => {
          products.push(item);
        })
        this.setState({
          products: products,
          showProducts: products
        })
      }
      else{
        console.log('LOAD MORE FLASE');
        this.setState({
          loadmore:false
        })
      }
    }
  }

  renderHeader = () => {
    return (
      <View style={{ width: '100%' }}>
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
            onPress={() => this.props.navigation.navigate('Loc', { handleLocation: this.handleLocation,location:this.state.location })}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor:'#1B1F22',
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
              {this.state.current}
            </Text>
            <Ionicons name="ios-caret-down" size={14} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor:'#1B1F22',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
              }}
            onPress={this.toggleModal}>
            <MaterialCommunityIcons name='filter-menu' size={22} color={colors.white}/>
          </TouchableOpacity>
        </View>
        {
          !this.state.categoriesLoading
            ?
            <View style={{ width: '100%', marginBottom: 15 }}>
              <ScrollView
                horizontal={true}
                style={{ width: '100%', paddingLeft: 5 }}
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
            :
            null
        }
      </View>
    )
  }

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
    )
  }

  renderFooter = () => {
    return (
      <View style={{ width: '100%', alignItems: 'center' }}>
          {
          this.state.loadingMore
            ?
            <View style={{ marginBottom: 10 }}>
			            <View style={{ width: 60, height: 60 }}>
                    <LottieView
                      source={require('../assets/loading.json')}
                      autoPlay={true}
                      loop={true}
                    />
                  </View>
            </View>
            :
            null
        }
        <Text style={{fontFamily:'Muli-Bold',color:colors.baseline,fontSize:14,marginBottom:10}}>{this.state.loadmore?null:"byebuyy"}</Text>
      </View>
    )
  }

  render() {
    const keyExtractor=((item) => item._id);
    return (
      <View style={styles.container}>
        <View style={styles.list}>
          {
            this.state.initialLoading
              ?
              <View style={{ marginTop: 30, alignItems: 'center', width: '100%', flex: 1 }}>
                <View style={{ marginTop: 20, alignItems: 'center', flex: 1, width: '100%', justifyContent: 'center', marginBottom: 60 }}>
                  <View style={{ width: 120, height: 120 }}>
                    <LottieView
                      source={require('../assets/loading.json')}
                      autoPlay={true}
                      loop={true}
                    />
                  </View>
                </View>
              </View>
              :
              <>
                <FlatList
                  keyboardShouldPersistTaps={'handled'}
                  ListEmptyComponent={this.renderListEmpty}
                  ListFooterComponent={this.renderFooter}
                  ListHeaderComponent={this.renderHeader}
                  style={{ width: '100%' }}
                  windowSize={3}
                  data={this.state.showProducts}
                  onEndReached={this.handleReachedEnd}
                  keyExtractor={keyExtractor}
                  onEndReachedThreshold={30}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.handleRefresh}
                    />
                  }
                  renderItem={({ item }) => (
                    <>
                      {
                        item.varient === 'Product'
                          ?
                          <HomeCard
                            handleCardClick={(e) => this.handleCardClick(e)}
                            handleCardImageClick={(e, f) => this.handleCardImageClick(e, f)}
                            item={item}
                            location={this.state.location}
                            navigation={this.props.navigation}
                          />
                          :
                          null
                      }
                      {
                        item.varient === 'Request'
                          ?
                        <HomeCard2
                            handleCardClick={(e) => this.handleCardClick(e)}
                            handleCardImageClick={(e, f) => this.handleCardImageClick(e, f)}
                            item={item}
                            location={this.state.location}
                            navigation={this.props.navigation}
                          />
                          :null
                      }
                    </>
                  )}
                />
              </>
          }
          {
            this.state.loadingProducts
              ?
              <View style={{ marginTop: 10 }}>
                <ActivityIndicator size="large" color={colors.baseline} />
              </View>
              :
              null
          }
        </View>
        <FloatingAction
          overlayColor='rgba(0,0,0, 0.6)'
          actionsPaddingTopBottom={5}
          actions={this.state.actions}
          color={colors.baseline}
          distanceToEdge={15}
          onPressItem={name => this.handleAdd(name)}
        />
        <Modal isVisible={this.state.isModalVisible}>
          <TouchableOpacity
            onPress={() => this.setState({
                  isModalVisible: false
                })}
            style={{
              alignItems: 'center',
              width:'100%',
              flex:1,
              justifyContent:'center'
            }}>
            <View
              style={{
                width: '80%',
                backgroundColor: colors.primary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <View style={{ width: '100%' }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showType: 'All'
                    }, () => {
                      this.handleShow('All')
                    })
                  }}
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    justifyContent: 'center',
                    borderBottomColor: colors.grey,
                    borderBottomWidth: StyleSheet.hairlineWidth
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Muli-Bold',
                      color: colors.white,
                      fontSize: 14,
                    }}>
                    Show All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showType: 'Product'
                    }, () => {
                      this.handleShow('Product')
                    })
                  }}
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    justifyContent: 'center',
                    borderBottomColor: colors.grey,
                    borderBottomWidth: StyleSheet.hairlineWidth
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Muli-Bold',
                      color: colors.white,
                      fontSize: 14,
                    }}>
                    Show Products Only
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showType: 'Request'
                    }, () => {
                      this.handleShow('Request')
                    })
                  }}
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Muli-Bold',
                      color: colors.white,
                      fontSize: 14,
                    }}>
                    Show Requests Only
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        {
          this.state.showNew
            ?
            <TouchableOpacity onPress={this.handleRefresh} style={styles.floatingButton}>
              <Text style={styles.floatingButtonText}>New Posts</Text>
            </TouchableOpacity>
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
  },
  list: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  category: {
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor:'#1B1F22',
    elevation:5,
    marginBottom:2
  },
  accategory: {
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor:'#1B1F22',
    elevation:5,
    marginBottom:2
  },
  categoryText: {
    fontSize: 14,
    color: colors.grey,
    fontFamily: 'Muli-Bold',
  },
  accategoryText: {
    fontSize: 14,
    color: colors.baseline,
    fontFamily: 'Muli-Bold',
  },
  actionButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 55,
    height: 55,
    backgroundColor: colors.baseline,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rp: {
    width: 200,
    height: 50,
    backgroundColor: colors.baseline,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20
  },
  rpt: {
    fontFamily: 'Muli-Bold',
    color: colors.white,
    fontSize: 16
  },
  vm: {
    width: 160,
    height: 40,
    backgroundColor: colors.baseline,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginVertical: 20
  },
  vmt: {
    fontFamily: 'Muli-Bold',
    color: colors.white,
    fontSize: 16
  },
  floatingButton: {
    position: 'absolute',
    top: 10,
    right: width * 0.5 - 55,
    width: 110,
    height: 35,
    backgroundColor: colors.baseline,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  floatingButtonText: {
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    color: colors.white
  }
});