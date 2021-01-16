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

import Ioniocns from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../appTheme';

const { width, height } = Dimensions.get('screen');

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

  componentDidMount() { }

  hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
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
        freeStyleCropEnabled: true,
        cropping: true,
        compressImageQuality: 0.8,
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
        freeStyleCropEnabled: true,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
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
    this.props.route.params.handleImages(this.state.images);
    this.props.navigation.pop();
  };

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
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
              style={[styles.actionButton, { backgroundColor: '#e5e5e5' }]}>
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleDone}
              style={[styles.actionButton, { backgroundColor: '#d65a31' }]}>
              <Text style={[styles.actionText, { color: '#e5e5e5' }]}>Done</Text>
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
            <View style={{ width: '100%' }}>
              {this.state.rphotos.length > 0 ? (
                <>
                  <Text style={styles.header}>Recent Photos</Text>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ width: '100%' }}>
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
                                source={{ uri: r.uri }}
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
                                source={{ uri: r.uri }}
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
              <View style={{ width: '100%', paddingHorizontal: 20 }}>
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
              <ScrollView style={{ width: '100%', paddingVertical: 10 }}>
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
                        <Image source={{ uri: image.uri }} style={styles.photo} />
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
    backgroundColor: colors.primary,
    width: '100%',
    flex: 1,
    paddingTop: 20,
  },
  selectLength: {
    fontSize: 16,
    color: colors.baseline,
    marginTop: 10,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 20,
    color: colors.white,
    paddingLeft: 20,
    marginTop: 10,
  },
  rsphotoView: {
    marginHorizontal: 2,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.baseline,
    borderRadius: 5,
    position: 'relative',
  },
  rsicon: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 26,
    color: colors.baseline,
  },
  shadeView: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: colors.baselineDull,
  },
  rphotoView: {
    elevation: 5,
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: colors.primary2,
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
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  pickericon: {
    backgroundColor: colors.baseline,
    padding: 5,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  pickerText: {
    fontSize: 16,
    color: colors.darkText,
  },
  photoView: {
    marginHorizontal: 2,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.baseline,
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
