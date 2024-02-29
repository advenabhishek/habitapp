import * as Notifications from 'expo-notifications';
import { set } from 'react-native-reanimated';

async function setAllNotificationCategory() {

    Notifications.setNotificationCategoryAsync('walkingReminder', [
        {
            identifier: 'yes',
            buttonTitle: 'On it',
            opensAppToForeground: false,
        },
        {
            identifier: 'skip',
            buttonTitle: 'Skip',
            opensAppToForeground: false,
        },
    ]);

    Notifications.setNotificationCategoryAsync('walkingLog', [
        {
            identifier: 'yes',
            buttonTitle: 'Log it',
            opensAppToForeground: false,
        },
        {
            identifier: 'skip',
            buttonTitle: 'Skip',
            opensAppToForeground: false,
        },
    ]);

    Notifications.setNotificationCategoryAsync('meditatingReminder', [
        {
            identifier: 'yes',
            buttonTitle: 'On it',
            opensAppToForeground: false,
        },
        {
            identifier: 'skip',
            buttonTitle: 'Skip',
            opensAppToForeground: false,
        },
    ]);

    Notifications.setNotificationCategoryAsync('meditatingLog', [
        {
            identifier: 'yes',
            buttonTitle: 'Log it',
            opensAppToForeground: false,
        },
        {
            identifier: 'skip',
            buttonTitle: 'Skip',
            opensAppToForeground: false,
        },
    ]);

    Notifications.setNotificationCategoryAsync('readingReminder', [
        {
            identifier: 'yes',
            buttonTitle: 'On it',
            opensAppToForeground: false,
        },
        {
            identifier: 'skip',
            buttonTitle: 'Skip',
            opensAppToForeground: false,
        },
    ]);

    Notifications.setNotificationCategoryAsync('readingLog', [
        {
            identifier: 'yes',
            buttonTitle: 'Log it',
            opensAppToForeground: false,
        },
        {
            identifier: 'skip',
            buttonTitle: 'Skip',
            opensAppToForeground: false,
        },
    ]);

    Notifications.setNotificationCategoryAsync('gymingReminder', [
        {
            identifier: 'yes',
            buttonTitle: 'On it',
            opensAppToForeground: false,
        },
        {
            identifier: 'skip',
            buttonTitle: 'Skip',
            opensAppToForeground: false,
        },
    ]);

    Notifications.setNotificationCategoryAsync('gymingLog', [
        {
            identifier: 'yes',
            buttonTitle: 'Log it',
            opensAppToForeground: false,
        },
        {
            identifier: 'skip',
            buttonTitle: 'Skip',
            opensAppToForeground: false,
        },
    ]);

    Notifications.setNotificationCategoryAsync('drinkingLog', [
        {
            identifier: 'yes',
            buttonTitle: 'Done',
            opensAppToForeground: false,
        },
        {
            identifier: 'later',
            buttonTitle: 'Later',
            opensAppToForeground: false,
        },
    ]);

    Notifications.setNotificationCategoryAsync('eatingFruitLog', [
        {
            identifier: 'yes',
            buttonTitle: 'Done',
            opensAppToForeground: false,
        },
        {
            identifier: 'later',
            buttonTitle: 'Later',
            opensAppToForeground: false,
        },
    ]);

    Notifications.setNotificationCategoryAsync('sleepingLog', [
        {
            identifier: 'yes',
            buttonTitle: "Yes",
            opensAppToForeground: true,
        },
    ]);

    return { success: true }
}

setAllNotificationCategory()

export { }
