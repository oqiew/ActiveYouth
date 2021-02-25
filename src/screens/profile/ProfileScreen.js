
import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button } from 'native-base';
import { connect } from 'react-redux';
import Loading from '../../components/Loading';
import { addProfile } from '../../redux/Reducer';
import upload from '../../assets/upload.png'
import mainStyle from '../../styles/main.style';
import { routeName } from '../../route/routeName';
import HeaderAy from '../../components/header/HeaderAy';

export class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            ...this.props.userReducer.profile
        }
    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.setState({
                ...this.props.userReducer.profile
            })
        })
    }
    onBackHandler = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { loading } = this.state;
        const { uid, email, avatar_uri, Name, Lastname, Nickname, Sex, Phone_number, User_type,
            Line_ID, Facebook, Birthday_format, Area_ID, newAvatarUpload, Avatar_URL } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="โปรไฟล์" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={{ padding: 15 }}>

                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                    }}>
                        {Avatar_URL === '' ? (
                            <Image
                                source={require('../../assets/user.png')}
                                style={mainStyle.avatar}></Image>
                        ) : (
                                <Image source={{ uri: Avatar_URL }} style={mainStyle.avatar}></Image>
                            )}

                        <View style={{ marginTop: 10, flex: 1 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                    ชื่อ</Text>
                                <Text style={{ fontSize: 16 }}>
                                    : {Name} {Lastname}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                    ชื่อเล่น</Text>
                                <Text style={{ fontSize: 16 }}>: {Nickname}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                    เพศ</Text>
                                <Text style={{ fontSize: 16 }}>: {Sex}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                    วันเกิด</Text>
                                <Text style={{ fontSize: 16 }}>: {Birthday_format}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                    ประเภทผู้ใช้</Text>
                                <Text style={{ fontSize: 16 }}>: {User_type}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                    เบอร์โทรศัพท์มือถือ</Text>
                                <Text style={{ fontSize: 16 }}>
                                    : {Phone_number}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                    Facebook</Text>
                                <Text style={{ fontSize: 16 }}>: {Facebook}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                    Line_ID</Text>
                                <Text style={{ fontSize: 16 }}>: {Line_ID}</Text>
                            </View>

                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Button
                                info
                                style={{ margin: 10 }}
                                onPress={() => this.props.navigation.navigate(routeName.ProfileEdit)}>
                                <Icon name="edit" type="AntDesign" />
                                <Text>แก้ไข</Text>
                            </Button>
                            <Button
                                danger
                                style={{ margin: 10 }}
                                onPress={() => this.props.navigation.navigate(routeName.Home)}>
                                <Icon name="left" type="AntDesign" />
                                <Text>กลับ</Text>
                            </Button>
                        </View>
                        <View>
                            <Button
                                danger
                                style={{ margin: 10 }}
                            // onPress={this.logout.bind(this)}
                            >
                                <Icon name="closecircleo" type="AntDesign" />
                                <Text>ออกจากระบบ</Text>
                            </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);