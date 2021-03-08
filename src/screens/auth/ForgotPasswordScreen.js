import React, { Component } from 'react'
import HeaderAy from '../../components/header/HeaderAy'
import Loading from '../../components/Loading'
import mainStyle from '../../styles/main.style'
import themeStyle from '../../styles/theme.style'
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button } from 'native-base';
export class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            Email: '',
        }
    }
    onResetPassword() {
        e.preventDefault();
        auth().sendPasswordResetEmail(this.state.Email)
            .then((doc) => {
                Alert.alert("กรุณาเช็คอีเมลของท่าน");
            })
            .catch(error => {
                Alert.alert("ตั้งรหัสผ่านใหม่ไม่สำเร็จ กรุณากรอกข้อมูลอีเมลให้ถูกต้อง");
            });
    }
    onBackHandler = () => {
        this.setState({
            loading: false,
            Email: '',
        })
        this.props.navigation.goBack()
    }
    render() {
        const { loading, Email, Password, Confirm_password } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="ลืมรหัสผ่าน" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={mainStyle.background}>
                    <View style={mainStyle.content}>

                        <Text style={{ textAlign: 'center', fontSize: 26, color: '#0080ff' }}>กรอก Email ที่ท่านสมัครไว้</Text>
                        <Item floatingLabel style={{ marginTop: 10 }}>
                            <Icon active name='mail' type="AntDesign"></Icon>
                            <Label>email</Label>
                            <Input onChangeText={str => this.setState({ Email: str })}
                                value={this.state.Email} />
                        </Item>
                        <View style={{ marginBottom: 10 }}></View>
                        <View style={{ margin: 10, flexDirection: 'row', justifyContent: "space-evenly", width: "100%" }}>
                            <View>
                                <Button success onPress={this.onResetPassword.bind(this)}>
                                    <Text style={{ fontSize: 24 }}> ส่ง</Text>
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

export default ForgotPasswordScreen
