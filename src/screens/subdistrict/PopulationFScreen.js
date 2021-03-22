import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button } from 'native-base';
import { connect } from 'react-redux';
import { addProfile } from '../../redux/Reducer';
import Loading from '../../components/Loading';

import upload from '../../assets/upload.png'
import mainStyle from '../../styles/main.style';
import { routeName } from '../../route/routeName';
import HeaderAy from '../../components/header/HeaderAy';
import Firestore from '@react-native-firebase/firestore'
import { TableName } from '../../database/TableName'
import { isEmptyValue } from '../../components/Method';
const tbMain = Firestore().collection(TableName.Areas);
const tbname = TableName.Areas;

export class PopulationFScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            ...this.props.userReducer.profile,
            Area: this.props.userReducer.area,
            Populations: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
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
                    const { PopulationFs } = doc.data();
                    if (doc.exists) {
                        this.setState({
                            step: 'view',
                            loading: false,
                            Populations: PopulationFs
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
    onSetAge = (index, value) => {
        const pop = this.state.Populations;
        pop[index] = value;
        this.setState({
            Populations: pop
        })
    }
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
            // update
            console.log('update religion', this.state.Populations)
            tbMain
                .doc(this.state.Area.ID)
                .update({
                    Area_ID: this.state.Area.ID,
                    Update_by_ID: this.state.uid,
                    Update_date: Firestore.Timestamp.now(),
                    PopulationFs: this.state.Populations
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



        } catch (error) {
            console.log(error);
        }
    }
    onBackHandler = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { loading, step, Area, Subdistrict, Populations } = this.state;
        console.log(Populations)
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="ประชากร" backHandler={this.onBackHandler}></HeaderAy>
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
                    <View>
                        <Text style={{ textDecorationLine: 'underline', margin: 5, fontSize: 16 }}>ประชากรเพศหญิง {Area.Dominance}{Area.Area_name}</Text>
                        {Populations.map((element, i) =>
                            <Item fixedLabel key={'M' + i}>
                                <Label>อายุ{i === 0 && "ต่ำกว่า"}{i === 119 && "มากกว่า"} {i + 1} :</Label>
                                <Input value={element}
                                    style={{ backgroundColor: '#ffffff', borderRadius: 5, minWidth: '100%', maxWidth: '100%' }}
                                    disabled={step === 'view'}
                                    placeholder="จำนวน"
                                    keyboardType='numeric'
                                    onChangeText={str => this.onSetAge(i, str)} />
                            </Item>
                        )}
                    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopulationFScreen);