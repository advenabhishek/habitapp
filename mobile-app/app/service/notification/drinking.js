import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { __createUserHabitNotificationChannel, __deleteUserHabitNotificationChannel } from './channel';
import { timeDiff } from '../utils';
import { analytics, analyticsTrack } from '../mixpanel';
import { POST_USER_HABIT_LOG } from '../../config/url'

const LitreToGlassConv = 4;

const sendDrinkingWaterNotification = async (userHabitId, data) => {
    // Need to think about the logic.......
    await __deleteUserHabitNotificationChannel({ userHabitId }).catch(console.warn)
    let channelId = await __createUserHabitNotificationChannel({ userHabitId })
    for (let weekday = 0; weekday < data.length; weekday++) {
        let { amount, endTime, startTime, unit, metric } = data[weekday][0]
        let numGlass = metric == "Glasses" ? amount : Math.ceil(amount * LitreToGlassConv)
        let timeDiffInHours = timeDiff(startTime, endTime).timeDiffHrsPrecise
        let timeDiffNotificationMins = Math.floor(timeDiffInHours / numGlass * 60)
        let amountPerNotitifcation = 1
        for (let i = 0; i < numGlass; i++) {
            let notificationTime = new Date(new Date(startTime).getTime() + 1000 * 60 * timeDiffNotificationMins * i) // instead of every hour make it every x hour depending on end and start time
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Drink water now',
                    body: 'Hi, please drink ' + amountPerNotitifcation + ' glass (250 ml) of water now.',
                    categoryIdentifier: 'drinkingLog',
                    data: { userHabitId, data, amountPerNotitifcation, metric }
                },
                trigger: {
                    channelId,
                    weekday: weekday + 1,
                    hour: notificationTime.getHours(),
                    minute: notificationTime.getMinutes(),
                    repeats: true,
                }
            }).then(res => {
                console.log('notification scheduled')
            }).catch(console.warn)
        }
    }
}

const handleDrinkingLogListener = async ({ notification, actionIdentifier, userText }) => {
    switch (actionIdentifier) {
        case 'yes':
            const weekday = (new Date().getDay() + 6) % 7
            let data = notification.request.content.data.data[weekday][0]
            let amount =  notification.request.content.data.amountPerNotitifcation
            let metric =  notification.request.content.data.metric
            var logAmount = metric == "Glasses" ? amount : (amount / LitreToGlassConv)
            analyticsTrack(analytics, "notif:drinkWaterLogYes", { "habitStartTime": new Date(), "amount": logAmount })
            await axios.post(POST_USER_HABIT_LOG, {
                userHabitId: notification.request.content.data.userHabitId,
                time: new Date(),
                amount: logAmount, // what should be the amount logged?
                location: data?.location || " ",
            }).catch(e => {
                console.error('auto logging failed due to some bug. fix it !!!!!!!! :: ', e)
            })
            break
        case 'later':
            analyticsTrack(analytics, "notif:drinkWaterLogLater")
            break
    }
}

export { sendDrinkingWaterNotification, handleDrinkingLogListener }