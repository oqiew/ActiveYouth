import React, { Component } from 'react'
import HeaderAy from '../../components/header/HeaderAy'
import Loading from '../../components/Loading'
import mainStyle from '../../styles/main.style'
import themeStyle from '../../styles/theme.style'
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button } from 'native-base';
import { routeName } from '../../route/routeName';
import { connect } from 'react-redux';
import { addProfile, setArea } from '../../redux/Reducer';
import Auth from '@react-native-firebase/auth'
import Firestore from '@react-native-firebase/firestore'
import { TableName } from '../../database/TableName'
import { isEmptyValue } from '../../components/Method'
export class SigninScreen extends Component {
    constructor(props) {
        super(props);
        this.tbUser = Firestore().collection(TableName.Users);
        this.tbArea = Firestore().collection(TableName.Areas);
        this.state = {
            loading: false,
            Email: 'asoyergas@gmail.com',
            Password: '12345678',
            // Email: '',
            // Password: '',
            pass: true,
            icon: 'eye-with-line',
        }
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
                if (user) {
                    this.tbUser.doc(user.uid).get().then((doc) => {
                        if (doc.exists) {
                            this.props.addProfile({ uid: user.uid, email: user.email, ...doc.data() })
                            this.tbArea.doc(doc.data().Area_ID).get().then((doc2) => {
                                if (doc2.exists) {
                                    this.props.setArea({ ID: doc2.id, ...doc2.data() })
                                    this.setState({
                                        loading: false
                                    })
                                    // console.log('home set user', { uid: user.uid, email: user.email, ...doc.data() })
                                    this.props.navigation.navigate(routeName.Home)
                                }
                            })
                        } else {
                            // console.log('error signin')
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
                        // console.log('error home set user no profile', user.uid, user.email)
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
    onSignin() {
        const { Email, Password } = this.state;
        this.setState({ loading: true });
        // console.log(Email, Password)
        Auth().signInWithEmailAndPassword(Email, Password)
            .then((user) => {
                // console.log('login success', user.user.uid)
                query_user(user);
            })
            .catch((msgError) => {
                this.setState({ loading: false });
                this.props.addProfile({})
                Alert.alert("can not login", msgError.message);
            });
        const query_user = (user) => {
            var uid = user.user.uid;
            var email = user.user.email;

            this.tbUser.doc(uid).get().then(async (doc) => {
                if (doc.exists) {
                    this.props.addProfile({ uid: uid, email: email, ...doc.data() })
                    if (!isEmptyValue(doc.data().Area_ID)) {

                        const area = await this.getArea(doc.data().Area_ID);
                        if (!isEmptyValue(area)) {
                            this.props.setArea({ ID: area.ID, ...area })
                        }
                    }
                    this.setState({
                        loading: false
                    })
                    // console.log('home set user', { uid: uid, email: email, ...doc.data() })
                    this.props.navigation.navigate(routeName.Home)
                } else {
                    this.props.addProfile({ uid: uid, email: email })
                    this.setState({
                        loading: false
                    })
                    // console.log('home set user no profile', uid, email)
                    this.props.navigation.navigate(routeName.ProfileEdit)
                }

            }).catch((error) => {
                this.props.addProfile({ uid: uid, email: email })
                this.setState({
                    loading: false
                })
                // console.log('error home set user no profile', uid, email)
                this.props.navigation.navigate(routeName.ProfileEdit)
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
        })
        this.props.navigation.goBack()
    }
    render() {
        const { loading, Email, Password, Confirm_password } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="เข้าสู่ระบบ" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={[mainStyle.background, { height: '100%' }]}>
                    <View style={mainStyle.content}>

                        <Text style={{ textAlign: 'center', fontSize: 26, color: '#0080ff' }}>เข้าสู่ระบบ</Text>
                        <Item floatingLabel style={{ marginTop: 10 }}>
                            <Icon active name='mail' type="AntDesign"></Icon>
                            <Label>email</Label>
                            <Input onChangeText={str => this.setState({ Email: str })}
                                value={this.state.Email} />
                        </Item>
                        <Item floatingLabel>
                            <Icon active name='lock' type="AntDesign"></Icon>
                            <Label>password</Label>
                            <Input secureTextEntry={this.state.pass} value={this.state.Password} onChangeText={str => this.setState({ Password: str })} />
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
    addProfile, setArea
};

export default connect(mapStateToProps, mapDispatchToProps)(SigninScreen);
