import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'react-moment';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

export default class Card extends React.Component {
    constructor() {
        super();
        this.state = {
            product: [],
            owner: [],
            loadingProduct: true,
            loadingOwner: true,
            isModalVisible: false,
            NF: false
        }
    }
    
    async componentDidMount(){
        const cardValue = await AsyncStorage.getItem(this.props.id+'product');
        const cardValue2 = await AsyncStorage.getItem(this.props.id+'owner');
        if(cardValue!==null && cardValue2!==null)
        {
            console.log('mini card local found');
            this.setState({
                product: JSON.parse(cardValue),
                owner: JSON.parse(cardValue2),
                loadingProduct: false,
                loadingOwner: false,
                NF: false
            })
            this.handleInit();
        }
        else{
            console.log('mini card local not found');
            this.handleInit();
        }
    }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    handleInit=async()=>{
        var data = {
            id: this.props.id
        }
        var res = await axios.post(link + '/api/product/single', data);
        var data2 = {
            id: res.data.owner
        }
        var res2 = await axios.post(link + '/api/user/single', data2);
        var owner = res2.data;
        owner.id = owner._id;
        var product = res.data;
        product.id=product._id;
        if (res.data !== null & res2.data !== null) {
            if(res.data.varient)
            {
                this.storeData(this.props.id+'product',product);
                this.storeData(this.props.id+'owner',owner);
                this.setState({
                    product: product,
                    owner: owner,
                    loadingOwner: false,
                    loadingProduct: false,
                    NF: false
                })
            }
            else{
                this.setState({
                    product: [],
                    owner: [],
                    loadingOwner: true,
                    loadingProduct: true,
                    NF: true
                })
            }
        }
        else {
            this.setState({
                product: [],
                owner: [],
                loadingOwner: true,
                loadingProduct: true,
                NF: true
            })
        }
    }

    storeData = async (label, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(label, jsonValue)
        } catch (e) {
            // saving error
            console.log('Error Storing File');
        }
    }

    render() {
        return (
            <>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    {
                        !this.state.loadingProduct && !this.state.loadingOwner
                            ?
                            <>
                                {
                                    this.state.NF === false
                                        ?
                                        <View style={{ width: '100%', alignItems: 'center' }}>
                                            <View style={styles.item}>
                                                <View style={styles.top}>
                                                    <View style={styles.profile}>
                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('viewProfile', { id: this.state.owner.id,location:{} })} style={styles.profileBox} >
                                                            {
                                                                this.state.owner.photo
                                                                    ?
                                                                    <Image
                                                                        source={{ uri: this.state.owner.photo }}
                                                                        style={styles.profileImage}
                                                                    />
                                                                    :
                                                                    <View style={styles.profileImageBox}>
                                                                        <Text style={styles.imageText}>{this.state.owner.name.charAt(0).toUpperCase()}</Text>
                                                                    </View>
                                                            }
                                                        </TouchableOpacity>
                                                        <View>
                                                            <Text style={styles.profileName} >{this.state.owner.name}</Text>
                                                            <Text  style={styles.profileUName}>@{this.state.owner.uname}</Text>
                                                            <Text style={styles.time}><Moment element={Text} fromNow>
                                                                {this.state.product.date}
                                                            </Moment></Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.middle}>
                                                    <Text style={styles.type}>{this.state.product.type}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Ionicons
                                                            name="ios-location-outline"
                                                            size={14}
                                                            color={colors.white}
                                                            style={{ marginRight: 5 }}
                                                        />
                                                        <Text style={styles.location}>{this.state.product.city + ", " + this.state.product.country}</Text>
                                                    </View>
                                                    <Text style={styles.title} onPress={() => this.props.navigation.navigate('viewProduct', { id: this.state.product.id, location: this.props.location })}>
                                                        Ready to {this.state.product.type} {this.state.product.what} {this.state.product.withh ? "with " + this.state.product.withh : null}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        null
                                }
                            </>
                            :
                            <View style={{
                                width: '95%', paddingVertical: 10,
                                paddingHorizontal: 15,
                                alignItems: 'center',
                                backgroundColor: colors.primary,
                                justifyContent: 'space-between',
                                borderRadius: 10,
                                marginBottom: 10,
                                elevation: 3,
                            }}>
                                <SkeletonContent
                                    containerStyle={{ width: "100%" }}
                                    boneColor={colors.primary}
                                    highlightColor={colors.darkText}
                                    isLoading={this.state.loadingProduct || this.state.loadingOwner}
                                    layout={[
                                        {
                                            flexDirection: 'row',
                                            marginTop: 10,
                                            alignItems: 'center',
                                            children: [
                                                {
                                                    width: 40,
                                                    height: 40,
                                                    marginRight: 10,
                                                    borderRadius: 20
                                                },
                                                {
                                                    width: 150,
                                                    height: 20,
                                                },
                                            ]
                                        },
                                        {
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginTop: 20,
                                            children: [
                                                {
                                                    width: 80,
                                                    height: 30,
                                                },
                                                {
                                                    width: 80,
                                                    height: 30,
                                                },
                                            ]
                                        },
                                    ]}
                                >
                                </SkeletonContent>
                            </View>
                    }
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.primary,
        justifyContent: 'space-between',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImage: {
        width: 50,
        height:50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImageBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.grey,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageText: {
        fontFamily: 'Muli-Bold',
        fontSize: 18,
        color: colors.darkText
    },
    profileName: {
        color:colors.white,
        fontSize: 14,
        fontFamily: 'Muli-Bold',
    },
    profileUName: {
        color:colors.grey,
        fontSize: 12,
        fontFamily: 'Muli-Bold',
    },
    time: {
        color: colors.grey,
        fontSize: 10,
        fontFamily: 'Muli-Regular',
    },
    middle: {
        width: '100%',
    },
    type: {
        color: colors.grey,
        fontSize: 14,
        fontFamily: 'Muli-Regular',
        textTransform: "capitalize",
        marginTop: 4
    },
    location: {
        color: colors.grey,
        fontSize: 14,
        fontFamily: 'Muli-Regular',
        marginTop: 4
    },
    title: {
        color: colors.white,
        fontSize: 14,
        fontFamily: 'Muli-Bold',
    },
});
