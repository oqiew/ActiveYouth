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
import themeStyle from '../../styles/theme.style';
import Firestore from '@react-native-firebase/firestore'
import { TableName } from '../../database/TableName';
import { isEmptyValue } from '../../components/Method';
const tbMain = Firestore().collection(TableName.Areas);
const tbname = TableName.Areas;
export class SubdistrictScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            ...this.props.userReducer.profile,
            Area: this.props.userReducer.area,
            Subdistrict: '',
            //   data
            Family: '',
            career: '',
            Family_Total_income: '',
            Tradition: '',
            TraditionAndNarcotic: '',
            ProtectAndNarcotic: '',
            ProtectAndCovid: '',
            // muti
            M_chanel_input: '',
            M_urge: '',
            M_alcohol: '',
            M_influence: '',
            step: 'view'
        }

    }

    componentDidMount() {
        this.getMainData();
    }
    getMainData() {
        this.setState({
            loading: true
        })
        try {
            tbMain
                .doc(this.state.Area.ID).get().then((doc) => {
                    const { M_chanel_input, M_urge, M_alcohol, M_influence, Family, career, Family_Total_income, Tradition,
                        TraditionAndNarcotic, ProtectAndNarcotic, ProtectAndCovid, } = doc.data();
                    if (doc.exists) {
                        this.setState({
                            M_chanel_input, M_urge, M_alcohol, M_influence, Family, career, Family_Total_income, Tradition,
                            TraditionAndNarcotic, ProtectAndNarcotic, ProtectAndCovid, step: 'view',
                            loading: false
                        })
                    }

                }).catch((error) => {
                    this.setState({
                        loading: false
                    })
                    console.log(error)
                })
        } catch (error) {
            this.setState({
                loading: false
            })
            console.log(error)
        }
    };
    onCancel = () => {
        this.setState({
            loading: false,
            step: 'view'
        })
    }
    onSubmit = () => {
        this.setState({
            loading: true
        })
        try {
            const { M_chanel_input, M_urge, M_alcohol, M_influence } = this.state;
            const { Family, career, Family_Total_income, Tradition,
                TraditionAndNarcotic, ProtectAndNarcotic, ProtectAndCovid, } = this.state;
            if (
                !isEmptyValue(M_chanel_input) &&
                !isEmptyValue(M_urge) &&
                !isEmptyValue(M_alcohol) &&
                !isEmptyValue(M_influence) &&
                !isEmptyValue(Family) &&
                !isEmptyValue(career) &&
                !isEmptyValue(Family_Total_income) &&
                !isEmptyValue(Tradition) &&
                !isEmptyValue(TraditionAndNarcotic) &&
                !isEmptyValue(ProtectAndNarcotic) &&
                !isEmptyValue(ProtectAndCovid)
            ) {

                // update
                console.log('update religion')
                tbMain
                    .doc(this.state.Area.ID)
                    .update({
                        Area_ID: this.state.Area.ID,
                        Update_by_ID: this.state.uid,
                        Update_date: Firestore.Timestamp.now(),
                        M_chanel_input, M_urge, M_alcohol, M_influence,
                        Family, career, Family_Total_income, Tradition,
                        TraditionAndNarcotic, ProtectAndNarcotic, ProtectAndCovid,
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

            } else {
                alert('กรุณากรอกข้อมูลให้ครบ');
                this.setState({
                    loading: false,
                });

            }

        } catch (error) {
            console.log(error);
        }
    }
    onBackHandler = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { step, loading, } = this.state;
        const { Family, career, Family_Total_income, Tradition,
            TraditionAndNarcotic, ProtectAndNarcotic, ProtectAndCovid, } = this.state;
        const { M_chanel_input, M_urge, M_alcohol, M_influence } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="ข้อมูลตำบล" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={mainStyle.background}>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={() => this.setState({ step: "edit" })}
                            style={{ backgroundColor: '#0080ff', margin: 2, padding: 3, borderRadius: 5 }}
                        ><Text style={{ color: '#ffffff' }}>แก้ไข</Text></TouchableOpacity>
                        {step === 'edit' && <TouchableOpacity
                            onPress={() => this.setState({ step: "view" })}
                            style={{ backgroundColor: '#ff0000', margin: 2, padding: 3, borderRadius: 5 }}
                        ><Text style={{ color: '#ffffff' }}>ยกเลิก</Text></TouchableOpacity>}
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: 'space-evenly' }}>
                        <Button onPress={() => this.props.navigation.navigate(routeName.PopulationM)}><Text>ประชากรเพศชาย</Text></Button>
                        <Button onPress={() => this.props.navigation.navigate(routeName.PopulationF)}><Text>ประชากรเพศหญิง</Text></Button>
                    </View>
                    <Item fixedLabel>
                        <Label>ครัวเรือน :</Label>
                        <Input value={Family}
                            style={{ backgroundColor: '#ffffff', borderRadius: 5, width: '100%' }}
                            disabled={step === 'view'}
                            placeholder="จำนวน"
                            keyboardType='numeric'
                            onChangeText={str => this.setState({ Family: str })}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label>อาชีพ :</Label>

                        <Textarea rowSpan={4} value={career} style={{ fontSize: 16 }}
                            style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                            disabled={step === 'view'}
                            onChangeText={str => this.setState({ career: str })}
                            placeholder="อาชีพหลักของคนในชุมชน ประกอบอาชีพอะไรบ้าง" />
                    </Item>
                    <Item fixedLabel>
                        <Label>รายได้เฉลี่ยต่อเดือน :</Label>
                        <Input value={Family_Total_income}
                            style={{ backgroundColor: '#ffffff', borderRadius: 5, width: '100%' }}
                            disabled={step === 'view'}
                            placeholder="จำนวน"
                            keyboardType='numeric'
                            onChangeText={str => this.setState({ Family_Total_income: str })} />
                    </Item>
                    <Item stackedLabel>
                        <Label>ประเพณี :</Label>

                        <Textarea rowSpan={4} value={Tradition}
                            style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                            disabled={step === 'view'}
                            onChangeText={str => this.setState({ Tradition: str })}
                            placeholder="ประเพณี วัฒนธรรมที่เป็นเอกสารลักษณ์ของตำบล" />
                    </Item>
                    <Item stackedLabel>
                        <Label>ประเพณีมีการสูบบุหรี่ ดื่มสุรา  :</Label>

                        <Textarea rowSpan={4} value={TraditionAndNarcotic}
                            style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                            disabled={step === 'view'}
                            onChangeText={str => this.setState({ TraditionAndNarcotic: str })}
                            placeholder="บุญประเพณีของพื้นที่ที่เกี่ยวข้องกับการสูบบุหรี่ ดื่มสุราจากมากไปหาน้อย (5 ลำดับ)" />
                    </Item>
                    <Item stackedLabel>
                        <Label>กิจกรรมส่งเสริมสุขภาพ :</Label>

                        <Textarea rowSpan={4} value={ProtectAndNarcotic}
                            style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                            disabled={step === 'view'}
                            onChangeText={str => this.setState({ ProtectAndNarcotic: str })}
                            placeholder="กิจกรรมหรือแนวทางการส่งเสริมสุขภาพและการลดปัจจัยเสี่ยงสุขภาพ (บุหรี่ สุรา อุบัติเหตุ ฯลฯ)ที่ผ่านมาของชุมชน" />
                    </Item><Item stackedLabel>
                        <Label>กิจกรรมส่งเสริมสุขภาพ ในช่วง covid 19 :</Label>
                        <Textarea rowSpan={5} value={ProtectAndCovid}
                            style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                            disabled={step === 'view'}
                            onChangeText={str => this.setState({ ProtectAndCovid: str })}
                            placeholder="กิจกรรมหรือแนวทางการส่งเสริมสุขภาพและการลดปัจจัยเสี่ยงสุขภาพ (บุหรี่ สุรา อุบัติเหตุ ฯลฯ)ในช่วงการแพร่ระบาดของโควิด-19ที่ผ่านมาของชุมชน" />
                    </Item>
                    <Item stackedLabel>
                        <Label>การรับข้อมูล<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                        <Textarea
                            style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                            rowSpan={4}
                            value={M_chanel_input}
                            onChangeText={str =>
                                this.setState({ M_chanel_input: str })
                            }
                            placeholder="ช่องทางการรับสื่อข้อมูลข่าวสาร มีช่องทางไหนบ้าง (โทรทัศน์ โทรศัพท์ เฟส ไลน์)"
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label>สื่อ<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                        <Textarea
                            style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                            rowSpan={4}
                            value={M_urge}
                            onChangeText={str =>
                                this.setState({ M_urge: str })
                            }
                            placeholder="สื่อใด(สื่อ เนื้อหา ผู้ส่ง) ที่กระตุ้นให้เกิดความอยากสูบบุหรี่ ดื่มสุรา"
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label>ช่องทาง<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                        <Textarea
                            style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                            rowSpan={4}
                            value={M_alcohol}
                            onChangeText={str =>
                                this.setState({ M_alcohol: str })
                            }
                            placeholder="พบโฆษณาบุหรี่ สุราจากช่องทางใดบ้าง (โทรทัศน์ โทรศัพท์ เฟส ไลน์)"
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label>อิทธิพล<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                        <Textarea
                            style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                            rowSpan={4}
                            value={M_influence}
                            onChangeText={str =>
                                this.setState({ M_influence: str })
                            }
                            placeholder="อิทธิพลการสื่อสารความเสี่ยงและพัฒนาพฤติกรรมสุขภาพให้กับคนในพื้นที่ของสื่อในช่วงการแพร่ระบาดของโควิด-19ของคนในพื้นที่"
                        />
                    </Item>
                    {step === 'edit' && <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Button
                            success
                            style={{ margin: 10 }}
                            onPress={this.onSubmit.bind(this)}>
                            <Icon name="save" type="AntDesign" />
                            <Text>บันทึก</Text>
                        </Button>
                        <Button
                            danger
                            style={{ marginTop: 10 }}
                            onPress={this.onCancel.bind(this)}>
                            <Icon name="left" type="AntDesign" />
                            <Text>กลับ</Text>
                        </Button>
                    </View>}
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
