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
    ScrollView,
    TextInput,
    ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Message from '../shared/message';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Modal from 'react-native-modal';
import ImageView from "react-native-image-viewing";
import ImagePicker from 'react-native-image-crop-picker';

const { width, height } = Dimensions.get('window');

export default class MessageViewScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            user: [],
            chat: [],
            loading: true,
            NF: false,
            images: [],
            imageIndex: 0,
            showImage: false,
            menu: false,
            message: '',
            sending: false,
            attach: false,
            image: ""
        }
    }

    componentDidMount() {
        this.setState({
            image: this.props.route.params.image,
        })
    }

    render() {
        var i = 0;
        return (
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        backgroundColor: '#192734',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            style={styles.headerIcon}
                            onPress={() => this.props.navigation.pop()}>
                            <Ionicons name="ios-close" size={30} color="#d65a31" />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView
                    ref="scrollView"
                    onContentSizeChange={(width, height) =>
                        this.refs.scrollView.scrollToEnd()
                    }
                    style={{ width: '100%', flex: 1 }}>
                    {
                        this.state.image
                            ?
                            <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />
                            :
                            null
                    }
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
        backgroundColor: '#15202B',
    },
    header: {
        color: '#e5e5e5',
        fontSize: 16,
        fontFamily: 'Muli-Bold',
        marginLeft: 10,
    },
    headerStatus: {
        color: '#d65a31',
        fontSize: 12,
        fontFamily: 'Muli-Bold',
        marginLeft: 10,
    },
    imageText: {
        fontFamily: 'Muli-Bold',
        fontSize: 18,
        color: '#d65a31'
    },
    headerIcon: {
        width: 30,
        height: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    list: {
        width: '100%',
    },
    blocked: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    blockedText: {
        fontFamily: 'Muli-Bold',
        fontSize: 16,
        color: '#acadaa'
    },
    unblockedText: {
        fontFamily: 'Muli-Bold',
        fontSize: 16,
        color: '#d65a31',
        marginLeft: 10,
        textDecorationLine: "underline"
    },
    bottomBar: {
        width: '100%',
        padding: 10,
        backgroundColor: '#192734',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        elevation: 3,
    },
    inputContainer: {
        height: 50,
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        padding: 5,
    },
    input: {
        width: '100%',
        height: '100%',
        fontFamily: 'Muli-Regular',
        fontSize: 16,
    },
    bottomButton: {
        width: width * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
});
