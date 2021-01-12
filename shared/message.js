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
import Hyperlink from 'react-native-hyperlink';

const {width, height} = Dimensions.get('window');

class Message extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  handleHighlight = (e) => {
    this.props.showMessageMenu(e);
  };

  render() {
    return (
      <>
        <TouchableOpacity
          onPress={() => this.handleHighlight({})}
          onLongPress={() => this.handleHighlight(this.props.data)}
          style={{
            width: '100%',
            marginVertical: 2,
            flexDirection: 'row',
            justifyContent: this.props.type ? 'flex-end' : 'flex-start',
            position: 'relative',
          }}>
          <TouchableOpacity
            onLongPress={() => this.handleHighlight(this.props.data)}
            style={{
              flexDirection: this.props.type ? 'row' : 'row-reverse',
              alignItems: 'center',
              marginVertical: 2,
            }}>
            <View
              style={{
                borderRadius: 5,
                backgroundColor: this.props.type
                  ? colors.secondary
                  : colors.white,
                padding: 8,
                borderBottomRightRadius: this.props.type ? 0 : 5,
                borderBottomLeftRadius: this.props.type ? 5 : 0,
                maxWidth: 340,
              }}>
              {this.props.format === 'attach-video' ||
              this.props.format === 'attach-doc' ||
              this.props.format === 'attach-photo' ? null : (
                <Hyperlink linkStyle={{color: '#2980b9'}} linkDefault={true}>
                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 5,
                      fontFamily: 'Muli-Regular',
                      color: this.props.type ? colors.white : colors.darkText,
                    }}>
                    {this.props.message}
                  </Text>
                </Hyperlink>
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
                  onLongPress={() => this.handleHighlight(this.props.data)}
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
                  onLongPress={() => this.handleHighlight(this.props.data)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: '#d5d5d5',
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
                  onLongPress={() => this.handleHighlight(this.props.data)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                    backgroundColor: '#d5d5d5',
                    borderRadius: 5,
                    marginBottom: 10,
                    marginTop: 5,
                    width: 250,
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
                      marginLeft: 10,
                      width: '85%',
                    }}>
                    {this.props.name}
                  </Text>
                </TouchableOpacity>
              ) : null}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {this.props.loading ? (
                  <Progress.Circle
                    progress={this.props.progress / 100}
                    size={15}
                    color="#d65a31"
                    borderWidth={0}
                    thickness={2}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Muli-Regular',
                      color: this.props.type ? colors.white : colors.secondary,
                    }}>
                    <Moment element={Text} format="DD-MM-YYYY, h:mm a">
                      {this.props.date}
                    </Moment>
                  </Text>
                )}
                {this.props.type ? (
                  <>
                    {this.props.read === true ? (
                      <Ionicons
                        name="ios-checkmark-done"
                        size={16}
                        color={colors.grey}
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
              </View>
            </View>
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
          </TouchableOpacity>
          {this.props.highlight &&
          this.props.highlight._id === this.props.data._id ? (
            <View style={styles.highlight}></View>
          ) : null}
        </TouchableOpacity>
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
  highlight: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#d6543040',
  },
});

export default Message;
