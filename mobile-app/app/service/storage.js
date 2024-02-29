import AsyncStorage from '@react-native-async-storage/async-storage';

async function getDashboardStatus() {
    try {
        const value = await AsyncStorage.getItem('dashboard-status')
        return value
    } catch (e) {
        console.warn('There was an error reading data')
    }
}

async function setDashboardStatus(value) {
    try {
        await AsyncStorage.setItem('dashboard-status', value.toString())
    } catch (e) {
        console.warn('There was an error writing data', e)
    }
}

async function getNotificationToken() {
    try {
        const value = await AsyncStorage.getItem('notification-token')
        return value
    } catch (e) {
        console.warn('There was an error reading data')
    }
}

async function setNotificationToken(value) {
    try {
        await AsyncStorage.setItem('notification-token', value.toString())
    } catch (e) {
        console.warn('There was an error writing data')
    }
}

async function getNotificationFlag() {
    try {
        const value = await AsyncStorage.getItem('notification-flag')
        return value
    } catch (e) {
        console.warn('There was an error reading data')
    }
}

async function setNotificationFlag(value) {
    try {
        await AsyncStorage.setItem('notification-flag', value.toString())
    } catch (e) {
        console.warn('There was an error writing data')
    }
}

export { getDashboardStatus, setDashboardStatus, getNotificationToken, setNotificationToken, getNotificationFlag, setNotificationFlag }
