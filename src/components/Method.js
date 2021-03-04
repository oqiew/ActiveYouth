import Firestore from '@react-native-firebase/firestore';
import Storage from '@react-native-firebase/storage'
import { TableName } from '../database/TableName';
export const isEmptyValues = (value) => {
    let result = false;
    if (value === undefined) {
        return result
    }
    value.forEach(element => {
        if (element === '' || element === null || element === undefined) {
            result = true
        }
    });

    return result

}
export const isEmptyValue = (value) => {
    if (value === '' || value === null || value === undefined) {
        return true
    } else {
        return false
    }
}
export var deleteImage = async (url) => {

    return new Promise((resolve, reject) => {
        try {
            Storage().refFromURL(url).delete().then(() => {
                resolve({ status: true, message: 'ลบรูปภาพสำเร็จ' })
            }).catch((error) => {
                Firestore().collection(TableName.Alerts).add({
                    Table: '',
                    ID: '',
                    Status: 'deleteImage',
                    Error: error,
                    URL: url,
                    date: Firestore.Timestamp.Now()
                }).then(() => {

                }).catch((error) => {
                    console.log('reject alert')
                })
                reject({ status: false, message: 'ลบรูปไม่ภาพสำเร็จ' + error })
            })
        } catch (error) {
            reject({ status: false, message: 'ลบรูปไม่ภาพสำเร็จ' + error })
        }
    })


}

export var deleteData = async (table, id) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('delete', id)
            Firestore().collection(table).doc(id).delete().then(() => {

                resolve({ status: true, message: 'ลบข้อมูลสำเร็จ' })
            }).catch((error) => {
                Firestore().collection(TableName.Alerts).add({
                    Table: table,
                    ID: id,
                    Status: 'deleteData',
                    Error: error,
                    URL: '',
                    date: Firestore.Timestamp.Now()
                }).then(() => {

                }).catch((error) => {
                    console.log('reject alert')
                })
                reject({ status: false, message: 'ลบข้อมูลไม่สำเร็จ' + error })
            })
        } catch (error) {
            reject({ status: false, message: 'ลบรูปไม่ภาพสำเร็จ' + error })
        }
    })

}
export var uploadImage = async (ref, id, uri) => {

    return new Promise((resolve, reject) => {
        try {
            const imageRef = Storage().ref(ref).child(id + '.jpg')
            let mime = 'image/jpg';
            imageRef.putFile(uri, { contentType: mime })
                .then(() => { return imageRef.getDownloadURL() })
                .then((url) => {
                    resolve(url)
                })
                .catch((error) => { reject(error) })
        } catch (error) {
            reject(error)
        }
    })

}