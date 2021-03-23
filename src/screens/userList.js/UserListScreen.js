import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform, StyleSheet, ScrollView } from 'react-native';
import {
    Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Textarea, Header, FooterTab
} from 'native-base';
import { connect } from 'react-redux';
import { addProfile } from '../../redux/Reducer';
import Loading from '../../components/Loading';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import upload from '../../assets/upload.png'
import mainStyle from '../../styles/main.style';
import { routeName } from '../../route/routeName';
import HeaderAy from '../../components/header/HeaderAy';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import themeStyle from '../../styles/theme.style';
import { isEmptyValue, isEmptyValues } from '../../components/Method';
import Firestore from '@react-native-firebase/firestore'
import { TableName } from '../../database/TableName';

export class UserListScreen extends Component {
    constructor(props) {
        super(props)
        this.tbUser = Firestore().collection(TableName.Users);
        this.tbAreas = Firestore().collection(TableName.Areas);

        this.state = {
            loading: false,
            Subdistrict: '',
            ...this.props.userReducer.profile,
            showingInfoWindow: false,
            position: { lat: 15.229399, lng: 104.857126 },
            position2: { lat: 15.229399, lng: 104.857126 },
            step: 'reject',
            religion_maps: [],
            religion_uri: '',
            Religion_URL: '',
            new_upload_image: false,
            //   data
            searchName: '',
            user_rejects: [],
            user_accepts: [],
            query_user_accepts: [],
            query_user_rejects: [],
            userEdit: '',

        }
    }

    componentDidMount() {
        this.tbAreas.onSnapshot(this.queryAreas)
    }
    queryAreas = (query) => {
        const query_area = [];
        query.forEach(doc => {
            query_area.push({ ID: doc.id, ...doc.data() })
        });
        this.setState({
            query_area
        }, () => {
            this.tbUser.onSnapshot(this.queryUsers)
        })

    }
    getArea(id) {
        let temp = ''
        this.state.query_area.forEach(element => {
            if (element.ID === id) {
                temp = element
            }
        });
        return temp
    }

