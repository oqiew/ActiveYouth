
import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'
import { Icon, Input, Label, Item, Picker, Text, Button, Container, Content, } from 'native-base';
import Storage from '@react-native-firebase/storage'
import { connect } from 'react-redux';
import { addProfile } from '../../redux/Reducer';
import HeaderAy from '../../components/header/HeaderAy';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer'
import DatePicker from 'react-native-datepicker'
import { isEmptyValues } from '../../components/Method';
import themeStyle from '../../styles/theme.style';
import Loading from '../../components/Loading';
import { TableName } from '../../database/TableName';
import { routeName } from '../../route/routeName';
import mainStyle from '../../styles/main.style';
import Auth from '@react-native-firebase/auth';

const style_private = StyleSheet.create({
    image: {
        borderRadius: 10, width: 200, height: 200, marginHorizontal: 5, marginVertical: 5,
        borderWidth: 2, borderColor: themeStyle.Color_green,
    }
})

export class ProfileEditScreen extends Component {
    constructor(props) {
        super(props);
        this.tbUser = firestore().collection(TableName.Users);
        this.state = {
            ...this.props.userReducer.profile,
            loading: false,
            newAvatarUpload: false,
            avatar_uri: '',
            newProfile: isEmptyValues([this.props.userReducer.profile.Name]) ? true : false
        };
        // console.log(this.state)
    }
    uploadImage() {
        console.log("upload image")
        try {
            return new Promise((resolve, reject) => {
                const imageRef = Storage().ref('User').child('user' + this.state.uid + '.jpg')
                let mime = 'image/jpg';
                imageRef.putFile(this.state.avatar_uri, { contentType: mime })
                    .then(() => { return imageRef.getDownloadURL() })
                    .then((url) => {
                        resolve(url)
                    })
                    .catch((error) => { reject(error) })
            })
        } catch (error) {
            console.log("upload image", error)
        }
    }

