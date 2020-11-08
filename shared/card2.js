import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Share
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import Moment from 'react-moment';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Snackbar from 'react-native-snackbar';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';
import Fontisto from 'react-native-vector-icons/Fontisto';

const { width, height } = Dimensions.get('window');

export default class Card2 extends React.Component {
  constructor() {
    super();
    this.state = {
      product: [],
      owner: [],
      loadingProduct: true,
      loadingOwner: true,
      isModalVisible: false,
      NF: false,
      reportForm: false,
      reportSuccess: false,
      like: false,
      save: false
    }
  }

  async componentDidMount() {
    const cardValue = await AsyncStorage.getItem(this.props.item._id+'product');
    const cardValue2 = await AsyncStorage.getItem(this.props.item._id+'owner');
    if(cardValue!==null && cardValue2!==null)
    {
        console.log('Card2 local found');
        var product=JSON.parse(cardValue);
            if(product.varient==='Request')
            {
                this.setState({
                    product: product,
                    owner: JSON.parse(cardValue2),
                    loadingProduct: false,
                    loadingOwner: false,
                    NF: false
                })
                this.handleInit();
            }
            else{
                this.setState({
                    product: [],
                    owner: [],
                    loadingProduct: false,
                    loadingOwner: false,
                    NF: true
                  })
            }
    }
    else{
        console.log('Card2 local not found');
        this.handleInit();
    }
  }

  componentWillUnmount(){
    this.setState = (state,callback)=>{
      return;
  };
  }

