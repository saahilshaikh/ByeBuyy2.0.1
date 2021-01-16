import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    Image,
    Share,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import colors from '../appTheme';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import link from '../fetchPath';
import Snackbar from 'react-native-snackbar';

const { width, height } = Dimensions.get('window');

export default class ReferScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            uname: '',
            data: {}
        }
    }

    async componentDidMount() {
        if (auth().currentUser) {
            var data = {
                id: auth().currentUser.email
            }
            var res = await axios.post(link + '/api/user/single', data);
            if (res.data !== null) {
                this.setState({
                    uname: res.data.uname,
                    data: res.data
                })
            }
        }
    }

    handleBack = () => {
        this.props.navigation.pop();
        this.props.route.params.handleBack()
    }

    handleShare = (e) => {
        console.log("110", e);
        const result = Share.share({
            message: '"' + e + '" - Use my code and earn 60 days of free access to byebuyy',
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
                console.log(result);
            } else {
                // shared
                console.log(result);
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
            console.log(result);
        }
    };

    handleCopy = (e) => {
        Clipboard.setString('"' + e + '" - Use my code and earn 60 days of free access to byebuyy');
        Snackbar.show({
            text: 'Copied to Clipboard',
            duration: Snackbar.LENGTH_SHORT,
        });
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
                <ScrollView style={{ width: '100%', flex: 1 }}>
                    <View style={{ width: '100%', flex: 1, alignItems: 'center', marginTop: 20 }}>
                        <Text
                            style={{
                                fontSize: 24,
                                fontFamily: 'Muli-Bold',
                                color: colors.white,
                                marginTop: 20,
                            }}>
                            Refer & Earn
                    </Text>
                        {
                            auth().currentUser
                                ?
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'Muli-Bold',
                                        color: colors.white,
                                        marginTop: 20,
                                    }}>
                                    Total Refers : {this.state.data.refferals ? this.state.data.refferals.length : "0"}
                                </Text>
                                :
                                null
                        }
                        <View style={{ width: 250, height: 200, marginBottom: 30 }}>
                            <LottieView
                                source={require('../assets/refer.json')}
                                autoPlay={true}
                                loop={true}
                                style={{ transform: [{ translateX: -50 }, { scale: 1.3 }] }}
                            />
                        </View>
                        {
                            auth().currentUser
                                ?
                                <>
                                    {
                                        this.state.uname
                                            ?
                                            <Text onPress={() => Clipboard.setString('#' + this.state.uname)} style={{
                                                fontSize: 20,
                                                fontFamily: 'Muli-Bold',
                                                color: colors.baseline,
                                                marginTop: 20,
                                                paddingHorizontal: 20,
                                                paddingVertical: 15,
                                                borderRadius: 10,
                                                borderColor: colors.baseline,
                                                borderWidth: 1,
                                                borderStyle: 'dashed',
                                                marginBottom: 20
                                            }}>#{this.state.uname}</Text>
                                            :
                                            <Text style={{
                                                fontSize: 16,
                                                fontFamily: 'Muli-Bold',
                                                color: colors.baseline,
                                                marginTop: 20,
                                                paddingHorizontal: 20,
                                                paddingVertical: 15,
                                                marginBottom: 20
                                            }}>Please update your user name</Text>
                                    }
                                    <Text style={{
                                        fontSize: 16,
                                        fontFamily: 'Muli-Bold',
                                        color: colors.white,
                                        marginBottom: 20,
                                        width: '80%',
                                        textAlign: 'center'
                                    }}>Share your code with friends and get bonus points</Text>

                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            onPress={() => this.handleCopy("#" + this.state.uname)} style={{ marginHorizontal: 10 }}>
                                            <Ionicons
                                                name="ios-copy-outline"
                                                size={30}
                                                color={colors.baseline}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.handleShare("#" + this.state.uname)} style={{ marginHorizontal: 10 }}>
                                            <Ionicons
                                                name="share-social-outline"
                                                size={30}
                                                color={colors.baseline}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </>
                                :
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={styles.loginButton}>
                                    <Text style={styles.loginButtonText}>Login to continue</Text>
                                </TouchableOpacity>
                        }
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
    loginButton: {
        width: 150,
        height: 50,
        backgroundColor: colors.baseline,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    loginButtonText: {
        color: colors.white,
        fontFamily: 'Muli-Bold',
        fontSize: 14
    }
});
