import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform, StyleSheet, ScrollView } from 'react-native';
import {
    Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Textarea, Picker, Body, Title, Header
} from 'native-base';
import Loading from '../../components/Loading';
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
        this.state = {
            loading: false,
            Subdistrict: '',
            showingInfoWindow: false,
            position: { lat: 15.229399, lng: 104.857126 },
            position2: { lat: 15.229399, lng: 104.857126 },
            religion_maps: [],


            // data map
            query_areas: [],
            query_religions: [],
            query_schools: [],
            query_local_organizations: [],
            query_yns: [],
            query_ays: [],
            query_local_map: [],

            action: 'map',
            select_area: '',
            view_data: '',
        }
    }

    componentDidMount() {
        this.tbAreas.onSnapshot(this.queryAreas);


    }
    listMarkLocalOrganization = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_local_organizations = [];
        let count = 0;
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Position,
                Lgo_name, Lgo_type, Lgo_position_youth, Lgo_officer,
                Lgo_policy_youth, Lgo_activity_protect, Lgo_activity
            } = doc.data();
            if (!isEmptyValue(Position)) {
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
            loading: false,
        });
    };
    listMarkLocalMap = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_local_map = [];
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
            loading: false,
        });
    };
    listMarkAy = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_ays = [];
        let count = 0;
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Position,
                Y_name, Y_description, Y_type, Y_family, Y_family_stay,
                Y_role, Y_concept, Y_family_career, Y_family_status,
                Y_covid19, Y_alcohol, Y_cigarette, Y_alcohol_cigarette,
                Y_attitude, Y_family_activity,
            } = doc.data();
            if (!isEmptyValue(Position)) {
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
            loading: false,
        });
    };
    listMarkReligion = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_religions = [];
        let count = 0;
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Religion_name, Religion_user, Religion_activity, Religion_alcohol,
                Relegion_covid19, Relegion_belief, Position
            } = doc.data();
            if (!isEmptyValue(Position)) {
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
            loading: false,
        });
    };
    listMarkYn = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_yns = [];
        let count = 0;
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Position,
                Yn_name,
                Yn_description,
                Yn_phone_number,
            } = doc.data();
            if (!isEmptyValue(Position)) {
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
            query_yns,
            loading: false,
        });
    };
    listMarkSchool = querySnapshot => {
        this.setState({
            loading: true,
        });
        const query_schools = [];
        let count = 0;
        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Map_image_URL, Position,
                School_name, School_study, School_activity, School_alcohol,
                School_cigarette, School_covid19,
            } = doc.data();
            if (!isEmptyValue(Position)) {
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
            loading: false,
        });
    };
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
            query_areas
        })
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

        }

    };

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
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 10000,
                distanceFilter: 50,
                forceRequestLocation: true,
            },
        );

    };
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
        })
    }
    render() {
        const { loading, action, select_area, query_areas, view_data, data_type } = this.state;
        const { Religion_name, Religion_user, Religion_activity, Religion_alcohol,
            Relegion_covid19, Relegion_belief, LM_type, subdistricts, subdistrict } = this.state;
        const { query_religions, query_schools, query_local_organizations, query_yns,
            query_ays, query_local_map, } = this.state;
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
                                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ action: 'map' })}
                                        style={{
                                            backgroundColor: '#ff0000', margin: 2,
                                            padding: 3, borderRadius: 5, width: 30
                                        }}>
                                        <Text style={{ color: '#ffffff', textAlign: 'center' }}>ปิด</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row', padding: 3 }}>
                                    <Text style={{ textAlign: "left", width: 120 }}>
                                        ประชากรชาย
                                    </Text>
                                    <Text style={_mstyle.sub_text_row}>
                                        {select_area.sumM}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', padding: 3 }}>
                                    <Text style={{ textAlign: "left", width: 120 }}>
                                        ประชากรหญิง
                                    </Text>
                                    <Text style={_mstyle.sub_text_row}>
                                        {select_area.sumF}
                                    </Text>
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
                    </>
                }
                {!isEmptyValue(select_area) && <>
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
                    </Footer></>}
            </Container>
        )
    }
}

export default (DashboardScreen);
