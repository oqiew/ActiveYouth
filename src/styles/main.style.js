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
    content: {
        flex:
            1,
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
})