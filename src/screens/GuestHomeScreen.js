import React, { Component } from 'react'
import HeaderAy from '../components/header/HeaderAy'
import Loading from '../components/Loading'
import mainStyle from '../styles/main.style'
import themeStyle from '../styles/theme.style'
import { View, Image, TouchableOpacity, Alert, Platform, BackHandler } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Grid, Col, FooterTab } from 'native-base';
import { connect } from 'react-redux'
import { addProfile } from '../redux/Reducer'
import { isEmptyValues } from '../components/Method'
import { routeName } from '../route/routeName'

export class GuestHomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    onBackHandler = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { loading } = this.state;

        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="หน้าหลัก" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={[mainStyle.background, { height: "100%" }]}>
                    <View style={mainStyle.content}>
                        <Grid>
                            <Col style={{ height: '100%', padding: 5 }}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', padding: 2, height: 120 }}
                                    onPress={() => this.props.navigation.navigate(routeName.DashboardGust)}
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
    addProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(GuestHomeScreen);
