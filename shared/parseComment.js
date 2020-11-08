import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import link from '../fetchPath';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import colors from '../appTheme';

const Comment = (props) => {
    const [data, updateData] = useState();

    useEffect(() => {
        (async function anyNameFunction() {
            var str = props.value;
            var r = str.split("@").length - 1;
            var lastscan = 0;
            var comment = str;
            var mentions = [];
            for (var i = 0; i < r; i++) {
                var n = str.indexOf("@", lastscan);
                var l = str.indexOf(" ", n);
                console.log(n, l);
                var lastscan = l;
                var id = str.substring(n + 1, l);
                console.log(id);
                var res = await axios.get(link + '/api/userUname/' + id);
                if (res.data !== null) {
                    var men = {
                        start: n,
                        end: l,
                        data: "@" + res.data[0].uname,
                        uid: res.data[0]._id
                    }
                    mentions.push(men);
                }
            }
            console.log(mentions);
            var comments = [];
            if (mentions.length > 0) {
                var checked = 0;
                for (j = 0; j < str.length; j++) {
                    for (k = checked; k < mentions.length; k++) {
                        if (j === mentions[k].start) {
                            var id = "";
                            id = mentions[k].uid;
                            var mention = this.tagged(mentions[k]);
                            comments.push(mention);
                            j = mentions[k].end;
                            checked++;
                            msg = "";
                        }
                        else {
                            var startmsg = <Text style={{ color: colors.white }}>{str[j]}</Text>;
                            comments.push(startmsg);
                            k = r;
                        }
                    }
                    if (checked === mentions.length && j < str.length) {
                        var startmsg = <Text style={{ color: colors.white }}>{str[j]}</Text>;
                        comments.push(startmsg);
                    }
                }
            }
            else {
                var startmsg = <Text style={{ color: '#e5e5e5' }}>{str}</Text>;
                comments.push(startmsg);
            }
            updateData(comments);
        })();
    }, []);

    tagged = (data) => {
        return (
            <Text onPress={() => props.navigation.navigate('viewProfile', { id: data.uid })} style={{ color: colors.baseline, fontFamily: 'Muli-Regular' }}>{data.data}</Text>
        )
    }

    return (
        <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
            {data}
        </View>
    )
};

export default Comment;