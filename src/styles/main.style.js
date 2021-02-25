import { create } from "react-test-renderer";

import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        margin: 20,
    },
    background: {
        padding: 15,
        backgroundColor: '#f0f2f5',

    },
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    footer: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        padding: 5
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 5,
        fontWeight: 'bold'
    },
})