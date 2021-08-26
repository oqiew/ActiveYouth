import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import {
    Container, Content, Footer, Text, Icon, Input, Label, Item, Button, Textarea, FooterTab, Picker, Right, Left, Radio
} from 'native-base';
import { connect } from 'react-redux';
import { addProfile } from '../../redux/Reducer';
import Loading from '../../components/Loading';

import upload from '../../assets/upload.png'
import mainStyle from '../../styles/main.style';
import { routeName } from '../../route/routeName';
import HeaderAy from '../../components/header/HeaderAy';
import themeStyle from '../../styles/theme.style';
import { TableName } from '../../database/TableName';
import Firestore from '@react-native-firebase/firestore'
import { isEmptyValue } from '../../components/Method';
const tbMain = Firestore().collection(TableName.LocalCalendar);
const tbname = TableName.Religions;
export class LocalCalendarScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit_ID: '',
            //data class
            dataCalendar1: [],
            dataCalendar2: [],
            Month1: "",
            Month2: "",
            mouth: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
            showMouth1: [],
            showMouth2: [],
            Name_activity: '',
            Attribute: "",
            //getuser
            selected: 1,
            loading: false,
            step: 'table',
            ...this.props.userReducer.profile,
            Area: this.props.userReducer.area,
        }
    }

    onCollectionUpdate = (querySnapshot) => {
        const dataCalendar1 = [];
        const dataCalendar2 = [];
        querySnapshot.forEach((doc) => {
            const { Name_activity, Month1, Month2, Type_activity, Attribute } = doc.data();
            const mn1 = parseInt(Month1, 10);
            const mn2 = parseInt(Month2, 10);
            if (Type_activity === 'เศรษฐกิจ') {
                dataCalendar1.push({
                    ID: doc.id,
                    Name_activity,
                    Month1: this.state.mouth[mn1 - 1],
                    Month2: this.state.mouth[mn2 - 1],
                    Month1db: Month1,
                    Month2db: Month2,
                    Type_activity,
                    Attribute
                });
            } else {
                dataCalendar2.push({
                    ID: doc.id,
                    Name_activity,
                    Month1: this.state.mouth[mn1 - 1],
                    Month2: this.state.mouth[mn2 - 1],
                    Month1db: Month1,
                    Month2db: Month2,
                    Type_activity,
                    Attribute
                });
            }
        });
        this.setState({
            dataCalendar1,
            dataCalendar2
        });
    }

    delete(id) {
        tbMain.doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    edit(data) {
        this.setState({ loading: true });
        const { Name_activity, Type_activity, Attribute } = data;
        const { mouth } = this.state;
        const Month1 = parseInt(data.Month1db, 10);
        const Month2 = parseInt(data.Month2db, 10);
        const showMouth2 = [];
        for (let index = Month1; index <= 12; index++) {
            showMouth2.push(<Picker.Item key={index} label={mouth[index - 1] + ""} value={index} />)
        }
        console.log(data)
        this.setState({
            Name_activity, Month1, Month2, Type_activity, edit_ID: data.ID, loading: false, showMouth2, step: 'add', Attribute
        })
    }
    cancelEdit = (e) => {
        this.setState({
            Name_activity: '', Month1: '', Month2: '', Type_activity: '', edit_ID: '', Attribute: '', step: 'table',
        })
    }
    componentDidMount() {
        tbMain.where('Area_ID', '==', this.state.Area.ID).onSnapshot(this.onCollectionUpdate)
        this.genrateMonth(0, 0);
    }
    genrateMonth(str, d) {

        var Month1 = 1;
        if (d === 0) {
            Month1 = 1;
        }
        if (d === 1) {
            Month1 = str;
            this.setState({
                Month1: str
            })
        }
        if (d === 2) {
            Month1 = this.state.Month1;
            this.setState({
                Month2: str
            })
        }
        const showMouth1 = [], showMouth2 = [];
        const { mouth, } = this.state;
        const mn1 = parseInt(Month1, 10);

        for (let index = 1; index <= 12; index++) {
            showMouth1.push(<Picker.Item key={index} label={mouth[index - 1] + ""} value={index} />)
        }
        for (let index = mn1; index <= 12; index++) {
            showMouth2.push(<Picker.Item key={index} label={mouth[index - 1] + ""} value={index} />)
        }
        this.setState({
            showMouth1,
            showMouth2
        })
    }
    onSubmit = e => {
        e.preventDefault()
        this.setState({ loading: true });
        const { Name_activity, Month1, Month2, uid, Type_activity, Name, edit_ID, Attribute,
            Area_ID } = this.state;

        if (Name_activity === '' || Month1 === '' || Month2 === '' || Type_activity === '' || Attribute === '') {
            this.setState({
                loading: false
            });
            Alert.alert("กรุณากรอกข้อมูลให้ครบ");
        } else {
            if (!isEmptyValue(edit_ID)) {
                tbMain.doc(edit_ID).set({
                    Area_ID: this.state.Area.ID,
                    Update_by_ID: this.state.uid,
                    Update_date: Firestore.Timestamp.now(),
                    Name_activity, Type_activity, Attribute
                    , Month1, Month2,
                }).then((docRef) => {
                    this.setState({
                        Name_activity: "", Month1: "", Month2: "", Type_activity: '', Attribute: '',
                        edit_ID: '', loading: false
                    });
                    Alert.alert("บันทึกข้อมูลสำเร็จ");

                }).catch((error) => {
                    this.setState({
                        loading: false
                    });
                    Alert.alert("บันทึกข้อมูลไม่สำเร็จ");
                    console.error("Error adding document: ", error);
                });

            } else {
                tbMain.add({
                    Area_ID: this.state.Area.ID,
                    Update_by_ID: this.state.uid,
                    Create_date: Firestore.Timestamp.now(),
                    Update_date: Firestore.Timestamp.now(),
                    Name_activity, Type_activity, Attribute
                    , Month1, Month2,
                }).then((docRef) => {
                    this.setState({
                        Name_activity: "", Month1: "", Month2: "", Type_activity: '',
                        edit_ID: '', loading: false, Attribute: ''
                    });
                    Alert.alert("บันทึกข้อมูลสำเร็จ");

                }).catch((error) => {
                    this.setState({
                        loading: false
                    });
                    Alert.alert("บันทึกข้อมูลไม่สำเร็จ");
                    console.error("Error adding document: ", error);
                });

            }
        }

    }
    onBackHandler = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { Month1, Month2, Name_activity, Type_activity, Attribute } = this.state;
        const { step } = this.state;
        return (
            <Container style={{ backgroundColor: themeStyle.background }}>
                <HeaderAy name="ปฏิทินชุมชน" backHandler={this.onBackHandler}></HeaderAy>
                <Loading visible={this.state.loading}></Loading>
                <Content contentContainerStyle={{
                    padding: 15,
                    backgroundColor: '#f0f2f5',
                }}>
                    {step === 'table' &&
                        <>
                            <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1, top: 0 }}>
                                <Text style={{ fontWeight: 'bold', margin: 10, width: '35%', textAlign: 'center' }}>รายการ</Text>
                                <Text style={{ fontWeight: 'bold', margin: 10, width: '25%', textAlign: 'center' }}>ช่วงเวลา</Text>
                                <Text style={{ fontWeight: 'bold', margin: 10, width: '20%', textAlign: 'center' }}>แก้ไข</Text>
                            </View>
                            <Text style={{ textAlign: 'center', color: 'red', backgroundColor: '#c0c0c0' }}>เศรษฐกิจ</Text>
                            {this.state.dataCalendar1.map((element, i) =>
                                <View Key={i} style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ margin: 10, width: '35%', textAlign: 'center' }}>
                                        {element.Name_activity}</Text>
                                    <Text style={{ margin: 10, width: '25%', textAlign: 'center' }}>
                                        {element.Month1}-{element.Month2}</Text>
                                    <View style={{ margin: 10, width: '20%', flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={this.edit.bind(this, element)}>
                                            <Image source={require('../../assets/pencil.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.delete.bind(this, element.ID)}>
                                            <Image source={require('../../assets/trash_can.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            <View style={{ backgroundColor: '#c0c0c0' }}>
                                <Text style={{ textAlign: 'center', color: 'red' }}>วัฒนธรรมประเพณี</Text>
                            </View>

                            {this.state.dataCalendar2.map((element, i) =>
                                <View Key={i} style={{ flex: 1, flexDirection: 'row', }}>

                                    <Text style={{ margin: 10, width: '35%', textAlign: 'center' }}>
                                        {element.Name_activity}</Text>
                                    <Text style={{ margin: 10, width: '25%', textAlign: 'center' }}>
                                        {element.Month1}-{element.Month2}</Text>
                                    <View style={{ margin: 10, width: '20%', flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={this.edit.bind(this, element)}>
                                            <Image source={require('../../assets/pencil.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.delete.bind(this, element.ID)}>
                                            <Image source={require('../../assets/trash_can.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                        </>
                    }
                    {step === "add" &&
                        < >
                            <Item fixedLabel >
                                <Label>ชื่อ</Label>
                                <Input value={Name_activity}
                                    onChangeText={str => this.setState({ Name_activity: str })} placeholder="ชื่อ กิจกรรม ประเพณี หรือสิ่งที่ทำ" />
                            </Item>
                            <Item fixedLabel >
                                <Label>ประเภท</Label>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => this.setState({ Type_activity: 'วัฒนธรรมประเพณี' })}
                                        style={{ margin: 3, flexDirection: 'row', borderWidth: 1, borderRadius: 5 }}>
                                        <Text>วัฒนธรรมประเพณี</Text>
                                        <Radio style={{ marginLeft: 3, marginRight: 3 }} selected={Type_activity === "วัฒนธรรมประเพณี" ? true : false}> </Radio>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({ Type_activity: 'เศรษฐกิจ' })}
                                        style={{ margin: 3, flexDirection: 'row', borderWidth: 1, borderRadius: 5 }}>
                                        <Text>เศรษฐกิจ</Text>
                                        <Radio style={{ marginLeft: 3, marginRight: 3 }} selected={Type_activity === "เศรษฐกิจ" ? true : false} ></Radio>
                                    </TouchableOpacity>


                                </View>
                            </Item>
                            <Item fixedLabel style={{ marginTop: 5 }}>
                                <Label>เลือกลักษณะ</Label>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => this.setState({ Attribute: 'ทั่วไป' })}
                                        style={{ margin: 3, flexDirection: 'row', borderWidth: 1, borderRadius: 5 }}>
                                        <Text>ทั่วไป</Text>
                                        <Radio style={{ marginLeft: 3, marginRight: 3 }}
                                            selected={Attribute === "ทั่วไป" ? true : false}> </Radio>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({ Attribute: 'เฉพาะถิ่น' })}
                                        style={{ margin: 3, flexDirection: 'row', borderWidth: 1, borderRadius: 5 }}>
                                        <Text>เฉพาะถิ่น</Text>
                                        <Radio style={{ marginLeft: 3, marginRight: 3 }}
                                            selected={Attribute === "เฉพาะถิ่น" ? true : false} ></Radio>
                                    </TouchableOpacity>


                                </View>
                            </Item>
                            <Item fixedLabel >
                                <Label>เดือนที่เริ่ม</Label>
                                <Picker
                                    selectedValue={Month1}
                                    style={{ height: 40 }}
                                    onValueChange={str => this.genrateMonth(str, 1)}>
                                    <Picker.Item key="0" label="เลือกเดือนที่เริ่ม" value="" />
                                    {this.state.showMouth1}

                                </Picker>
                            </Item>
                            <Item fixedLabel >
                                <Label>เดือนที่สิ้นสุด</Label>
                                <Picker
                                    selectedValue={Month2}
                                    style={{ height: 40 }}
                                    onValueChange={str => this.genrateMonth(str, 2)}>
                                    <Picker.Item key="0" label="เลือกเดือนที่สิ้นสุด" value="" />
                                    {this.state.showMouth2}

                                </Picker>
                            </Item>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                                <Button success style={{ margin: 10 }} onPress={this.onSubmit.bind(this)}>
                                    <Icon name='save' type="AntDesign" />
                                    <Text>บันทึก</Text></Button>
                                <Button danger style={{ margin: 10 }} onPress={this.cancelEdit.bind(this)}>
                                    <Icon name='left' type="AntDesign" />
                                    <Text>กลับ</Text></Button>
                            </View>
                        </>
                    }
                </Content>
                <Footer>
                    <FooterTab style={mainStyle.footer}>
                        <TouchableOpacity onPress={() => this.setState({ step: 'table' })}>
                            <Text style={[{ textAlign: 'center', padding: 5, borderRadius: 10 }
                                , step === 'table' && { backgroundColor: themeStyle.Color_green }]}>ปฏิทิน</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ step: 'add' })}>
                            <Text style={[{ textAlign: 'center', padding: 5, borderRadius: 10 }
                                , step === 'add' && { backgroundColor: themeStyle.Color_green }]}>เพิ่มข้อมูล</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(LocalCalendarScreen);

