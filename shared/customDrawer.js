import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import colors from '../appTheme';

class CustomDrawerContent extends React.Component {
  render() {
    return (
      <View style={{ width: '100%', height: '100%', paddingVertical: 20, paddingHorizontal: 10 }}>
        <View style={{ width: '100%' }}>
          <TouchableOpacity onPress={() => this.props.handleMenu('Home')} style={this.props.active === 'Home' ? styles.activeButton : styles.button}>
            <Text style={this.props.active === 'Home' ? styles.activeButtonText : styles.buttonText}>Home</Text>
          </TouchableOpacity>
          {
            auth().currentUser
            ?
            <TouchableOpacity onPress={() => this.props.handleMenu('Deal')} style={this.props.active === 'Deal' ? styles.activeButton : styles.button}>
              <Text style={this.props.active === 'Deal' ? styles.activeButtonText : styles.buttonText}>My Deals</Text>
            </TouchableOpacity>
            :
            null
          }
          <TouchableOpacity onPress={() => this.props.handleMenu('Refer')} style={this.props.active === 'Refer' ? styles.activeButton : styles.button}>
            <Text style={this.props.active === 'Refer' ? styles.activeButtonText : styles.buttonText}>Refer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.handleMenu('About')} style={this.props.active === 'About' ? styles.activeButton : styles.button}>
            <Text style={this.props.active === 'About' ? styles.activeButtonText : styles.buttonText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.handleMenu('Privacy')} style={this.props.active === 'Privacy' ? styles.activeButton : styles.button}>
            <Text style={this.props.active === 'Privacy' ? styles.activeButtonText : styles.buttonText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.handleMenu('Terms')} style={this.props.active === 'Terms' ? styles.activeButton : styles.button}>
            <Text style={this.props.active === 'Terms' ? styles.activeButtonText : styles.buttonText}>Terms</Text>
          </TouchableOpacity>
        </View>
        {
          auth().currentUser
            ?
            <TouchableOpacity onPress={() => this.props.handleMenu('Logout')} style={styles.button}>
              <Text style={styles.activeButtonText}>Logout</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => this.props.handleMenu('Login')} style={styles.button}>
              <Text style={styles.activeButtonText}>Login</Text>
            </TouchableOpacity>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  activeButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.baselineDull,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginVertical: 5
  },
  activeButtonText: {
    fontFamily: 'Muli-Bold',
    color: colors.baseline,
    fontSize: 16,
    textTransform: "uppercase"
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 3,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginVertical: 5
  },
  buttonText: {
    fontFamily: 'Muli-Bold',
    color: colors.white,
    fontSize: 16,
    textTransform: "uppercase"
  }
})

export default CustomDrawerContent;
