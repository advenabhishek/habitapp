import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { analytics, analyticsTrack } from '../mixpanel';
import { POST_USER_HABIT_LOG } from '../../config/url'

import { __createUserHabitNotificationChannel, __deleteUserHabitNotificationChannel } from './channel';
let logDelayTime = 1000 * 60 * 60; 
const sendMeditatingNotification = async (userHabitId, data) => {
    await __deleteUserHabitNotificationChannel({ userHabitId }).catch(console.warn)
    let channelId = await __createUserHabitNotificationChannel({ userHabitId })
    await __sendReminderNotificationForMeditating({ userHabitId, data, channelId })
    await __sendLogNotificationForMeditating({ userHabitId, data, channelId })
}

const handleMeditatingReminderListener = async ({ notification, actionIdentifier, props }) => {
    switch (actionIdentifier) {
        case 'yes':
            analyticsTrack(analytics, "notif:meditateReminderYes")
            break
        case 'skip':
            analyticsTrack(analytics, "notif:meditateReminderSkip")
            let { userHabitId } = notification.request.content.data
            await __deleteUserHabitNotificationChannel({ userHabitId }).catch(console.warn)
            setTimeout(() => {
                sendMeditatingNotification(userHabitId, data)
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

const handleMeditatingLogListener = async ({ notification, actionIdentifier, userText }) => {
    switch (actionIdentifier) {
        case 'yes':
            analyticsTrack(analytics, "notif:meditateLogYes")
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
            break // call an api to log the meditating activity
        case 'skip': //cancel previous notifications  and reschedule them after the delay
            analyticsTrack(analytics, "notif:meditateLogSkip")
            break // do nothing
    }
}

const __sendReminderNotificationForMeditating = async ({ userHabitId, data, channelId }) => {
    for (let weekday = 0; weekday < data.length; weekday++) {
        for (let i = 0; i < data[weekday].length; i++) {
            let routine = data[weekday][i]
            // const reminderTime = new Date(new Date().getTime() + 1000 * 60 * 2) // 2 minute after
            const reminderTime = new Date(new Date(routine.startTime).getTime() - 1000 * 60 * 10) // 10 minute before
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Meditation in 10 minutes',
                    body: '10 minutes to go for your Meditation session. Are you ready?',
                    data: { userHabitId, data, channelId },
                    categoryIdentifier: 'meditatingReminder',
                },
                trigger: {
                    channelId,
                    weekday: weekday + 1,
                    hour: reminderTime.getHours(),
                    minute: reminderTime.getMinutes(),
                    repeats: true,
                }
            }).then(res => {
                console.log('notification scheduled for meditating :: ', res)
            })
        }
    }
}

const __sendLogNotificationForMeditating = async ({ userHabitId, data, channelId }) => {
    for (let weekday = 0; weekday < data.length; weekday++) {
        for (let i = 0; i < data[weekday].length; i++) {
            let routine = data[weekday][i]
            const logTime = new Date(new Date(routine.startTime).getTime() + logDelayTime) // 60 minute after
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Log your Meditation',
                    body: 'Hi, did you meditate today?',
                    data: { userHabitId, data, channelId },
                    categoryIdentifier: 'meditatingLog',
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

const __handleMeditateLaterListener = async ({ notification, actionIdentifier, userText }) => {
    const delay = 30 * 60 * 1000
    let time = new Date(new Date().getTime() + delay); // make it 30.
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Meditate in 10 minutes',
            body: '10 minutes to go for your meditation. Are you ready?',
            categoryIdentifier: 'meditatingReminder',
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
        sendMeditatingNotification(userHabitId, data)
    }, delay * 2)
    Notifications.scheduleNotificationAsync({
        content: {
            title: 'Log your Meditation',
            body: 'Hi, did you meditate today?',
            data: data,
            categoryIdentifier: 'meditatingLog',
        },
        trigger: {
            channelId: notification.request.trigger.channelId,
            date: new Date(new Date().getTime() + delay + logDelayTime)
        }
    })
}

export { sendMeditatingNotification, handleMeditatingReminderListener, handleMeditatingLogListener }
