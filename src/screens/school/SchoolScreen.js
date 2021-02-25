import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform, StyleSheet, ScrollView } from 'react-native';
import {
    Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Textarea
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
export class SchoolScreen extends Component {
    constructor(props) {
        super(props)

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
            Religion_name: '',
            Religion_user: '',
            Religion_activity: '',
            Religion_alcohol: '',
            Relegion_covid19: '',
            Relegion_belief: '',



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
    render() {
        const { laoding, step, religion_maps, religion_uri, Religion_URL } = this.state;
        const { Religion_name, Religion_user, Religion_activity, Religion_alcohol,
            Relegion_covid19, Relegion_belief, } = this.state;
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
                <HeaderAy name="สถานศึกษา" backHandler={this.onBackHandler}></HeaderAy>

                {step === 'map' &&
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
                    </MapView>}
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
                                                onPress={this.edit.bind(this, element, element.Key,)}>
                                                <Image
                                                    source={require('../../assets/pencil.png')}
                                                    style={{ width: 25, height: 25, justifyContent: 'center', }}></Image>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={this.delete.bind(this, element)}>
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
                {step === 'add' &&
                    <Content contentContainerStyle={mainStyle.background}>
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <Text style={mainStyle.title}>เพิ่มข้อมูล</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'red' }}>*</Text>
                                <Text>กรุณากดเลือกพิกัดก่อนการเพิ่ม</Text>
                            </View>
                            <Item fixedLabel>
                                <Label>พิกัดที่เลือก<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Label>{this.state.position.lat}</Label>
                                <Label>{this.state.position.lng}</Label>
                            </Item>
                            <Item fixedLabel>
                                <Label>ชื่อพื้นที่<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Input
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                // value={Geo_map_name}
                                // onChangeText={str => this.setState({ Geo_map_name: str })}
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>การเรียน<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Textarea
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                    rowSpan={4}
                                    // value={Geo_map_description}
                                    // onChangeText={str =>
                                    //     this.setState({ Geo_map_description: str })
                                    // }
                                    placeholder="มีแนวทางการจัดการเรียนการสอนแบบใด"
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>กิจกรรม<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Textarea
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                    rowSpan={4}
                                    // value={Geo_map_description}
                                    // onChangeText={str =>
                                    //     this.setState({ Geo_map_description: str })
                                    // }
                                    placeholder="กิจกรรมใดบ้างที่สะท้อนถึงความเชื่อมโยงระหว่างศาสนสถานกับคนในพื้นที่"
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>การจำหน่ายบุหรี่และเครื่องดื่มแอลกอฮอล์<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Textarea
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                    rowSpan={4}
                                    // value={Geo_map_description}
                                    // onChangeText={str =>
                                    //     this.setState({ Geo_map_description: str })
                                    // }
                                    placeholder="พบการซื้อขายและการสูบบุหรี่ ดื่มสุราในเขตศาสนสถานหรือไม่ อย่างไร"
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>การสูบบุหรี่<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Textarea
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                    rowSpan={4}
                                    // value={Geo_map_description}
                                    // onChangeText={str =>
                                    //     this.setState({ Geo_map_description: str })
                                    // }
                                    placeholder="พบการสูบบุหรี่ ดื่มสุราในเขตสถานศึกษาหรือไม่ อย่างไร"
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>covid 19<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Textarea
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                    rowSpan={4}
                                    // value={Geo_map_description}
                                    // onChangeText={str =>
                                    //     this.setState({ Geo_map_description: str })
                                    // }
                                    placeholder="การแพร่ระบาดของโควิด-19 ส่งผลต่อบทบาทหน้าที่ของสถาบันทางศาสนาอย่างไร"
                                />
                            </Item>
                        </View>
                        {isEmptyValues([religion_uri]) === false ?
                            <Image
                                source={{ uri: religion_uri }}
                                style={{ height: 100, width: 100 }}></Image>
                            : isEmptyValues([Religion_URL]) === false ?
                                <Image
                                    source={{ uri: Religion_URL }}
                                    style={{ height: 100, width: 100 }}></Image> : <></>
                        }
                        <View style={{ flexDirection: 'row' }}>
                            <Button
                                info
                                style={{ margin: 10 }}
                                onPress={this._handleChoosePhoto}>
                                <Icon name="plus" type="AntDesign" />
                                <Text>เพิ่มรูปพื้นที่</Text>
                            </Button>
                            <Button
                                danger
                                style={{ marginTop: 10 }}
                                onPress={this.onCancel.bind(this)}>
                                <Icon name="left" type="AntDesign" />
                                <Text>กลับ</Text>
                            </Button>

                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Button
                                success
                                style={{ margin: 10 }}
                                onPress={this.onSubmit.bind(this)}>
                                <Icon name="save" type="AntDesign" />
                                <Text>บันทึก</Text>
                            </Button>
                        </View>
                    </Content>
                }
                <Footer style={{ backgroundColor: '#ffffff', justifyContent: "space-around" }}>
                    <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        onPress={this.onCancel.bind(this)}>
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
                    <TouchableOpacity
                        onPress={() =>
                            this.setState({ step: 'add' })
                        }>
                        <Image
                            source={require('../../assets/add.png')}
                            style={{ width: 50, height: 50 }}></Image>
                    </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(SchoolScreen);
