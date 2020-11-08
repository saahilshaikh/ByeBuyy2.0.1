import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ScrollView,
    Share,
} from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'react-moment';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';
import AsyncStorage from '@react-native-community/async-storage';

const { width, height } = Dimensions.get('window');

export default class Card3 extends React.Component {
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
    async componentDidMount() {
        const cardValue = await AsyncStorage.getItem(this.props.id+'product');
        const cardValue2 = await AsyncStorage.getItem(this.props.id+'owner');
        if(cardValue!==null && cardValue2!==null)
        {
            console.log('Card3 local found');
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
            console.log('Card3 local not found');
            this.handleInit();
        }
    }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    handleInit=async()=>{
        this._isMounted = true;
        console.log(this.props.id);
        var data = {
            id: this.props.id
        }
        var res = await axios.post(link + '/api/product/single', data);
        var data2 = {
            id: res.data.owner
        }
        var res2 = await axios.post(link + '/api/user/single', data2);
        if(res.data!==null & res2.data!==null)
        {
            if(res.data.varient)
            {
                this.storeData(this.props.id+'product',res.data);
                this.storeData(this.props.id+'owner',res2.data);
                this.setState({
                    product:res.data,
                    owner:res2.data,
                    loadingOwner:false,
                    loadingProduct:false,
                    NF:false
                })
            }
            else{
                this.setState({
                    product:[],
                    owner:[],
                    loadingOwner:false,
                    loadingProduct:false,
                    NF:true
                })
            }
        }
        else{
            this.setState({
                product:[],
                owner:[],
                loadingOwner:false,
                loadingProduct:false,
                NF:true
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
                                                        <View>
                                                            <Text style={styles.time}><Moment element={Text} fromNow>
                                                                {this.state.product.date}
                                                            </Moment></Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.middle}>
                                                    <Text style={styles.location}>{(this.state.product.neighbourhood ? this.state.product.neighbourhood + " ," : "") + this.state.product.city + ", " + this.state.product.country}</Text>
                                                    <Text style={styles.title} >
                                                        Ready to {this.state.product.type} {this.state.product.what} {this.state.product.with ? "with " + this.state.product.with : null}
                                                    </Text>
                                                    <ScrollView
                                                        horizontal={true}
                                                        showsHorizontalScrollIndicator={false}
                                                        style={{ marginVertical: 10 }}>
                                                        {
                                                            this.state.product.images.length > 1
                                                                ?
                                                                <>
                                                                    {
                                                                        this.state.product.images.map(image => {
                                                                            return (
                                                                                <TouchableOpacity key={image.index} activeOpacity={0.5} onLongPress={() => this.props.handleCardImageClick(this.state.product.images, image.index)} style={styles.imageBox}>
                                                                                    <Image
                                                                                        source={{ uri: image.image }}
                                                                                        style={styles.imageBox}
                                                                                    />
                                                                                </TouchableOpacity>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                                :
                                                                <TouchableOpacity activeOpacity={0.5} onLongPress={() => this.props.handleCardImageClick(this.state.product.images, this.state.product.images[0].index)} style={styles.imageBoxOne}>
                                                                    <Image
                                                                        source={{ uri: this.state.product.images[0].image }}
                                                                        style={styles.imageBoxOne}
                                                                    />
                                                                </TouchableOpacity>
                                                        }
                                                    </ScrollView>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        null
                                }
                            </>
                            :
                            <View style={{
                                width: '95%',
                                padding: 15,
                                alignItems: 'center',
                                backgroundColor: colors.primary,
                                justifyContent: 'space-between',
                                elevation: 3,
                                borderWidth: 1,
                                borderColor: colors.darkText,
                                borderRadius: 10,
                                marginBottom: 10
                            }}>
                                <SkeletonContent
                                    containerStyle={{ width: "100%" }}
                                    boneColor={colors.primary}
                                    highlightColor={colors.darkText}
                                    isLoading={true}
                                    layout={[
                                        {
                                            flexDirection: 'column',
                                            marginTop: 10,
                                            children: [
                                                {
                                                    width: "100%",
                                                    height: 30,
                                                },
                                                {
                                                    flexDirection: 'row',
                                                    marginVertical: 10,
                                                    justifyContent: 'space-between',
                                                    children: [
                                                        {
                                                            width: width * 0.35,
                                                            height: 150,
                                                        },
                                                        {
                                                            width: width * 0.35,
                                                            height: 150,
                                                        },
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
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
        width: '95%',
        alignItems: 'center',
        backgroundColor: colors.primary,
        justifyContent: 'space-between',
        borderRadius: 10,
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
    time: {
        color: colors.grey,
        fontSize: 10,
        fontFamily: 'Muli-Regular',
    },
    middle: {
        width: '100%',
    },
    location: {
        color: colors.grey,
        fontSize: 12,
        fontFamily: 'Muli-Regular',
        marginBottom:5
    },
    title: {
        color: colors.white,
        fontSize: 14,
        fontFamily: 'Muli-Bold',
    },
    imageBox: {
        marginRight: 20,
        width: 0.5 * width,
        height: 0.5 * width,
        backgroundColor: colors.grey,
        borderRadius: 10,
    },
    imageBoxOne: {
        width: 0.87 * width,
        height: 0.87 * width,
        backgroundColor: colors.grey,
        borderRadius: 10,
    },
});
