import React, { Component } from 'react'
import HeaderAy from '../../components/header/HeaderAy'
import Loading from '../../components/Loading'
import mainStyle from '../../styles/main.style'
import themeStyle from '../../styles/theme.style'
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button } from 'native-base';
import { routeName } from '../../route/routeName';
import { connect } from 'react-redux';
import { addProfile } from '../../redux/Reducer';
export class SigninScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            Email: '',
            Password: '',
            pass: true,
            icon: 'eye-with-line',
        }
    }
    onSignin() {
        this.props.addProfile({
            isLogin: true,
            Name: 'test'
        })
        this.props.navigation.navigate(routeName.Home)
    }
    hidePass() {
        if (this.state.pass) {
            this.setState({
                icon: 'eye',
                pass: false
            })
        } else {
            this.setState({
                icon: 'eye-with-line',
                pass: true
            })
        }
    }
    onBackHandler = () => {
        this.setState({
            loading: false,
            Email: '',
            Password: '',
        })
        this.props.navigation.goBack()
    }
    render() {
        const { loading, Email, Password, Confirm_password } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="เข้าสู่ระบบ" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={{ padding: 15 }}>
                    <View style={mainStyle.content}>

                        <Text style={{ textAlign: 'center', fontSize: 26, color: '#0080ff' }}>สมัครสมาชิก</Text>
                        <Item floatingLabel style={{ marginTop: 10 }}>
                            <Icon active name='mail' type="AntDesign"></Icon>
                            <Label>email</Label>
                            <Input onChangeText={str => this.setState({ Email: str })}
                                value={this.state.Email} />
                        </Item>
                        <Item floatingLabel>
                            <Icon active name='lock' type="AntDesign"></Icon>
                            <Label>password</Label>
                            <Input secureTextEntry={this.state.pass} onChangeText={str => this.setState({ Password: str })} />
                            <Icon name={this.state.icon} onPress={this.hidePass.bind(this)} type="Entypo"></Icon>
                        </Item>
                        <View style={{ marginBottom: 10 }}></View>
                        <View style={{ margin: 10, flexDirection: 'row', justifyContent: "space-evenly", width: "100%" }}>
                            <View>
                                <Button success onPress={this.onSignin.bind(this)}>
                                    <Text style={{ fontSize: 24 }}>เข้าสู่ระบบ</Text>
                                </Button>
                            </View>
                            <View>
                                <Button danger onPress={this.onBackHandler}>
                                    <Text style={{ fontSize: 24 }}> ยกเลิก</Text>
                                </Button>
                            </View>


                        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(SigninScreen);
