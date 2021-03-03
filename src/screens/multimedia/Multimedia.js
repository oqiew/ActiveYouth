import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
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

export class MultimediaScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            Subdistrict: '',
            //   data
            step: "table",
            multimedies: []
        }
    }

    componentDidMount() {

    }
    onSubmit = async () => {

    }
    onCancel = () => {

    }
    onEdit = () => {

    }
    onDelete = () => {

    }
    onBackHandler = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { loading, multimedies, step } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="ข้อมูลศาสนา" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={{ padding: 15 }}>
                    {step === 'add' &&
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <Item fixedLabel>
                                <Label>การรับข้อมูล<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Input
                                    placeholder="ช่องทางการรับสื่อข้อมูลข่าวสาร"
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                // value={Geo_map_name}
                                // onChangeText={str => this.setState({ Geo_map_name: str })}
                                />
                            </Item>
                            <Item fixedLabel>
                                <Label>สื่อ<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Input
                                    placeholder="สื่อใด(สื่อ เนื้อหา ผู้ส่ง) ที่กระตุ้นให้เกิดความอยากสูบบุหรี่ ดื่มสุรา"
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                // value={Geo_map_name}
                                // onChangeText={str => this.setState({ Geo_map_name: str })}
                                />
                            </Item>
                            <Item fixedLabel>
                                <Label>ช่องทาง<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Input
                                    placeholder="พบโฆษณาบุหรี่ สุราจากช่องทางใดบ้าง"
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                // value={Geo_map_name}
                                // onChangeText={str => this.setState({ Geo_map_name: str })}
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>อิทธิพล<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                <Textarea
                                    style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                    rowSpan={4}
                                    // value={Geo_map_description}
                                    // onChangeText={str =>
                                    //     this.setState({ Geo_map_description: str })
                                    // }
                                    placeholder="อิทธิพลการสื่อสารความเสี่ยงและพัฒนาพฤติกรรมสุขภาพให้กับคนในพื้นที่ของสื่อในช่วงการแพร่ระบาดของโควิด-19ของคนในพื้นที่"
                                />
                            </Item>
                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    success
                                    style={{ margin: 10 }}
                                    onPress={this.onSubmit.bind(this)}>
                                    <Icon name="save" type="AntDesign" />
                                    <Text>บันทึก</Text>
                                </Button>
                            </View>

                        </View>}
                    {step === 'table' &&

                        <View style={{ flex: 1, alignItems: 'center', }}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    margin: 5,
                                    fontSize: 18,
                                }}>
                                ตารางข้อมูล</Text>
                            <View
                                style={{

                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                }}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        margin: 10,
                                        width: '20%',
                                        textAlign: 'center',
                                    }}>
                                    ชื่อพื้นที่</Text>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        margin: 10,
                                        width: '20%',
                                        textAlign: 'center',
                                    }}>
                                    ลักษณะพื้นที่</Text>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        margin: 10,
                                        width: '20%',
                                        textAlign: 'center',
                                    }}>
                                    ผู้เพิ่มข้อมูล</Text>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        margin: 10,
                                        width: '20%',
                                        textAlign: 'center',
                                    }}>
                                    แก้ไข</Text>
                            </View>
                            <ScrollView>
                                {multimedies.map((element, i) => (
                                    <View key={i} style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text
                                            style={{
                                                margin: 10,
                                                width: '20%',
                                                textAlign: 'center',
                                            }}>
                                            {element.Geo_map_name}
                                        </Text>
                                        <Text
                                            style={{
                                                margin: 10,
                                                width: '20%',
                                                textAlign: 'center',
                                            }}>
                                            {element.name_type}
                                        </Text>
                                        <Text
                                            style={{
                                                margin: 10,
                                                width: '20%',
                                                textAlign: 'center',
                                            }}>
                                            {element.Informer_name}
                                        </Text>
                                        <View style={{ width: '20%', justifyContent: 'center', flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                onPress={this.edit.bind(this, element, element.Key,)}>
                                                <Image
                                                    source={require('../../assets/pencil.png')}
                                                    style={{ width: 25, height: 25, justifyContent: 'center', }}></Image>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={this.delete.bind(this, element)}>
                                                <Image
                                                    source={require('../../assets/trash_can.png')}
                                                    style={{ width: 25, height: 25, justifyContent: 'center', }}></Image>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>}
                </Content>
                <Footer style={{ backgroundColor: '#ffffff', justifyContent: "space-around" }}>
                    <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        onPress={() =>
                            this.setState({ step: 'table' })
                        }>
                        <Image
                            source={require('../../assets/table.png')}
                            style={{ width: 60, height: 60 }}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            this.setState({ step: 'add' })
                        }>
                        <Image
                            source={require('../../assets/add.png')}
                            style={{ width: 50, height: 50 }}></Image>
                    </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(MultimediaScreen);
