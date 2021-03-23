import React, { Component } from 'react'
import HeaderAy from '../components/header/HeaderAy'
import Loading from '../components/Loading'
import mainStyle from '../styles/main.style'
import themeStyle from '../styles/theme.style'
import { View, Image, TouchableOpacity, Alert, Platform, BackHandler } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Grid, Col, FooterTab, Picker } from 'native-base';
import { connect } from 'react-redux'
import { addProfile, setArea } from '../redux/Reducer'
import { isEmptyValues, isEmptyValue } from '../components/Method'
import { routeName } from '../route/routeName'
import Firestore from '@react-native-firebase/firestore'
import { TableName } from '../database/TableName'

export class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.tbAreas = Firestore().collection(TableName.Areas);
        this.tbUser = Firestore().collection(TableName.Users);
        this.state = {
            loading: false,
            ...this.props.userReducer.profile,
            query_areas: [],
            Area: this.props.userReducer.area,
            select_area: false
        }


    }
    componentDidMount() {
        this.tbAreas.onSnapshot(this.queryAreas);

    }
    queryAreas = (query) => {
        const query_areas = [];
        query.forEach(element => {
            query_areas.push({
                ID: element.id,
                ...element.data()
            })
        });
        // query_areas.forEach(element => {
        //     this.tbAreas.doc(element.ID).set({
        //         Area_name: element.Area_name,
        //         District: element.District,
        //         Dominance: element.Dominance,
        //         Dominance: element.Dominance,
        //         PopulationMs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //         PopulationFs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //         Family: 0,
        //         career: '',
        //         Family_Total_income: 0,
        //         Tradition: '',
        //         TraditionAndNarcotic: '',
        //         ProtectAndNarcotic: '',
        //         ProtectAndCovid: '',
        //         Create_date: Firestore.Timestamp.now(),
        //         Update_date: Firestore.Timestamp.now(),
        //         Update_by_ID: ''

        //     })
        //  });
        this.setState({
            query_areas
        })

    }
    onBackHandler = () => {
        this.props.navigation.goBack()
    }

    onSelectedArea(Area) {
        const { User_type } = this.state;
        if (User_type === 'admin') {
            this.tbUser.doc(this.state.uid).update({
                Area_ID: Area.ID
            }).then(() => {
                this.props.setArea({ Area })
                this.setState({
                    Area, select_area: false
                })
            }).catch((error) => {
                console.log('error update area', error)
            })
        } else {
            this.tbUser.doc(this.state.uid).update({
                User_type: 'ay',
                Area_ID: Area.ID
            }).then(() => {
                this.props.setArea({ Area })
                this.setState({
                    Area, select_area: false
                })
            }).catch((error) => {
                console.log('error update area', error)
            })
        }


    }
    render() {
        const { loading, query_areas, Area, select_area } = this.state;
        const { Subdistrict, subdistricts, subdistrict, province, provinces } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="หน้าหลัก" backHandler={this.onBackHandler}></HeaderAy>

                {isEmptyValue(Area.Area_name) || select_area ?
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
                    </Content>
                    :
                    <Content contentContainerStyle={[mainStyle.background, { display: "flex", justifyContent: "center", alignItems: 'center', height: '100%' }]}>
                        <View style={mainStyle.content}>
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.setState({ select_area: true })}>
                                <Text style={{ fontSize: 20 }}>{Area.Dominance} {Area.Area_name}</Text>
                                <Icon name="edit" type="AntDesign"></Icon>
                            </TouchableOpacity>

                            <Grid>
                                <Col style={{ height: '100%', padding: 5 }}>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 2, height: 120 }}
                                        onPress={() => this.props.navigation.navigate(routeName.Subdistrict)}
                                    >
                                        <Image
                                            source={require('../assets/main/gps.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            ข้อมูลตำบล</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 2, height: 120 }}
                                        onPress={() => this.props.navigation.navigate(routeName.LocalMaps)}
                                    >
                                        <Image
                                            source={require('../assets/main/maps.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            แผนที่ชุมชน</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 2, height: 120 }}
                                        onPress={() => this.props.navigation.navigate(routeName.AY)}
                                    >
                                        <Image
                                            source={require('../assets/user.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            AY</Text>
                                    </TouchableOpacity>
                                </Col>
                                <Col style={{ height: '100%', padding: 5 }}>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 2, height: 120 }}
                                        onPress={() => this.props.navigation.navigate(routeName.Religion)}
                                    >
                                        <Image
                                            source={require('../assets/main/temple.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            ศาสนา</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 2, height: 120 }}
                                        onPress={() => this.props.navigation.navigate(routeName.LocalOrganization)}
                                    >
                                        <Image
                                            source={require('../assets/main/government.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            อปท</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 2, height: 120 }}
                                        onPress={() => this.props.navigation.navigate(routeName.LocalCalendar)}
                                    >
                                        <Image
                                            source={require('../assets/main/calendar.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            ปฏิทิน</Text>
                                    </TouchableOpacity>
                                </Col>
                                <Col style={{ height: '100%', padding: 5 }}>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 2, height: 120 }}
                                        onPress={() => this.props.navigation.navigate(routeName.School)}
                                    >
                                        <Image
                                            source={require('../assets/main/school.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            สถานศึกษา</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 2, height: 120 }}
                                        onPress={() => this.props.navigation.navigate(routeName.YouthNetwork)}
                                    >
                                        <Image
                                            source={require('../assets/main/user_network.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            เครือข่าย</Text>
                                    </TouchableOpacity>

                                    < TouchableOpacity
                                        style={{ alignItems: 'center', padding: 2, height: 120 }}
                                        onPress={() => this.props.navigation.navigate(routeName.Dashboard)}
                                    >
                                        <Image
                                            source={require('../assets/report.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            สรุป</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Grid>
                        </View>
                    </Content>}

                <Footer>
                    <FooterTab style={mainStyle.footer}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate(routeName.Home)}
                        >
                            <Image
                                source={require('../assets/dropdown.png')}
                                style={{ width: 50, height: 50 }}></Image>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate(routeName.UserList)}
                        >
                            <Image
                                source={require('../assets/database.png')}
                                style={{ width: 50, height: 50 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate(routeName.Profile)}
                        >
                            <Image
                                source={require('../assets/user.png')}
                                style={{ width: 50, height: 50 }}></Image>
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
    addProfile, setArea
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
