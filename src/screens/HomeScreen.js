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
            Area: [],
        }


    }
    componentDidMount() {
        console.log(this.props.userReducer.profile)
        this.tbAreas.onSnapshot(this.queryAreas);
        if (!isEmptyValue(this.props.userReducer.profile.Area_ID)) {
            this.tbAreas.doc(this.props.userReducer.profile.Area_ID).get().then((doc) => {
                this.setState({
                    Area: [{ ID: doc.id, ...doc.data() }]
                })
            })
        } else {
            console.log(this.props.userReducer.profile.Area_ID)
        }
    }
    queryAreas = (query) => {
        const query_areas = [];
        query.forEach(element => {
            query_areas.push({
                ID: element.id,
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

    onSelectedArea(Area) {
        this.tbUser.doc(this.state.uid).update({
            User_type: 'ay',
            Area_ID: Area.ID
        }).then(() => {
            this.props.setArea({ Area })
            this.setState({
                Area
            })
        }).catch((error) => {
            console.log('error update area', error)
        })

    }
    render() {
        const { loading, query_areas, Area } = this.state;
        const { Subdistrict, subdistricts, subdistrict, province, provinces } = this.state;
        console.log(this.props.userReducer)
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="หน้าหลัก" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={[mainStyle.background, { display: "flex", justifyContent: "center", alignItems: 'center' }]}>
                    {isEmptyValue(Area.Area_name) ?
                        query_areas.map((element, i) =>
                            <TouchableOpacity key={i} style={{
                                backgroundColor: themeStyle.Color_green,
                                borderRadius: 10,
                                marginBottom: 10,
                                padding: 12,
                                width: "90%",
                                margin: 5,
                            }}>
                                <Text style={{ fontSize: 30, color: '#ffffff', textAlign: 'center' }} onPress={this.onSelectedArea.bind(this, element)}>{element.Area_name}</Text>
                            </TouchableOpacity>
                        )

                        :
                        <View style={mainStyle.content}>
                            <Text>{Subdistrict}</Text>
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
                                        onPress={() => this.props.navigation.navigate(routeName.Multimedia)}
                                    >
                                        <Image
                                            source={require('../assets/main/video.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            สื่อ</Text>
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
                                        onPress={() => this.props.navigation.navigate(routeName.Dashboard)}
                                    >
                                        <Image
                                            source={require('../assets/report.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            สรุป</Text>
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
                            </Grid>
                        </View>}

                </Content>
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
