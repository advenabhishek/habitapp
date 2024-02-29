import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import * as Application from 'expo-application';
import { v4 as uuidv4 } from 'uuid';
let uuid = uuidv4();

// const getDeviceId = async () => {
//     return Application.androidId
// }

export const getDeviceId = async () => {
    // await AsyncStorage.removeItem('deviceId')
    let fetchUUID = await AsyncStorage.getItem('deviceId')
    if (!fetchUUID) {
        await AsyncStorage.setItem('deviceId', uuid);
        fetchUUID = await AsyncStorage.getItem('deviceId');
    }
    return fetchUUID
}

export const getDeviceIdForAnalytics = async () => {
    let deviceId = await AsyncStorage.getItem('deviceId')
    let newUserFlag = 0
    if (!deviceId) {
        await AsyncStorage.setItem('deviceId', uuid);
        newUserFlag = 1
        deviceId = await AsyncStorage.getItem('deviceId');
    }
    return {deviceId, newUserFlag}
}

//export default getDeviceId

// b6c7dd85-fa6f-47f2-9f21-bf38f9361245