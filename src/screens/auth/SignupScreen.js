import React, { Component } from 'react'
import HeaderAy from '../../components/header/HeaderAy'
import Loading from '../../components/Loading'
import mainStyle from '../../styles/main.style'
import themeStyle from '../../styles/theme.style'
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button } from 'native-base';
import Auth from '@react-native-firebase/auth'
import Firestone from '@react-native-firebase/firestore'
import { routeName } from '../../route/routeName'
import { connect } from 'react-redux';
import { addProfile } from '../../redux/Reducer';
export class SignupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            Email: '',
            Password: '',
            Confirm_password: '',
            pass: true,
            icon: 'eye-with-line',
        }
    }
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // do something
            Auth().onAuthStateChanged((user) => {
                if (user) {
                    this.props.navigation.navigate(routeName.Home)
                }
            })
        });
    }
    componentWillUnmount() {
        this._unsubscribe = null;
    }
    onRegister() {
        console.log("create email")
        this.setState({
            loading: true
        })
        const { Email, Password, Confirm_password } = this.state;
        if (Email !== '' && Password !== '' && Confirm_password !== '') {
            if (Password.length < 8 || Confirm_password.length < 8 || Password.length > 16 || Confirm_password.length > 16) {
                Alert.alert("ความยาวของรหัสผคือ 8-16 ");
                this.setState({
                    loading: false,
                })
            } else {
                if (Password !== Confirm_password) {
                    console.log(Password + "=" + Confirm_password);
                    Alert.alert("พาสเวิร์ด ไม่ตรงกัน");
                    this.setState({
                        loading: false,
                    })
                } else {
                    Auth().createUserWithEmailAndPassword(Email, Password)
                        .then(doc => {
                            Alert.alert("บันทึก อีเมลล์สำเร็จ");
                            this.setState({
                                loading: false,
                                step: 1
                            })
                            this.props.addProfile({ uid: doc.user.uid, Email })
                            console.log('register success')
                            this.props.navigation.navigate(routeName.Home)
                        }).catch(error => {
                            //can not use email show warnin
                            Alert.alert("บันทึก อีเมลล์ไม่สำเร็จ");
                            this.setState({
                                loading: false
                            })
                        })
                }
            }
        } else {
            Alert.alert("กรอกข้อมูลไม่ครบ บันทึกไม่สำเร็จ");
            this.setState({
                loading: false
            })
        }
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
            Confirm_password: '',
        })
        this.props.navigation.goBack()
    }
    render() {
        const { loading, Email, Password, Confirm_password } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="สมัครสมาชิก" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={[mainStyle.background, { height: '100%' }]}>
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
                        <Item floatingLabel>
                            <Icon active name='lock' type="AntDesign"></Icon>
                            <Label>Confirm password</Label>
                            <Input secureTextEntry={this.state.pass} onChangeText={str => this.setState({ Confirm_password: str })} />
                            <Icon name={this.state.icon} onPress={this.hidePass.bind(this)} type="Entypo"></Icon>
                        </Item>
                        <View style={{ marginBottom: 10 }}></View>
                        <View style={{ margin: 10, flexDirection: 'row', justifyContent: "space-evenly", width: "100%" }}>
                            <View>
                                <Button success onPress={this.onRegister.bind(this)}>
                                    <Text style={{ fontSize: 24 }}> สมัคร</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
