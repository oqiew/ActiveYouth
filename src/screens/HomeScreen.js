import React, { Component } from 'react'
import HeaderAy from '../components/header/HeaderAy'
import Loading from '../components/Loading'
import mainStyle from '../styles/main.style'
import themeStyle from '../styles/theme.style'
import { View, Image, TouchableOpacity, Alert, Platform, BackHandler } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Grid, Col, FooterTab } from 'native-base';
import { connect } from 'react-redux'
import { addProfile } from '../redux/Reducer'
export class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            ...this.props.userReducer.profile
        }
        BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();
        });
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
                <Content contentContainerStyle={{ padding: 15 }}>
                    <View style={mainStyle.content}>
                        <Text>{this.state.Name}</Text>
                        <Grid>
                            <Col style={{ height: '100%', padding: 5 }}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', padding: 10, height: 120 }}
                                // onPress={() => this.props.navigation.navigate(routeName.Maps)}
                                >
                                    <Image
                                        source={require('../assets/maps.png')}
                                        style={{ width: 75, height: 75 }}></Image>
                                    <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                        แผนที่ทั้งหมด</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col style={{ height: '100%', padding: 5 }}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', padding: 10, height: 120 }}
                                // onPress={() => this.props.navigation.navigate(routeName.Maps)}
                                >
                                    <Image
                                        source={require('../assets/maps.png')}
                                        style={{ width: 75, height: 75 }}></Image>
                                    <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                        แผนที่ทั้งหมด</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col style={{ height: '100%', padding: 5 }}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', padding: 10, height: 120 }}
                                // onPress={() => this.props.navigation.navigate(routeName.Maps)}
                                >
                                    <Image
                                        source={require('../assets/maps.png')}
                                        style={{ width: 75, height: 75 }}></Image>
                                    <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                        แผนที่ทั้งหมด</Text>
                                </TouchableOpacity>
                            </Col>
                        </Grid>
                    </View>
                </Content>
                <Footer>
                    <FooterTab style={mainStyle.footer}>
                        <TouchableOpacity
                        // onPress={() => this.props.navigation.navigate(routeName.Main)}
                        >
                            <Image
                                source={require('../assets/dropdown.png')}
                                style={{ width: 50, height: 50 }}></Image>
                        </TouchableOpacity>

                        <TouchableOpacity
                        // onPress={() => this.props.navigation.navigate(routeName.ListUser)}
                        >
                            <Image
                                source={require('../assets/database.png')}
                                style={{ width: 50, height: 50 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                        // onPress={() => this.props.navigation.navigate(routeName.Profile)}
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
