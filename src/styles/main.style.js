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
    map_bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        alignSelf: 'center',
        width: 110,
        padding: 5
    },
    map_arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32
    },
    map_arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5
    },
    map_name: {
        fontSize: 16,
        marginBottom: 5
    },
    map_image: {
        width: 100,
        height: 100,
    }
})