import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import link from '../fetchPath';
import colors from '../appTheme';

export default class ShowSimilar extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            data: []
        }
    }
    async componentDidMount() {
        var data = {
            id:this.props.sameList[0]
        }
        var res = await axios.post(link + '/api/user/single', data);
        if(res.data!==null)
        {
            var data = res.data;
                data.id = data._id;
                this.setState({
                    data: data
                })
        }
        // firestore().collection('testusers').where('email', '==', this.props.sameList[0]).get().then(snap => {
        //     snap.forEach(doc => {
        //         var data = doc.data();
        //         data.id = doc.id;
        //         this.setState({
        //             data: data
        //         })
        //     })
        // })
    }

    handleClick = () => {
        this.props.navigation.push('viewProfile', { id: this.state.data.id });
    }

    render() {
        return (
            <Text onPress={this.handleClick} style={{ color: colors.baseline, fontSize: 14, fontFamily: 'Muli-Bold' }}>{this.state.data && this.state.data.name}</Text>
        )
    }
}