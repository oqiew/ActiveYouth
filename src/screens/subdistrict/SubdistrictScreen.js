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
            laoding: false,
            Subdistrict: '',
            //   data
            Family: '',
            career: '',
            Family_Total_income: '',
            Family_environtment: '',
            Family_status: '',
        }

    }

    componentDidMount() {

    }

    onBackHandler = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { laoding, Family, career, Family_Total_income, Family_environtment, Family_status, } = this.state;
        return (
            <Container>
                <Loading visible={laoding}></Loading>
                <HeaderAy name="ข้อมูลตำบล" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={{ padding: 15 }}>

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
                    <Item fixedLabel>
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
                    <Item fixedLabel>
                        <Label>ประเพณี :</Label>

                        <Textarea rowSpan={4} style={{ fontSize: 16 }}
                            placeholder="ประเพณี วัฒนธรรมที่เป็นเอกสารลักษณ์ของตำบล" />
                    </Item>
                    <Item fixedLabel>
                        <Label>ประเพณีมีการสูบบุหรี่ ดื่มสุรา  :</Label>

                        <Textarea rowSpan={4} style={{ fontSize: 16 }}
                            placeholder="บุญประเพณีของพื้นที่ที่เกี่ยวข้องกับการสูบบุหรี่ ดื่มสุราจากมากไปหาน้อย (5 ลำดับ)" />
                    </Item>
                    <Item fixedLabel>
                        <Label>กิจกรรมส่งเสริมสุขภาพ :</Label>

                        <Textarea rowSpan={4} style={{ fontSize: 16 }}
                            placeholder="กิจกรรมหรือแนวทางการส่งเสริมสุขภาพและการลดปัจจัยเสี่ยงสุขภาพ (บุหรี่ สุรา อุบัติเหตุ ฯลฯ)ที่ผ่านมาของชุมชน" />
                    </Item><Item fixedLabel>
                        <Label>กิจกรรมส่งเสริมสุขภาพ ในช่วง covid 19 :</Label>

                        <Textarea rowSpan={4} style={{ fontSize: 16 }}
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
