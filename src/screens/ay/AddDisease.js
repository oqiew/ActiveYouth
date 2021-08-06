import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
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
const tbMain = Firestore().collection(TableName.LocalDisease);
export class AddDiseaseScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disease_ID: '',
            edit_ID: '',
            //data class
            Name_disease: '',
            Male_number: '',
            Age_male_number: '',
            Female_number: '',
            Age_female_number: '',
            Create_date: '',
            Update_date: '',
            Update_by_ID: '',
            diseases: [],
            //getuser
            selected: 1,
            loading: false,
            step: 'addDisease',
            ...this.props.userReducer.profile,
            Area: this.props.userReducer.area,
        }
    }

    onCollectionUpdate = (querySnapshot) => {
        const diseases = [];
        querySnapshot.forEach((doc) => {
            const { Name_disease, Male_number, Age_male_number, Female_number, Age_female_number, Create_date, Update_date } = doc.data();

            diseases.push({
                ID: doc.id,
                Name_disease, Male_number, Age_male_number, Female_number, Age_female_number, Create_date, Update_date
            });

        });
        this.setState({
            diseases
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
        const { Name_disease, Male_number, Age_male_number, Female_number, Age_female_number, } = data;
        this.setState({
            Name_disease, Male_number, Age_male_number, Female_number, Age_female_number,
            edit_ID: data.ID, loading: false, step: 'add'
        })
    }
    cancelEdit = (e) => {
        this.setState({
            Name_disease: '',
            Male_number: '',
            Age_male_number: '',
            Female_number: '',
            Age_female_number: '',
            step: 'table',
            disease_ID: ''
        })
    }
    componentDidMount() {
        tbMain.onSnapshot(this.onCollectionUpdate)
    }
    onSubmit = e => {
        e.preventDefault()
        this.setState({ loading: true });
        const { Name_disease, Male_number, Age_male_number, Female_number, Age_female_number,
            Area_ID, edit_ID } = this.state;

        if (Name_disease === '' || Male_number === '' || Age_male_number === '' || Female_number === '' || Age_female_number === '') {
            this.setState({
                loading: false
            });
            Alert.alert("กรุณากรอกข้อมูลให้ครบ");
        } else {
            if (!isEmptyValue(edit_ID)) {
                tbMain.doc(edit_ID).set({
                    Area_ID,
                    Update_by_ID: this.state.uid,
                    Update_date: Firestore.Timestamp.now(),
                    Name_disease, Male_number, Age_male_number, Female_number, Age_female_number
                }).then((docRef) => {
                    this.setState({
                        Name_disease: '',
                        Male_number: '',
                        Age_male_number: '',
                        Female_number: '',
                        Age_female_number: '',
                        Create_date: '',
                        Update_date: '',
                        edit_ID: '', loading: false,
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
                    Area_ID,
                    Update_by_ID: this.state.uid,
                    Create_date: Firestore.Timestamp.now(),
                    Update_date: Firestore.Timestamp.now(),
                    Name_disease, Male_number, Age_male_number, Female_number, Age_female_number
                }).then((docRef) => {
                    this.setState({
                        Name_disease: '',
                        Male_number: '',
                        Age_male_number: '',
                        Female_number: '',
                        Age_female_number: '',
                        Create_date: '',
                        Update_date: '',
                        edit_ID: '', loading: false,
                        step: 'addDisease',
                        disease_ID: docRef.id
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
        const { Name_disease, Male_number, Age_male_number, Female_number, Age_female_number, diseases } = this.state;
        const { step } = this.state;
        return (
            <Container style={{ backgroundColor: themeStyle.background }}>
                <HeaderAy name="ข้อมูลโรค" backHandler={this.onBackHandler}></HeaderAy>
                <Loading visible={this.state.loading}></Loading>
                <Content contentContainerStyle={{
                    padding: 15,
                    backgroundColor: '#f0f2f5',
                }}>
                    {step === 'table' &&
                        <>
                            {diseases.map((element, i) =>
                                <View style={{
                                    marginRight: 2, marginLeft: 2, height: 120,
                                    backgroundColor: '#ddffff', borderRadius: 15, padding: 20,
                                    flexDirection: 'row'
                                }}>

                                    <View style={{ width: '90%', flexDirection: "column" }}>
                                        <View style={{ height: '45%' }}>
                                            <Text>{element.Name_disease}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: "#d3d3d3" }}>
                                            <View style={{ flexDirection: 'column', borderRightWidth: 1, width: "50%", borderColor: "#d3d3d3" }}>
                                                <View>
                                                    <Text>เพศชาย {element.Male_number}</Text>
                                                </View>
                                                <View>
                                                    <Text>ช่วงอายุ  {element.Age_male_number}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'column', width: "50%", }}>
                                                <View>
                                                    <Text>เพศหญิง {element.Female_number}</Text>
                                                </View>
                                                <View>
                                                    <Text>ช่วงอายุ {element.Age_female_number}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ width: '10%', justifyContent: 'space-around' }}>
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
                                <Label>ชื่อโรค</Label>
                                <Input value={Name_disease}
                                    onChangeText={str => this.setState({ Name_disease: str })} placeholder="ชื่อโรค" />
                            </Item>
                            <Item fixedLabel >
                                <Label>จำนวนเพศชาย</Label>
                                <Input value={Male_number} keyboardType='numeric'
                                    onChangeText={str => this.setState({ Male_number: str })} placeholder="จำนวนคนที่เป็นโรค" />
                            </Item>
                            <Item fixedLabel >
                                <Label>ช่วงอายุเพศชาย</Label>
                                <Input value={Age_male_number} keyboardType='numeric'
                                    onChangeText={str => this.setState({ Age_male_number: str })} placeholder="ช่วงอายุที่พบส่วนใหญ่" />
                            </Item>
                            <Item fixedLabel >
                                <Label>จำนวนเพศหญิง</Label>
                                <Input value={Female_number} keyboardType='numeric'
                                    onChangeText={str => this.setState({ Female_number: str })} placeholder="จำนวนคนที่เป็นโรค" />
                            </Item>
                            <Item fixedLabel >
                                <Label>ช่วงอายุเพศหญิง</Label>
                                <Input value={Age_female_number} keyboardType='numeric'
                                    onChangeText={str => this.setState({ Age_female_number: str })} placeholder="ช่วงอายุที่พบส่วนใหญ่" />
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
                    {step === 'addDisease' &&
                        <>
                            <Item fixedLabel >
                                <Label>ชื่อโรค</Label>
                                <Input value={Name_disease}
                                    onChangeText={str => this.setState({ Name_disease: str })} placeholder="ชื่อโรค" />
                            </Item>
                            <Item fixedLabel >
                                <Label>จำนวนเพศชาย</Label>
                                <Input value={Male_number} keyboardType='numeric'
                                    onChangeText={str => this.setState({ Male_number: str })} placeholder="จำนวนคนที่เป็นโรค" />
                            </Item>
                            <Item fixedLabel >
                                <Label>ช่วงอายุเพศชาย</Label>
                                <Input value={Age_male_number} keyboardType='numeric'
                                    onChangeText={str => this.setState({ Age_male_number: str })} placeholder="ช่วงอายุที่พบส่วนใหญ่" />
                            </Item>
                            <Item fixedLabel >
                                <Label>จำนวนเพศหญิง</Label>
                                <Input value={Female_number} keyboardType='numeric'
                                    onChangeText={str => this.setState({ Female_number: str })} placeholder="จำนวนคนที่เป็นโรค" />
                            </Item>
                            <Item fixedLabel >
                                <Label>ช่วงอายุเพศหญิง</Label>
                                <Input value={Age_female_number} keyboardType='numeric'
                                    onChangeText={str => this.setState({ Age_female_number: str })} placeholder="ช่วงอายุที่พบส่วนใหญ่" />
                            </Item>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                                <Button success style={{ margin: 10 }} onPress={this.n
                                    .bind(this)}>
                                    <Icon name='save' type="AntDesign" />
                                    <Text>บันทึก</Text></Button>
                                <Button danger style={{ margin: 10 }} onPress={this.cancelEditDisease.bind(this)}>
                                    <Icon name='left' type="AntDesign" />
                                    <Text>กลับ</Text></Button>
                            </View>
                        </>}
                </Content>
                <Footer>
                    <FooterTab style={mainStyle.footer}>
                        <TouchableOpacity onPress={() => this.setState({ step: 'table' })}>
                            <Text style={[{ textAlign: 'center', padding: 5, borderRadius: 10 }
                                , step === 'table' && { backgroundColor: themeStyle.Color_green }]}>รายการข้อมูล</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddDiseaseScreen);

