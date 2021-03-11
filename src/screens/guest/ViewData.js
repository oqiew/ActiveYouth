import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
    Content, Footer, Text, Icon, Input, Label, Item, Button, Textarea, Picker, Body, Title, Header
} from 'native-base';
import mainStyle from '../../styles/main.style';
export class ViewData extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { data, data_type, onCancel } = this.props
        const _mstyle = StyleSheet.create({
            sub_text_row: {
                backgroundColor: '#ffffff', borderRadius: 5, width: '63%',
                padding: 3
            },
            sub_text_colum: {
                backgroundColor: '#ffffff', borderRadius: 5, width: '100%',
                padding: 3
            },
        });
        return (
            <Content contentContainerStyle={[mainStyle.background]}>
                {data_type === "re" &&
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={onCancel}
                                style={{
                                    backgroundColor: '#ff0000', margin: 2,
                                    padding: 3, borderRadius: 5, width: 30
                                }}>
                                <Text style={{ color: '#ffffff', textAlign: 'center' }}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                source={{ uri: data.Map_image_URL }}
                                style={{ height: 100, width: 100 }}></Image>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                ชื่อพื้นที่
                               </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Religion_name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                บุคคลที่มีบทบาทสำคัญทางศาสนา
                               </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Religion_user}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                กิจกรรมใดบ้างที่สะท้อนถึงความเชื่อมโยงระหว่างศาสนสถานกับคนในพื้นที่
                               </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Religion_activity}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                การจำหน่ายบุหรี่และเครื่องดื่มแอลกอฮอล์
                               </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Religion_alcohol}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                การแพร่ระบาดของโควิด-19 ส่งผลต่อบทบาทหน้าที่ของสถาบันทางศาสนา
                               </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Relegion_covid19}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                ความเชื่อใดที่ส่งผลต่อการดำเนินชีวิตของคนในชุมชน
                               </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Relegion_belief}
                            </Text>
                        </View>
                    </View>}
                {data_type === "sc" &&
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={onCancel}
                                style={{
                                    backgroundColor: '#ff0000', margin: 2,
                                    padding: 3, borderRadius: 5, width: 30
                                }}>
                                <Text style={{ color: '#ffffff', textAlign: 'center' }}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                ชื่อพื้นที่
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.School_name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                แนวทางการจัดการเรียนการสอนภายในโรงเรียน
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.School_study}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                กิจกรรมที่สำคัญของโรงเรียน
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.School_activity}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                การซื้อขายและการสูบบุหรี่ ดื่มสุราในเขตสถานศึกษา
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.School_alcohol}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                การสูบบุหรี่ ดื่มสุราในเขตสถานศึกษา
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.School_cigarette}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                การแพร่ระบาดของโควิด-19 ส่งผลต่อระบบการเรียนการ
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.School_covid19}
                            </Text>
                        </View>

                    </View>}
                {data_type === "lo" &&
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={onCancel}
                                style={{
                                    backgroundColor: '#ff0000', margin: 2,
                                    padding: 3, borderRadius: 5, width: 30
                                }}>
                                <Text style={{ color: '#ffffff', textAlign: 'center' }}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                source={{ uri: data.Map_image_URL }}
                                style={{ height: 100, width: 100 }}></Image>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                ชื่อ อปท
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Lgo_name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                รูปแบบ
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Lgo_type}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                จำนวนบุคลากรใน อปท.
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Lgo_officer}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                จำนวนผคนทำงานด้านเด็ก
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Lgo_position_youth}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                นโยบายที่เกี่ยวข้องกับเด็กและเยาวชน
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Lgo_policy_youth}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                กิจกรรมหรือแนวทางการดำเนินงานด้านเด็กและเยาวชน
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Lgo_activity}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                กิจกรรมหรือแนวทางการส่งเสริมการปกป้องและคุ้มครองประชาชนด้านสุขภาพ
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Lgo_activity_protect}
                            </Text>
                        </View>
                    </View>}
                {data_type === "lm" &&
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={onCancel}
                                style={{
                                    backgroundColor: '#ff0000', margin: 2,
                                    padding: 3, borderRadius: 5, width: 30
                                }}>
                                <Text style={{ color: '#ffffff', textAlign: 'center' }}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                source={{ uri: data.Map_image_URL }}
                                style={{ height: 100, width: 100 }}></Image>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                ชื่อพื้นที่
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Lm_name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                ประเภท
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Lm_type}
                            </Text>
                        </View>
                        {(data.Lm_type === 'พื้นที่ดี' || data.Lm_type === 'พื้นที่เสี่ยง') ?
                            <>
                                <View style={{ flexDirection: 'row', padding: 3 }}>
                                    <Text style={{ textAlign: "left", width: 120 }}>
                                        เวลาที่เกิดเหตุ
                                    </Text>
                                    <Text style={_mstyle.sub_text_row}>
                                        {data.Lm_time}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'column', padding: 3 }}>
                                    <Text style={{ textAlign: "left" }}>
                                        ลักษณะกิจกรรม
                                </Text>
                                    <Text style={_mstyle.sub_text_colum}>
                                        {data.Lm_description}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'column', padding: 3 }}>
                                    <Text style={{ textAlign: "left" }}>
                                        ผลที่เกิดขึ้น
                                </Text>
                                    <Text style={_mstyle.sub_text_colum}>
                                        {data.Lm_action}
                                    </Text>
                                </View>
                            </>
                            :
                            <View style={{ flexDirection: 'column', padding: 3 }}>
                                <Text style={{ textAlign: "left" }}>
                                    รายละเอียด
                                </Text>
                                <Text style={_mstyle.sub_text_colum}>
                                    {data.Lm_description}
                                </Text>
                            </View>}
                    </View>}
                {data_type === "yn" &&
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={onCancel}
                                style={{
                                    backgroundColor: '#ff0000', margin: 2,
                                    padding: 3, borderRadius: 5, width: 30
                                }}>
                                <Text style={{ color: '#ffffff', textAlign: 'center' }}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                source={{ uri: data.Map_image_URL }}
                                style={{ height: 100, width: 100 }}></Image>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                ชื่อ
                                </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Yn_name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                เบอร์ติดต่อ
                                </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Yn_phone_number}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                รายละเอียด กิจกรรม การดำเนินงานขององค์กร
                                </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Yn_description}
                            </Text>
                        </View>
                    </View>}
                {data_type === "ay" &&
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={onCancel}
                                style={{
                                    backgroundColor: '#ff0000', margin: 2,
                                    padding: 3, borderRadius: 5, width: 30
                                }}>
                                <Text style={{ color: '#ffffff', textAlign: 'center' }}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                source={{ uri: data.Map_image_URL }}
                                style={{ height: 100, width: 100 }}></Image>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                ชื่อ-นามสกุล
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Y_name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                เกี่ยวกับ
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Y_description}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                ประเภทบุคคล
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Y_type}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                จำนวนสมาชิกครอบครัว
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Y_family}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                จำนวนคนที่อาศัยอยู่ด้วยกัน
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Y_family_stay}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                บทบาทของสมาชิกในครอบครัว
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Y_role}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                แนวคิดและรูปแบบการเลี้ยงลูก
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Y_concept}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                อาชีพของครอบครัว
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Y_family_career}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 3 }}>
                            <Text style={{ textAlign: "left", width: 120 }}>
                                สถานะของครอบครัว
                                    </Text>
                            <Text style={_mstyle.sub_text_row}>
                                {data.Y_family_status}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                ผลกระทบ covid 19
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Y_covid19}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                คนในครอบครัวที่ดื่มสุรา
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Y_alcohol}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                คนในครอบครัวที่สูบบุหรี่
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Y_cigarette}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                คนในครอบครัวที่สูบบุหรี่และดื่มสุรา
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Y_alcohol_cigarette}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                ทัศนคติที่มีต่อผู้ดื่มสุรา/ ผู้สูบบุหรี่
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Y_attitude}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 3 }}>
                            <Text style={{ textAlign: "left" }}>
                                กิจกรรมภายในครอบครัว
                                    </Text>
                            <Text style={_mstyle.sub_text_colum}>
                                {data.Y_family_activity}
                            </Text>
                        </View>
                    </View>}
            </Content>
        )
    }
}

export default ViewData
