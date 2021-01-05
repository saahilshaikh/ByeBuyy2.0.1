import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'react-moment';
import NetworkImage from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import MiniCard from './mincard';
import MiniCard2 from './minicard2';
import colors from '../appTheme';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';

const {width, height} = Dimensions.get('window');

class Message extends React.Component {
  constructor() {
    super();
    this.state = {
      menu: false,
      menu2: false,
    };
  }

  render() {
    return (
      <>
        <View
          style={{
            width: '100%',
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: this.props.type ? 'flex-end' : 'flex-start',
          }}>
          <View
            style={{
              flexDirection: this.props.type ? 'row' : 'row-reverse',
              alignItems: 'center',
              marginRight: 5,
              maxWidth: '90%',
            }}>
            <TouchableOpacity
              onLongPress={() => {
                this.setState({
                  menu: true,
                });
              }}
              style={{
                borderRadius: 5,
                backgroundColor: this.props.type
                  ? colors.secondary
                  : colors.white,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderBottomRightRadius: this.props.type ? 0 : 5,
                borderBottomLeftRadius: this.props.type ? 5 : 0,
              }}>
              {this.props.format === 'attach-video' ||
              this.props.format === 'attach-doc' ||
              this.props.format === 'attach-photo' ? null : (
                <Text
                  selectable={true}
                  style={{
                    fontSize: 16,
                    marginBottom: 5,
                    fontFamily: 'Muli-Regular',
                    color: this.props.type ? colors.white : colors.darkText,
                  }}>
                  {this.props.message}
                </Text>
              )}
              {this.props.format === 'post-product' ? (
                <View style={styles.post}>
                  <MiniCard
                    location={this.props.location}
                    id={this.props.url}
                    navigation={this.props.navigation}
                  />
                </View>
              ) : null}
              {this.props.format === 'post-request' ? (
                <View style={styles.post}>
                  <MiniCard2
                    location={this.props.location}
                    id={this.props.url}
                    navigation={this.props.navigation}
                  />
                </View>
              ) : null}
              {this.props.format === 'attach-photo' ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.handleDocumentView(
                      this.props.url,
                      this.props.format,
                    )
                  }
                  style={{
                    width: 200,
                    maxHeight: 200,
                    marginBottom: 10,
                    marginTop: 5,
                  }}>
                  <Image
                    source={{uri: this.props.url}}
                    style={{width: '100%', height: '100%', borderRadius: 3}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : null}
              {this.props.format === 'attach-doc' ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.handleDocumentView(
                      this.props.url,
                      this.props.format,
                    )
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: colors.white,
                    borderRadius: 5,
                    marginBottom: 10,
                    marginTop: 5,
                  }}>
                  <Ionicons
                    name="document-text"
                    size={24}
                    color={colors.darkText}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Muli-Regular',
                      color: colors.darkText,
                      marginLeft: 5,
                    }}>
                    {this.props.name}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {this.props.format === 'attach-video' ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.handleDocumentView(
                      this.props.url,
                      this.props.format,
                    )
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                    backgroundColor: colors.white,
                    borderRadius: 5,
                    marginBottom: 10,
                    marginTop: 5,
                  }}>
                  <Ionicons
                    name="ios-videocam"
                    size={24}
                    color={colors.darkText}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Muli-Regular',
                      color: colors.darkText,
                      marginLeft: 5,
                    }}>
                    {this.props.name}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {this.props.format === 'attach-video' ||
              this.props.format === 'attach-doc' ||
              this.props.format === 'attach-photo' ? (
                <TouchableOpacity
                  style={styles.down}
                  onPress={() => {
                    if (this.props.format === 'attach-photo') {
                      this.props.saveToGallery(this.props.url, '.jpeg');
                    } else if (this.props.format === 'attach-video') {
                      this.props.saveToGallery(this.props.url, this.props.name);
                    } else if (this.props.format === 'attach-doc') {
                      this.props.saveToGallery(this.props.url, this.props.name);
                    }
                  }}>
                  <Ionicons
                    name="download-outline"
                    size={20}
                    style={{
                      color: colors.white,
                      transform: [{translateX: 1}, {translateY: -1}],
                    }}
                  />
                </TouchableOpacity>
              ) : null}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {this.props.loading ? (
                  <Progress.Pie
                    progress={this.props.progress / 100}
                    size={15}
                    color="#d65a31"
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Muli-Regular',
                      color: this.props.type ? colors.white : colors.secondary,
                    }}>
                    <Moment element={Text} format="MMMM Do YYYY, h:mm a">
                      {this.props.date}
                    </Moment>
                  </Text>
                )}
                <>
                  {this.props.read ? (
                    <>
                      {this.props.read === true ? (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="#d65a31"
                          style={{marginLeft: 5}}
                        />
                      ) : (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={colors.grey}
                          style={{marginLeft: 5}}
                        />
                      )}
                    </>
                  ) : null}
                </>
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: 10,
                height: '100%',
                position: 'relative',
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  width: 10,
                  height: '100%',
                  backgroundColor: this.props.type
                    ? colors.secondary
                    : colors.white,
                }}></View>
              <View
                style={{
                  width: 10,
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundColor: colors.primary,
                  borderBottomLeftRadius: this.props.type ? 10 : 0,
                  borderBottomRightRadius: this.props.type ? 0 : 10,
                }}></View>
            </View>
          </View>
        </View>
        <Modal isVisible={this.state.menu}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                menu: false,
              });
            }}
            style={{
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              flex: 1,
            }}>
            <View
              style={{
                width: '80%',
                backgroundColor: colors.secondary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState(
                    {
                      menu: false,
                    },
                    () => {
                      if (this.props.format === 'message') {
                        this.props.copyText(this.props.message);
                      } else {
                        this.props.copyText(this.props.url);
                      }
                    },
                  );
                }}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 15,
                  justifyContent: 'center',
                  borderBottomColor: colors.grey,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}>
                <Text
                  style={{
                    fontFamily: 'Muli-Bold',
                    color: colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  Copy message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    menu: false,
                    menu2: true,
                  });
                }}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 20,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Muli-Bold',
                    color: colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  Clear message
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal isVisible={this.state.menu2}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                menu2: false,
              });
            }}
            style={{
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              flex: 1,
            }}>
            <View
              style={{
                width: '80%',
                backgroundColor: colors.secondary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState(
                    {
                      menu2: false,
                    },
                    () => {
                      this.props.handleHide(this.props.item._id);
                    },
                  );
                }}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 20,
                  justifyContent: 'center',
                  borderBottomColor: colors.grey,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}>
                <Text
                  style={{
                    fontFamily: 'Muli-Bold',
                    color: colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  Yes, clear message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    menu2: false,
                  });
                }}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 20,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Muli-Bold',
                    color: colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  No, dont clear message
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  post: {
    width: width * 0.75,
  },
  down: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 5,
    backgroundColor: '#d65431',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Message;
