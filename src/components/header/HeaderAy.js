import React from "react";
import { Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import themeStyle from "../../styles/theme.style";

const HeaderAy = ({ name, backHandler, menu }, props) => {

    return (
        <Header style={{ backgroundColor: themeStyle.Color_green }}>
            <Left >
                {backHandler !== null && <Button transparent onPress={backHandler}>
                    <Icon name='arrow-back' />
                </Button>}
            </Left>
            <Body style={{ position: "absolute" }}>
                <Title>{name}</Title>
            </Body>
            <Right>
                {/* <Button transparent>
                    <Icon name='menu' />
                </Button> */}
            </Right>
        </Header>
    )

}

export default HeaderAy
