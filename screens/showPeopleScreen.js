import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    ActivityIndicator,
    Text,
    FlatList
} from 'react-native';
import Card4 from '../shared/card4';
import axios from 'axios';
import link from '../fetchPath';
import LottieView from 'lottie-react-native';


export default class ShowPeopleScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            loading: true
        }
    }
    async componentDidMount() {
        var search=this.props.searchWord;
        var res=await axios.get(link+'/api/username/'+search);
        if(res.data!==null)
        {
            this.setState({
                data:res.data,
                loading:false
            })
        }
    }

    renderListEmpty = () => {
        return (
            <View
                style={{
                    width: '100%',
                    flex: 1,
                    alignItems: 'center',
                }}>
                <LottieView
                    source={require('../assets/16656-empty-state.json')}
                    autoPlay={true}
                    loop={false}
                    style={{
                        width: 300,
                        height: 250,
                    }}
                />
                <Text
                    style={{
                        fontFamily: 'Muli-Bold',
                        color: '#ACADAA',
                        fontSize: 20,
                    }}>
                    Nothing Found
            </Text>
            </View>
        )
    }

    renderFooter = () => {
        return (
            <View style={{ width: '100%', alignItems: 'center' }}>
                {
                    this.state.loadingMore
                        ?
                        <View style={{ marginVertical: 20 }}>
                            <ActivityIndicator size="large" color="#d65a31" />
                        </View>
                        :
                        null
                }
            </View>
        )
    }

    render() {
        return (
            <ScrollView style={{ width: '100%', flex: 1, paddingVertical: 10 }}>
                {
                    !this.state.loading
                        ?
                        <FlatList
                            style={{ width: '100%' }}
                            data={this.state.data}
                            ListEmptyComponent={this.renderListEmpty}
                            ListFooterComponent={this.renderFooter}
                            keyExtractor={_renderMyKeyExtractor}
                            initialNumToRender={2}
                            onEndReachedThreshold={0.5}
                            renderItem={({ item }) => (
                                <Card4 id={item.email} navigation={this.props.navigation} />
                            )}
                        />
                        :
                        <View style={{ marginTop: 30, alignItems: 'center', width: '100%', flex: 1 }}>
                            <View style={{ marginTop: 20, alignItems: 'center', flex: 1, width: '100%', justifyContent: 'center', marginBottom: 60 }}>
                            <View style={{ width: 120, height: 120 }}>
                                <LottieView
                                source={require('../assets/loading.json')}
                                autoPlay={true}
                                loop={true}
                                />
                            </View>
                            </View>
                        </View>
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#15202B',
    },
    header: {
        width: '100%',
        paddingVertical: 5,
        backgroundColor: '#192734',
        alignItems: 'center',
    },
    headerText: {
        fontFamily: 'Muli-Bold',
        textTransform: "capitalize",
        fontSize: 20,
        color: '#d65a31'
    },
    box: {
        width: '100%',
        marginVertical: 5,
        padding: 15,
    },
    boxHeader: {
        fontSize: 20,
        color: '#d65a31',
        fontFamily: 'Muli-Bold',
    },
    topic: {
        fontSize: 18,
        color: '#e5e5e5',
        fontFamily: 'Muli-Regular',
        marginLeft: 10,
    },
});
