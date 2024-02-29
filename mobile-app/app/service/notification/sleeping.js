import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { analytics, analyticsTrack } from '../mixpanel';
import { POST_USER_HABIT_LOG } from '../../config/url'

const sendSleepingNotification = async (userHabitId, data) => {
    await __deleteUserHabitNotificationChannel({ userHabitId }).catch(console.warn)
    let channelId = await __createUserHabitNotificationChannel({ userHabitId })
    for (let weekday = 0; weekday < data.length; weekday++) {
        let { amount, endTime, startTime, unit, metric } = data[weekday][0]

        Notifications.scheduleNotificationAsync({
            content: {
                title: 'Good morning',
                body: 'Hope you had a good sleep. Shall we look at your day ahead?',
                categoryIdentifier: 'sleepingLog',
            },
            trigger: {
                channelId,
                weekday: weekday + 1,
                hour: new Date(endTime).getHours(),
                minute: new Date(endTime).getMinutes(),
                repeats: true,
            }
        }).then(res => {
            console.info(res)
            console.log('notification scheduled')
        }).catch(console.warn)

        let prepareForSleepTime = new Date(startTime).getTime() - 1000 * 60 * 30 // 30 mins before sleep

        Notifications.scheduleNotificationAsync({
            content: {
                title: 'Sleep now',
                body: 'Good night, see you tomorrow',
            },
            trigger: {
                channelId,
                weekday: weekday + 1,
                hour: new Date(startTime).getHours(),
                minute: new Date(startTime).getMinutes(),
                repeats: true,
            }
        }).then(res => {
            console.info(res)
            console.log('notification scheduled')
        }).catch(console.warn)

        Notifications.scheduleNotificationAsync({
            content: {
                title: 'Sleep in 30 minutes',
                body: "Let's wind down and prepare for a good night's rest.",
            },
            trigger: {
                channelId,
                weekday: weekday + 1,
                hour: new Date(prepareForSleepTime).getHours(),
                minute: new Date(prepareForSleepTime).getMinutes(),
                repeats: true,
            }
        }).then(res => {
            console.info(res)
            console.log('notification scheduled')
        }).catch(console.warn)
    }
}

const handleSleepingLogListener =  async ({ notification, actionIdentifier, props }) => {
    console.log(props)
    
    switch (actionIdentifier) {
        case 'yes':
            navigation.navigate('HomeScreen', { refreshPage: true })
        default:
            break;
    }
}


export { sendSleepingNotification, handleSleepingLogListener }