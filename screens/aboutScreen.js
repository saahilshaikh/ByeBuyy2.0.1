import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Linking,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

export default class AboutScreen extends React.Component {

  handleBack = () => {
    this.props.navigation.pop();
    this.props.route.params.handleBack()
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 20,
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            borderBottomColor: colors.grey,
            borderBottomWidth: StyleSheet.hairlineWidth
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
        <ScrollView style={{ width: '100%', flex: 1 }}>
          <View style={{ width: '100%', flex: 1 }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'Muli-Bold',
                color: colors.baseline,
                marginLeft: 20,
                marginTop: 20,
              }}>
              About
          </Text>
            <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
              <View style={styles.box}>
                <Text style={styles.boxText}>
                  Byebuyy provides a needs-fulfillment service and enables its
                  users to connect to other users for the purpose of sharing /
                  donating /exchanging or bartering products owned and offered for
                  sharing/ exchange by such users. Byebuyyy enables users to find
                  products/providers in their vicinity. Let us share the joy of
                  giving.
              </Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxText}>
                  You can reach us at, Oneco.work, 2/3, 2nd Floor, 80 Feet Road,
                  Barleyz Junction, Koramangala, Bengaluru, Karnataka-560034. or
                you can mail us{' '}
                  <Text
                    onPress={() => Linking.openURL('mailto:feedback@byebuyy.com')}
                    style={{ color: colors.baseline, fontWeight: 'bold' }}>
                    feedback@byebuyy.com
                </Text>
                </Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxText}>
                  Developed and maintained by <Text
                    onPress={() => Linking.openURL('https://augendtech.com')}
                    style={{ color: colors.baseline, fontWeight: 'bold' }}>
                    Augend Tech
                </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: colors.primary,
  },
  header: {
    color: colors.baseline,
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
  box: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    borderBottomColor: colors.grey,
    borderBottomWidth: StyleSheet.hairlineWidth,
    elevation: 3,
  },
  boxText: {
    fontSize: 16,
    color: '#e5e5e5',
    fontFamily: 'Muli-Regular',
  },
});
