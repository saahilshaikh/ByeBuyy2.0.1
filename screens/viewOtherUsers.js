import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Card4 from '../shared/card4';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

export default class ViewOtherUsersListScreen extends React.Component {
  render() {
    return (
      <>
        <SafeAreaView></SafeAreaView>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.pop()}
                style={{
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Ionicons
                  name="ios-arrow-back"
                  size={26}
                  color={colors.baseline}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Mutual Friends</Text>
            </View>
          </View>
          <ScrollView style={{ width: '100%', flex: 1, paddingVertical: 10 }}>
            {this.props.route.params.data &&
              this.props.route.params.data.map((item) => {
                console.log(item);
                return (
                  <Card4
                    handleRefresh={this.handleRefresh}
                    id={item}
                    navigation={this.props.navigation}
                    location={this.props.route.params.location}
                  />
                );
              })}
          </ScrollView>
        </SafeAreaView>
        <SafeAreaView></SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.secondary,
  },
  header: {
    width: '100%',
    paddingVertical: 5,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Muli-Bold',
    textTransform: 'capitalize',
    fontSize: 20,
    color: colors.baseline,
  },
});
