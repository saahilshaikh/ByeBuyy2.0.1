import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LoadingScreen from '../screens/loadingScreen';
import LottieView from 'lottie-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Snackbar from 'react-native-snackbar';
import * as Progress from 'react-native-progress';

const {width, height} = Dimensions.get('window');

class DoneDeals extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: true,
      visible: false,
      topic: '',
      rating: 0,
      itemData: [],
      loadRating: false,
    };
  }
  componentDidMount() {
    firestore()
      .collection('users')
      .where('email', '==', auth().currentUser.email)
      .onSnapshot((snap) => {
        this.setState({
          loading: true,
        });
        snap.docChanges().forEach((change) => {
          this.setState({
            data: change.doc.data().done.reverse(),
            loading: false,
          });
        });
      });
  }

  handleRating = (e, r) => {
    console.log(r);
    this.setState({
      topic: e.topic,
      visible: true,
      rating: r,
      itemData: e,
    });
  };

  rate = () => {
    this.setState({
      loadRating: true,
      visible: false,
    });
    console.log(this.state.itemData);
    firestore()
      .collection('users')
      .where('email', '==', auth().currentUser.email)
      .get()
      .then((snap) => {
        var done = [];
        snap.forEach((doc) => {
          done = doc.data().done;
          done.map((item) => {
            item.rating = this.state.rating;
          });
          firestore()
            .collection('users')
            .doc(doc.id)
            .update({
              done: done,
            })
            .then(() => {
              firestore()
                .collection('products')
                .where('owner', '==', this.state.itemData.email)
                .get()
                .then((snap) => {
                  var products = [],
                    topic,
                    x = {};
                  snap.forEach((doc2) => {
                    item = doc2.data();
                    if (item.type === 'exchange') {
                      topic =
                        'Ready to ' +
                        item.type +
                        ' ' +
                        item.what +
                        ' with ' +
                        item.with;
                      if (topic === this.state.itemData.topic) {
                        x['email'] = doc.data().email;
                        x['date'] = new Date();
                        x['rating'] = this.state.rating;
                        if (item.rating.length === 0) {
                          item.rating.push(x);
                        } else {
                          var found = false;
                          item.rating.map((ra) => {
                            if (ra.email == auth().currentUser.email) {
                              ra.rating = this.state.rating;
                              found = true;
                            }
                          });
                          if (found === false) {
                            item.rating.push(x);
                          }
                        }
                        firestore()
                          .collection('products')
                          .doc(doc2.id)
                          .update({
                            rating: item.rating,
                          })
                          .then(() => {
                            this.setState({
                              loadRating: false,
                            });
                            Snackbar.show({
                              text: 'Item review added',
                              duration: Snackbar.LENGTH_SHORT,
                            });
                          });
                      }
                    } else if (item.type === 'share') {
                      topic = 'Ready to ' + item.type + ' ' + item.what;
                      if (topic === this.state.itemData.topic) {
                        x['email'] = doc.data().email;
                        x['date'] = new Date();
                        x['rating'] = this.state.rating;
                        if (item.rating.length === 0) {
                          item.rating.push(x);
                        } else {
                          var found = false;
                          item.rating.map((ra) => {
                            if (ra.email == auth().currentUser.email) {
                              ra.rating = this.state.rating;
                              found = true;
                            }
                          });
                          if (found === false) {
                            item.rating.push(x);
                          }
                        }
                        firestore()
                          .collection('products')
                          .doc(doc2.id)
                          .update({
                            rating: item.rating,
                          })
                          .then(() => {
                            Snackbar.show({
                              text: 'Item review added',
                              duration: Snackbar.LENGTH_SHORT,
                            });
                            this.setState({
                              loadRating: false,
                            });
                          });
                      }
                    }
                  });
                });
            });
        });
      });
  };

  render() {
    return (
      <View style={{width: '100%'}}>
        {this.state.loading ? (
          <View
            style={{
              width: '100%',
              height: height - 200,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Progress.Bar
              progress={0.3}
              width={50}
              height={6}
              color="#d65a31"
              indeterminate={true}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Muli-Bold',
                color: '#d65a31',
                marginTop: 10,
              }}>
              Loading Done Deals
            </Text>
          </View>
        ) : (
          <>
            {this.state.data.length === 0 ? (
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <LottieView
                  source={require('../assets/empty_box.json')}
                  style={{width: 200, height: 200}}
                  autoPlay={true}
                  loop={true}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Muli-Bold',
                    marginTop: 20,
                    color: '#ACADAA',
                  }}>
                  Empty Inventory
                </Text>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  paddingTop: 10,
                  position: 'relative',
                }}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.visible}>
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(110,110,110,0.2)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: '80%',
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        alignItems: 'center',
                        padding: 20,
                      }}>
                      <FontAwesome
                        name="star"
                        style={[styles.star, {fontSize: 50}]}
                      />
                      {this.state.rating > 0 ? (
                        <Text
                          style={{
                            fontSize: 24,
                            color: '#000',
                            fontFamily: 'Muli-Bold',
                            marginTop: 5,
                          }}>
                          {this.state.rating}.0
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#000',
                            fontFamily: 'Muli-Bold',
                            marginTop: 5,
                          }}>
                          Not yet rated
                        </Text>
                      )}
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 16,
                          fontFamily: 'Muli-Bold',
                          color: '#464646',
                          marginTop: 10,
                        }}>
                        {this.state.topic}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 10,
                        }}>
                        {this.state.loadRating ? (
                          <ActivityIndicator size="large" color="#d6531a" />
                        ) : (
                          <View style={{width: '100%', alignItems: 'center'}}>
                            <TouchableOpacity
                              onPress={this.rate}
                              style={{
                                backgroundColor: '#d6531a',
                                width: '100%',
                                marginTop: 20,
                                paddingVertical: 15,
                                borderRadius: 10,
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 16,
                                  fontFamily: 'Muli-Bold',
                                  color: '#fff',
                                }}>
                                Rate
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => this.setState({visible: false})}
                              style={{marginTop: 20}}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 16,
                                  fontFamily: 'Muli-Bold',
                                  color: '#777',
                                }}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </Modal>
                {this.state.data.map((item) => {
                  var star = [],
                    starhalf = [];
                  for (var i = 1; i < item.rating + 1; i++) {
                    star.push(i);
                  }
                  for (var i = 1; i < 5 - item.rating + 1; i++) {
                    starhalf.push(i);
                  }
                  return (
                    <View style={styles.card}>
                      <Text style={styles.topic}>{item.topic}</Text>
                      <View style={styles.stars}>
                        {star.map((star) => {
                          return (
                            <TouchableOpacity
                              onPress={() => this.handleRating(item, star)}>
                              <FontAwesome name="star" style={styles.star} />
                            </TouchableOpacity>
                          );
                        })}
                        {starhalf.map((star) => {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                this.handleRating(item, star + item.rating)
                              }>
                              <FontAwesome name="star-o" style={styles.star} />
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 15,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 3,
    marginBottom: 10,
    height: 100,
    backgroundColor: '#192734',
    elevation: 3,
  },
  topic: {
    width: '90%',
    fontSize: 14,
    color: '#e5e5e5',
    fontFamily: 'Muli-Bold',
  },
  stars: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 10,
  },
  star: {
    marginHorizontal: 2,
    color: '#d65a31',
    fontSize: 30,
  },
});

export default DoneDeals;