  handleInit = async () => {
    if (this.props.item._id) {
      var data = {
        id: this.props.item._id
      }
      var res = await axios.post(link + '/api/product/single', data);
      if(res.data!==null)
      {
        if(res.data.varient)
        {
          var data2 = {
            id: res.data.owner
          }
          var res2 = await axios.post(link + '/api/user/single', data2);
          var owner = res2.data;
          owner.id = owner._id;
          var product = res.data;
          product.id = product._id;
          if(this.props.location && this.props.location.lat!=='')
                {
                    const d = this.handleDistance(product.lat, product.long, this.props.location.lat, this.props.location.long);
                    product.distance=d;
                }
          if (res2.data !== null) {
            this.storeData(this.props.item._id+'product',product);
                this.storeData(this.props.item._id+'owner',owner);
            this.setState({
              product: product,
              owner: owner,
              loadingProduct: false,
              loadingOwner: false,
              NF: false
            })
          }
          if (auth().currentUser) {
              var data3 = {
                id: auth().currentUser.email
              }
              var res3 = await axios.post(link + '/api/user/single', data3);
              if (res3.data !== null) {
                var currentUser = res3.data;
                currentUser.id = currentUser._id;
                this.setState({
                  currentUser: currentUser,
                  like: product.likes.includes(auth().currentUser.email),
                  save: product.saves.includes(auth().currentUser.email)
              })
            }
          }
        }
        else{
          this.setState({
            product: [],
            owner: [],
            loadingProduct: false,
            loadingOwner: false,
            NF: true
          })
        }
      }
      else {
        this.setState({
          product: [],
          owner: [],
          loadingProduct: false,
          loadingOwner: false,
          NF: true
        })
      }
  }
    else {
      this.setState({
        product: [],
        owner: [],
        loadingProduct: false,
        loadingOwner: false,
        NF: true
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

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  handleDistance = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

  handleLike = async () => {
    var addLike = false;
    if (auth().currentUser) {
        this.setState({
            like: !this.state.like
        })
        var data = {
            id: this.state.product.id,
            email: auth().currentUser.email,
            type: this.state.product.varient
        }
        var res = await axios.post(link + '/api/product/toggleLike', data);
        console.log(res.data);
        if(res.data!==null)
        {
            if(res.data.type==='success')
            {
                if(this.state.like)
                {
                    this.sendLikeActivity();
                    this.sendLikedPushNotification('Request',this.state.product.id);
                }
            }
        }
    }
    else {
        this.props.navigation.navigate('Login');
    }
};

sendLikeActivity=async()=>{
    var data={
        id:this.state.product.id,
        action:'Like',
        type:'Request',
        email1:this.state.owner.email,
        email2:this.state.currentUser.email
    }
    var res=await axios.post(link+'/api/notifications/add',data)
    if(res.data!==null)
    {
        console.log(res.data);
    }
}


  handleShare = (e) => {
    console.log("110", e);
    const result = Share.share({
      message: 'https://www.byebuyy.com/viewRequest/' + e,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
        console.log(result);
      } else {
        // shared
        console.log(result);
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
      console.log(result);
    }
  };

  handleSave = async () => {
    var addLike = false;
    if (auth().currentUser) {
      this.setState({
        save: !this.state.save
      })
      var data = {
        id: this.state.product.id,
        email: auth().currentUser.email,
        type: this.state.product.varient
      }
      var res = await axios.post(link + '/api/product/toggleSave', data);
      console.log(res.data);
    }
    else {
      this.props.navigation.navigate('Login');
    }
  };

  handleMenu = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  handleRemovePost = async () => {
    this.setState({
      NF: true
    })
    const data = {
      id: this.state.product.id,
      email: auth().currentUser.email
    }
    var res = await axios.post(link + '/api/product/delete', data);
    if (res.data.type === 'success') {
      Snackbar.show({
        text: 'Post removed!',
        duration: Snackbar.LENGTH_SHORT
      })
    }
    else {
      Snackbar.show({
        text: res.data.error,
        duration: Snackbar.LENGTH_SHORT
      })
    }
  }

  sendLikedPushNotification = async (e, f) => {
    const FIREBASE_API_KEY = "AAAA-x7BxpY:APA91bGm_UWNpbo0o6aOfVkEaIqRLZAhdh0oCjs-RCxA2qsrYy3LjTzSRzVeoBycvhXT2w2qRZEL2e7nmKa3-kgBRCfUZEyffWlpU8fhOhwaELLC0RpNvUtM6GAdcdC8jhhfaWxq6req";
    console.log(this.state.token);
    const message = {
        registration_ids: [
            this.state.owner.pushToken,
        ],
        notification: {
            title: this.state.currentUser.name + " liked your request",
            body: "",
            vibrate: 1,
            sound: 1,
            show_in_foreground: true,
            priority: "high",
            content_available: true,
        },
        data: {
            type: e,
            id: f,
            date: new Date()
        },
    }
    var body = JSON.stringify(message);
    let headers = new Headers({
        "Content-Type": "application/json",
        Authorization: "key=" + FIREBASE_API_KEY,
    })

    let response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers,
        body: body,
    })
    re = response.json();
    console.log("174", re);
}

  handleReport = (e) => {
    console.log(e);
    this.setState({
      reportForm: false,
      reportSuccess: true
    });
    setTimeout(() => {
      this.setState({
        reportSuccess: false
      });
    }, 1500);
    if (!this.state.currentUser.reports.includes(this.state.product.id)) {
      firestore().collection('testusers').doc(this.state.currentUser.id).get().then(user => {
        var reports = user.data().reports;
        var report = {
          category: e,
          id: this.state.product.id,
          date: new Date()
        }
        reports.push(report);
        firestore().collection('testusers').doc(this.state.currentUser.id).update({
          reports: reports
        })
          .then(() => {
            firestore().collection('testproducts').doc(this.state.product.id).get().then(product => {
              var reports = product.data().reports;
              var report = {
                category: e,
                email: this.state.currentUser.email,
                date: new Date()
              }
              reports.push(report);
              firestore().collection('testproducts').doc(this.state.product.id).update({
                reports: reports
              })
            })
          })
      })
    }
    else {
      Snackbar.show({
        text: 'Already reported',
        duration: Snackbar.LENGTH_SHORT
      })
    }
  }


  render() {
    return (
      <>
        <View style={{ width: '100%', alignItems: 'center' }}>
          {
            !this.state.loadingProduct && !this.state.loadingOwner
              ?
              <>
                {
                  this.state.NF === false
                    ?
                    <View
                      style={{ width: '100%', alignItems: 'center' }}>
                      <View style={styles.item}>
                        <View style={styles.top}>
                          {
                            !this.state.loadingOwner
                              ?
                              <View style={styles.profile}>
                                <TouchableOpacity onPress={() => this.props.navigation.push('viewProfile', { id: this.state.owner.id,location:this.props.location  })} style={styles.profileBox} >
                                  {
                                    this.state.owner.photo
                                      ?
                                      <Image
                                        source={{ uri: this.state.owner.photo }}
                                        style={styles.profileImage}
                                      />
                                      :
                                      <View style={styles.profileImageBox}>
                                        <Text style={styles.imageText}>{this.state.owner.name.charAt(0).toUpperCase()}</Text>
                                      </View>
                                  }
                                  {this.state.owner.active & this.state.owner.logout === false ? <View style={styles.active}></View> : null}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.push('viewProfile', { id: this.state.owner.id,location:this.props.location  })} style={{ marginLeft: 5 }}>
                                  <Text style={styles.profileName}>{this.state.owner.name}</Text>
                                  {this.state.owner.uname?<Text style={styles.profileUName}>@{this.state.owner.uname}</Text>:null}
                                  <Text style={styles.time}>{this.state.product.date ? <Moment element={Text} fromNow>
                                    {this.state.product.date}
                                  </Moment> : null}</Text>
                                </TouchableOpacity>
                              </View>
                              :
                              <View style={{
                                width: '100%',
                                padding: 5,
                                alignItems: 'center',
                                backgroundColor: colors.primary,
                                justifyContent: 'space-between',
                                elevation: 3,
                                borderTopColor: colors.grey,
                                borderBottomColor: colors.grey,
                              }}>
                                <SkeletonContent
                                  containerStyle={{ width: "100%" }}
                                  boneColor={colors.primary}
                                  highlightColor={colors.darkText}
                                  isLoading={true}
                                  layout={[
                                    {
                                      flexDirection: 'row',
                                      marginTop: 10,
                                      alignItems: 'center',
                                      children: [
                                        {
                                          width: 50,
                                          height: 50,
                                          marginRight: 10,
                                          borderRadius: 25
                                        },
                                        {
                                          width: 150,
                                          height: 20,
                                        },
                                      ]
                                    },
                                  ]}
                                >
                                </SkeletonContent>
                              </View>
                          }
                          {
                              auth().currentUser
                              ?
                              <TouchableOpacity
                                  style={{
                                      width: 40,
                                      height: 40,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      borderRadius: 10,
                                  }}
                                  onPress={this.handleMenu}>
                                  <Ionicons
                                      name="ios-ellipsis-horizontal-outline"
                                      size={22}
                                      color={colors.grey}
                                  />
                              </TouchableOpacity>
                              :
                              null
                          }
                        </View>
                        <View style={styles.middle}>
                          <Text style={styles.type}>{this.state.product.type}, {this.state.product.category}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{uri:'https://www.countryflags.io/' +this.state.product.code +'/flat/64.png'}} style={{width:20,height:15,marginRight:5}} />
                            <Text style={styles.location}>{this.state.product.city + ", " + this.state.product.country}</Text>
                            {
                                                                this.state.product.distance
                                                                ?
                                                                <>
                                                                {
                                                                auth().currentUser
                                                                ?
                                                                <>
                                                                {
                                                                    this.state.product.owner!==auth().currentUser.email
                                                                    ?
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' ,marginLeft:5}}>
                                                                    <Ionicons name='ios-navigate' color={colors.baseline} size={14} style={{marginRight:5}}/>
                                                                    <Text style={styles.location}>{this.state.product.distance>1?(Math.round(this.state.product.distance)+' km'):((this.state.product.distance*1000).toFixed(2)+ ' m')}</Text>
                                                                    </View>
                                                                    :
                                                                    null
                                                                }
                                                                </>
                                                                :
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' ,marginLeft:5}}>
                                                                    <Ionicons name='ios-navigate' color={colors.baseline} size={14} style={{marginRight:5}}/>
                                                                    <Text style={styles.location}>{this.state.product.distance>1?(Math.round(this.state.product.distance)+' km'):((this.state.product.distance*1000).toFixed(2)+ ' m')}</Text>
                                                                </View>
                                                            }
                                                                </>
                                                                :
                                                                null
                                                            }
                          </View>
                          <Text style={styles.title}>{this.state.product.description}</Text>
                        </View>
                        <View style={styles.bottom}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                              onPress={this.handleLike}
                              style={{ flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'center' }}>
                              {
                                this.state.like
                                  ?
                                  <AntDesign
                                    name="like1"
                                    size={28}
                                    color={colors.baseline}
                                    style={{ marginRight: 7 }}
                                  />
                                  :
                                  <AntDesign
                                    name="like2"
                                    size={28}
                                    color={colors.grey}
                                    style={{ marginRight: 7 }}
                                  />
                              }
                              {
                                this.state.product.likes.length > 0
                                  ?
                                  <Text style={{ fontSize: 16, color: colors.grey }}>{this.state.product.likes.length > 1000 ? (this.state.product.likes.length / 1000) + "K" : this.state.product.likes.length}</Text>
                                  :
                                  null
                              }
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => this.props.navigation.navigate('viewComment', { id: this.state.product.id })}
                              style={{ flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'center' }}>
                              <Ionicons
                                name="ios-chatbubble-outline"
                                size={28}
                                color={colors.grey}
                                style={{ marginHorizontal: 7 }}
                              />
                              {
                                this.state.product.comments.length > 0
                                  ?
                                  <Text style={{ fontSize: 16, color: colors.grey }}>{this.state.product.comments.length > 1000 ? (this.state.product.comments.length / 1000) + "K" : this.state.product.comments.length}</Text>
                                  :
                                  null
                              }
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => this.handleShare(this.state.product.id)}
                            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons
                              name="ios-share-social-outline"
                              size={26}
                              color={colors.grey}
                              style={{ marginHorizontal: 5 }}
                            />
                          </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>

                    :
                    null
                }
              </>
              :
              <View style={{
                width: '95%',
                padding: 15,
                alignItems: 'center',
                backgroundColor: '#1B1F22',
                justifyContent: 'space-between',
                elevation: 3,
                borderWidth: 1,
                borderColor: colors.darkText,
                borderRadius: 10,
                marginBottom: 10
              }}>
                <SkeletonContent
                  containerStyle={{ width: "100%" }}
                  boneColor={colors.primary}
                  highlightColor={colors.darkText}
                  isLoading={true}
                  layout={[
                    {
                      flexDirection: 'row',
                      marginTop: 10,
                      alignItems: 'center',
                      children: [
                        {
                          width: 50,
                          height: 50,
                          marginRight: 10,
                          borderRadius: 25
                        },
                        {
                          width: 150,
                          height: 20,
                        },
                      ]
                    },
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                      children: [
                        {
                          width: 80,
                          height: 30,
                        },
                        {
                          width: 80,
                          height: 30,
                        },
                      ]
                    },
                  ]}
                >
                </SkeletonContent>
              </View>
          }
        </View>
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
                                backgroundColor: colors.secondary,
                                borderRadius: 10,
                                alignItems: 'center',
                            }}>
                            <View style={{ width: '100%' }}>
                                {
                                    auth().currentUser
                                        ?
                                        <>
                                            {
                                                auth().currentUser && this.state.product.owner === auth().currentUser.email
                                                    ?
                                                    null
                                                    :
                                                    <TouchableOpacity
                                                        onPress={() => this.setState({
                                                            reportForm: true,
                                                            isModalVisible: false
                                                        })}
                                                        style={{
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            paddingVertical: 15,
                                                            justifyContent: 'center',
                                                            borderBottomColor: colors.grey,
                                                            borderBottomWidth: StyleSheet.hairlineWidth
                                                        }}>
                                                        <Ionicons name='ios-flag' size={22} color={colors.grey} style={{marginRight:20}}/>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'Muli-Bold',
                                                                color: colors.white,
                                                                fontSize: 14,
                                                                width:60,
                                                            }}>
                                                            Report
                                                        </Text>
                                                    </TouchableOpacity>
                                            }
                                        </>
                                        :
                                        null
                                }
                                {
                                    auth().currentUser
                                        ?
                                        <TouchableOpacity
                                            onPress={() => this.setState({
                                                isModalVisible: false
                                            }, () => {
                                                this.handleSave();
                                            })}
                                            style={{
                                                width: '100%',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                paddingVertical: 15,
                                                justifyContent: 'center',
                                                borderBottomColor: colors.grey,
                                                borderBottomWidth: auth().currentUser.email===this.state.product.owner?StyleSheet.hairlineWidth:0
                                            }}>
                                            <Fontisto name='bookmark-alt' size={22} color={colors.grey} style={{marginRight:20}}/>
                                            <Text
                                                style={{
                                                    fontFamily: 'Muli-Bold',
                                                    color: colors.white,
                                                    fontSize: 14,
                                                    width:60
                                                }}>
                                                {this.state.save ? 'Unsave' : 'Save'}
                                            </Text>
                                        </TouchableOpacity>
                                        :
                                        null
                                }
                                {
                                    auth().currentUser
                                        ?
                                        <>
                                            {
                                                auth().currentUser && this.state.product.owner === auth().currentUser.email
                                                    ?
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                isModalVisible: false
                                                            });
                                                            this.props.navigation.navigate('EditRequest', {  id: this.state.product.id})
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            paddingVertical: 15,
                                                            justifyContent: 'center',
                                                            borderBottomColor:colors.grey,
                                                            borderBottomWidth: StyleSheet.hairlineWidth
                                                        }}>
                                                        <Ionicons name='ios-brush' size={22} color={colors.grey} style={{marginRight:20}}/>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'Muli-Bold',
                                                                color: colors.white,
                                                                fontSize: 14,
                                                                width:60
                                                            }}>
                                                            Edit
                                                        </Text>
                                                    </TouchableOpacity>
                                                    :
                                                    null
                                            }
                                        </>
                                        :
                                        null
                                }
                                {
                                    auth().currentUser
                                        ?
                                        <>
                                            {
                                                auth().currentUser && this.state.product.owner === auth().currentUser.email
                                                    ?
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                isModalVisible: false
                                                            });
                                                            this.handleRemovePost(this.props.item.id);
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            paddingVertical: 15,
                                                            justifyContent: 'center',
                                                        }}>
                                                        <Ionicons name='ios-trash' size={22} color={colors.grey} style={{marginRight:20}}/>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'Muli-Bold',
                                                                color: colors.white,
                                                                fontSize: 14,
                                                                width:60
                                                            }}>
                                                            Remove
                                                        </Text>
                                                    </TouchableOpacity>
                                                    :
                                                    null
                                            }
                                        </>
                                        :
                                        null
                                }
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
        <Modal isVisible={this.state.reportForm}>
          <TouchableOpacity
            onPress={() => this.setState({
                  reportForm: false
                })}
            style={{
              alignItems: 'center',
              width:'100%',
              flex:1,
              justifyContent:'center'
            }}>
            <View
              style={{
                width: '90%',
                backgroundColor: colors.primary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <View style={{ width: '100%', paddingHorizontal: 15, paddingVertical: 10 }}>
                <TouchableOpacity onPress={() => this.handleReport("Nudity or sexual activity")} style={styles.reportButton}>
                  <Text style={styles.reportText}>Nudity or sexual activity</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleReport("Hate speech or symbols")} style={styles.reportButton}>
                  <Text style={styles.reportText}>Hate speech or symbols</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleReport("Violence or dangerous")} style={styles.reportButton}>
                  <Text style={styles.reportText}>Violence or dangerous</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleReport("Sale of illegal or regulated goods")} style={styles.reportButton}>
                  <Text style={styles.reportText}>Sale of illegal or regulated goods</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleReport("Bullying or harassment")} style={styles.reportButton}>
                  <Text style={styles.reportText}>Bullying or harassment</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleReport("Intellectual property violation")} style={styles.reportButton}>
                  <Text style={styles.reportText}>Intellectual property violation</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleReport("Suicide, self-injury or easting disorders")} style={styles.reportButton}>
                  <Text style={styles.reportText}>Suicide, self-injury or easting disorders</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleReport("Scam or fraud")} style={styles.reportButton}>
                  <Text style={styles.reportText}>Scam or fraud</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleReport("False infromation")} style={styles.reportButton}>
                  <Text style={styles.reportText}>False information</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal isVisible={this.state.reportSuccess}>
          <View
            style={{
              alignItems: 'center',
              width:'100%',
              flex:1,
              justifyContent:'center'
            }}>
            <View
              style={{
                width: '60%',
                backgroundColor: colors.primary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <View style={{ width: '100%', alignItems: 'center', borderBottomColor: colors.grey, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 10 }}>
                <Text style={styles.reportheader}>Reported</Text>
              </View>
              <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={{ width: 80, height: 80 }}>
                  <LottieView
                    source={require('../assets/433-checked-done.json')}
                    autoPlay={true}
                    loop={false}
                    style={{ transform: [{ scale: 1.5 }] }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    width: '95%',
    alignItems: 'center',
    backgroundColor:'#1B1F22',
    justifyContent: 'space-between',
    // borderColor: colors.darkText,
    // borderWidth: 1,
    elevation: 3,
    borderRadius: 10,
    marginBottom: 10
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.active,
    bottom: 0,
    right: 0,
    borderWidth: 1.5,
    borderColor: colors.white
  },
  profileImageBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.grey,
    borderWidth: StyleSheet.hairlineWidth
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: colors.grey,
    borderWidth: StyleSheet.hairlineWidth
  },
  imageText: {
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    color: colors.darkText
  },
  profileName: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
  },
  profileUName: {
    color: colors.grey,
    fontSize: 12,
    fontFamily: 'Muli-Bold',
  },
  time: {
    color: colors.grey,
    fontSize: 10,
    fontFamily: 'Muli-Regular',
  },
  middle: {
    width: '100%',
    marginBottom: 10,
  },
  type: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    textTransform: "capitalize"
  },
  location: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'Muli-Regular',
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Muli-Bold',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  reportheader: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  reportButton: {
    marginVertical: 5,
    width: '100%',
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5
  },
  reportText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: 'Muli-Bold',
  }
});