    queryUsers = (query) => {
        const user_rejects = [];
        const user_accepts = [];
        query.forEach(doc => {
            let temp_area = this.getArea(doc.data().Area_ID);
            if (doc.data().User_type === 'admin' || doc.data().User_type === 'ay') {
                user_accepts.push({ ID: doc.id, ...doc.data(), Area: temp_area })
            } else {
                user_rejects.push({ ID: doc.id, ...doc.data(), Area: temp_area })
            }

        });
        this.setState({
            user_rejects,
            user_accepts,
            query_user_rejects: user_rejects,
            query_user_accepts: user_accepts,
        })
    }
    onCancel() {

    }
    onBackHandler = () => {
        this.props.navigation.goBack()
    }
    get getgeolocation() {
        return {
            region: {
                latitude: this.state.position.lat,
                longitude: this.state.position.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }
    onMapPress = e => {
        this.setState({
            position: {
                lat: e.nativeEvent.coordinate.latitude,
                lng: e.nativeEvent.coordinate.longitude,
            },
        });
    };
    _handleChoosePhoto = () => {
        const options = {
            title: 'เลือกรูปโปรไฟล์',
            takePhotoButtonTitle: 'ถ่ายรูป',
            chooseFromLibraryButtonTitle: 'เลือกรูปในคลัง',
            cancelButtonTitle: 'ยกเลิก',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                ImageResizer.createResizedImage(Platform.OS === "android" ? response.path : response.uri, 300, 300, 'JPEG', 100)
                    .then(({ uri }) => {
                        this.setState({
                            religion_uri: uri,
                            // map_image_file_name: response.fileName,
                            new_upload_image: true
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
    }
    onAccept = (id) => {
        this.tbUser.doc(id).update({
            User_type: 'ay'
        }).then((doc) => {
            this.setState({
                userEdit: '',
            })
            Alert.alert("อนุมัติสำเร็จ");
        }).catch((eroor) => {
            Alert.alert("อนุมัติไม่สำเร็จ");
        })
    }
    onReject = (id) => {
        this.tbUser.doc(id).update({
            User_type: ''
        }).then((doc) => {
            this.setState({
                userEdit: '',
            })
            Alert.alert("ยกเลิกสิทธิ์สำเร็จ");
        }).catch((eroor) => {
            Alert.alert("ยกเลิกสิทธิ์ไม่สำเร็จ");
        })
    }
    clearSearch() {
        this.setState({
            searchName: '',
            user_rejects: this.state.query_user_rejects,
            user_accepts: this.state.query_user_accepts
        });
    }
    onSearchUser = (searchName) => {
        let queryUsers = this.state.query_user_accepts;
        if (this.state.step === 'reject') {
            queryUsers = this.state.query_user_rejects;
        }

        const regex = new RegExp(`${searchName.trim()}`, 'i');
        const users = queryUsers.filter(user => user.Name.search(regex) >= 0)
        if (this.state.step === 'reject') {
            this.setState({
                searchName,
                user_rejects: users
            })
        } else {
            this.setState({
                searchName,
                user_accepts: users
            })
        }

    }
    render() {
        const { loading, step, searchName, user_accepts, user_rejects, userEdit } = this.state;
        const mstyle = StyleSheet.create({
            map: {
                ...StyleSheet.absoluteFillObject,
                width: '100%',
                justifyContent: 'flex-end',
                alignItems: 'center',
                zIndex: -1,
                position: 'relative',
                flex: 1,
            },
        });
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="ทำเนียบ" backHandler={this.onBackHandler}></HeaderAy>
                <Header searchBar rounded style={{ backgroundColor: themeStyle.Color_green }}>
                    <Item>
                        <Icon name="ios-people" />
                        <Input placeholder="ค้นหาชื่อ" value={searchName}
                            onChangeText={str => this.onSearchUser(str)} />
                        <TouchableOpacity onPress={this.clearSearch.bind(this)}>
                            <Icon name="close" />
                        </TouchableOpacity>

                    </Item>
                </Header>
                {isEmptyValue(userEdit) ?
                    step === 'reject' ?
                        <Content contentContainerStyle={mainStyle.background}>
                            {user_rejects.map((element, i) =>
                                <TouchableOpacity onPress={() => this.setState({ userEdit: element })} key={i}
                                    style={{
                                        padding: 10, marginLeft: 10, backgroundColor: '#ffffff', borderRadius: 10, margin: 2,
                                        marginRight: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                    <Image source={{ uri: element.Avatar_URL }} style={{ width: 50, height: 50, borderRadius: 50 }} ></Image>
                                    <Text style={{ fontSize: 16, width: 170, marginRight: 5 }}>{element.Name} {element.Lastname}{'\n'}
                                        {element.Email}{'\n'}{element.Area.Dominance}{element.Area.Area_name}
                                    </Text>
                                    <Text style={{ fontSize: 16 }}>{element.User_type}</Text>
                                </TouchableOpacity>
                            )}
                        </Content> :
                        <Content contentContainerStyle={mainStyle.background}>
                            {user_accepts.map((element, i) =>
                                <TouchableOpacity onPress={() => this.setState({ userEdit: element })} key={i}
                                    style={{
                                        padding: 10, marginLeft: 10, backgroundColor: '#ffffff', borderRadius: 10, margin: 2,
                                        marginRight: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                    <Image source={{ uri: element.Avatar_URL }} style={{ width: 50, height: 50, borderRadius: 50 }} ></Image>
                                    <Text style={{ fontSize: 16, width: 170, marginRight: 5 }}>{element.Name} {element.Lastname}{'\n'}
                                        {element.Email}{'\n'}{element.Area.Dominance}{element.Area.Area_name}
                                    </Text>
                                    <Text style={{ fontSize: 16 }}>{element.User_type}</Text>
                                </TouchableOpacity>
                            )}
                        </Content>
                    :
                    <Content contentContainerStyle={mainStyle.background}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                        }}>
                            {userEdit.Avatar_URL === '' ? (
                                <Image
                                    source={require('../../assets/user.png')}
                                    style={mainStyle.avatar}></Image>
                            ) : (
                                <Image source={{ uri: userEdit.Avatar_URL }} style={mainStyle.avatar}></Image>
                            )}
                            <View style={{ marginTop: 10, flex: 1 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                        ชื่อ</Text>
                                    <Text style={{ fontSize: 16 }}>
                                        : {userEdit.Name} {userEdit.Lastname}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                        ชื่อเล่น</Text>
                                    <Text style={{ fontSize: 16 }}>: {userEdit.Nickname}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                        เพศ</Text>
                                    <Text style={{ fontSize: 16 }}>: {userEdit.Sex}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                        วันเกิด</Text>
                                    <Text style={{ fontSize: 16 }}>: {userEdit.Birthday_format}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                        ประเภทผู้ใช้</Text>
                                    <Text style={{ fontSize: 16 }}>: {userEdit.User_type}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                        เบอร์โทรศัพท์มือถือ</Text>
                                    <Text style={{ fontSize: 16 }}>
                                        : {userEdit.Phone_number}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                        Facebook</Text>
                                    <Text style={{ fontSize: 16 }}>: {userEdit.Facebook}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ width: 150, fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>
                                        Line_ID</Text>
                                    <Text style={{ fontSize: 16 }}>: {userEdit.Line_ID}</Text>
                                </View>

                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                {this.state.User_type === 'admin' &&
                                    <>
                                        {userEdit.User_type === 'ay' ?
                                            <Button
                                                info
                                                style={{ margin: 10 }}
                                                onPress={this.onReject.bind(this, userEdit.ID)}>
                                                <Text>ยกเลิกสิทธิ์</Text>
                                            </Button>
                                            :
                                            <Button
                                                info
                                                style={{ margin: 10 }}
                                                onPress={this.onAccept.bind(this, userEdit.ID)}>
                                                <Text>อนุมัติ</Text>
                                            </Button>
                                        }
                                    </>
                                }
                                <Button
                                    danger
                                    style={{ margin: 10 }}
                                    onPress={() => this.setState({ userEdit: '' })}>
                                    <Icon name="left" type="AntDesign" />
                                    <Text>กลับ</Text>
                                </Button>
                            </View>
                        </View>
                    </Content>
                }

                <Footer>
                    <FooterTab style={mainStyle.footer}>
                        <TouchableOpacity onPress={() => this.setState({ step: 'reject' })}>
                            <Text style={[{ textAlign: 'center', padding: 5, borderRadius: 10 }
                                , step === 'reject' && { backgroundColor: themeStyle.Color_green }]}>ยังไม่อนุมัติ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ step: 'accept' })}>
                            <Text style={[{ textAlign: 'center', padding: 5, borderRadius: 10 }
                                , step === 'accept' && { backgroundColor: themeStyle.Color_green }]}>อนุมัติแล้ว</Text>
                        </TouchableOpacity>
                    </FooterTab>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserListScreen);
