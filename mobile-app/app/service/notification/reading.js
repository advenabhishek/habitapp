import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { analytics, analyticsTrack } from '../mixpanel';
import { POST_USER_HABIT_LOG } from '../../config/url'

import { __createUserHabitNotificationChannel, __deleteUserHabitNotificationChannel } from './channel';
let logDelayTime = 1000 * 60 * 60; 
const sendReadingNotification = async (userHabitId, data) => {
    await __deleteUserHabitNotificationChannel({ userHabitId }).catch(console.warn)
    let channelId = await __createUserHabitNotificationChannel({ userHabitId })
    await __sendReminderNotificationForReading({ userHabitId, data, channelId })
    await __sendLogNotificationForReading({ userHabitId, data, channelId })
}

const handleReadingReminderListener = async ({ notification, actionIdentifier, props }) => {
    switch (actionIdentifier) {
        case 'yes':
            analyticsTrack(analytics, "notif:readReminderYes")
            break
        case 'skip':
            analyticsTrack(analytics, "notif:readReminderSkip")
            let { userHabitId } = notification.request.content.data
            await __deleteUserHabitNotificationChannel({ userHabitId }).catch(console.warn)
            setTimeout(() => {
                sendReadingNotification(userHabitId, data)
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

const handleReadingLogListener = async ({ notification, actionIdentifier, userText }) => {
    switch (actionIdentifier) {
        case 'yes':
            analyticsTrack(analytics, "notif:readLogYes")
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
            break // call an api to log the reading activity
        case 'skip': //cancel previous notifications  and reschedule them after the delay
            analyticsTrack(analytics, "notif:readLogSkip")
            break // do nothing
    }
}

const __sendReminderNotificationForReading = async ({ userHabitId, data, channelId }) => {
    for (let weekday = 0; weekday < data.length; weekday++) {
        for (let i = 0; i < data[weekday].length; i++) {
            let routine = data[weekday][i]
            // const reminderTime = new Date(new Date().getTime() + 1000 * 60 * 2) // 2 minute after
            const reminderTime = new Date(new Date(routine.startTime).getTime() - 1000 * 60 * 10) // 10 minute before
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Read in 10 minutes',
                    body: '10 minutes to go for your reading session. Are you ready?',
                    data: { userHabitId, data, channelId },
                    categoryIdentifier: 'readingReminder',
                },
                trigger: {
                    channelId,
                    weekday: weekday + 1,
                    hour: reminderTime.getHours(),
                    minute: reminderTime.getMinutes(),
                    repeats: true,
                }
            }).then(res => {
                console.log('notification scheduled for reading :: ', res)
            })
        }
    }
}

const __sendLogNotificationForReading = async ({ userHabitId, data, channelId }) => {
    for (let weekday = 0; weekday < data.length; weekday++) {
        for (let i = 0; i < data[weekday].length; i++) {
            let routine = data[weekday][i]
            const logTime = new Date(new Date(routine.startTime).getTime() + logDelayTime) // 60 minute after
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Log your reading session',
                    body: 'Hi, did you read today?',
                    data: { userHabitId, data, channelId },
                    categoryIdentifier: 'readingLog',
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

const __handleReadLaterListener = async ({ notification, actionIdentifier, userText }) => {
    const delay = 30 * 60 * 1000
    let time = new Date(new Date().getTime() + delay); // make it 30.
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Read in 10 minutes',
            body: '10 minutes to go for your reading session. Are you ready?',
            categoryIdentifier: 'readingReminder',
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
        sendReadingNotification(userHabitId, data)
    }, delay * 2)
    Notifications.scheduleNotificationAsync({
        content: {
            title: 'Log your reading session',
            body: 'Hi, did you read today?',
            data: data,
            categoryIdentifier: 'readingLog',
        },
        trigger: {
            channelId: notification.request.trigger.channelId,
            date: new Date(new Date().getTime() + delay + logDelayTime)
        }
    })
}

export { sendReadingNotification, handleReadingReminderListener, handleReadingLogListener }
