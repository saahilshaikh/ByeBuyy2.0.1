import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'react-moment';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

export default class RateCard extends React.Component {
    constructor() {
        super();
        this.state = {
            user: [],
            loading: true
        }
    }
    async componentDidMount() {
        var data={
            id:this.props.item.userEmail
        }
        var res = await axios.post(link + '/api/user/single', data);
        if(res.data!==null)
        {
            this.setState({
                loading:false,
                user:res.data
            })
        }
    }
    render() {
        var stars = [];
        for (var j = 1; j <= this.props.item.rate; j++) {
            stars.push(j);
        }
        return (
            <>
                {
                    !this.state.loading
                        ?
                        <View style={styles.ratingContainer}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.push('viewProfile', { id: this.state.user._id })}
                                style={styles.left}>
                                {
                                    this.state.user.photo
                                        ?
                                        <Image
                                            source={{ uri: this.state.user.photo }}
                                            style={styles.profileImage}
                                        />
                                        :
                                        <View style={styles.profileImageBox}>
                                            <Text style={styles.imageText}>{this.state.user.name.charAt(0).toUpperCase()}</Text>
                                        </View>
                                }
                            </TouchableOpacity>
                            <View style={styles.right}>
                                <Text style={styles.name}>{this.state.user.name}</Text>
                                <View style={styles.dateRate}>
                                    <View style={styles.rating}>
                                        {
                                            stars.map(star => {
                                                return (
                                                    <Ionicons key={star} name="ios-star" size={16} color={colors.baseline} />
                                                )
                                            })
                                        }
                                    </View>
                                    <Text style={styles.date}><Moment element={Text} fromNow>{this.props.item.date}</Moment></Text>
                                </View>
                                {this.props.item.comment ? <Text style={styles.rateText}>{this.props.item.comment}</Text> : null}
                            </View>
                        </View>
                        :
                        <View style={{
                            width: '95%', paddingVertical: 10,
                            paddingHorizontal: 15,
                            alignItems: 'center',
                            backgroundColor: '#1B1F22',
                            justifyContent: 'space-between',
                            borderRadius: 10,
                            marginBottom: 10,
                            elevation: 3,
                        }}>
                            <SkeletonContent
                                containerStyle={{ width: "100%" }}
                                boneColor={colors.primary}
                                highlightColor={colors.darkText}
                                isLoading={true}
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
                                        marginTop: 10,
                                        marginLeft: 50,
                                        children: [
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
            </>
        )
    }
}


const styles = StyleSheet.create({
    ratingContainer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: '95%',
        backgroundColor:colors.secondary,
        borderRadius: 5,
        marginBottom: 10,
        elevation: 3,
        flexDirection: 'row'
    },
    left: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImageBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor:colors.grey,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageText: {
        fontFamily: 'Muli-Bold',
        fontSize: 18,
        color: colors.darkText
    },
    right: {
        width: width * 0.75,
    },
    name: {
        color: colors.white,
        fontSize: 14,
        fontFamily: 'Muli-Bold',
    },
    dateRate: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rating: {
        flexDirection: 'row'
    },
    date: {
        color:colors.grey,
        fontSize: 14,
        fontFamily: 'Muli-Regular',
        marginLeft: 5
    },
    rateText: {
        color:colors.white,
        fontSize: 14,
        fontFamily: 'Muli-Regular',
    }
});
