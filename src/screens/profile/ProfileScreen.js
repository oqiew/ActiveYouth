
import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button } from 'native-base';
import { connect } from 'react-redux';
import Loading from '../../components/Loading';
import { addProfile } from '../../redux/Slice';
import upload from '../../assets/upload.png'
import mainStyle from '../../styles/main.style';
import { routeName } from '../../route/routeName';
export class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    onBackHandler = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { loading } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="โปรไฟล์" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={{ padding: 15 }}>
                    <View style={mainStyle.content}>
                        <Text></Text>
                    </View>
                </Content>
            </Container>
        )
    }
}


const mapStateToProps = state => ({
    userReducer: state.userReducer,
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    addProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);