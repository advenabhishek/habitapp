import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native'
import * as Device from 'expo-device';
import { setNotificationToken } from '../../service/storage'
import { __createUserHabitNotificationChannel, __deleteUserHabitNotificationChannel } from './channel';
import './category';
import { sendWalkingNotification, handleWalkingReminderListener, handleWalkingLogListener } from './walking'
import { sendMeditatingNotification, handleMeditatingReminderListener, handleMeditatingLogListener } from './meditation'
import { sendReadingNotification, handleReadingReminderListener, handleReadingLogListener } from './reading'
import { sendGymNotification, handleGymingReminderListener, handleGymingLogListener } from './gym'
import { sendDrinkingWaterNotification, handleDrinkingLogListener } from './drinking'
import { sendEatingFruitNotification, handleEatingFruitLogListener } from './eatingFruit'
import { sendSleepingNotification, handleSleepingLogListener } from './sleeping'


const createUserHabitNotification = async (userHabitId, { data = {}, habit }) => {
    let habitName = habit.name.toUpperCase()
    switch (habitName) {
        case 'WALKING':
            return sendWalkingNotification(userHabitId, data)
        case 'GYM':
            return sendGymNotification(userHabitId, data)
        case 'DRINKING WATER':
            return sendDrinkingWaterNotification(userHabitId, data)
        case 'SLEEPING':
            return sendSleepingNotification(userHabitId, data)
        case 'EATING FRUITS':
            return sendEatingFruitNotification(userHabitId, data)
        case 'READING':
            return sendReadingNotification(userHabitId, data)
        case 'MEDITATION':
            return sendMeditatingNotification(userHabitId, data)
        default:
            return console.warn('Notification not supported for this habit :: ', habitName)
    }
}

const deleteUserHabitNotification = async (userHabitId) => {
    await __deleteUserHabitNotificationChannel({ userHabitId })
    return true
}

const registerForPushNotifications = async () => {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setNotificationToken(token)
    } else {
        alert('Must use physical device for Push Notifications');
    }
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
};

const setNotificationListner = (props) => {
    Notifications.setNotificationHandler({
        handleNotification: async (notification) => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
    return Notifications.addNotificationResponseReceivedListener(async (response) => {
        const { notification, actionIdentifier, userText = '' } = response
        const categoryIdentifier = notification?.request?.content?.categoryIdentifier
        try {
            if (categoryIdentifier === 'walkingReminder') {
                await handleWalkingReminderListener({ notification, actionIdentifier, userText, props })
            }
            else if (categoryIdentifier === 'walkingLog') {
                await handleWalkingLogListener({ notification, actionIdentifier, userText, props })
            }
            if (categoryIdentifier === 'meditatingReminder') {
                await handleMeditatingReminderListener({ notification, actionIdentifier, userText, props })
            }
            else if (categoryIdentifier === 'meditatingLog') {
                await handleMeditatingLogListener({ notification, actionIdentifier, userText, props })
            }
            if (categoryIdentifier === 'readingReminder') {
                await handleReadingReminderListener({ notification, actionIdentifier, userText, props })
            }
            else if (categoryIdentifier === 'readingLog') {
                await handleReadingLogListener({ notification, actionIdentifier, userText, props })
            }
            if (categoryIdentifier === 'gymingReminder') {
                await handleGymingReminderListener({ notification, actionIdentifier, userText, props })
            }
            else if (categoryIdentifier === 'gymingLog') {
                await handleGymingLogListener({ notification, actionIdentifier, userText, props })
            }
            else if (categoryIdentifier === 'drinkingLog') {
                await handleDrinkingLogListener({ notification, actionIdentifier, userText, props })
            }
            else if (categoryIdentifier === 'eatingFruitLog') {
                await handleEatingFruitLogListener({ notification, actionIdentifier, userText, props })
            }
            else if (categoryIdentifier === 'sleepingLog') {
                await handleSleepingLogListener({ notification, actionIdentifier, userText, props })
            }
        } catch (e) {
            console.warn('Error in notification listener :: ', e)
        }

        Notifications.dismissNotificationAsync(notification.request.identifier)
    });
}

export { registerForPushNotifications, setNotificationListner, createUserHabitNotification, deleteUserHabitNotification }