import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux';
import { addUser, getTodos } from '../redux/Slice';

export class WelcomeScreen extends Component {
    constructor(props) {
        super(props)
        console.log(props)
    }
    render() {
        return (
            <View>
                <Text> Hello </Text>
            </View>
        )
    }
}


const mapStateToProps = state => ({
    todoReducer: state.todoReducer,
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    addUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
