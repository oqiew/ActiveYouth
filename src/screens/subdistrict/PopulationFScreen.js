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
export class PopulationFScreen extends Component {
    constructor(props) {
        super(props)
        this.tbAreas = Firestore().collection(TableName.Areas);
        this.state = {
            loading: false,
            Area: this.props.userReducer.area,
            PopulationFs: this.props.userReducer.area.PopulationFs
        }
    }
    componentDidMount() {

    }
    onSetAge = (index, value) => {
        let pop = this.state.PopulationFs;
        pop[index] = value;
        // this.setState({
        //     PopulationFs: pop
        // })
    }
    onBackHandler = () => {
        this.props.navigation.goBack()
    }
    onSubmit = () => {
        this.setState({ loading: true })
        // this.tbAreas.doc(this.state.Area.ID).update({
        //     PopulationFs: this.state.PopulationFs
        // }).then(() => {
        //     Alert.alert("บันทึกสำเร็จ");
        //     this.setState({ loading: false })
        // }).catch((error) => {
        //     console.log('error', error)
        this.setState({ loading: false })
        // })
    }
    render() {
        const { loading, Area, PopulationFs, } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="ประชากร" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={{ padding: 15 }}>

                    <View>
                        <Text style={{ textDecorationLine: 'underline', margin: 5, fontSize: 16 }}>ประชากรเพศหญิง ตำบล{Area.Area_name}</Text>
                        {PopulationFs.map((element, i) =>

                            <Item fixedLabel key={'M' + i}>
                                <Label>อายุ{i === 0 && "ต่ำกว่า"}{i === 119 && "มากกว่า"} {i + 1} :</Label>
                                <Input value={element.toString()}
                                    placeholder="จำนวน"
                                    keyboardType='numeric'
                                    onChangeText={str => this.onSetAge(i, str)} />
                            </Item>
                        )}
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                        <Button success style={{ margin: 10 }} onPress={this.onSubmit.bind(this)}>
                            <Icon name='save' type="AntDesign" />
                            <Text>บันทึก</Text></Button>
                        <Button danger style={{ margin: 10 }} onPress={this.onBackHandler}>
                            <Icon name='left' type="AntDesign" />
                            <Text>กลับ</Text></Button>
                    </View>
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
