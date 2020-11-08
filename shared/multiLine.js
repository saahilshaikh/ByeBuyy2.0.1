import React, { Component } from "react";
import { TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";

export default class MultiLine extends Component {
    static propTypes = {
        maxLines: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value || ""
        };
    }

    onChangeText = text => {
        const { maxLines, onChangeText } = this.props;
        const lines = text.split("\n");

        if (lines.length <= (maxLines || 1)) {
            onChangeText(text);
            this.setState({ value: text });
        }
    };

    render() {
        const { onChangeText, multiline, value, ...other } = this.props;
        return (
            <TextInput
                style={styles.inputArea}
                {...other}
                multiline={true}
                value={this.state.value}
                onChangeText={this.onChangeText}
            />
        );
    }
}

const styles = StyleSheet.create({
    inputArea: {
        marginTop: 5,
        backgroundColor: '#e5e5e5',
        fontSize: 16,
        fontFamily: 'Muli-Regular',
        color: '#464646',
        padding: 10,
        height: 150,
        textAlignVertical: 'top',
        borderRadius: 3,
    },
})