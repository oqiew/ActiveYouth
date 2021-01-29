
import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button } from 'native-base';
import { connect } from 'react-redux';
import { addProfile } from '../redux/Reducer';
import Loading from '../components/Loading';

import upload from '../assets/upload.png'
import mainStyle from '../styles/main.style';
import { routeName } from '../route/routeName';

export class WelcomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            laoding: false,
            page_status: 'start',
            Email: '',
            Password: '',
            confirm_password: '',
        }
    }
    goToScreen(name) {
        this.props.navigation.navigate(name)
    }
    render() {
        const { laoding, page_status } = this.state;
        return (
            <Container>
                <Loading visible={laoding}></Loading>
                <Content contentContainerStyle={{ padding: 15 }}>
                    <View style={mainStyle.content}>
                        <Image
                            source={upload}
                            style={{ width: 130, height: 130 }}
                        />
                        <Text style={{ fontSize: 32, textAlign: 'center' }}>
                            Active Youth</Text>
                        <Text style={{ fontSize: 32, textAlign: 'center' }}>
                            รายละเอียดโครงการ</Text>
                        {page_status === 'start' &&
                            // แสดงหน้าแรก
                            <View style={{
                                alignItems: 'center'
                            }}>
                                <View style={{ margin: 10, }}>
                                    <Button
                                        success
                                        onPress={this.goToScreen.bind(this, routeName.Home)}
                                    >
                                        {/* <Icon name="colsecircleo" type="AntDesign" /> */}
                                        <Text style={{ color: '#ffffff', fontSize: 24 }}>ผู้เยี่ยมชม</Text>
                                    </Button>
                                </View>
                                <View style={{ margin: 10, }}>
                                    <Button
                                        success
                                        onPress={this.goToScreen.bind(this, routeName.Signin)}
                                    >
                                        {/* <Icon name="colsecircleo" type="AntDesign" /> */}
                                        <Text style={{ fontSize: 24 }}>เข้าสู่ระบบ</Text>
                                    </Button>
                                </View>
                                <View style={{ margin: 10, }}>
                                    <Button
                                        success
                                        onPress={this.goToScreen.bind(this, routeName.Signup)}
                                    >
                                        {/* <Icon name="colsecircleo" type="AntDesign" /> */}
                                        <Text style={{ fontSize: 24 }}>สมัครสมาชิก</Text>
                                    </Button>
                                </View>
                                <View >
                                    <TouchableOpacity onPress={this.goToScreen.bind(this, routeName.ForgotPassword)}>
                                        <Text style={{ color: '#0080ff', textAlign: 'center', textDecorationLine: 'underline', fontSize: 20 }}>ลืมรหัสผ่าน</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                </Content>
                <Footer style={{ backgroundColor: '#ffffff', height: 'auto' }}>
                    {/* <FooterTab style={{  }}> */}
                    {/* <Image
                        source={require('../assets/sss.png')}
                        style={{ width: 80, height: 80 }}
                    />
                    <Image
                        source={require('../assets/4ctPED.png')}
                        style={{ width: 80, height: 80 }}
                    />
                    <Image
                        source={require('../assets/silc.png')}
                        style={{ width: 70, height: 70 }}
                    /> */}
                </Footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
