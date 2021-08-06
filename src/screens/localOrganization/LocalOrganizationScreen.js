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
import { isEmptyValue, isEmptyValues, uploadImage, deleteData, deleteImage } from '../../components/Method';
import Geolocation from '@react-native-community/geolocation';
import { TableName } from '../../database/TableName';
import Firestore from '@react-native-firebase/firestore'
import government from '../../assets/map/government.png'
const tbMain = Firestore().collection(TableName.LocalOrganizations);
const tbname = TableName.LocalOrganizations;
export class LocalOrganizationScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            Subdistrict: '',
            showingInfoWindow: false,
            position: { lat: 15.229399, lng: 104.857126 },
            position2: { lat: 15.229399, lng: 104.857126 },
            step: 'map',
            religion_maps: [],
            religion_uri: '',
            Religion_URL: '',
            new_upload_image: false,
            edit_ID: '',
            more_detail: '',
            map_image_uri: '',
            Map_image_URL: '',
            ...this.props.userReducer.profile,
            Area: this.props.userReducer.area,
            //data
            Lgo_name: '',
            Lgo_type: '',
            Lgo_officer: '',
            Lgo_position_youth: '',
            Lgo_policy_youth: '',
            Lgo_activity_protect: '',
            Lgo_activity: '',
            // หัวข้อม index 0-3 [ฝ่ายงานที่เกี่ยวข้อง,จำนวนบุคลากร,นโยบาย/แผนงานขององค์กรปกครองส่วนท้องถิ่นที่เกี่ยวข้อง,โครงการ/กิจกรรมที่ผ่านมา]
            // index 0 ชื่อกิจกรรม
            name_quest: [['ส่งเสริมการพัฒนาสตรี เด็ก เยาวชน ผู้สูงอายุ และผู้พิการ'],
            ['ส่งเสริมสุขภาพ ป้องกันโรคและระงับโรคติดต่อ'],
            ['กำกับ ควบคุม บำรุงสถานที่สาธารณะในพื้นที่/ การปรับปรุงแหล่งชุมชนและการจัดการเกี่ยวกับที่อยู่อาศัย'],
            ['ส่งเสริมการฝึกและการประกอบอาชีพ'],
            ['การจัดการศึกษา'],
            ['สังคมสงเคราะห์และการ'],
            ['พัฒนาคุณภาพชีวิตเด็ก สตรี คนชรา และผู้ด้อยโอกาส'],
            ['การสาธารณสุข การอนามัยครอบครัวและการรักษาพยาบาล'],
            ['การจัดระเบียบชุมชนสังคม/ ส่งเสริมและสนับสนุนการป้องกันและรักษาความปลอดภัยในชีวิต'],
            ['ส่งเสริม บำรุงศาสนาและวัฒนธรรม จารีต ประเพณี ภูมิปัญญาท้องถิ่น'],
            ['ส่งเสริมการมีส่วนร่วมของประชาชนในการมีมาตรการป้องกัน']],
            Quest1: ['', '', '', ''],
            Quest2: ['', '', '', ''],
            Quest3: ['', '', '', ''],
            Quest4: ['', '', '', ''],
            Quest5: ['', '', '', ''],
            Quest6: ['', '', '', ''],
            Quest7: ['', '', '', ''],
            Quest8: ['', '', '', ''],
            Quest9: ['', '', '', ''],
            Quest10: ['', '', '', ''],
            Quest11: ['', '', '', '']
        }
    }
    setQuest(index1, index2, value) {
        var temp_quest1 = this.state.Quest1;
        var temp_quest2 = this.state.Quest2;
        var temp_quest3 = this.state.Quest3;
        var temp_quest4 = this.state.Quest4;
        var temp_quest5 = this.state.Quest5;
        var temp_quest6 = this.state.Quest6;
        var temp_quest7 = this.state.Quest7;
        var temp_quest8 = this.state.Quest8;
        var temp_quest9 = this.state.Quest9;
        var temp_quest10 = this.state.Quest10;
        var temp_quest11 = this.state.Quest11;
        if (index1 === 0) {
            temp_quest1[index2] = value;
        } else if (index1 === 1) {
            temp_quest2[index2] = value;
        } else if (index1 === 2) {
            temp_quest3[index2] = value;
        } else if (index1 === 3) {
            temp_quest4[index2] = value;
        } else if (index1 === 4) {
            temp_quest5[index2] = value;
        } else if (index1 === 5) {
            temp_quest6[index2] = value;
        } else if (index1 === 6) {
            temp_quest7[index2] = value;
        } else if (index1 === 7) {
            temp_quest8[index2] = value;
        } else if (index1 === 8) {
            temp_quest9[index2] = value;
        } else if (index1 === 9) {
            temp_quest10[index2] = value;
        } else if (index1 === 10) {
            temp_quest11[index2] = value;
        }

        this.setState({
            Quest1: temp_quest1,
            Quest2: temp_quest2,
            Quest3: temp_quest3,
            Quest4: temp_quest4,
            Quest5: temp_quest5,
            Quest6: temp_quest6,
            Quest7: temp_quest7,
            Quest8: temp_quest8,
            Quest9: temp_quest9,
            Quest10: temp_quest10,
            Quest11: temp_quest11,
        })
    }
    componentDidMount() {
        tbMain.where('Area_ID', '==', this.state.Area.ID)
            .onSnapshot(this.ListMark);
    }
    ListMark = querySnapshot => {
        this.setState({
            loading: true,
        });
        const maps_data = [];
        const maps_marker = [];
        let count = 0;
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Position,
                Lgo_name, Lgo_type, Lgo_position_youth, Lgo_officer,
                Lgo_policy_youth, Lgo_activity_protect, Lgo_activity
            } = doc.data();
            if (!isEmptyValue(Position)) {
                maps_marker.push(
                    <Marker
                        key={count}
                        coordinate={{
                            latitude: Position.lat,
                            longitude: Position.lng,
                        }}
                        image={government}
                        icon={government}
                    // label={count}
                    >
                        <Callout tooltip>
                            <View>
                                <View style={mainStyle.map_bubble}>
                                    <Text style={mainStyle.map_name}>{Lgo_name}</Text>
                                    <Text style={{ fontSize: 12, color: '#6a6a6a', flexWrap: 'wrap' }}>{Lgo_activity}</Text>
                                    <Text style={{ position: "relative", bottom: 40, width: 100, height: 100, }}>
                                        <Image style={{
                                            width: 100, height: 100,
                                        }} source={{ uri: Map_image_URL }} resizeMode="cover" >
                                        </Image>
                                    </Text>

                                </View>
                                <View style={mainStyle.map_arrowBorder}></View>
                                <View style={mainStyle.map_arrow}></View>
                            </View>
                        </Callout>
                    </Marker >,
                );
                maps_data.push({
                    ID: doc.id,
                    ...doc.data()
                });
            }
            count++;
        });
        this.setState({
            maps_data,
            maps_marker,
            loading: false,
        });
    };
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
                            map_image_uri: uri,
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
    findCoordinates = () => {
        this.setState({ loading: true })
        Geolocation.getCurrentPosition(
            position => {
                console.log(position.coords.latitude
                    , ",", position.coords.longitude);
                this.setState({
                    position: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    loading: false
                });
            },
            error => {
                this.setState({ loading: false })
                console.log(error);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 10000,
                distanceFilter: 50,
                forceRequestLocation: true,
            },
        );

    };
    onSubmit = async () => {

        console.log('call')
        this.setState({
            loading: true
        })
        try {
            const { map_image_uri, Map_image_URL, new_upload_image, Map_image_name, position } = this.state;
            const { Lgo_name, Lgo_type, Lgo_position_youth, Lgo_officer,
                Lgo_policy_youth, Lgo_activity_protect, Lgo_activity, } = this.state;
            const { Quest1, Quest2, Quest3, Quest4, Quest5, Quest6, Quest7, Quest8, Quest9, Quest10, Quest11 } = this.state;
            let temp_image_URL = "";
            let new_id = '';
            if (!isEmptyValue(this.state.edit_ID)) {
                new_id = Map_image_name;
            } else {
                new_id = Date.now().toString();
            }
            if (new_upload_image) {
                temp_image_URL = await uploadImage(tbname, new_id, map_image_uri);
            } else {
                temp_image_URL = Map_image_URL
            }
            if (!isEmptyValue(temp_image_URL)) {
                if (
                    !isEmptyValue(Lgo_name) &&
                    !isEmptyValue(Lgo_type) &&
                    !isEmptyValue(Lgo_position_youth) &&
                    !isEmptyValue(Lgo_policy_youth) &&
                    !isEmptyValue(Lgo_activity_protect) &&
                    !isEmptyValue(Lgo_officer) &&
                    !isEmptyValue(Lgo_activity)
                ) {
                    if (isEmptyValue(this.state.edit_ID)) {
                        // add
                        console.log('add religion')

                        tbMain
                            .doc(new_id)
                            .set({
                                Area_ID: this.state.Area.ID,
                                Update_by_ID: this.state.uid,
                                Create_date: Firestore.Timestamp.now(),
                                Update_date: Firestore.Timestamp.now(),
                                Map_image_URL: temp_image_URL,
                                Map_image_name: new_id,
                                Position: position,
                                Lgo_name, Lgo_type, Lgo_position_youth,
                                Lgo_policy_youth, Lgo_activity_protect, Lgo_activity, Lgo_officer,
                                Quest1, Quest2, Quest3, Quest4, Quest5, Quest6, Quest7, Quest8, Quest9, Quest10, Quest11

                            })
                            .then(result => {
                                Alert.alert('บันทึกสำเร็จ');
                                this.onCancel();
                            })
                            .catch(error => {
                                console.log(error);
                                this.setState({
                                    loading: false,
                                });

                            });

                    } else {
                        // update
                        console.log('update religion')
                        tbMain.doc(this.state.edit_ID)
                            .update({
                                Area_ID: this.state.Area.ID,
                                Update_by_ID: this.state.uid,
                                Update_date: Firestore.Timestamp.now(),
                                Map_image_URL: temp_image_URL,
                                Map_image_name: new_id,
                                Position: position,
                                Lgo_name, Lgo_type, Lgo_position_youth,
                                Lgo_policy_youth, Lgo_activity_protect, Lgo_activity, Lgo_officer,
                                Quest1, Quest2, Quest3, Quest4, Quest5, Quest6, Quest7, Quest8, Quest9, Quest10, Quest11
                            })
                            .then(result => {
                                Alert.alert('อัพเดตสำเร็จ');
                                this.onCancel();
                            })
                            .catch(error => {
                                console.log(error);
                                this.setState({
                                    loading: false,
                                });

                            });
                    }
                } else {
                    alert('กรุณากรอกข้อมูลให้ครบ');
                    this.setState({
                        loading: false,
                    });

                }
            } else {
                this.setState({
                    loading: false,
                });
                alert('กรุณาอัพโหลดรูปภาพ');
            }
        } catch (error) {
            console.log(error);
        }
    }
    onCancel() {
        this.setState({
            map_image_uri: '',
            Map_image_URL: '',
            new_upload_image: false,
            Religion_name: '',
            edit_ID: '',
            loading: false,
            step: 'map',
            Lgo_name: '',
            Lgo_type: '',
            Lgo_officer: '',
            Lgo_position_youth: '',
            Lgo_policy_youth: '',
            Lgo_activity_protect: '',
            Lgo_activity: '',
            Quest1: ['', '', '', ''],
            Quest2: ['', '', '', ''],
            Quest3: ['', '', '', ''],
            Quest4: ['', '', '', ''],
            Quest5: ['', '', '', ''],
            Quest6: ['', '', '', ''],
            Quest7: ['', '', '', ''],
            Quest8: ['', '', '', ''],
            Quest9: ['', '', '', ''],
            Quest10: ['', '', '', ''],
            Quest11: ['', '', '', '']
        })
    }
    onEdit = (data) => {
        this.setState({
            Map_image_URL: data.Map_image_URL,
            new_upload_image: false,
            Map_image_name: data.Map_image_name,
            position: data.Position,
            edit_ID: data.ID,
            loading: false,
            step: 'add',
            //   data
            Lgo_name: data.Lgo_name,
            Lgo_type: data.Lgo_type,
            Lgo_position_youth: data.Lgo_position_youth,
            Lgo_policy_youth: data.Lgo_policy_youth,
            Lgo_activity_protect: data.Lgo_activity_protect,
            Lgo_activity: data.Lgo_activity,
            Lgo_officer: data.Lgo_officer,
            Quest1: data.Quest1,
            Quest2: data.Quest2,
            Quest3: data.Quest3,
            Quest4: data.Quest4,
            Quest5: data.Quest5,
            Quest6: data.Quest6,
            Quest7: data.Quest7,
            Quest8: data.Quest8,
            Quest9: data.Quest9,
            Quest10: data.Quest10,
            Quest11: data.Quest11,

        })
    }
    onDelete = async (data) => {

        const resultImage = await deleteImage(data.Map_image_URL);
        const resultData = await deleteData(tbname, data.ID);

        if (!resultImage.status) {
            console.log(resultImage.message)
        } else {
            console.log(resultImage.message)
        }
        if (resultData.status) {
            Alert.alert(resultData.message)
        } else {
            console.log(resultData.message)
        }

    }
    getDataQuest(index1, index2) {
        const { Quest1, Quest2, Quest3, Quest4, Quest5, Quest6, Quest7, Quest8, Quest9, Quest10, Quest11 } = this.state
        if (index1 === 0) {
            return Quest1[index2];
        } else if (index1 === 1) {
            return Quest2[index2];
        } else if (index1 === 2) {
            return Quest3[index2];
        } else if (index1 === 3) {
            return Quest4[index2];
        } else if (index1 === 4) {
            return Quest5[index2];
        } else if (index1 === 5) {
            return Quest6[index2];
        } else if (index1 === 6) {
            return Quest7[index2];
        } else if (index1 === 7) {
            return Quest8[index2];
        } else if (index1 === 8) {
            return Quest9[index2];
        } else if (index1 === 9) {
            return Quest10[index2];
        } else if (index1 === 10) {
            return Quest11[index2];
        } else {
            return ""
        }
    }
    render() {
        const { loading, step, maps_data, map_image_uri, Map_image_URL } = this.state;
        const { Lgo_name, Lgo_type, Lgo_position_youth, Lgo_officer,
            Lgo_policy_youth, Lgo_activity_protect, Lgo_activity,
            Quest1, Quest2, Quest3, Quest4, Quest5, Quest6, Quest7, Quest8, Quest9, Quest10, Quest11 } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="อปท" backHandler={this.onBackHandler}></HeaderAy>
                {step === 'map' &&
                    <MapView
                        onPress={this.onMapPress.bind(this)}
                        style={mainStyle.main_map}
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
                        {this.state.maps_marker}
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
                            </View>
                            <ScrollView >
                                {maps_data.map((element, i) => (
                                    <View key={i} style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        backgroundColor: '#d9d9ff',
                                        justifyContent: 'space-around',
                                        alignItems: "center",
                                        padding: 5,
                                        borderRadius: 10,
                                        margin: 2,
                                        height: 100

                                    }}>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: '35%',
                                            }}>
                                            <Text
                                                style={{
                                                    flexWrap: "wrap",
                                                    height: 60
                                                }}>
                                                {element.Lgo_name}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: '50%',
                                            }}>
                                            <Text
                                                style={{
                                                    flexWrap: "wrap",
                                                    height: 60
                                                }}>
                                                {element.Lgo_activity}
                                            </Text>

                                        </View>

                                        <View style={{ width: '15%', justifyContent: 'center', flexDirection: 'column', margin: 10, }}>
                                            <TouchableOpacity
                                                onPress={this.onEdit.bind(this, element)}>
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
                                <Label>ชื่อ<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Input
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                    value={Lgo_name}
                                    onChangeText={str => this.setState({ Lgo_name: str })}
                                />
                            </Item>
                            <Item fixedLabel>
                                <Label>ประเภท<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Input
                                    placeholder="ประเภท-ขนาดของ อปท."
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                    value={Lgo_type}
                                    onChangeText={str => this.setState({ Lgo_type: str })}
                                />
                            </Item>
                            <Item fixedLabel>
                                <Label>บุคลากร<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Input
                                    placeholder="จำนวนบุคลากรใน อปท."
                                    keyboardType='numeric'
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                    value={Lgo_officer}
                                    onChangeText={str => this.setState({ Lgo_officer: str })}
                                />
                            </Item>
                            <Item fixedLabel>
                                <Label>บุคลากร<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Input
                                    placeholder="จำนวนผคนทำงานด้านเด็ก"
                                    keyboardType='numeric'
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                    value={Lgo_position_youth}
                                    onChangeText={str => this.setState({ Lgo_position_youth: str })}
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>นโยบาย<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Textarea
                                    style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                                    rowSpan={4}
                                    value={Lgo_policy_youth}
                                    onChangeText={str =>
                                        this.setState({ Lgo_policy_youth: str })
                                    }
                                    placeholder="นโยบายที่เกี่ยวข้องกับเด็กและเยาวชนของ อปท. มีอะไรบ้าง"
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>กิจกรรมด้านเด็ก<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Textarea
                                    style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                                    rowSpan={4}
                                    value={Lgo_activity}
                                    onChangeText={str =>
                                        this.setState({ Lgo_activity: str })
                                    }
                                    placeholder="กิจกรรมหรือแนวทางการดำเนินงานด้านเด็กและเยาวชนที่ผ่านมาของ อปท."
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>กิจกรรมด้านสุขภาพ<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Textarea
                                    style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                                    rowSpan={4}
                                    value={Lgo_activity_protect}
                                    onChangeText={str =>
                                        this.setState({ Lgo_activity_protect: str })
                                    }
                                    placeholder="กิจกรรมหรือแนวทางการส่งเสริมการปกป้องและคุ้มครองประชาชนด้านสุขภาพแบบองค์รวมที่ผ่านมาของ อปท."
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>ภารกิจ และบุคลากรที่เกี่ยวข้อง <Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                            </Item>
                            {this.state.name_quest.map((elemant, i) =>
                                <View style={{ borderColor: "#ff8080", borderWidth: 1, margin: 2 }}>
                                    <Item stackedLabel>
                                        <Label>{elemant}:</Label>
                                        <Item fixedLabel>
                                            <Label>ฝ่ายงานที่เกี่ยวข้อง<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                            <Input
                                                style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                                value={this.getDataQuest(i, 0)}
                                                onChangeText={str => this.setQuest(i, 0, str)}
                                            />
                                        </Item>
                                        <Item fixedLabel>
                                            <Label>จำนวนบุคลากร<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                            <Input
                                                style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                                value={this.getDataQuest(i, 1)}
                                                keyboardType='numeric'
                                                onChangeText={str => this.setQuest(i, 1, str)}
                                            />
                                        </Item>
                                        <Item stackedLabel>
                                            <Label>นโยบาย<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                            <Textarea
                                                style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                                                rowSpan={4}
                                                value={this.getDataQuest(i, 2)}
                                                onChangeText={str =>
                                                    this.setQuest(i, 2, str)
                                                }
                                                placeholder="ภารกิจ	ฝ่ายงานที่เกี่ยวข้อง	จำนวนบุคลากร	นโยบาย/ แผนงานขององค์กรปกครองส่วนท้องถิ่นที่เกี่ยวข้อง	โครงการ/กิจกรรมที่ผ่านมา"
                                            />
                                        </Item>
                                        <Item stackedLabel>
                                            <Label>โครงการ/กิจกรรมที่ผ่านมา<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                            <Textarea
                                                style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                                                rowSpan={4}
                                                value={this.getDataQuest(i, 3)}
                                                onChangeText={str =>
                                                    this.setQuest(i, 3, str)
                                                }
                                                placeholder="โครงการ/กิจกรรมที่ผ่านมา"
                                            />
                                        </Item>
                                    </Item>
                                </View>
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            {isEmptyValues([map_image_uri]) === false ?
                                <Image
                                    source={{ uri: map_image_uri }}
                                    style={{ height: 100, width: 100 }}></Image>
                                : isEmptyValues([Map_image_URL]) === false ?
                                    <Image
                                        source={{ uri: Map_image_URL }}
                                        style={{ height: 100, width: 100 }}></Image> : <></>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
                <Footer style={{ backgroundColor: '#ffffff' }}>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
                        onPress={this.findCoordinates}>
                        <Icon name="enviroment" type="AntDesign"></Icon>
                        <Text>
                            เลือกพิกัดที่อยู่ตอนนี้
                        </Text>

                    </TouchableOpacity>
                </Footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(LocalOrganizationScreen);
