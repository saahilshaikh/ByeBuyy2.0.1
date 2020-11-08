import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  RefreshControl
} from 'react-native';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import link from '../fetchPath';
import axios from 'axios';
import colors from '../appTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyPostScreen from './myPostScreen';
import LikedPostScreen from './likedPostScreen';
import SavedPostScreen from './savedPostScreen';
import MyRatingScreen from './myRatingScreen';
import Swiper from 'react-native-swiper'

const { width, height } = Dimensions.get('window');

export default class ProfileScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      currentUser:{},
      loading: true,
      refreshing:false,
      location:{
        lat:'',
        long:''
      },
      tab:"Posts"
    };
  }

  async componentDidMount() {
    if (auth().currentUser) {
      this.setState({
        location:this.props.location
      })
      var data = {
        id: auth().currentUser.email
      }
      var res = await axios.post(link + '/api/user/single', data);
      if (res.data !== null) {
        this.setState({
          currentUser:res.data,
          loading:false
        })
      }
    }
    else{
      this.setState({
        loading:false
      })
    }
  }

  handleRefresh = async () => {
      this.setState({
          loading:true
      })
      var data = {
        id: auth().currentUser.email
      }
      var res = await axios.post(link + '/api/user/single', data);
      if (res.data !== null) {
        this.setState({
          currentUser:res.data,
          loading:false,
        })
      }
  }

  storeData = async (label, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(label, jsonValue)
    } catch (e) {
      // saving error
      console.log('Error Storing File');
    }
  }

  render() {
    _renderMyKeyExtractor = (item, index) => index.toString();
    return (
      <View style={styles.container}>
      {
              this.state.loading
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
        {
          auth().currentUser
            ?
            <ScrollView 
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                    />
                }
                style={{ width: '100%', flex: 1 }}>
                <View style={{ width: '100%', alignItems: 'center', flex: 1 }}>
                    <View style={styles.profileBox}>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View
                            style={styles.profileImageContainer}>
                            {
                                this.state.currentUser.photo
                                ?
                                <Image
                                    source={{ uri: this.state.currentUser.photo }}
                                    style={styles.profileImage}
                                />
                                :
                                <View style={styles.profileImageBox}>
                                    <Text style={styles.imageText}>{this.state.currentUser.name.charAt(0).toUpperCase()}</Text>
                                </View>
                            }
                            </View>
                        </View>
                    <View style={styles.profileInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.name}>{this.state.currentUser.name}</Text>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('ProfileEdit')}
                            style={{
                            width: 30,
                            height: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.darkText,
                            elevation: 3,
                            borderRadius: 10,
                            marginLeft: 5,
                            }}>
                            <Ionicons name="settings-outline" size={18} color={colors.white} />
                        </TouchableOpacity>
                        </View>
                        <Text style={styles.uname}>@{this.state.currentUser.uname}</Text>
                        <Text style={styles.profession}>{this.state.currentUser.prof}</Text>
                        {this.state.currentUser.institution && this.state.currentUser.prof === 'Student' ? <Text style={styles.uname}>{this.state.currentUser.institution}</Text> : null}
                    </View>
                    </View>
                    <View style={styles.profileStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statHeader}>{this.state.currentUser.posts.length}</Text>
                            <Text style={styles.statSubHeader}>Posts</Text>
                        </View>
                        <TouchableOpacity style={styles.stat} onPress={() => this.props.navigation.push('viewUsers', { id: this.state.currentUser._id, type: "followers",location:this.props.location  })}>
                            <Text style={styles.statHeader}>{this.state.currentUser.followers.length}</Text>
                            <Text style={styles.statSubHeader}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.stat} onPress={() => this.props.navigation.push('viewUsers', { id: this.state.currentUser._id, type: "following",location:this.props.location  })}>
                            <Text style={styles.statHeader}>{this.state.currentUser.following.length}</Text>
                            <Text style={styles.statSubHeader}>Following</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'100%',flex:1,alignItems:'center'}}>
                        <View style={styles.tabbar}>
                            {
                                this.state.tab==='Posts'
                                ?
                                <View style={styles.activeTab}>
                                    <Text style={styles.activeTabText}>Posts</Text>
                                </View>
                                :
                                <TouchableOpacity onPress={()=>this.setState({tab:'Posts'})} style={styles.tab}>
                                    <Text style={styles.tabText}>Posts</Text>
                                </TouchableOpacity>
                            }
                            {
                                this.state.tab==='Liked'
                                ?
                                <View style={styles.activeTab}>
                                    <Text style={styles.activeTabText}>Liked</Text>
                                </View>
                                :
                                <TouchableOpacity onPress={()=>this.setState({tab:'Liked'})} style={styles.tab}>
                                    <Text style={styles.tabText}>Liked</Text>
                                </TouchableOpacity>
                            }
                            {
                                this.state.tab==='Saved'
                                ?
                                <View style={styles.activeTab}>
                                    <Text style={styles.activeTabText}>Saved</Text>
                                </View>
                                :
                                <TouchableOpacity onPress={()=>this.setState({tab:'Saved'})} style={styles.tab}>
                                    <Text style={styles.tabText}>Saved</Text>
                                </TouchableOpacity>
                            }
                            {
                                this.state.tab==='Ratings'
                                ?
                                <View style={styles.activeTab}>
                                    <Text style={styles.activeTabText}>Ratings</Text>
                                </View>
                                :
                                <TouchableOpacity onPress={()=>this.setState({tab:'Ratings'})} style={styles.tab}>
                                    <Text style={styles.tabText}>Ratings</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        {
                            this.state.tab==='Posts'
                            ?
                            <MyPostScreen navigation={this.props.navigation} location={this.props.location}/>
                            :
                            null
                        }
                        {
                            this.state.tab==='Liked'
                            ?
                            <LikedPostScreen navigation={this.props.navigation} location={this.props.location}/>
                            :
                            null
                        }
                        {
                            this.state.tab==='Saved'
                            ?
                            <SavedPostScreen navigation={this.props.navigation} location={this.props.location}/>
                            :
                            null
                        }
                        {
                            this.state.tab==='Ratings'
                            ?
                            <MyRatingScreen navigation={this.props.navigation}/>
                            :
                            null
                        }
                    </View>
              </View>
            </ScrollView>
            :
            <View style={{ width: '100%', alignItems: 'center' }}>
              <View style={styles.imageBox}>
                <LottieView
                  source={require('../assets/login.json')}
                  autoPlay
                  loop
                />
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login to continue</Text>
              </TouchableOpacity>
            </View>
        }
        </>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex:1
  },
  header: {
    top: 0,
    height: 301,
    width: '100%',
    backgroundColor: colors.primary,
    alignItems: 'center',
    position: 'absolute',
    elevation: 10
  },
  profileBox: {
    width: '90%',
    marginVertical: 20,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  profileImageBox: {
    width: 80,
    height: 80,
    backgroundColor: colors.grey,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  imageText: {
    fontFamily: 'Muli-Bold',
    fontSize: 24,
    color: colors.darkText,
  },
  rating: {
    alignItems: 'center',
    width: '100%',
    height:'80%',
    justifyContent:'center',
  },
  ratingNumber: {
    fontFamily: 'Muli-Bold',
    fontSize: 20,
    color: colors.white,
    marginLeft: 15
  },
  ratingText: {
    fontFamily: 'Muli-Regular',
    fontSize: 12,
    color: colors.white,
    marginLeft: 15,
    textAlign: "right"
  },
  profileInfo: {
    width: '100%',
    marginTop: 5
  },
  name: {
    fontFamily: 'Muli-Bold',
    fontSize: 20,
    color: colors.white,
  },
  uname: {
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    color: colors.grey,
  },
  profession: {
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    color: colors.baseline,
  },
  bio: {
    fontFamily: 'Muli-Bold',
    fontSize: 14,
    color: colors.grey,
  },
  profileStats: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stat: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
    width: '25%',
  },
  statHeader: {
    fontSize: 18,
    fontFamily: 'Muli-Bold',
    color: colors.white,
  },
  statSubHeader: {
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    color: colors.white,
  },
  tabbar:{
    width:'100%',
    height:50,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#1B1F22'
  },
  tab:{
    width:'25%',
    alignItems:'center',
    justifyContent:'center',
    height:'100%',
  },
  tabText:{
    fontFamily:'Muli-Regular',
    textTransform:"uppercase",
      color:'#acadaa',
      fontSize:14
  },
  activeTab:{
    width:'25%',
    alignItems:'center',
    justifyContent:'center',
    height:'100%',
    borderBottomColor:'#d65a31',
    borderBottomWidth:4,
  },
  activeTabText:{
    fontFamily:'Muli-Regular',
    textTransform:"uppercase",
    color:'#e5e5e5',
    fontSize:14
},
  imageBox: {
    width: 300,
    height: 300,
  },
  loginButton: {
    width: 150,
    height: 50,
    backgroundColor: colors.baseline,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  loginButtonText: {
    color: colors.white,
    fontFamily: 'Muli-Bold',
    fontSize: 14
  }
});
