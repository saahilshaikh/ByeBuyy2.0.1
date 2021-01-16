import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Pdf from 'react-native-pdf';
import firestore from '@react-native-firebase/firestore';
import * as Progress from 'react-native-progress';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

class PrivacyPolicy extends React.Component {
  constructor() {
    super();
    this.state = {
      data: '',
      loading: true,
    };
  }
  async componentDidMount() {
    await firestore()
      .collection('settings')
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          this.setState({
            url: doc.data().privacy,
            loading: false,
          });
        });
      });
  }
  handleBack = () => {
    this.props.navigation.pop();
    this.props.route.params.handleBack()
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            backgroundColor: colors.primary2,
            paddingHorizontal: 20,
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            elevation: 3
          }}>
          <TouchableOpacity
            onPress={this.handleBack}>
            <Ionicons
              name="ios-arrow-back"
              size={30}
              color={colors.baseline}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 10
            }}>
            <View style={{ width: 30, height: 30 }}>
              <Image
                style={{ width: '100%', height: '100%' }}
                source={require('../assets/images/icon.png')}
              />
            </View>
            <Text style={styles.header}>bye<Text style={styles.header2}>buyy</Text></Text>
          </View>
        </View>
        {this.state.loading ? (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Progress.Bar
              progress={0.3}
              width={40}
              height={4}
              color={colors.baseline}
              indeterminate={true}
            />
          </View>
        ) : (
            <Pdf
              activityIndicatorProps={{
                color: colors.baseline,
                progressTintColor: colors.white,
              }}
              source={{ uri: this.state.url, cache: true }}
              style={{ width: width, flex: 1 }}
            />
          )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.primary,
    position: 'relative',
  },
  header: {
    color: colors.white,
    fontSize: 20,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  header2: {
    color: colors.baseline,
    fontSize: 20,
    fontFamily: 'Muli-Bold',
    marginLeft: 10,
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginLeft: 10,
  },
  action: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
});

export default PrivacyPolicy;
