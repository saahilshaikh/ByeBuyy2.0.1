import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Text
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Card4 from '../shared/card4';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

export default class ViewUsersListScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser: [],
            loading: true
        }
    }
    async componentDidMount() {
        var data = {
            id: this.props.route.params.id
        }
        var res = await axios.post(link + '/api/user/singleId', data);
        if(res.data!==null)
        {
            var currentUser = res.data;
                currentUser.id = currentUser._id;
                this.setState({
                    currentUser: currentUser,
                    loading: false,
                    data: currentUser[this.props.route.params.type]
                })
        }
    }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

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
                                paddingHorizontal: 10
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
                                <Ionicons name="ios-arrow-back" size={26} color={colors.baseline} />
                            </TouchableOpacity>
                            <Text style={styles.headerText}>{this.props.route.params.type} List</Text>
                        </View>
                    </View>
                    <ScrollView style={{ width: '100%', flex: 1, paddingVertical: 10 }}>
                        {
                            !this.state.loading
                                ?
                                <>
                                    {
                                        this.state.data && this.state.data.map(item => {
                                            console.log(item);
                                            return (
                                                <Card4 id={item} navigation={this.props.navigation} location={this.props.route.params.location} />
                                            )
                                        })
                                    }
                                </>
                                :
                                <ActivityIndicator size="large" color={colors.baseline} />
                        }
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
        backgroundColor:colors.primary,
    },
    header: {
        width: '100%',
        paddingVertical: 5,
        backgroundColor: colors.secondary,
        alignItems: 'center',
    },
    headerText: {
        fontFamily: 'Muli-Bold',
        textTransform: "capitalize",
        fontSize: 20,
        color: colors.baseline
    },
});