    _handleChoosePhoto = () => {
        const options = {
            title: 'เลือกรูปโปรไฟล์',
            takePhotoButtonTitle: 'ถ่ายรูป',
            chooseFromLibraryButtonTitle: 'เลือกรูปในคลัง',
            cancelButtonTitle: 'ยกเลิก',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                ImageResizer.createResizedImage(Platform.OS === "android" ? response.path : response.uri, 300, 300, 'JPEG', 100)
                    .then(({ uri }) => {
                        this.setState({
                            newAvatarUpload: true,
                            avatar_uri: uri
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
    }
    _onSave = async () => {

        this.setState({
            loading: true
        })
        const { uid, email, avatar_uri, Name, Lastname, Nickname, Sex, Phone_number, User_type,
            Line_ID, Facebook, Birthday_format, Area_ID, newAvatarUpload, Avatar_URL } = this.state;
        var temp_Avatar_URL = "";
        if (newAvatarUpload) {
            temp_Avatar_URL = await this.uploadImage();
        } else {
            temp_Avatar_URL = Avatar_URL
        }

        if (isEmptyValues([temp_Avatar_URL])) {
            Alert.alert("อัพโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่")
            this.setState({
                loading: false
            })
        } else {
            if (!isEmptyValues[Name, Lastname, Nickname, Sex, Phone_number, Birthday_format]) {
                try {
                    const Birthday_array = Birthday_format.split('-');
                    const Birthday = new Date(Birthday_array[2], (parseInt(Birthday_array[1], 10) - 1), Birthday_array[0]);
                    if (this.state.newProfile) {
                        console.log('new profile')
                        this.tbUser.doc(uid).set({
                            Name, Lastname, Nickname, Sex, Phone_number, User_type: '', Email: email, Birthday_format,
                            Line_ID, Facebook, Birthday, Area_ID: '', Avatar_URL: temp_Avatar_URL,
                            Update_date: firestore.Timestamp.now(), Create_date: firestore.Timestamp.now()
                        }).then((success) => {
                            Alert.alert("บันทึกข้อมูลสำเร็จ")
                            this.props.addProfile({
                                uid, email, avatar_uri, Name, Lastname, Nickname, Sex, Phone_number, User_type: '',
                                Line_ID, Facebook, Birthday, Area_ID: '', Avatar_URL: temp_Avatar_URL, Birthday_format,
                            });
                            this.setState({
                                loading: false
                            })
                            this.props.navigation.push(routeName.Profile);

                        }).catch((error) => {
                            console.log('error update', error)
                            Alert.alert("บันทึกข้อมูลไม่สำเร็จ");
                            this.setState({
                                loading: false
                            })
                        })
                    } else {
                        console.log('update profile')
                        this.tbUser.doc(uid).update({
                            Name, Lastname, Nickname, Sex, Phone_number, User_type, Email: email, Birthday_format,
                            Line_ID, Facebook, Birthday, Area_ID, Avatar_URL: temp_Avatar_URL,
                            Update_date: firestore.Timestamp.now(),
                        }).then((success) => {
                            Alert.alert("บันทึกข้อมูลสำเร็จ")
                            this.props.addProfile({
                                uid, email, avatar_uri, Name, Lastname, Nickname, Sex, Phone_number, User_type,
                                Line_ID, Facebook, Birthday, Area_ID, Avatar_URL: temp_Avatar_URL, Birthday_format,
                            });
                            this.setState({
                                loading: false
                            })
                            this.props.navigation.navigate(routeName.Profile);

                        }).catch((error) => {
                            console.log('error update', error)
                            Alert.alert("บันทึกข้อมูลไม่สำเร็จ");
                            this.setState({
                                loading: false
                            })
                        })
                    }


                } catch (error) {
                    console.log('error update', error)
                }
            } else {
                Alert.alert("บันทึกข้อมูลไม่สำเร็จ กรอกข้อมูลไม่ครบ");
                this.setState({
                    loading: false
                })
            }

        }


    }
    onBack = () => {
        this.props.navigation.pop();
    }
    render() {
        const { avatar_uri, Avatar_URL } = this.state;
        const { Name, Lastname, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday_format,
        } = this.state;

        return (
            <Container style={{ backgroundColor: themeStyle.background }}>
                <HeaderAy name="โปรไฟล์" backHandler={this.onBack}></HeaderAy>
                <Loading visible={this.state.loading}></Loading>
                <Content contentContainerStyle={mainStyle.background}>
                    <View tyle={{ marginBottom: 10 }}>
                        {isEmptyValues([avatar_uri]) === false ?
                            <TouchableOpacity onPress={this._handleChoosePhoto} style={{ marginBottom: 20, alignItems: 'center' }}>
                                <Image style={[style_private.image]} source={{ uri: avatar_uri }} />
                            </TouchableOpacity>
                            :
                            isEmptyValues([Avatar_URL]) === false ?
                                <TouchableOpacity onPress={this._handleChoosePhoto} style={{ marginBottom: 20, alignItems: 'center' }}>
                                    <View style={[style_private.image, { backgroundColor: themeStyle.Color_white, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Image source={{ uri: Avatar_URL }} style={[style_private.image]}></Image>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={this._handleChoosePhoto} style={{ marginBottom: 20, alignItems: 'center' }}>
                                    <View style={[style_private.image, { backgroundColor: themeStyle.Color_white, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Icon name='plus' backgroundColor={themeStyle.Color_white} style={{ color: themeStyle.Color_green, fontSize: 60 }} type="AntDesign" />
                                    </View>
                                </TouchableOpacity>
                        }
                        <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 5 }}>กดรูปเพื่ออัพโหลดรูปโปรไฟล์</Text>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Item fixedLabel >
                            <Label>ชื่อ<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                            <Input value={Name}
                                placeholder="ชื่อจริงไม่ต้องใส่คำนำหน้า"
                                onChangeText={str => this.setState({ Name: str })} />
                        </Item>
                        <Item fixedLabel style={{ marginTop: 5 }}>
                            <Label>นามสกุล<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                            <Input value={Lastname}
                                placeholder="นามสกุล"
                                onChangeText={str => this.setState({ Lastname: str })} />
                        </Item>
                        <Item fixedLabel style={{ marginTop: 5 }}>
                            <Label>ชื่อเล่น<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                            <Input value={Nickname}
                                placeholder="ชื่อเล่น"
                                onChangeText={str => this.setState({ Nickname: str })} />
                        </Item>
                        <Item fixedLabel style={{ marginTop: 5 }}>
                            <Label>เพศ<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                            <Picker
                                mode="dropdown"
                                placeholder="เลือกเพศ"
                                iosIcon={<Icon name="down" type="AntDesign"></Icon>}
                                style={{ left: -56, height: 40 }}
                                selectedValue={Sex}
                                onValueChange={str => this.setState({ Sex: str })}>
                                <Picker.Item key="0" label="เลือก" value="" />
                                <Picker.Item key="1" label="ชาย" value="ชาย" />
                                <Picker.Item key="2" label="หญิง" value="หญิง" />
                                <Picker.Item key="3" label="อื่นๆ" value="อื่นๆ" />
                            </Picker>
                        </Item>
                        <Item fixedLabel style={{ marginTop: 5 }}>
                            <Label>วันเกิด<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                            <DatePicker
                                style={{ width: 200 }}
                                date={Birthday_format}
                                mode="date"
                                placeholder="เลือกวันเกิด(ค.ศ.)"
                                format="DD-MM-YYYY"
                                maxDate={new Date()}
                                confirmBtnText="ตกลง"
                                cancelBtnText="ยกเลิก"
                                duration={300}
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        right: 0,
                                        top: 4,
                                        marginRight: 0,
                                    },
                                    dateInput: {
                                        marginRight: 36,
                                    },
                                    placeholderText: {
                                        fontSize: 16,
                                        color: '#5c5c5c',
                                    },
                                }}
                                onDateChange={(date) => { this.setState({ Birthday_format: date }) }}
                            />

                        </Item>
                        <Item fixedLabel style={{ marginTop: 5 }}>
                            <Label>เบอร์มือถือ :</Label>
                            <Input value={Phone_number}
                                placeholder="เบอร์มือถือ"
                                keyboardType="number-pad"
                                onChangeText={str => this.setState({ Phone_number: str })} />
                        </Item>
                        <Item fixedLabel style={{ marginTop: 5 }}>
                            <Label>Facebook :</Label>
                            <Input value={Facebook}
                                placeholder="Facebook"
                                onChangeText={str => this.setState({ Facebook: str })} />
                        </Item>
                        <Item fixedLabel style={{ marginTop: 5 }}>
                            <Label>Line_ID :</Label>
                            <Input value={Line_ID}
                                placeholder="Line_ID"
                                onChangeText={str => this.setState({ Line_ID: str })} />
                        </Item>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Button primary style={{ marginLeft: 10, marginRight: 10 }} onPress={this._onSave}>
                            <Text style={{ fontSize: 26 }}>{this.state.newProfile ? 'บันทึกข้อมูล' : 'อัพเดตข้อมูล'}</Text>
                        </Button>
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


export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen);
