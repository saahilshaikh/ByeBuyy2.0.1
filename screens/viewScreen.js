import React from 'react';
import {View, StyleSheet, Dimensions, Image, BackHandler} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Pdf from 'react-native-pdf';
import VideoPlayer from 'react-native-video-controls';

const {width, height} = Dimensions.get('window');

class ViewScreen extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.pop();
    return true;
  };
  render() {
    return (
      <View style={styles.container}>
        {this.props.route.params.documenttype.includes('attach-photo') ? (
          <ImageZoom
            cropWidth={width}
            enableSwipeDown={true}
            onSwipeDown={() => this.props.navigation.pop()}
            cropHeight={height}
            imageWidth={width}
            imageHeight={height}>
            <Image
              style={{width: '100%', height: '100%'}}
              source={{
                uri: this.props.route.params.documentData,
              }}
              resizeMode="center"
            />
          </ImageZoom>
        ) : null}
        {this.props.route.params.documenttype.includes('attach-video') ? (
          <View style={{width: width, height: '100%'}}>
            <VideoPlayer
              onBack={() => this.props.navigation.pop()}
              disableFullscreen={true}
              source={{uri: this.props.route.params.documentData}}
            />
          </View>
        ) : null}
        {this.props.route.params.documenttype.includes('attach-doc') ? (
          <Pdf
            source={{uri: this.props.route.params.documentData, cache: true}}
            style={{width: width, height: height}}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
});
export default ViewScreen;
