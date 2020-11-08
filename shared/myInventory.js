import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import InventoryCard from './inventoryCard';
import LoadingScreen from '../screens/loadingScreen';
import LottieView from 'lottie-react-native';
import InventoryCardDetails from './inventoryCardDetails';
import Snackbar from 'react-native-snackbar';
import * as Progress from 'react-native-progress';

const {width, height} = Dimensions.get('window');

class MyInventory extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: true,
      showItem: false,
      showData: [],
      actionLoading: false,
      refreshing: false,
    };
  }

  componentDidMount() {
    firestore()
      .collection('products')
      .get()
      .then((snap) => {
        var data = [];
        snap.forEach((doc) => {
          var product = doc.data();
          if (product.owner === auth().currentUser.email) {
            var item = {};
            item = product;
            item['id'] = doc.id;
            console.log('ITEM: ', item);
            data.push(item);
          }
        });
        var sortdata = data.sort((a, b) => b.date.toDate() - a.date.toDate());
        console.log(sortdata);
        this.setState({
          data: sortdata,
          loading: false,
        });
      });
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
      loading: true,
    });
    firestore()
      .collection('products')
      .get()
      .then((snap) => {
        var data = [];
        snap.forEach((doc) => {
          var product = doc.data();
          if (product.owner === auth().currentUser.email) {
            var item = {};
            item = product;
            item['id'] = doc.id;
            console.log('ITEM: ', item);
            data.push(item);
          }
        });
        var sortdata = data.sort((a, b) => b.date.toDate() - a.date.toDate());

        this.setState({
          data: sortdata,
          loading: false,
          refreshing: false,
        });
      });
  };

  handleInventoryCard = (e) => {
    this.setState({
      showItem: true,
      showData: e,
    });
  };

  handleCloseItem = () => {
    this.setState({
      showItem: false,
      showData: [],
      actionLoading: false,
    });
  };

  handleEdit = (e) => {
    console.log(e.id);
    this.props.navigation.navigate('Edit', {
      id: e.id,
      handleCloseItem: () => this.handleCloseItem(),
    });
  };

  handleDelete = async (e) => {
    this.setState({
      actionLoading: true,
    });
    console.log(e);
    await firestore()
      .collection('users')
      .where('email', '==', auth().currentUser.email)
      .get()
      .then((snap) => {
        var chats;
        snap.forEach(async (doc) => {
          chats = doc.data().chats;
          var i = 0,
            j = 0;
          var removeIndex2;
          var topic = '';
          if (e.type === 'exchange') {
            topic = 'Ready to exchange ' + e.what + ' with ' + e.with;
          } else {
            topic = 'Ready to share ' + e.what;
          }
          await this.handleDeleteProductData(e.id);
          e.images.map(async (image) => {
            await this.handleStorageDelete(i + 1, topic, e.images[i].type);
          });
          chats.map((chat) => {
            if (chat.topic === topic) {
              console.log('FOUND');
              removeIndex2 = j;
              chat.members.map(async (mem) => {
                await firestore()
                  .collection('users')
                  .where('email', '==', mem.email)
                  .get()
                  .then((snap) => {
                    snap.forEach((docmem) => {
                      var memchats = docmem.data().chats;
                      var m = 0,
                        memremove;
                      memchats.map((t) => {
                        if (t.topic === topic && t.post === false) {
                          memremove = m;
                        }
                        m++;
                      });
                      memchats.splice(memremove, 1);
                      firestore().collection('users').doc(docmem.id).update({
                        chats: memchats,
                      });
                    });
                  });
              });
            }
            j++;
          });
          chats.splice(removeIndex2, 1);

          firestore()
            .collection('users')
            .doc(doc.id)
            .update({
              chats: chats,
            })
            .then(() => {
              this.handleCloseItem();
              Snackbar.show({
                text: 'Product removed successfully',
                duration: Snackbar.LENGTH_SHORT,
              });
            });
        });
      });
  };

  handleDeleteProductData = async (e) => {
    firestore()
      .collection('products')
      .doc(e)
      .delete()
      .then(() => {
        console.log('DELETED DOCUMENT SUCCESSFULLY');
      });
  };

  handleStorageDelete = async (e, topic, type) => {
    console.log(e);
    console.log(topic);
    var storageRef = storage().ref(
      `users/${auth().currentUser.email}/products/${topic}/${e}`,
    );
    await storageRef
      .delete()
      .then(() => {
        console.log('SUC DEL');
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          actionLoading: true,
        });
        Snackbar.show({
          text: 'Error',
          duration: Snackbar.LENGTH_SHORT,
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
                color: '#e5e5e5',
                marginTop: 10,
              }}>
              Getting Your Inventory
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{width: '100%'}}
            indicatorStyle="white"
            refreshControl={
              <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={this.handleRefresh}
                tintColor={['#d65a31']}
                progressBackgroundColor="#e5e5e5"
                colors={['#d65a31']}
              />
            }>
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
                style={{width: '100%', alignItems: 'center', paddingTop: 10}}>
                {this.state.showItem ? (
                  <InventoryCardDetails
                    item={this.state.showData}
                    handleCloseItem={this.handleCloseItem}
                    handleEdit={(e) => this.handleEdit(e)}
                    handleDelete={(e) => this.handleDelete(e)}
                    loading={this.state.actionLoading}
                  />
                ) : (
                  <>
                    {this.state.data.map((item) => {
                      return (
                        <InventoryCard
                          item={item}
                          handleInventoryCard={(e) =>
                            this.handleInventoryCard(e)
                          }
                        />
                      );
                    })}
                  </>
                )}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default MyInventory;
