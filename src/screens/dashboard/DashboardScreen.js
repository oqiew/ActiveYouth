import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform, StyleSheet, ScrollView, PermissionsAndroid } from 'react-native';
import {
    Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Textarea, Picker, Body, Title, Header
    , Grid, Col
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
import { isEmptyValue } from '../../components/Method';
import Firestore from '@react-native-firebase/firestore'
import { TableName } from '../../database/TableName'
import user_network from '../../assets/map/user_network.png'
import user from '../../assets/map/user.png'
import river from '../../assets/map/river.png'
import resource from '../../assets/map/resource.png'
import user_star from '../../assets/map/user_star.png'
import government_star from '../../assets/map/government_star.png'
import flag_good from '../../assets/map/flag_good.png'
import flag_danger from '../../assets/map/flag_danger.png'
import government from '../../assets/map/government.png'
import temple from '../../assets/map/temple.png'
import school from '../../assets/map/school.png'
import Geolocation from '@react-native-community/geolocation';
import ViewData from './ViewData';
import Pie from 'react-native-pie'
import { writeFile } from 'react-native-fs';
import XLSX from 'xlsx';
export class DashboardScreen extends Component {
    constructor(props) {
        super(props)
        this.tbAreas = Firestore().collection(TableName.Areas);
        this.tbReligions = Firestore().collection(TableName.Religions);
        this.tbSchools = Firestore().collection(TableName.Schools);
        this.tbLocalOrganizations = Firestore().collection(TableName.LocalOrganizations);
        this.tbYouthNetworks = Firestore().collection(TableName.YouthNetworks);
        this.tbLocalMaps = Firestore().collection(TableName.LocalMaps);
        this.tbAYs = Firestore().collection(TableName.AYs);
        this.tbCalendar = Firestore().collection(TableName.LocalCalendar);
        this.tbLocalDisease = Firestore().collection(TableName.LocalDisease);
        this.state = {
            loading: false,
            Subdistrict: '',
            showingInfoWindow: false,
            position: { lat: 15.229399, lng: 104.857126 },
            position2: { lat: 15.229399, lng: 104.857126 },
            religion_maps: [],
            ...this.props.userReducer.profile,
            Area: this.props.userReducer.area,

            // data map
            query_areas: [],
            query_religions: [],
            query_schools: [],
            query_local_organizations: [],
            query_yns: [],
            query_ays: [],
            query_local_map: [],
            query_local_map1: [],
            query_local_map2: [],
            query_local_map3: [],
            query_local_map4: [],
            query_local_map5: [],
            query_local_map6: [],

            excel_areas: [],
            excel_religions: [],
            excel_schools: [],
            excel_local_organizations: [],
            excel_yns: [],
            excel_ays: [],
            excel_calendar: [],
            excel_localDisease: [],
            excel_local_map: [],
            action: 'map',
            select_area: '',
            view_data: '',
        }
    }

    componentDidMount() {
        this.tbAreas.onSnapshot(this.queryAreas);


    }
    exportExcel = async (name, data) => {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "การอนุญาตสิทธิ์การใช้งาน",
                    message:
                        "จำเป็นต้องขอสิทธิ์การใช้งานพื้นที่จัดเก็บข้อมูล",
                    buttonNeutral: "ถามฉันทีหลัง",
                    buttonNegative: "ยกเลิก",
                    buttonPositive: "ตกลง"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log(this.state.excel, this.state.excel.length())
                var ws = XLSX.utils.json_to_sheet(data);
                // console.log(ws)
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, name);

                const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });
                var RNFS = require('react-native-fs');
                var file = RNFS.DownloadDirectoryPath + name + '.xlsx';
                writeFile(file, wbout, 'ascii').then((r) => {
                    console.log('FILE WRITTEN!');
                    Alert.alert("บันทึกไฟล์เสร็จสิ้น", 'ที่ Download/' + name + '.xlsx')
                }).catch((e) => {
                    console.log(e);
                });
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }

    }
    listMarkLocalOrganization = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_local_organizations = [];
        const excel_local_organizations = [];
        let count = 0;
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Position,
                Lgo_name, Lgo_type, Lgo_position_youth, Lgo_officer,
                Lgo_policy_youth, Lgo_activity_protect, Lgo_activity
            } = doc.data();
            if (!isEmptyValue(Position)) {
                excel_local_organizations.push({
                    "ชื่อองค์กร": Lgo_name,
                    "ประเภทองค์กร": Lgo_type,
                    "บุคลากร": Lgo_officer,
                    "คนที่ทำงานด้านเด็ก": Lgo_position_youth,
                    "นโยบาย": Lgo_policy_youth,
                    "กิจกรรมด้านสุขภาพ": Lgo_activity_protect,
                    "กิขกรรมเานเด็ก": Lgo_activity,
                })
                query_local_organizations.push(
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
                        <Callout tooltip onPress={() => this.setState({ view_data: doc.data(), data_type: 'lo' })}>
                            <View >
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
            }
            count++;
        });
        this.setState({
            query_local_organizations,
            excel_local_organizations,
            loading: false,
        });
    };
    listMarkLocalMap = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_local_map = [];
        const excel_local_map = [];
        const query_local_map1 = [];
        const query_local_map2 = [];
        const query_local_map3 = [];
        const query_local_map4 = [];
        const query_local_map5 = [];
        const query_local_map6 = [];

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
                query_local_map1.push({ iconm })
            } else if (Lm_type === 'ทรัพยากรป่าไม้') {
                iconm = resource;
                query_local_map2.push({ iconm })
            } else if (Lm_type === 'สถานที่สำคัญ') {
                iconm = government_star;
                query_local_map3.push({ iconm })
            } else if (Lm_type === 'บุคคลสำคัญ') {
                iconm = user_star;
                query_local_map4.push({ iconm })
            } else if (Lm_type === 'พื้นที่ดี') {
                iconm = flag_good;
                query_local_map5.push({ iconm })
            } else if (Lm_type === 'พื้นที่เสี่ยง') {
                iconm = flag_danger;
                query_local_map6.push({ iconm })
            }
            if (!isEmptyValue(Position)) {
                excel_local_map.push({
                    "ชื่อพื้นที่": Lm_name,
                    "ประเภทพื้นที่": Lm_type,
                    "เวลาที่เกิดเหตุ": Lm_time,
                    "ลักษณะ/รายละเอียด": Lm_description,
                    "ผลที่เกิดขึ้น": Lm_action,
                })
                query_local_map.push(
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
                        <Callout tooltip onPress={() => this.setState({ view_data: doc.data(), data_type: 'lm' })}>
                            <View >
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
            }
            count++;
        });
        this.setState({
            query_local_map,
            query_local_map1,
            query_local_map2,
            query_local_map3,
            query_local_map4,
            query_local_map5,
            query_local_map6,
            excel_local_map,
            loading: false,
        });
    };
    listMarkAy = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_ays = [];
        const excel_ays = [];
        let count = 0;
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Position,
                Y_name, Y_description, Y_type, Y_family, Y_family_stay,
                Y_role, Y_concept, Y_family_career, Y_family_status, Y_family_sub_career,
                Y_covid19, Y_alcohol, Y_cigarette, Y_alcohol_cigarette,
                Y_attitude, Y_family_activity, Income1, Income2, Income3, Income4
            } = doc.data();
            if (!isEmptyValue(Position)) {
                excel_ays.push({
                    "ชื่อ-นามสกุล": Y_name,
                    "เกี่ยวกับ": Y_description,
                    "ประเภทของบุคคล": Y_type,
                    "สมาชิกครอบครัว": Y_family,
                    "อาศัยอยู่ด้วยกัน": Y_family_stay,
                    "บทบาทของสมาชิก": Y_role,
                    "แนวคิด": Y_concept,
                    "รายได้2763": Income1,
                    "รายได้5346": Income2,
                    "รายได้6531": Income3,
                    "รายได้มากกว่า6531บาท": Income4,
                    "อาชีพหลักของครอบครัว": Y_family_career,
                    "อาชีพรองของครอบครัว": Y_family_sub_career,
                    "สถานะของครอบครัว": Y_family_status,
                    "ผลกระทบจากcovid19": Y_covid19,
                    "ดื่มสุรา": Y_alcohol,
                    "สูบบุหรี่": Y_cigarette,
                    "สูบบุหรี่และดื่มสุรา": Y_alcohol_cigarette,
                    "ทัศนคติ": Y_attitude,
                    "กิจกรรมภายในครอบครัว": Y_family_activity,
                })
                query_ays.push(
                    <Marker
                        key={count}
                        coordinate={{
                            latitude: Position.lat,
                            longitude: Position.lng,
                        }}
                        image={user}
                        icon={user}
                    // label={count}
                    >
                        <Callout tooltip onPress={() => this.setState({ view_data: doc.data(), data_type: 'ay' })}>
                            <View>
                                <View style={mainStyle.map_bubble}>
                                    <Text style={mainStyle.map_name}>{Y_name}</Text>
                                    <Text style={{ fontSize: 12, color: '#6a6a6a', flexWrap: 'wrap' }}>{Y_description}</Text>
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
            }
            count++;
        });
        this.setState({
            query_ays,
            excel_ays,
            loading: false,
        });
    };
    listMarkReligion = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_religions = [];
        const excel_religions = [];
        let count = 0;
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Religion_name, Religion_user, Religion_activity, Religion_alcohol,
                Relegion_covid19, Relegion_belief, Position
            } = doc.data();
            if (!isEmptyValue(Position)) {
                excel_religions.push({
                    "ชื่อสถานที่": Religion_name,
                    "บุคคลสำคัญที่เกี่ยวข้อง": Religion_user,
                    "กิจกรรม": Religion_activity,
                    "การจำหน่ายบุหรี่และเครื่องดื่มแอลกอฮอล์": Religion_alcohol,
                    "ผลกระทบจากcovid19": Relegion_covid19,
                    "ความเชื่อ": Relegion_belief,
                })
                query_religions.push(
                    <Marker
                        key={count}

                        coordinate={{
                            latitude: Position.lat,
                            longitude: Position.lng,
                        }}

                        image={temple}
                        icon={temple}
                    // label={count}
                    >
                        <Callout tooltip onPress={() => this.setState({ view_data: doc.data(), data_type: 're' })}>
                            <View>
                                <View style={mainStyle.map_bubble}>
                                    <Text style={mainStyle.map_name}>{Religion_name}</Text>
                                    <Text style={{ fontSize: 12, color: '#6a6a6a', flexWrap: 'wrap' }}>{Religion_activity}</Text>
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
            }
            count++;
        });

        this.setState({
            query_religions,
            excel_religions,
            loading: false,
        });
    };
    listMarkYn = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_yns = [];
        const excel_yns = [];
        let count = 0;
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Position,
                Yn_name,
                Yn_description,
                Yn_phone_number,
                Relevant
            } = doc.data();
            if (!isEmptyValue(Position)) {
                excel_yns.push({
                    "ชื่อเครือข่าย": Yn_name,
                    "เบอร์ติดต่อ": Yn_phone_number,
                    "เบอร์ติดต่อ": Yn_description,
                    "บทบาทการทำงานร่วมกัน": Relevant,
                })
                query_yns.push(
                    <Marker
                        key={count}
                        coordinate={{
                            latitude: Position.lat,
                            longitude: Position.lng,
                        }}
                        image={user_network}
                        icon={user_network}
                    // label={count}
                    >
                        <Callout tooltip onPress={() => this.setState({ view_data: doc.data(), data_type: 'yn' })}>
                            <View>
                                <View style={mainStyle.map_bubble}>
                                    <Text style={mainStyle.map_name}>{Yn_name}</Text>
                                    <Text style={{ fontSize: 12, color: '#6a6a6a', flexWrap: 'wrap' }}>{Yn_description}</Text>
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
            }
            count++;
        });
        this.setState({
            query_yns, excel_yns,
            loading: false,
        });
    };
    listMarkSchool = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_schools = [];
        const excel_schools = [];
        let count = 0;
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Position,
                School_name, School_study, School_activity, School_alcohol,
                School_cigarette, School_covid19,
            } = doc.data();
            if (!isEmptyValue(Position)) {
                excel_schools.push({
                    "ชื่อพื้นที่": School_name,
                    "การเรียน": School_study,
                    "กิจกรรม": School_activity,
                    "การจำหน่ายบุหรี่และเครื่องดื่มแอลกอฮอล์": School_alcohol,
                    "การสูบบุหรี่": School_cigarette,
                    "ผลกระทบจากcovid19": School_covid19,
                })
                query_schools.push(
                    <Marker
                        key={count}
                        coordinate={{
                            latitude: Position.lat,
                            longitude: Position.lng,
                        }}
                        image={school}
                        icon={school}
                    // label={count}
                    >
                        <Callout tooltip onPress={() => this.setState({ view_data: doc.data(), data_type: 'sc' })}>
                            <View >
                                <View style={mainStyle.map_bubble}>
                                    <Text style={mainStyle.map_name}>{School_name}</Text>
                                    <Text style={{ fontSize: 12, color: '#6a6a6a', flexWrap: 'wrap' }}>{School_activity}</Text>
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
            }
            count++;
        });
        this.setState({
            query_schools,
            excel_schools,
            loading: false,
        });
    };
    listLocalCalendar = querySnapshot => {
        const excel_calendar = this.state;
        querySnapshot.forEach(element => {
            const { Name_activity, Type_activity, Attribute
                , Month1, Month2, } = this.state;
            excel_calendar.push({
                "ชื่อกิจกรรม": Name_activity,
                "ประเภท": Type_activity,
                "ลักษณะ": Attribute,
                "เดือนที่เริ่ม": Month1,
                "เดือนที่สิ้นสุด": Month2,

            })

        })
        this.setState({
            excel_calendar
        })
    }
    listLocalDisease = querySnapshot => {
        const excel_localDisease = this.state;
        querySnapshot.forEach(element => {
            const { Name_disease, Male_number, Age_male_number, Female_number, Age_female_number, } = this.state;
            excel_localDisease.push({
                "ชื่อโรค": Name_disease,
                "จำนวนเพศชาย": Male_number,
                "ช่วงอายุเพศชาย": Age_male_number,
                "จำนวนเพศหญิง": Female_number,
                "ช่วงอายุเพศหญิง": Age_female_number,

            })

        })
        this.setState({
            excel_localDisease
        })
    }
    queryAreas = (query) => {
        const query_areas = [];
        query.forEach(element => {
            query_areas.push({
                ID: element.id,
                sumF: element.data().PopulationFs.reduce((a, b) => parseInt(a, 10) + parseInt(b, 10), 0),
                sumM: element.data().PopulationMs.reduce((a, b) => parseInt(a, 10) + parseInt(b, 10), 0),
                ...element.data()
            })
        });

        this.setState({
            // select_area: query_areas[8],
            // action: "view",
            query_areas
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
        try {
            this.setState({
                position: {
                    lat: e.nativeEvent.coordinate.latitude,
                    lng: e.nativeEvent.coordinate.longitude,
                },
            });
        } catch (error) {
            console.log(e, error)
        }

    };

    findCoordinates = () => {
        this.setState({ loading: true })
        Geolocation.getCurrentPosition(
            position => {

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
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 10000,
                distanceFilter: 50,
                forceRequestLocation: true,
            },
        );

    };
    // เลือกพื้นที่และค้นหาข้อมูล
    onSelectedArea(Area) {
        this.setState({
            Area,
            select_area: Area
        }, () => {
            this.tbReligions.where('Area_ID', '==', Area.ID)
                .onSnapshot(this.listMarkReligion);
            this.tbSchools.where('Area_ID', '==', Area.ID)
                .onSnapshot(this.listMarkSchool);
            this.tbLocalOrganizations.where('Area_ID', '==', Area.ID)
                .onSnapshot(this.listMarkLocalOrganization);
            this.tbYouthNetworks.where('Area_ID', '==', Area.ID)
                .onSnapshot(this.listMarkYn);
            this.tbLocalMaps.where('Area_ID', '==', Area.ID)
                .onSnapshot(this.listMarkLocalMap);
            this.tbAYs.where('Area_ID', '==', Area.ID)
                .onSnapshot(this.listMarkAy);
            this.tbCalendar.where('Area_ID', '==', Area.ID)
                .onSnapshot(this.listLocalCalendar);
            this.tbLocalDisease.where('Area_ID', '==', Area.ID)
                .onSnapshot(this.listLocalDisease);
        })
    }
    render() {
        const { loading, action, select_area, query_areas, view_data, data_type } = this.state;
        const { Religion_name, Religion_user, Religion_activity, Religion_alcohol,
            Relegion_covid19, Relegion_belief, LM_type, subdistricts, subdistrict } = this.state;
        const { query_religions, query_schools, query_local_organizations, query_yns,
            query_ays, query_local_map, } = this.state;
        const { query_local_map1, query_local_map2, query_local_map3, query_local_map4
            , query_local_map5, query_local_map6 } = this.state;
        const _mstyle = StyleSheet.create({
            sub_text_row: {
                backgroundColor: '#ffffff', borderRadius: 5, width: '63%',
                padding: 3
            },
            sub_text_colum: {
                backgroundColor: '#ffffff', borderRadius: 5, width: '100%',
                padding: 3
            },
        });
        let numbermapLocal = parseInt(query_local_map.length, 10);
        if (numbermapLocal === 0) {
            numbermapLocal = 1;
        }
        let numberMap = parseInt(query_religions.length, 10) + parseInt(query_schools.length, 10) + parseInt(query_local_organizations.length, 10) +
            parseInt(query_yns.length, 10) + parseInt(query_ays.length, 10);
        if (numberMap === 0) {
            numberMap = 1;
        }

        const dataSet1 = [
            {
                name: "Johson",
                amount: 30000,
                sex: 'M',
                is_married: true
            },
            {
                name: "Monika",
                amount: 355000,
                sex: 'F',
                is_married: false
            },
            {
                name: "John",
                amount: 250000,
                sex: 'M',
                is_married: false
            },
            {
                name: "Josef",
                amount: 450500,
                sex: 'M',
                is_married: true
            }
        ];
        return (
            <Container>
                <Loading visible={loading}></Loading>
                {isEmptyValue(select_area) ? <HeaderAy name="เลือกพื้นที่" backHandler={this.onBackHandler}></HeaderAy>
                    : <HeaderAy name={select_area.Dominance + select_area.Area_name} backHandler={() => this.setState({ select_area: "" })}></HeaderAy>
                }
                {isEmptyValue(select_area) ?
                    <Content contentContainerStyle={[mainStyle.background, { display: "flex", justifyContent: "center", alignItems: 'center' }]}>
                        {query_areas.map((element, i) =>
                            <TouchableOpacity key={i} style={{
                                backgroundColor: themeStyle.Color_green,
                                borderRadius: 10,
                                marginBottom: 10,
                                padding: 12,
                                width: "90%",
                                margin: 5,
                            }}
                                onPress={this.onSelectedArea.bind(this, element)}
                            >
                                <Text style={{ fontSize: 30, color: '#ffffff', textAlign: 'center' }} >{element.Area_name}</Text>
                            </TouchableOpacity>
                        )}
                    </Content> : <>
                        {action === 'map' &&
                            isEmptyValue(view_data) ?
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
                                {query_religions}
                                {query_schools}
                                {query_local_organizations}
                                {query_yns}
                                {query_ays}
                                {query_local_map}
                            </MapView>
                            : isEmptyValue(view_data) ? <></> : <ViewData data={view_data} data_type={data_type}
                                onCancel={() => this.setState({ view_data: '', data_type: '' })}></ViewData>
                        }
                        {action === 'view' &&
                            <Content contentContainerStyle={{ padding: 15, backgroundColor: '#f0f2f5' }}>
                                <View style={{ flexDirection: "row", justifyContent: 'flex-end', margin: 5 }}>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ action: 'map' })}
                                        style={{
                                            backgroundColor: '#ff0000', margin: 2,
                                            padding: 3, borderRadius: 5, width: 30
                                        }}>
                                        <Text style={{ color: '#ffffff', textAlign: 'center' }}>ปิด</Text>
                                    </TouchableOpacity>
                                </View>

                                <View
                                    style={[{
                                        paddingVertical: 5,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }, mainStyle.cardBox]}
                                >
                                    <View style={{ width: 60, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text>
                                            ชาย{"\n"}{select_area.sumM}
                                        </Text>
                                    </View>
                                    <Pie
                                        radius={80}
                                        sections={[
                                            {
                                                percentage: (select_area.sumM * 100) / (select_area.sumM + select_area.sumF === 0 ? 1 : select_area.sumM + select_area.sumF),
                                                color: '#C70039',
                                            },
                                            {
                                                percentage: (select_area.sumF * 100) / (select_area.sumM + select_area.sumF === 0 ? 1 : select_area.sumM + select_area.sumF),
                                                color: '#404FCD',
                                            },
                                        ]}
                                        strokeCap={'butt'}
                                    />
                                    <View style={{ width: 60, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text>
                                            หญิง{"\n"}{select_area.sumF}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={[{
                                        paddingVertical: 5,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }, mainStyle.cardBox]}
                                >
                                    <Pie
                                        radius={80}
                                        sections={[
                                            {
                                                percentage: (query_religions.length * 100) / numberMap,
                                                color: '#165ff3',
                                            },
                                            {
                                                percentage: (query_schools.length * 100) / numberMap,
                                                color: '#11ace8',
                                            },
                                            {
                                                percentage: (query_local_organizations.length * 100) / numberMap,
                                                color: '#f94906',
                                            },
                                            {
                                                percentage: (query_yns.length * 100) / numberMap,
                                                color: '#07f8b6',
                                            },
                                            {
                                                percentage: (query_ays.length * 100) / numberMap,
                                                color: '#ce71ad',
                                            },
                                        ]}
                                        strokeCap={'butt'}
                                    />

                                    <View style={{ flexDirection: "column", justifyContent: "center" }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: "#165ff3", width: 10, height: 10, borderRadius: 10 }}></View>
                                            <Text>ศาสนา</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: "#11ace8", width: 10, height: 10, borderRadius: 10 }}></View>
                                            <Text>สถานศึกษา</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: "#f94906", width: 10, height: 10, borderRadius: 10 }}></View>
                                            <Text>อปท</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: "#07f8b6", width: 10, height: 10, borderRadius: 10 }}></View>
                                            <Text>เครือข่าย</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: "#ce71ad", width: 10, height: 10, borderRadius: 10 }}></View>
                                            <Text>ay</Text>
                                        </View>
                                    </View>
                                </View>
                                <View
                                    style={[{
                                        paddingVertical: 5,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }, mainStyle.cardBox]}
                                >
                                    <Pie
                                        radius={80}
                                        sections={[
                                            {
                                                percentage: (query_local_map1.length * 100) / numbermapLocal,
                                                color: '#f3a80c',
                                            },
                                            {
                                                percentage: (query_local_map2.length * 100) / numbermapLocal,
                                                color: '#f5cf5c',
                                            },
                                            {
                                                percentage: (query_local_map3.length * 100) / numbermapLocal,
                                                color: '#8080ff',
                                            },
                                            {
                                                percentage: (query_local_map4.length * 100) / numbermapLocal,
                                                color: '#00bfbf',
                                            },
                                            {
                                                percentage: (query_local_map5.length * 100) / numbermapLocal,
                                                color: '#ffff80',
                                            },
                                            {
                                                percentage: (query_local_map6.length * 100) / numbermapLocal,
                                                color: '#28bb6f',
                                            },

                                        ]}
                                        strokeCap={'butt'}
                                    />

                                    <View style={{ flexDirection: "column", justifyContent: "center" }}>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: "#f3a80c", width: 10, height: 10, borderRadius: 10 }}></View>
                                            <Text>ทรัพยากรน้ำ</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: "#f5cf5c", width: 10, height: 10, borderRadius: 10 }}></View>
                                            <Text>ทรัพยากรป่าไม้</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: "#8080ff", width: 10, height: 10, borderRadius: 10 }}></View>
                                            <Text>สถานที่สำคัญ</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: "#00bfbf", width: 10, height: 10, borderRadius: 10 }}></View>
                                            <Text>บุคคลสำคัญ</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: "#ffff80", width: 10, height: 10, borderRadius: 10 }}></View>
                                            <Text>จุดดี</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: "#28bb6f", width: 10, height: 10, borderRadius: 10 }}></View>
                                            <Text>จุดเสี่ยง</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', padding: 3 }}>
                                    <Text style={{ textAlign: "left", width: 120 }}>
                                        จำนวนครัวเรือน
                                    </Text>
                                    <Text style={_mstyle.sub_text_row}>
                                        {select_area.Family}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'column', padding: 3 }}>
                                    <Text style={{ textAlign: "left" }}>
                                        ลักษณะการประกอบอาชีพ
                                    </Text>
                                    <Text style={_mstyle.sub_text_colum}>
                                        {select_area.career}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', padding: 3 }}>
                                    <Text style={{ textAlign: "left", width: 120 }}>
                                        รายได้เฉลี่ยต่อเดือน
                                    </Text>
                                    <Text style={_mstyle.sub_text_row}>
                                        {select_area.Family_Total_income}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'column', padding: 3 }}>
                                    <Text style={{ textAlign: "left" }}>
                                        ประเพณี
                                    </Text>
                                    <Text style={_mstyle.sub_text_colum}>
                                        {select_area.Tradition}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'column', padding: 3 }}>
                                    <Text style={{ textAlign: "left" }}>
                                        ประเพณีมีการสูบบุหรี่ ดื่มสุรา
                                    </Text>
                                    <Text style={_mstyle.sub_text_colum}>
                                        {select_area.TraditionAndNarcotic}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'column', padding: 3 }}>
                                    <Text style={{ textAlign: "left" }}>
                                        กิจกรรมส่งเสริมสุขภาพ
                                    </Text>
                                    <Text style={_mstyle.sub_text_colum}>
                                        {select_area.ProtectAndNarcotic}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'column', padding: 3 }}>
                                    <Text style={{ textAlign: "left" }}>
                                        กิจกรรมส่งเสริมสุขภาพ ในช่วง covid 19
                                    </Text>
                                    <Text style={_mstyle.sub_text_colum}>
                                        {select_area.ProtectAndCovid}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'column', padding: 3 }}>
                                    <Text style={{ textAlign: "left" }}>
                                        การรับข้อมูล
                                    </Text>
                                    <Text style={_mstyle.sub_text_colum}>
                                        {select_area.M_chanel_input}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'column', padding: 3 }}>
                                    <Text style={{ textAlign: "left" }}>
                                        สื่อที่กระตุ้นให้เกิดความอยากสูบบุหรี่ ดื่มสุรา
                                    </Text>
                                    <Text style={_mstyle.sub_text_colum}>
                                        {select_area.M_urge}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'column', padding: 3 }}>
                                    <Text style={{ textAlign: "left" }}>
                                        ช่องทางการโฆษณาบุหรี่หรือสุรา
                                    </Text>
                                    <Text style={_mstyle.sub_text_colum}>
                                        {select_area.M_alcohol}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'column', padding: 3 }}>
                                    <Text style={{ textAlign: "left" }}>
                                        อิทธิพล
                                    </Text>
                                    <Text style={_mstyle.sub_text_colum}>
                                        {select_area.M_influence}
                                    </Text>
                                </View>
                            </Content>
                        }
                        {action === 'load' &&
                            <Content contentContainerStyle={{ padding: 15, alignItems: 'center' }}>
                                <Text>โหลดข้อมูล</Text>
                                <Grid>
                                    <Col style={{ height: '100%', padding: 5 }}>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', padding: 2, height: 120 }}
                                            onPress={this.exportExcel.bind(this, "แผนที่ชุมชน", this.state.excel_local_map)}
                                        >
                                            <Image
                                                source={require('../../assets/main/maps.png')}
                                                style={{ width: 75, height: 75 }}></Image>
                                            <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                                แผนที่ชุมชน</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', padding: 2, height: 120 }}
                                            onPress={this.exportExcel.bind(this, "AY", this.state.excel_ays)}
                                        >
                                            <Image
                                                source={require('../../assets/user.png')}
                                                style={{ width: 75, height: 75 }}></Image>
                                            <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                                AY</Text>
                                        </TouchableOpacity>
                                        < TouchableOpacity
                                            style={{ alignItems: 'center', padding: 2, height: 120 }}
                                            onPress={this.exportExcel.bind(this, "ข้อมูลโรค", this.state.excel_localDisease)}
                                        >
                                            <Image
                                                source={require('../../assets/main/virus.png')}
                                                style={{ width: 75, height: 75 }}></Image>
                                            <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                                ข้อมูลโรค</Text>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ height: '100%', padding: 5 }}>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', padding: 2, height: 120 }}
                                            onPress={this.exportExcel.bind(this, "ศาสนา", this.state.excel_religions)}
                                        >
                                            <Image
                                                source={require('../../assets/main/temple.png')}
                                                style={{ width: 75, height: 75 }}></Image>
                                            <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                                ศาสนา</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', padding: 2, height: 120 }}
                                            onPress={this.exportExcel.bind(this, "อปท", this.state.excel_local_organizations)}

                                        >
                                            <Image
                                                source={require('../../assets/main/government.png')}
                                                style={{ width: 75, height: 75 }}></Image>
                                            <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                                อปท</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', padding: 2, height: 120 }}
                                            onPress={this.exportExcel.bind(this, "ปฏิทิน", this.state.excel_calendar)}
                                        >
                                            <Image
                                                source={require('../../assets/main/calendar.png')}
                                                style={{ width: 75, height: 75 }}></Image>
                                            <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                                ปฏิทิน</Text>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ height: '100%', padding: 5 }}>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', padding: 2, height: 120 }}
                                            onPress={this.exportExcel.bind(this, "สถานศึกษา", this.state.excel_schools)}
                                        >
                                            <Image
                                                source={require('../../assets/main/school.png')}
                                                style={{ width: 75, height: 75 }}></Image>
                                            <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                                สถานศึกษา</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', padding: 2, height: 120 }}
                                            onPress={this.exportExcel.bind(this, "เครือข่าย", this.state.excel_yns)}
                                        >
                                            <Image
                                                source={require('../../assets/main/user_network.png')}
                                                style={{ width: 75, height: 75 }}></Image>
                                            <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                                เครือข่าย</Text>
                                        </TouchableOpacity>


                                    </Col>
                                </Grid>
                            </Content>
                        }
                    </>
                }
                {!isEmptyValue(select_area) && <>
                    {action === 'map' && <Footer style={{ backgroundColor: '#ffffff' }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
                            onPress={this.findCoordinates}>
                            <Icon name="enviroment" type="AntDesign"></Icon>
                            <Text>
                                เลือกพิกัดที่อยู่ตอนนี้
                            </Text>

                        </TouchableOpacity>
                    </Footer>}
                    <Footer style={{ backgroundColor: '#ffffff', justifyContent: "space-around" }}>


                        <TouchableOpacity
                            style={{ justifyContent: 'center' }}
                            onPress={() =>
                                this.setState({ action: 'map' })
                            }>
                            <Image
                                source={require('../../assets/maps.png')}
                                style={{ width: 50, height: 50 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ justifyContent: 'center' }}
                            onPress={() =>
                                this.setState({ action: 'view' })
                            }>
                            <Image
                                source={require('../../assets/table.png')}
                                style={{ width: 60, height: 60 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ justifyContent: 'center' }}
                            onPress={() =>
                                this.setState({ action: 'load' })
                            }>
                            <Image
                                source={require('../../assets/document.png')}
                                style={{ width: 45, height: 45 }}></Image>
                        </TouchableOpacity>
                    </Footer></>}
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
