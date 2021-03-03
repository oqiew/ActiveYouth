import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import {
    Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Textarea
} from 'native-base';
import { connect } from 'react-redux';
import { addProfile } from '../../redux/Reducer';
import Loading from '../../components/Loading';

import upload from '../../assets/upload.png'
import mainStyle from '../../styles/main.style';
import { routeName } from '../../route/routeName';
import HeaderAy from '../../components/header/HeaderAy';

export class SubdistrictScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            Subdistrict: '',
            //   data
            Family: '',
            career: '',
            Family_Total_income: '',
            Tradition: '',
            TraditionAndNarcotic: '',
            ProtectAndNarcotic: '',
            ProtectAndCovid: '',
        }

    }

    componentDidMount() {

    }

    onBackHandler = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { loading, Family, career, Family_Total_income, Tradition,
            TraditionAndNarcotic, ProtectAndNarcotic, ProtectAndCovid, } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="ข้อมูลตำบล" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={mainStyle.background}>

                    <View style={{ flexDirection: "row", justifyContent: 'space-evenly' }}>
                        <Button onPress={() => this.props.navigation.navigate(routeName.PopulationM)}><Text>ประชากรเพศชาย</Text></Button>
                        <Button onPress={() => this.props.navigation.navigate(routeName.PopulationF)}><Text>ประชากรเพศหญิง</Text></Button>
                    </View>
                    <Item fixedLabel>
                        <Label>ครัวเรือน :</Label>
                        <Input value={Family}
                            placeholder="จำนวน"
                            keyboardType='numeric'
                            onChangeText={str => this.setState({ Family: str })}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label>อาชีพ :</Label>

                        <Textarea rowSpan={4} value={career} style={{ fontSize: 16 }}
                            onChangeText={str => this.setState({ career: str })} placeholder="อาชีพหลักของคนในชุมชน" />
                    </Item>
                    <Item fixedLabel>
                        <Label>รายได้เฉลี่ยต่อเดือน :</Label>
                        <Input value={Family_Total_income}
                            placeholder="จำนวน"
                            keyboardType='numeric'
                            onChangeText={str => this.setState({ Family_Total_income: str })} />
                    </Item>
                    <Item stackedLabel>
                        <Label>ประเพณี :</Label>

                        <Textarea rowSpan={4} style={{ fontSize: 16 }} value={Tradition}
                            onChangeText={str => this.setState({ Tradition: str })}
                            placeholder="ประเพณี วัฒนธรรมที่เป็นเอกสารลักษณ์ของตำบล" />
                    </Item>
                    <Item stackedLabel>
                        <Label>ประเพณีมีการสูบบุหรี่ ดื่มสุรา  :</Label>

                        <Textarea rowSpan={4} style={{ fontSize: 16 }} value={TraditionAndNarcotic}
                            onChangeText={str => this.setState({ TraditionAndNarcotic: str })}
                            placeholder="บุญประเพณีของพื้นที่ที่เกี่ยวข้องกับการสูบบุหรี่ ดื่มสุราจากมากไปหาน้อย (5 ลำดับ)" />
                    </Item>
                    <Item stackedLabel>
                        <Label>กิจกรรมส่งเสริมสุขภาพ :</Label>

                        <Textarea rowSpan={4} style={{ fontSize: 16 }} value={ProtectAndNarcotic}
                            onChangeText={str => this.setState({ ProtectAndNarcotic: str })}
                            placeholder="กิจกรรมหรือแนวทางการส่งเสริมสุขภาพและการลดปัจจัยเสี่ยงสุขภาพ (บุหรี่ สุรา อุบัติเหตุ ฯลฯ)ที่ผ่านมาของชุมชน" />
                    </Item><Item stackedLabel>
                        <Label>กิจกรรมส่งเสริมสุขภาพ ในช่วง covid 19 :</Label>
                        <Textarea rowSpan={5} style={{ fontSize: 16 }} value={ProtectAndCovid}
                            onChangeText={str => this.setState({ ProtectAndCovid: str })}
                            placeholder="กิจกรรมหรือแนวทางการส่งเสริมสุขภาพและการลดปัจจัยเสี่ยงสุขภาพ (บุหรี่ สุรา อุบัติเหตุ ฯลฯ)ในช่วงการแพร่ระบาดของโควิด-19ที่ผ่านมาของชุมชน" />
                    </Item>
                </Content>
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

export default connect(mapStateToProps, mapDispatchToProps)(SubdistrictScreen);
