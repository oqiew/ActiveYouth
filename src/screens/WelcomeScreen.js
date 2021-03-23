
import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button } from 'native-base';
import { connect } from 'react-redux';
import { addProfile, setArea } from '../redux/Reducer';
import Loading from '../components/Loading';

import logo from '../assets/logo.png'
import mainStyle from '../styles/main.style';
import { routeName } from '../route/routeName';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore'
import { isEmptyValue, isEmptyValues } from '../components/Method';
import { TableName } from '../database/TableName';
export class WelcomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            Email: '',
            Password: '',
            confirm_password: '',
            ...this.props.userReducer.profile
        }
        this.tbUser = Firestore().collection(TableName.Users);
        this.tbArea = Firestore().collection(TableName.Areas);

    }
    getArea = async (id) => {
        return new Promise((resolve, reject) => {
            try {
                this.tbArea.doc(id).get().then((doc) => {
                    let area = { ID: doc.id, ...doc.data() }

                    resolve(area)
                }).catch((error) => {
                    console.log('reject alert', error)
                    reject('')
                })

            } catch (error) {
                console.log('reject alert', error)
                reject('')
            }
        })
    }
    componentDidMount() {
        this.setState({
            loading: true
        })
        this._unsubscribe = this.props.navigation.addListener('focus', () => {

            Auth().onAuthStateChanged((user) => {

                if (!isEmptyValue(user)) {
                    this.tbUser.doc(user.uid).get().then(async (doc) => {
                        if (doc.exists) {
                            this.props.addProfile({ uid: user.uid, email: user.email, ...doc.data() })
                            if (!isEmptyValue(doc.data().Area_ID)) {

                                const area = await this.getArea(doc.data().Area_ID);
                                if (!isEmptyValue(area)) {
                                    this.props.setArea({ ID: area.ID, ...area })
                                }
                            }
                            this.setState({
                                loading: false
                            })
                            this.props.navigation.navigate(routeName.Home)
                            // console.log('home set user', { uid: user.uid, email: user.email, ...doc.data() })
                        }
                        else {
                            this.props.addProfile({ uid: user.uid, email: user.email })
                            this.setState({
                                loading: false
                            })
                            // console.log('home set user no profile', user.uid, user.email)
                            this.props.navigation.navigate(routeName.ProfileEdit)
                        }

                    }).catch((error) => {
                        this.props.addProfile({ uid: user.uid, email: user.email })
                        this.setState({
                            loading: false
                        })
                        // console.log('error home set user no profile', user.uid, user.email, error)
                        this.props.navigation.navigate(routeName.ProfileEdit)
                    })
                } else {
                    this.setState({
                        loading: false
                    })
                    // console.log('You are not logged in.')

                }
            })
        });

    }
    componentWillUnmount() {
        this._unsubscribe = null;
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            ...this.props.userReducer.profile
        })
    }
    goToGuest() {
        this.props.navigation.navigate(routeName.GuestHome)
    }
    goToSignin() {
        if (this.state.uid === undefined) {
            this.props.navigation.navigate(routeName.Signin)
        } else {
            this.props.navigation.navigate(routeName.Home)
        }
    }
    goToRegister() {
        this.props.navigation.navigate(routeName.Signup)
    }
    goToForgotPassword() {
        this.props.navigation.navigate(routeName.ForgotPassword)
    }
    render() {
        const { loading } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <Content contentContainerStyle={[mainStyle.background, { height: "100%" }]}>
                    <View style={mainStyle.content}>
                        <Image
                            source={logo}
                            style={{ width: 150, height: 150 }}
                        />
                        <Text style={{ fontSize: 32, textAlign: 'center' }}>
                            Active Youth</Text>
                        <Text style={{ fontSize: 32, textAlign: 'center' }}>
                            รายละเอียดโครงการ</Text>

                        {/* แสดงหน้าแรก */}
                        <View style={{
                            alignItems: 'center'
                        }}>
                            {this.state.uid === undefined && <View style={{ margin: 10, }}>
                                <Button
                                    success
                                    style={{ width: 170, justifyContent: 'center' }}
                                    onPress={this.goToGuest.bind(this)}
                                >
                                    {/* <Icon name="colsecircleo" type="AntDesign" /> */}
                                    <Text style={{ color: '#ffffff', fontSize: 24, textAlign: 'center' }}>ผู้เยี่ยมชม</Text>
                                </Button>
                            </View>}
                            <View style={{ margin: 10, }}>
                                <Button
                                    success
                                    style={{ width: 170, justifyContent: 'center' }}
                                    onPress={this.goToSignin.bind(this)}
                                >
                                    {/* <Icon name="colsecircleo" type="AntDesign" /> */}
                                    <Text style={{ fontSize: 24 }}>เข้าสู่ระบบ</Text>
                                </Button>
                            </View>
                            {this.state.uid === undefined && <><View style={{ margin: 10, }}>
                                <Button
                                    success
                                    style={{ width: 170, justifyContent: 'center' }}
                                    onPress={this.goToRegister.bind(this, routeName.Signup)}
                                >
                                    {/* <Icon name="colsecircleo" type="AntDesign" /> */}
                                    <Text style={{ fontSize: 24 }}>สมัครสมาชิก</Text>
                                </Button>
                            </View>
                                <View >
                                    <TouchableOpacity onPress={this.goToForgotPassword.bind(this, routeName.ForgotPassword)}>
                                        <Text style={{ color: '#0080ff', textAlign: 'center', textDecorationLine: 'underline', fontSize: 20 }}>ลืมรหัสผ่าน</Text>
                                    </TouchableOpacity>
                                </View></>}
                        </View>
                        <View style={{ marginTop: 30 }}>
                            <Text style={{ textAlign: 'center', fontSize: 12 }}>ผู้พัฒนา นายอดิศร ราชชิต {'\n'}
                            Email : adison.ra.56@ubu.ac.th{'\n'}0809352590</Text>
                        </View>
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
    addProfile, setArea
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
