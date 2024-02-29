import AsyncStorage from '@react-native-async-storage/async-storage'

async function getDashboardStatus() {
    try {
        const value = await AsyncStorage.getItem('dashboard-status')
        return value
    } catch (e) {
        console.warn('There was an error reading data')
    }
}

async function setDashboardStatus() {
    try {
        await AsyncStorage.setItem('@storage_Key', value)
    } catch (e) {
        console.warn('There was an error writing data')
    }
}