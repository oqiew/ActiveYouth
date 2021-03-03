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


export class PopulationMScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            PopulationMs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

        }
    }
    onSetAge(index, value) {
        const pop = this.state.PopulationMs;
        pop[index] = value;
        this.setState({
            PopulationMs: pop
        })
    }
    onBackHandler = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { loading, Subdistrict, PopulationMs } = this.state;
        return (
            <Container>
                <Loading visible={loading}></Loading>
                <HeaderAy name="ประชากร" backHandler={this.onBackHandler}></HeaderAy>
                <Content contentContainerStyle={{ padding: 15 }}>

                    <View>
                        <Text style={{ textDecorationLine: 'underline', margin: 5, fontSize: 16 }}>ประชากรเพศชาย ตำบล{Subdistrict}</Text>
                        {PopulationMs.map((element, i) =>
                            <Item fixedLabel key={'M' + i}>
                                <Label>อายุ{i === 0 && "ต่ำกว่า"}{i === 119 && "มากกว่า"} {i + 1} :</Label>
                                <Input value={element}
                                    placeholder="จำนวน"
                                    keyboardType='numeric'
                                    onChangeText={str => this.onSetAge.bind(this, i, str)} />
                            </Item>
                        )}
                    </View>
                </Content>
            </Container>
        )
    }
}

export default PopulationMScreen
