import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import link from '../fetchPath';
import Moment from 'react-moment';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Comment from './parseComment';
import colors from '../appTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import ReplyCard from './replyCard';

const {width, height} = Dimensions.get('window');

export default class CommentCard extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      comment: {},
      isModalVisible: false,
      editModalVisible: false,
      desc: '',
      showReply: false,
      reply: '',
      replies: [],
      user: {},
    };
  }
  async componentDidMount() {
    console.log(this.props.item.reply);
    var data = {
      id: this.props.item.userEmail,
    };
    var res = await axios.post(link + '/api/user/single', data);
    if (res.data !== null && res.data.name) {
      var comment = {
        name: res.data.name,
        photo: res.data.photo,
        email: res.data.email,
        comment: this.props.item.comment,
        date: this.props.item.date,
        active: res.data.active === true && res.data.logout === false,
      };
      this.setState({
        comment: comment,
        replies: this.props.item.reply,
        loading: false,
        NF: false,
        user: res.data,
      });
    } else {
      this.setState({
        comment: {},
        loading: false,
        NF: true,
      });
    }
  }

  handleDeleteComment = () => {
    this.props.handleDeleteComment(this.props.item._id);
  };

  handleEdit = () => {
    this.props.handleEditComment(this.props.item._id, this.state.desc);
    this.setState({
      editModalVisible: false,
      desc: '',
    });
  };

  handleReply = () => {
    this.props.handleReplyComment(
      this.props.item._id,
      this.state.reply,
      this.state.user,
    );
    this.setState({
      showReply: false,
      reply: '',
    });
  };

  handleDeleteReply = (e) => {
    this.props.handleDeleteReplyComment(this.props.item._id, e);
  };

  handleEditReply = (e, f) => {
    this.props.handleEditReplyComment(this.props.item._id, e, f);
  };

  render() {
    return (
      <View style={{width: '100%', alignItems: 'center'}}>
        {this.state.loading ? (
          <View
            style={{
              width: '95%',
              paddingVertical: 10,
              paddingHorizontal: 15,
              alignItems: 'center',
              backgroundColor: colors.primary,
              justifyContent: 'space-between',
              borderRadius: 10,
              elevation: 3,
              marginVertical: 5,
            }}>
            <SkeletonContent
              containerStyle={{width: '100%'}}
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
                      borderRadius: 20,
                    },
                    {
                      width: 150,
                      height: 20,
                    },
                  ],
                },
              ]}></SkeletonContent>
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              alignItems: 'flex-end',
            }}>
            {this.state.NF ? null : (
              <View style={styles.commentView}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.commentUserPhotoBox}>
                    {this.state.comment.photo ? (
                      <Image
                        source={{uri: this.state.comment.photo}}
                        style={styles.commentUserPhoto}
                      />
                    ) : (
                      <View style={styles.profileImageBox}>
                        <Text style={styles.imageText}>
                          {this.state.comment.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    {this.state.comment.active ? (
                      <View style={styles.active}></View>
                    ) : null}
                  </View>
                  <View style={{marginLeft: 10}}>
                    <View style={{width: width * 0.65}}>
                      <Text style={styles.commentUserName}>
                        {this.state.comment.name}
                      </Text>
                      <Comment
                        value={this.state.comment.comment}
                        navigation={this.props.navigation}
                      />
                    </View>
                    <Text style={styles.commentDate}>
                      <Moment element={Text} fromNow>
                        {this.state.comment.date}
                      </Moment>
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          showReply: true,
                        });
                      }}
                      style={styles.replyButton}>
                      <Text style={styles.replyButtonText}>Reply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {auth().currentUser ? (
                  <>
                    {this.state.comment.email === auth().currentUser.email ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({isModalVisible: true});
                        }}
                        style={styles.actionButton}>
                        <Ionicons
                          name="ios-ellipsis-horizontal-outline"
                          size={22}
                          color={colors.grey}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </>
                ) : null}
              </View>
            )}
            <ScrollView style={{width: '90%'}}>
              {this.state.replies.map((rep) => {
                return (
                  <ReplyCard
                    item={rep}
                    handleEditReply={this.handleEditReply}
                    handleDeleteReply={this.handleDeleteReply}
                  />
                );
              })}
            </ScrollView>
          </View>
        )}

        <Modal isVisible={this.state.isModalVisible}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                isModalVisible: false,
              })
            }
            style={{
              alignItems: 'center',
              width: '100%',
              flex: 1,
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '80%',
                backgroundColor: colors.secondary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <View style={{width: '100%'}}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      isModalVisible: false,
                      editModalVisible: true,
                      desc: this.state.comment.comment,
                    })
                  }
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    justifyContent: 'center',
                    borderBottomColor: colors.grey,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Muli-Bold',
                      color: colors.white,
                      fontSize: 14,
                      width: 60,
                    }}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.setState(
                      {
                        isModalVisible: false,
                      },
                      () => {
                        this.handleDeleteComment();
                      },
                    )
                  }
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    justifyContent: 'center',
                    borderBottomColor: colors.grey,
                    borderBottomWidth: 0,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Muli-Bold',
                      color: colors.white,
                      fontSize: 14,
                      width: 60,
                    }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal isVisible={this.state.editModalVisible}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                editModalVisible: false,
              })
            }
            style={{
              alignItems: 'center',
              width: '100%',
              flex: 1,
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: colors.secondary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <View style={{width: '100%', marginTop: 10}}>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <View style={{width: '100%', alignItems: 'center'}}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputGroupText}>Edit Comment</Text>
                      <TextInput
                        style={styles.inputArea}
                        autoCapitalize="none"
                        maxLength={150}
                        autoFocus={true}
                        multiline={true}
                        onChangeText={(desc) => this.setState({desc})}
                        value={this.state.desc}></TextInput>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={this.handleEdit}>
                    <Text style={styles.editButtonText}>Update Comment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal isVisible={this.state.showReply}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                showReply: false,
              })
            }
            style={{
              alignItems: 'center',
              width: '100%',
              flex: 1,
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: colors.secondary,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <View style={{width: '100%', marginTop: 10}}>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <View style={{width: '100%', alignItems: 'center'}}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputGroupText}>
                        Reply to Comment
                      </Text>
                      <TextInput
                        style={styles.inputArea}
                        autoCapitalize="none"
                        maxLength={150}
                        autoFocus={true}
                        multiline={true}
                        onChangeText={(reply) => this.setState({reply})}
                        value={this.state.reply}></TextInput>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={this.handleReply}>
                    <Text style={styles.editButtonText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentView: {
    width: '100%',
    marginVertical: 5,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  commentUserPhotoBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'relative',
  },
  commentUserPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileImageBox: {
    width: 40,
    height: 40,
    backgroundColor: colors.grey,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginRight: 5,
  },
  comment: {
    fontFamily: 'Muli-Regular',
    fontSize: 12,
    color: colors.grey,
  },
  commentDate: {
    fontFamily: 'Muli-Regular',
    fontSize: 10,
    color: colors.grey,
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
    borderColor: colors.white,
  },
  actionButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    width: '90%',
    alignItems: 'center',
  },
  inputGroupText: {
    fontSize: 16,
    color: colors.grey,
    fontFamily: 'Muli-Bold',
    marginBottom: 10,
  },
  inputArea: {
    marginTop: 5,
    backgroundColor: colors.white,
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    color: colors.darkText,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
    borderRadius: 3,
    width: '100%',
  },
  editButton: {
    elevation: 3,
    borderRadius: 5,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 40,
    backgroundColor: colors.baseline,
    marginBottom: 25,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    color: colors.white,
  },
  replyButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  replyButtonText: {
    fontSize: 12,
    fontFamily: 'Muli-Bold',
    color: colors.white,
  },
});
