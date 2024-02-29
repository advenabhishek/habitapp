import * as Notifications from 'expo-notifications';

const __createUserHabitNotificationChannel = async ({ userHabitId }) => {
    const channel = await Notifications.setNotificationChannelAsync(`NOTIFICATION_CHANNEL_USERHABIT_${userHabitId}`, {
        name: 'USER_HABIT',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
    }).catch(e => {
        console.error(e)
        console.log(Object.keys(e))
        throw 'SHUTUP'
    })
    const { id, name, importance, bypassDnd, description, groupId, lightColor, lockscreenVisibility, showBadge, sound, audioAttributes, vibrationPattern, enableLights, enableVibrate } = channel
    console.info('created a new channel', channel)
    return id
}

const __deleteUserHabitNotificationChannel = async ({ userHabitId }) => {
    const res = await Notifications.deleteNotificationChannelAsync(`NOTIFICATION_CHANNEL_USERHABIT_${userHabitId}`)
    return res
}

export { __createUserHabitNotificationChannel, __deleteUserHabitNotificationChannel }