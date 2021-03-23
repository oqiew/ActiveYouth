import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Alert, Platform, StyleSheet } from 'react-native';
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
const _styles = StyleSheet.create({

    MainContainer: {

        justifyContent: 'center',
        flex: 1,
        margin: 10
    },

    rowViewContainer:
    {

        fontSize: 18,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,

    },

    topButton: {

        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 150,
    },


    bottomButton: {

        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 110,
    },

});
export class PopulationMScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            ...this.props.userReducer.profile,
            Area: this.props.userReducer.area,
            Populations: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
                "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
                "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
                "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
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

                    if (doc.exists) {
                        const { PopulationMs } = doc.data();
                        if (!isEmptyValue(PopulationMs)) {
                            this.setState({
                                step: 'view',
                                loading: false,
                                Populations: PopulationMs
                            })
                        } else {
                            this.setState({
                                step: 'view',
                                loading: false,
                            })
                        }

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
        console.log('object')
        const pop = this.state.Populations;
        pop[index] = value;
        console.log(pop)
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

        tbMain
            .doc(this.state.Area.ID)
            .update({
                Update_by_ID: this.state.uid,
                Update_date: Firestore.Timestamp.now(),
                PopulationMs: this.state.Populations
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
    }
    onBackHandler = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { loading, step, Area, Subdistrict, Populations } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="ประชากร" backHandler={this.onBackHandler}></HeaderAy>
                <Content
                    ref='ListView'
                    contentContainerStyle={mainStyle.background}>
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
                        <Text style={{ textDecorationLine: 'underline', margin: 5, fontSize: 16 }}>ประชากรเพศชาย {Area.Dominance}{Area.Area_name}</Text>
                        {Populations.map((element, i) =>
                            <Item fixedLabel key={'M' + i}>
                                <Label>อายุ{i === 0 && "ต่ำกว่า"}{i === 119 && "มากกว่า"} {i + 1} :</Label>
                                <Input value={element + ''}
                                    style={{ backgroundColor: '#ffffff', borderRadius: 5 }}
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
                <TouchableOpacity activeOpacity={0.5}
                    onPress={() => {
                        this.refs.ListView._root.scrollToPosition(0, 0, { animated: true });
                    }}
                    style={_styles.topButton} >

                    <Icon name="arrowup" type="AntDesign" />
                </TouchableOpacity>


                <TouchableOpacity activeOpacity={0.5}
                    onPress={() => {
                        this.refs.ListView._root.scrollToEnd({ animated: true });
                    }}
                    style={_styles.bottomButton} >

                    <Icon name="arrowdown" type="AntDesign" />

                </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopulationMScreen);