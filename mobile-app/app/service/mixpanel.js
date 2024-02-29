//import ExpoMixpanelAnalytics from '@bothrs/expo-mixpanel-analytics';
import {getDeviceIdForAnalytics} from './device.js';
import * as Application from 'expo-application';

const disableAnalytics = false
// export const analytics = new ExpoMixpanelAnalytics("5080fc41b27eaf84fd738247a4512f24");

// export const analyticsTrack = (analytics, msg, attb={}) =>{
//     if(!disableAnalytics){
//         analytics.track(msg, attb)
//     }
// }

export const analytics = "123";

export const analyticsTrack = (analytics, msg, attb={}) =>{
    
}

const getInstallReferrer = async () =>{
    let installReferrer = await Application.getInstallReferrerAsync()
    return installReferrer;

}

const getPhoneId = () => {
    return Application.androidId
}

const appInstallTime = async () => {
    let installTime = await Application.getInstallationTimeAsync()
    return installTime;
}

// getDeviceIdForAnalytics().then(async (response) => {
//     let installReferrer = await getInstallReferrer()
//     let phoneId = getPhoneId()
//     let installTime = await appInstallTime()
//     analytics.identify(response.deviceId)
//     analytics.register({deviceID: response.deviceId})
//     analytics.people_set({ "$deviceID": response.deviceId, "$phoneID": phoneId, "$installTime": installTime, "$installReferrer": installReferrer});
//     if(response.newUserFlag){
//         analytics.track('newUser')
//     }
// })
