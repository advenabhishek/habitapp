import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { analytics, analyticsTrack } from '../mixpanel';
import { POST_USER_HABIT_LOG } from '../../config/url'

import { __createUserHabitNotificationChannel, __deleteUserHabitNotificationChannel } from './channel';
// let logDelayTime = 1000 * 60 * 2; // changed this to 60 mins
let logDelayTime = 1000 * 60 * 60; 
const sendGymNotification = async (userHabitId, data) => {
    await __deleteUserHabitNotificationChannel({ userHabitId }).catch(console.warn)
    let channelId = await __createUserHabitNotificationChannel({ userHabitId })
    await __sendReminderNotificationForGyming({ userHabitId, data, channelId })
    await __sendLogNotificationForGyming({ userHabitId, data, channelId })
}

const handleGymingReminderListener = async ({ notification, actionIdentifier, props }) => {
    console.log('RPOPS :::::: ', props)
    switch (actionIdentifier) {
        case 'yes':
            analyticsTrack(analytics, "notif:gymReminderYes")
            break
        case 'skip':
            analyticsTrack(analytics, "notif:gymReminderSkip")
            await __deleteUserHabitNotificationChannel({ userHabitId }).catch(console.warn)
            setTimeout(() => {
                sendGymNotification(userHabitId, data)
            }, 1000 * 60 * 60)
            break
    }
}
const __findMostRecentRoutine = (data) => {
    let minDifference = Infinity
    let index = -1
    for (let i = 0; i < data.length; i++) {
        let timeDifference = Math.abs(new Date().getTime() - new Date(data[i].startTime).getTime())
        if (timeDifference < minDifference) {
            minDifference = timeDifference
            index = i
        }
    }
    return data[index]
}

const handleGymingLogListener = async ({ notification, actionIdentifier, userText }) => {
    switch (actionIdentifier) {
        case 'yes':
            analyticsTrack(analytics, "notif:gymLogYes")
            const weekday = (new Date().getDay() + 6) % 7
            let data = notification.request.content.data.data[weekday]
            data = __findMostRecentRoutine(data)
            if (!data) {
                console.error('no data for this day')
                return
            }
            await axios.post(POST_USER_HABIT_LOG, {
                userHabitId: notification.request.content.data.userHabitId,
                time: new Date(),
                amount: data.amount,
                location: data.location || " ",
            }).catch(e => {
                console.error('auto loggin failed due to some bug. fix it !!!!!!!! :: ', e)
            })
            break // call an api to log the gyming activity
        case 'skip': //cancel previous notifications  and reschedule them after the delay
            analyticsTrack(analytics, "notif:gymLogSkip")
            break // do nothing
        case 'later':
            analyticsTrack(analytics, "notif:gymLogLater")
            await __handleGymLaterListener({ notification, actionIdentifier, userText })
            break;
    }
}

const __sendReminderNotificationForGyming = async ({ userHabitId, data, channelId }) => {
    for (let weekday = 0; weekday < data.length; weekday++) {
        for (let i = 0; i < data[weekday].length; i++) {
            let routine = data[weekday][i]
            // const reminderTime = new Date(new Date().getTime() + 1000 * 60 * 2) // 2 minute after
            const reminderTime = new Date(new Date(routine.startTime).getTime() - 1000 * 60 * 30) // 10 minute before

            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Gym in 30 minutes',
                    body: '30 minutes to go for your gym session. Are you ready?',
                    data: { userHabitId, data, channelId },
                    categoryIdentifier: 'gymingReminder',
                },
                trigger: {
                    channelId,
                    weekday: weekday + 1,
                    hour: reminderTime.getHours(),
                    minute: reminderTime.getMinutes(),
                    repeats: true,
                }
            }).then(res => {
                console.log('notification scheduled')
            })
        }
    }
}

const __sendLogNotificationForGyming = async ({ userHabitId, data, channelId }) => {
    console.log('send log notification for gyming :: ', { userHabitId, data, channelId })
    for (let weekday = 0; weekday < data.length; weekday++) {
        for (let i = 0; i < data[weekday].length; i++) {
            let routine = data[weekday][i]
            const logTime = new Date(new Date(routine.startTime).getTime() + logDelayTime) // 60 minute after
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Log your Gym session',
                    body: 'Hi, did you go to gym today?',
                    data: { userHabitId, data, channelId },
                    categoryIdentifier: 'gymingLog',
                },
                trigger: {
                    channelId,
                    weekday: weekday + 1,
                    hour: logTime.getHours(),
                    minute: logTime.getMinutes(),
                    repeats: true,
                }
            }).then(res => {
                console.log('notification scheduled')
            })
        }
    }
}

const __handleGymLaterListener = async ({ notification, actionIdentifier, userText }) => {
    const delay = 30 * 60 * 1000
    let time = new Date(new Date().getTime() + delay); // make it 30.
    console.log('notification.request.content.data notification.request.content.data notification.request.content.data data :: ', notification)
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Gym in 30 minutes',
            body: '30 minutes to go for your gym session. Are you ready?',
            categoryIdentifier: 'gymingReminder',
            data: notification.request.content.data,
        },
        trigger: {
            channelId: notification.request.trigger.channelId,
            date: time,
        }
    })
    let { userHabitId, data } = notification.request.content.data
    //cancel previous notifications  and reschedule them after the delay
    await __deleteUserHabitNotificationChannel({ userHabitId }).catch(console.warn)
    setTimeout(() => {
        sendGymNotification(userHabitId, data)
    }, delay * 2)
    Notifications.scheduleNotificationAsync({
        content: {
            title: 'Log your Gym session',
            body: 'Hi, did you go to gym today?',
            data: data,
            categoryIdentifier: 'gymingLog',
        },
        trigger: {
            channelId: notification.request.trigger.channelId,
            date: new Date(new Date().getTime() + delay + logDelayTime)
        }
    })
}

export { sendGymNotification, handleGymingReminderListener, handleGymingLogListener }
