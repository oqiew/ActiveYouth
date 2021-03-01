import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform, StyleSheet, ScrollView } from 'react-native';
import {
    Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Textarea, Header
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
import { isEmptyValues } from '../../components/Method';
import Firestore from '@react-native-firebase/firestore'
import { TableName } from '../../database/TableName';

export class UserListScreen extends Component {
    constructor(props) {
        super(props)
        this.tbUser = Firestore().collection(TableName.Users);
        this.state = {
            laoding: false,
            Subdistrict: '',

            showingInfoWindow: false,
            position: { lat: 15.229399, lng: 104.857126 },
            position2: { lat: 15.229399, lng: 104.857126 },
            step: 'map',
            religion_maps: [],
            religion_uri: '',
            Religion_URL: '',
            new_upload_image: false,
            //   data
            searchName: '',
            users: [],
        }
    }

    componentDidMount() {
        this.tbUser.onSnapshot(this.queryUser)
    }
    queryUser = (query) => {
        const users = [];
        query.forEach(doc => {
            users.push({ ID: doc.id, ...doc.data() })
        });
        this.setState({
            users
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
    onSubmit = async () => {

    }
    onCancel = () => {

    }
    clearSearch() {
        // this.setState({ searchName: '', userType: 'ทั้งหมด', users: this.state.queryUsers });
    }
    onSearchUser = (searchName) => {
        // const { userType } = this.state;
        // let queryUsers = this.state.queryUsers;
        // if (userType !== 'ทั้งหมด') {
        //     queryUsers = this.state.users
        // }
        // const regex = new RegExp(`${searchName.trim()}`, 'i');
        // const users = queryUsers.filter(searchName => searchName.Name.search(regex) >= 0)
        // console.log(users)
        // this.setState({
        //     searchName,
        //     users
        // })
    }
    render() {
        const { laoding, step, religion_maps, religion_uri, Religion_URL } = this.state;
        const { Religion_name, Religion_user, Religion_activity, Religion_alcohol,
            Relegion_covid19, Relegion_belief, searchName, users } = this.state;
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
                <Loading visible={laoding}></Loading>
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
                <Content>
                    <ScrollView>
                        {users.map((element, i) =>
                            <View key={i} style={{ padding: 10, marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Image source={{ uri: element.Avatar_URL }} style={{ width: 50, height: 50, borderRadius: 50 }} ></Image>
                                <Text style={{ fontSize: 16, width: 170, marginRight: 5, backgroundColor: '#aeae' }}>{element.Name} {element.Lastname}{'\n'} {element.Email}</Text>
                                <Text style={{ fontSize: 16 }}>{element.User_type}</Text>
                            </View>
                        )}

                    </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserListScreen);
