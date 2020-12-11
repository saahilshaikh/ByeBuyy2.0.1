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

const {width, height} = Dimensions.get('window');
const Message = (props) => {
  return (
    <View
      style={{
        width: '100%',
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: props.type ? 'flex-end' : 'flex-start',
      }}>
      <View
        style={{
          flexDirection: props.type ? 'row' : 'row-reverse',
          alignItems: 'center',
          marginRight: 5,
          maxWidth: '90%',
        }}>
        <View
          style={{
            borderRadius: 5,
            backgroundColor: props.type ? colors.secondary : colors.white,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderBottomRightRadius: props.type ? 0 : 5,
            borderBottomLeftRadius: props.type ? 5 : 0,
          }}>
          <Text
            selectable={true}
            style={{
              fontSize: 16,
              marginBottom: 5,
              fontFamily: 'Muli-Regular',
              color: props.type ? colors.white : colors.darkText,
            }}>
            {props.message}
          </Text>
          {props.format === 'post-product' ? (
            <View style={styles.post}>
              <MiniCard
                location={props.location}
                id={props.url}
                navigation={props.navigation}
              />
            </View>
          ) : null}
          {props.format === 'post-request' ? (
            <View style={styles.post}>
              <MiniCard2
                location={props.location}
                id={props.url}
                navigation={props.navigation}
              />
            </View>
          ) : null}
          {props.format === 'attach-photo' ? (
            <TouchableOpacity
              onPress={() => props.handleDocumentView(props.url, props.format)}
              style={{width: 200, maxHeight: 200, marginBottom: 10}}>
              <Image
                source={{uri: props.url}}
                style={{width: '100%', height: '100%', borderRadius: 3}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
          {props.format === 'attach-doc' ? (
            <TouchableOpacity
              onPress={() => props.handleDocumentView(props.url, props.format)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: colors.white,
                borderRadius: 5,
                marginBottom: 10,
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
                {props.name}
              </Text>
            </TouchableOpacity>
          ) : null}
          {props.format === 'attach-video' ? (
            <TouchableOpacity
              onPress={() => props.handleDocumentView(props.url, props.format)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 20,
                backgroundColor: colors.white,
                borderRadius: 5,
                marginBottom: 10,
              }}>
              <Ionicons name="ios-videocam" size={24} color={colors.darkText} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Muli-Regular',
                  color: colors.darkText,
                  marginLeft: 5,
                }}>
                {props.name}
              </Text>
            </TouchableOpacity>
          ) : null}
          {props.loading ? (
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Muli-Regular',
                color: props.type ? colors.white : colors.secondary,
              }}>
              <Ionicons
                name="ios-time-outline"
                size={10}
                style={{color: colors.white, marginRight: 10}}
              />{' '}
              <Moment element={Text} format="MMMM Do YYYY, h:mm a">
                {new Date()}
              </Moment>
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Muli-Regular',
                color: props.type ? colors.white : colors.secondary,
              }}>
              <Moment element={Text} format="MMMM Do YYYY, h:mm a">
                {props.date}
              </Moment>
            </Text>
          )}
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
              backgroundColor: props.type ? colors.secondary : colors.white,
            }}></View>
          <View
            style={{
              width: 10,
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: colors.primary,
              borderBottomLeftRadius: props.type ? 10 : 0,
              borderBottomRightRadius: props.type ? 0 : 10,
            }}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    width: width * 0.75,
  },
});

export default Message;
