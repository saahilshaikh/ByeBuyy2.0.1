import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';
import Ioniocns from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';

const {width, height} = Dimensions.get('screen');

export default class PhotoPickerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rphotos: [],
      sphotos: this.props.route.params.images,
      images: this.props.route.params.images,
      max: 5,
    };
  }

  componentDidMount() {
    // this.handleShowGallery();
  }

  hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };
  handleShowGallery = async () => {
    console.log('Ran SG');
    this.setState({
      sphotos: [],
    });
    var per = await this.hasAndroidPermission();
    if (per) {
      CameraRoll.getPhotos({
        first: 10,
        assetType: 'Photos',
        groupTypes: 'All',
      }).then((r) => {
        var i = 0;
        r.edges.map((n) => {
          if (n.node.image.size) {
            var item = {};
            item['uri'] = n.node.image.uri;
            item['file'] = n.node.image;
            item['selected'] = false;
            item['key'] = i;
            this.setState({
              rphotos: [...this.state.rphotos, item],
            });
            i++;
          }
        });
      });
    }
  };

  handleSelect = (e) => {
    var rphotos = this.state.rphotos;
    var sphotos = this.state.sphotos;
    this.state.rphotos.map((r) => {
      if (r.key === e) {
        if (r.selected) {
          r['selected'] = false;
          var newsphotos = [];
          sphotos.map((s) => {
            if (s.key !== e) {
              newsphotos.push(s);
            }
          });
          sphotos = newsphotos;
        } else {
          if (
            this.state.sphotos.length + this.state.images.length <
            this.state.max
          ) {
            r['selected'] = true;
            sphotos.push(r);
          } else {
            console.log('Cannot select more than ' + this.state.max + ' item');
          }
        }
      }
    });
    this.setState({
      rphotos: rphotos,
      sphotos: sphotos,
    });
  };

  handleCamera = () => {
    console.log('Camera Click');
    if (this.state.sphotos.length + this.state.images.length < this.state.max) {
      ImagePicker.openCamera({
        width: 2000,
        height: 2000,
      })
        .then((image) => {
          var i = this.state.images.length + 1;
          var photos = [];
          photos = this.state.images;
          var img = {};
          img['uri'] = image.path;
          img['key'] = i;
          img['file'] = image;
          photos.push(img);
          i++;
          console.log(photos);
          this.setState({
            images: photos,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('Cannot select more than ' + this.state.max + ' item');
    }
  };

  handleGallery = () => {
    console.log('Gallery Click');
    if (this.state.sphotos.length + this.state.images.length < this.state.max) {
      ImagePicker.openPicker({
        width: 2000,
        height: 2000,
        multiple: true,
        mediaType: 'photo',
      })
        .then((items) => {
          console.log(items);
          for (var x = 0; x < items.length; x++) {
            var i = this.state.images.length + 1;
            var photos = [];
            var photos = this.state.images;
            var image = {};
            image['uri'] = items[x].path;
            image['key'] = i;
            image['file'] = items[x];
            photos.push(image);
            console.log(photos);
            this.setState({
              images: photos,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('Cannot select more than ' + this.state.max + ' item');
    }
  };

  handleImage = (e) => {
    console.log('173', e);
    var images = this.state.images;
    var newimages = [];
    images.map((image) => {
      if (image.key !== e) {
        newimages.push(image);
      }
    });
    this.setState({
      images: newimages,
    });
  };

  handleDone = () => {
    // console.log(this.state.images);
    // this.props.handleImages(this.state.images);
    this.props.route.params.handleImages(this.state.images);
    this.props.navigation.pop();
  };

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#15202B" />
        <SafeAreaView style={styles.container}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.pop()}
              style={[styles.actionButton, {backgroundColor: '#e5e5e5'}]}>
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleDone}
              style={[styles.actionButton, {backgroundColor: '#d65a31'}]}>
              <Text style={[styles.actionText, {color: '#e5e5e5'}]}>Done</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.header}>
            Total Photos Selected
            <Text style={styles.selectLength}>
              {' '}
              ({this.state.sphotos.length + this.state.images.length})
            </Text>
          </Text>
          <ScrollView>
            <View style={{width: '100%'}}>
              {this.state.rphotos.length > 0 ? (
                <>
                  <Text style={styles.header}>Recent Photos</Text>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{width: '100%'}}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingHorizontal: 20,
                        marginTop: 15,
                      }}>
                      {this.state.rphotos.map((r) => {
                        if (r.selected) {
                          return (
                            <TouchableOpacity
                              onPress={() => this.handleSelect(r.key)}
                              key={r.key}
                              style={styles.rsphotoView}>
                              <Image
                                source={{uri: r.uri}}
                                style={styles.rphoto}
                              />
                              <View style={styles.shadeView}></View>
                              <Ioniocns
                                name="checkmark-circle"
                                size={26}
                                style={styles.rsicon}
                              />
                            </TouchableOpacity>
                          );
                        } else {
                          return (
                            <TouchableOpacity
                              key={r.key}
                              onPress={() => this.handleSelect(r.key)}
                              style={styles.rphotoView}>
                              <Image
                                source={{uri: r.uri}}
                                style={styles.rphoto}
                              />
                            </TouchableOpacity>
                          );
                        }
                      })}
                    </View>
                  </ScrollView>
                </>
              ) : null}
              <View style={{width: '100%', paddingHorizontal: 20}}>
                <TouchableOpacity
                  onPress={this.handleCamera}
                  style={styles.pickerAction}>
                  <View style={styles.pickericon}>
                    <Ioniocns name="camera-outline" size={22} color="#e5e5e5" />
                  </View>
                  <Text style={styles.pickerText}>Click a photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.handleGallery}
                  style={styles.pickerAction}>
                  <View style={styles.pickericon}>
                    <MaterialIcons
                      name="photo-filter"
                      size={22}
                      color="#e5e5e5"
                    />
                  </View>
                  <Text style={styles.pickerText}>Select from gallery</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={{width: '100%', paddingVertical: 10}}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    paddingHorizontal: 20,
                  }}>
                  {this.state.images.map((image) => {
                    return (
                      <TouchableOpacity
                        key={image.key}
                        onPress={() => this.handleImage(image.key)}
                        style={styles.photoView}>
                        <Image source={{uri: image.uri}} style={styles.photo} />
                        <View style={styles.shadeView}></View>
                        <Ioniocns
                          name="checkmark-circle"
                          size={26}
                          style={styles.rsicon}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#192734',
    width: '100%',
    flex: 1,
    paddingTop: 20,
  },
  selectLength: {
    fontSize: 16,
    color: '#d65a31',
    marginTop: 10,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 20,
    color: '#e5e5e5',
    paddingLeft: 20,
    marginTop: 10,
  },
  rsphotoView: {
    marginHorizontal: 2,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#d65a31',
    borderRadius: 5,
    position: 'relative',
  },
  rsicon: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 26,
    color: '#d65a31',
  },
  shadeView: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(214, 90, 49,0.1)',
  },
  rphotoView: {
    elevation: 5,
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: '#192734',
    borderRadius: 5,
  },
  rphoto: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  actionButton: {
    width: 70,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  actionText: {
    fontSize: 16,
  },
  pickerAction: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginVertical: 5,
    backgroundColor: '#15202B',
    borderRadius: 5,
  },
  pickericon: {
    backgroundColor: '#d65a31',
    padding: 5,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  pickerText: {
    fontSize: 16,
    color: '#e5e5e5',
  },
  photoView: {
    marginHorizontal: 2,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#d65a31',
    borderRadius: 5,
    position: 'relative',
    marginBottom: 5,
  },
  photo: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 5,
  },
});
