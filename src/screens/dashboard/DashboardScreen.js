import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform, StyleSheet, ScrollView } from 'react-native';
import {
    Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Textarea, Picker, Body, Title, Header
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
export class DashboardScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            laoding: false,
            Subdistrict: '',
            showingInfoWindow: false,
            position: { lat: 15.229399, lng: 104.857126 },
            position2: { lat: 15.229399, lng: 104.857126 },
            step: 'area',
            religion_maps: [],
            religion_uri: '',
            Religion_URL: '',
            new_upload_image: false,
            //   data
            Religion_name: '',
            Religion_user: '',
            Religion_activity: '',
            Religion_alcohol: '',
            Relegion_covid19: '',
            Relegion_belief: '',
            // marginTop:
            LM_type: '',
            title: 'ทั้งหมด',
            subdistrict: '',
            query_subdistricts: [],
            subdistricts: []


        }
    }

    componentDidMount() {

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
    onEdit = () => {

    }
    onDelete = () => {

    }
    onSearchSubdistrict = (subdistrict) => {
        const { query_subdistricts } = this.state;
        const regex = new RegExp(`${ban.trim()}`, 'i');
        const subdistricts = query_subdistricts.filter(subdistrict => subdistrict.Name.search(regex) >= 0)
        this.setState({
            subdistricts,
            subdistrict
        })
    }
    onSelectedSubdistrict(subdistrict, ID) {
        // this.unsubscribe = this.tbLocalCalendars
        //     .where('Ban_ID', '==', ID)
        //     .onSnapshot(this.onCollectionUpdate);
        // this.setState({
        //     selected_ban: { Name, ID },
        //     selected: 2
        // })
    }
    render() {
        const { laoding, step, religion_maps, religion_uri, Religion_URL } = this.state;
        const { Religion_name, Religion_user, Religion_activity, Religion_alcohol,
            Relegion_covid19, Relegion_belief, LM_type, subdistricts, subdistrict } = this.state;
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
                <HeaderAy name={subdistrict} backHandler={this.onBackHandler}></HeaderAy>
                {step === 'area' &&
                    <Content contentContainerStyle={[mainStyle.background, { height: "100%" }]}>
                        <View style={mainStyle.content}>
                            <Button onPress={() => this.setState({ subdistrict: 'แสดงทั้งหมด', step: 'map' })}><Text>แสดงทั้งหมด</Text></Button>
                            <Text style={{ fontSize: 24, textAlign: 'center' }}>เลือกพื้นที่ ที่ต้องการเพิ่มข้อมูล</Text>
                            <Item fixedLabel style={{ marginTop: 5 }}>
                                <Label>ตำบล :</Label>
                                <Input value={subdistrict}
                                    placeholder="ค้นหา ตำบล"
                                    onChangeText={str => this.onSearchSubdistrict(str)} />
                            </Item>
                            {subdistricts.map((element, i) =>
                                <TouchableOpacity style={{
                                    margin: 5, padding: 5, backgroundColor: '#ff80c0'
                                    , borderRadius: 5
                                }} onPress={this.onSelectedSubdistrict.bind(this, element.Name, element.ID)}>
                                    <Text style={{ color: "#ffffff", textAlign: "center" }}>{element.Name}</Text>
                                </TouchableOpacity>
                            )}
                            <Button onPress={() => this.setState({ subdistrict: 'subdistrict test', step: 'map' })}><Text>เลือก</Text></Button>

                        </View>
                    </Content>
                }
                {step === 'map' &&
                    <>
                        <MapView
                            onPress={this.onMapPress.bind(this)}
                            style={mstyle.map}
                            zoomEnabled={true}
                            toolbarEnabled={true}
                            showsUserLocation={true}
                            showsScale={true}
                            zoomTapEnabled={true}
                            zoomControlEnabled={true}
                            {...this.getgeolocation}
                        >
                            <Marker
                                coordinate={{
                                    latitude: this.state.position.lat,
                                    longitude: this.state.position.lng,
                                }}>


                            </Marker>
                        </MapView></>}
                {step === 'table' &&
                    <Content contentContainerStyle={[mainStyle.background, { height: "100%" }]}>
                        <View style={{ flex: 1, alignItems: 'center', }}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    margin: 5,
                                    fontSize: 18,
                                }}>
                                ตารางข้อมูล</Text>
                            <View
                                style={{

                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                }}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        margin: 10,
                                        width: '20%',
                                        textAlign: 'center',
                                    }}>
                                    ชื่อพื้นที่</Text>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        margin: 10,
                                        width: '20%',
                                        textAlign: 'center',
                                    }}>
                                    ลักษณะพื้นที่</Text>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        margin: 10,
                                        width: '20%',
                                        textAlign: 'center',
                                    }}>
                                    ผู้เพิ่มข้อมูล</Text>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        margin: 10,
                                        width: '20%',
                                        textAlign: 'center',
                                    }}>
                                    แก้ไข</Text>
                            </View>
                            <ScrollView>
                                {religion_maps.map((element, i) => (
                                    <View key={i} style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text
                                            style={{
                                                margin: 10,
                                                width: '20%',
                                                textAlign: 'center',
                                            }}>
                                            {element.Geo_map_name}
                                        </Text>
                                        <Text
                                            style={{
                                                margin: 10,
                                                width: '20%',
                                                textAlign: 'center',
                                            }}>
                                            {element.name_type}
                                        </Text>
                                        <Text
                                            style={{
                                                margin: 10,
                                                width: '20%',
                                                textAlign: 'center',
                                            }}>
                                            {element.Informer_name}
                                        </Text>
                                        <View style={{ width: '20%', justifyContent: 'center', flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                onPress={this.onEdit.bind(this, element, element.Key,)}>
                                                <Image
                                                    source={require('../../assets/pencil.png')}
                                                    style={{ width: 25, height: 25, justifyContent: 'center', }}></Image>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={this.onDelete.bind(this, element)}>
                                                <Image
                                                    source={require('../../assets/trash_can.png')}
                                                    style={{ width: 25, height: 25, justifyContent: 'center', }}></Image>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </Content>
                }

                <Footer style={{ backgroundColor: '#ffffff', justifyContent: "space-around" }}>
                    <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        onPress={() =>
                            this.setState({ step: 'area' })
                        }>
                        <Image
                            source={require('../../assets/table.png')}
                            style={{ width: 60, height: 60 }}></Image>
                    </TouchableOpacity>
                    {!isEmptyValues[subdistrict] &&
                        <>
                            <TouchableOpacity
                                style={{ justifyContent: 'center' }}
                                onPress={() =>
                                    this.setState({ step: 'map' })
                                }>
                                <Image
                                    source={require('../../assets/maps.png')}
                                    style={{ width: 50, height: 50 }}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ justifyContent: 'center' }}
                                onPress={() =>
                                    this.setState({ step: 'table' })
                                }>
                                <Image
                                    source={require('../../assets/table.png')}
                                    style={{ width: 60, height: 60 }}></Image>
                            </TouchableOpacity>
                        </>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
