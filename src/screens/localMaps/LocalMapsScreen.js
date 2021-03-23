import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform, StyleSheet, ScrollView } from 'react-native';
import {
    Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Textarea, Picker
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
import river from '../../assets/map/river.png'
import resource from '../../assets/map/resource.png'
import user_star from '../../assets/map/user_star.png'
import government_star from '../../assets/map/government_star.png'
import flag_good from '../../assets/map/flag_good.png'
import flag_danger from '../../assets/map/flag_danger.png'
// river,resource,user_star,government_star,flag_good,flag_danger
const tbMain = Firestore().collection(TableName.LocalMaps);
const tbname = TableName.LocalMaps;
export class LocalMapsScreen extends Component {
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
            Lm_name: '',
            Lm_type: '',
            Lm_time: '',
            Lm_description: '',
            Lm_action: '',
        }
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
        // river,resource,user_star,government_star,flag_good,flag_danger
        var iconm = '';
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Position,
                Lm_name,
                Lm_type,
                Lm_time,
                Lm_description,
                Lm_action,
            } = doc.data();
            var iconm = '';

            if (Lm_type === 'ทรัพยากรน้ำ') {
                iconm = river;
            } else if (Lm_type === 'ทรัพยากรป่าไม้') {
                iconm = resource;
            } else if (Lm_type === 'สถานที่สำคัญ') {
                iconm = government_star;
            } else if (Lm_type === 'บุคคลสำคัญ') {
                iconm = user_star;
            } else if (Lm_type === 'พื้นที่ดี') {
                iconm = flag_good;
            } else if (Lm_type === 'พื้นที่เสี่ยง') {
                iconm = flag_danger;
            }
            if (!isEmptyValue(Position)) {
                maps_marker.push(
                    <Marker
                        key={count}
                        coordinate={{
                            latitude: Position.lat,
                            longitude: Position.lng,
                        }}
                        image={iconm}
                        icon={iconm}
                    // label={count}
                    >
                        <Callout tooltip>
                            <View>
                                <View style={mainStyle.map_bubble}>
                                    <Text style={mainStyle.map_name}>{Lm_name}</Text>
                                    <Text style={{ fontSize: 12, color: '#6a6a6a', flexWrap: 'wrap' }}>{Lm_description}</Text>
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
            const { Lm_name,
                Lm_type,
                Lm_time,
                Lm_description,
                Lm_action, } = this.state;
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
                let add = false;
                if (Lm_type === 'พื้นที่ดี' || Lm_type === 'พื้นที่เสี่ยง') {
                    if (
                        !isEmptyValue(Lm_name) &&
                        !isEmptyValue(Lm_description) &&
                        !isEmptyValue(Lm_time) &&
                        !isEmptyValue(Lm_action)
                    ) {
                        add = true
                    } else {
                        dd = false
                    }
                } else {
                    if (
                        !isEmptyValue(Lm_name) &&
                        !isEmptyValue(Lm_description)
                    ) {
                        add = true
                    } else {
                        dd = false
                    }
                }
                if (add) {

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
                                Lm_name,
                                Lm_type,
                                Lm_time,
                                Lm_description,
                                Lm_action,

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
                                Lm_name,
                                Lm_type,
                                Lm_time,
                                Lm_description,
                                Lm_action,
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
            Lm_name: '',
            Lm_type: '',
            Lm_time: '',
            Lm_description: '',
            Lm_action: '',
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
            Lm_name: data.Lm_name,
            Lm_type: data.Lm_type,
            Lm_time: data.Lm_time,
            Lm_description: data.Lm_description,
            Lm_action: data.Lm_action,
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
    render() {
        const { loading, step, maps_data, map_image_uri, Map_image_URL } = this.state;
        const { Lm_name,
            Lm_type,
            Lm_time,
            Lm_description,
            Lm_action, } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="แผนที่ชุมชน" backHandler={this.onBackHandler}></HeaderAy>

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
                                                {element.Lm_name}
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
                                                {element.Lm_description}
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
                                    value={Lm_name}
                                    onChangeText={str => this.setState({ Lm_name: str })}
                                />
                            </Item>
                            <Item fixedLabel>
                                <Label>ประเภท<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Picker
                                    selectedValue={Lm_type}
                                    onValueChange={str => this.setState({ Lm_type: str })}
                                >
                                    <Picker.Item key="0" label="เลือกประเภทพื้นที่" value="" />
                                    <Picker.Item key="1" label="ทรัพยากรน้ำ" value="ทรัพยากรน้ำ" />
                                    <Picker.Item key="2" label="ทรัพยากรป่าไม้" value="ทรัพยากรป่าไม้" />
                                    <Picker.Item key="3" label="สถานที่สำคัญ" value="สถานที่สำคัญ" />
                                    <Picker.Item key="4" label="บุคคลสำคัญ" value="บุคคลสำคัญ" />
                                    <Picker.Item key="5" label="พื้นที่ดี" value="พื้นที่ดี" />
                                    <Picker.Item key="6" label="พื้นที่เสี่ยง" value="พื้นที่เสี่ยง" />
                                </Picker>

                            </Item>
                            {(Lm_type === 'พื้นที่ดี' || Lm_type === 'พื้นที่เสี่ยง') ?
                                <>
                                    <Item fixedLabel>

                                        <Label>เวลาที่เกิดเหตุ<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <Input
                                            style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                            value={Lm_time}
                                            onChangeText={str => this.setState({ Lm_time: str })}
                                            keyboardType='number-pad'
                                            placeholder="00:00"
                                        />

                                    </Item>
                                    <Item stackedLabel>
                                        <Label>ลักษณะกิจกรรม<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <Textarea
                                            style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                                            rowSpan={4}
                                            value={Lm_description}
                                            onChangeText={str =>
                                                this.setState({ Lm_description: str })
                                            }
                                            placeholder="ลักษณะกิจกรรมที่เกิดขึ้นบนพื้นที่ เกิดเหตุการณ์อะไร อย่างไร"
                                        />
                                    </Item>
                                    <Item stackedLabel>
                                        <Label>ผลที่เกิดขึ้น<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <Textarea
                                            style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                                            rowSpan={4}
                                            value={Lm_action}
                                            onChangeText={str =>
                                                this.setState({ Lm_action: str })
                                            }
                                            placeholder="จากกิจกรรมบนพื้นที่ มีผลที่เกิดขึ้นยังไงบ้าง เช่น การรวมตัวของวัยรุ่นหลังวัดที่เสพสารเสพติด ทำให้เกิดเด็กติดยาและเกิดการลักขโมย"
                                        />
                                    </Item>
                                </>
                                : <>
                                    <Item stackedLabel>
                                        <Label>รายละเอียด :</Label>
                                        <Textarea
                                            style={{ backgroundColor: "#ffffff", borderRadius: 5, minWidth: '100%' }}
                                            rowSpan={4}
                                            value={Lm_description}
                                            onChangeText={str =>
                                                this.setState({ Lm_description: str })
                                            }
                                            placeholder={Lm_type === 'บุคคลสำคัญ' ? "บทบาทในชุมชน" : "รายละเอียดกิจกรรม บนพื้นที่"}
                                        />
                                    </Item>
                                </>
                            }

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

export default connect(mapStateToProps, mapDispatchToProps)(LocalMapsScreen);
