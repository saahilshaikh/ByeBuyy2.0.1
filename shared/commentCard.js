import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import axios from 'axios';
import link from '../fetchPath';
import Moment from 'react-moment';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Comment from './parseComment';
import colors from '../appTheme';

const { width, height } = Dimensions.get('window');

export default class CommentCard extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            comment: {}
        }
    }
    async componentDidMount() {
        var data = {
            id: this.props.item.userEmail
        }
        var res = await axios.post(link + '/api/user/single', data);
        if (res.data) {
            var comment = {
                name: res.data.name,
                photo: res.data.photo,
                comment: this.props.item.comment,
                date: this.props.item.date,
                active: res.data.active === true && res.data.logout === false
            }
            this.setState({
                comment: comment,
                loading: false
            })
        }
    }
    render() {
        return (
            <View style={{ width: '100%', alignItems: 'center' }}>
                {
                    this.state.loading
                        ?
                        <View style={{
                            width: '95%', paddingVertical: 10,
                            paddingHorizontal: 15,
                            alignItems: 'center',
                            backgroundColor: colors.primary,
                            justifyContent: 'space-between',
                            borderRadius: 10,
                            elevation: 3,
                            marginVertical: 5
                        }}>
                            <SkeletonContent
                                containerStyle={{ width: "100%" }}
                                boneColor={colors.primary}
                                highlightColor={colors.darkText}
                                isLoading={this.state.loading}
                                layout={[
                                    {
                                        flexDirection: 'row',
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
                                ]}
                            >
                            </SkeletonContent>
                        </View>
                        :
                        <View style={styles.commentView}>
                            <View style={styles.commentUserPhotoBox}>
                                {
                                    this.state.comment.photo
                                        ?
                                        <Image source={{ uri: this.state.comment.photo }} style={styles.commentUserPhoto} />
                                        :
                                        <View style={styles.profileImageBox}>
                                            <Text style={styles.imageText}>{this.state.comment.name.charAt(0).toUpperCase()}</Text>
                                        </View>
                                }
                                {this.state.comment.active ? <View style={styles.active}></View> : null}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <View style={{ width: width * 0.7 }}>
                                    <Text style={styles.commentUserName}>{this.state.comment.name}</Text>
                                    <Comment value={this.state.comment.comment} navigation={this.props.navigation} />
                                </View>
                                <Text style={styles.commentDate}><Moment element={Text} fromNow>{this.state.comment.date}</Moment></Text>
                            </View>
                        </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    commentView: {
        width: '90%',
        marginVertical: 5,
        padding: 5,
        flexDirection: 'row'
    },
    commentUserPhotoBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        position: 'relative'
    },
    commentUserPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    profileImageBox: {
        width: 40,
        height: 40,
        backgroundColor: colors.grey,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageText: {
        fontFamily: 'Muli-Bold',
        fontSize: 16,
        color: colors.darkText,
    },
    commentUserName: {
        fontFamily: 'Muli-Bold',
        fontSize: 14,
        color: colors.white,
        marginRight: 5
    },
    comment: {
        fontFamily: 'Muli-Regular',
        fontSize: 12,
        color: colors.grey,
    },
    commentDate: {
        fontFamily: 'Muli-Regular',
        fontSize: 10,
        color: colors.grey
    },
    active: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.active,
        bottom: 0,
        right: 0,
        borderWidth: 1.5,
        borderColor: colors.white
    },
})