import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  Text
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  TabView,
  TabBar,
  SceneMap,
  SceneRendererProps,
} from 'react-native-tab-view';
import ShowPeopleScreen from './showPeopleScreen';
import ShowPostsScreen from './showPostsScreen';
import ShowPostsScreen2 from './showPostsScreen2';
import colors from '../appTheme';
import LikedFollowing from '../shared/likedfollwing';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

export default class SearchScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUser: [],
      showFollowedUsers: false,
      followedUsersPost: [],
      showTrending: true,
      showResult: false,
      location: [],
      loading: false,
      index: 0,
      routes: [
        { key: 'products', title: 'PRODUCTS' },
        { key: 'requests', title: 'REQUESTS' },
        { key: 'people', title: 'PEOPLE' },
      ],
      searchWord: '',
      images: [],
      imageIndex: 0,
    };
  }
  async componentDidMount() {
    this.setState({
      location: this.props.route.params.location,
    });
  }

  handleCardImageClick = (e, f) => {
    console.log('card image clicked');
    var images = [];
    e.map((image) => {
      var img = {};
      img.uri = image.image;
      images.push(img);
    });
    this.setState({
      showImage: true,
      imageIndex: f - 1,
      images: images,
    });
  };

  renderTabBar = (props: SceneRendererProps & { navigationState: State }) => {
    return (
      <TabBar
        {...props}
        renderLabel={({ route, focused, color }) => (
          <Text style={{ color: colors.grey, fontSize: 14, fontFamily: 'Muli-Bold' }}>
            {route.title}
          </Text>
        )}
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
      />
    );
  };

  renderScene = SceneMap({
    products: () => (
      <ShowPostsScreen
        handleCardImageClick={(e, f) => this.handleCardImageClick(e, f)}
        location={this.state.location}
        navigation={this.props.navigation}
        searchWord={this.state.searchWord}
      />
    ),
    requests: () => (
      <ShowPostsScreen2
        location={this.state.location}
        navigation={this.props.navigation}
        searchWord={this.state.searchWord}
      />
    ),
    people: () => (
      <ShowPeopleScreen
        navigation={this.props.navigation}
        searchWord={this.state.searchWord}
      />
    ),
  });

  handleIndexChange = (index: number) =>
    this.setState({
      index,
    });

  handleInputFocus = (e) => {
    console.log(e);
    this.setState({
      showTrending: true,
      showResult: false,
    });
  };

  handleInputOutOfFocus = () => {
    this.setState({
      showTrending: false,
    });
  };

  handleSearch = () => {
    if (this.state.searchWord.replace(' ', '').length > 0) {
      this.setState({
        showResult: true,
        index: 0,
      });
      Keyboard.dismiss();
    }
  };

  handleCategory = (e) => {
    console.log(e);
    this.setState(
      {
        searchWord: e,
      },
      () => {
        this.handleSearch();
      },
    );
  };

  render() {
    _renderMyKeyExtractor = (item, index) => item.id;
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
                justifyContent: 'center',
              }}>
              {this.state.showResult ? (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      showResult: false,
                    })
                  }
                  style={{
                    width: 50,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                  }}>
                  <Ionicons name="ios-close" size={26} color={colors.baseline} />
                </TouchableOpacity>
              ) : (
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
                )}
              <TextInput
                onSubmitEditing={this.handleSearch}
                onFocus={this.handleInputFocus}
                onEndEditing={this.handleInputOutOfFocus}
                style={styles.input}
                placeholder="Search Products, Requests, & People"
                placeholderTextColor={colors.grey}
                value={this.state.searchWord}
                onChangeText={(text) => {
                  this.setState({ searchWord: text });
                }}
              />
              <TouchableOpacity
                onPress={this.handleSearch}
                style={{
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Ionicons name="ios-search" size={26} color={colors.grey} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: '100%', alignItems: 'center', flex: 1 }}>
            {this.state.loading ? (
              <View
                style={{ width: '100%', marginTop: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.baseline} />
              </View>
            ) : (
                <>
                  {this.state.showResult ? (
                    <View style={{ width: '100%', flex: 1 }}>
                      <TabView
                        navigationState={this.state}
                        renderScene={this.renderScene}
                        renderTabBar={this.renderTabBar}
                        onIndexChange={this.handleIndexChange}
                      />
                    </View>
                  ) : (
                      <>
                        {auth().currentUser ? (
                          <LikedFollowing
                            location={this.state.location}
                            navigation={this.props.navigation}
                          />
                        ) : null}
                      </>
                    )}
                </>
              )}
          </View>
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
    backgroundColor: colors.primary,
  },
  header: {
    width: '100%',
    paddingVertical: 5,
    backgroundColor: colors.primary2,
    alignItems: 'center',
    height: 60,
    elevation: 3
  },
  input: {
    width: width - 110,
    height: 40,
    padding: 0,
    fontSize: 16,
    color: colors.darkText,
    fontFamily: 'Muli-Regular',
    backgroundColor: colors.white,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  box: {
    width: '100%',
    paddingHorizontal: 15,
  },
  boxHeader: {
    fontSize: 20,
    color: colors.baseline,
    fontFamily: 'Muli-Bold',
  },
  tabBox: {
    width: '100%',
  },
  tabbar: {
    backgroundColor: colors.primary2,
    elevation: 3,
  },
  indicator: {
    backgroundColor: colors.baseline,
    height: 4,
    borderRadius: 2,
  },
});
