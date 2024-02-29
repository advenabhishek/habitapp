const Notification = require('../model/notification')

class NotificationLogic {
    async addRoutineSuccessFullyAddedNotification({ userId, userHabitId, body, title, token }) {
        let result = await Notification.create({
            userId,
            userHabitId,
            body,
            title,
            time: new Date(),
            frequency: null,
            type: 'SUCCESSfully-added',
            status: 'ACTIVE',
            token,
            active: true,
        }).catch(console.error)
        // console.log('addRoutineSuccessFullyAddedNotification :: ', result)
        return { success: true }
    }

    async addReminderNotification({ startDate, userId, userHabitId, body, title, token }, beforeTimeInSec) {
        // console.log(startDate)
        let result = await Notification.create({
            userId,
            userHabitId,
            body,
            title,
            time: new Date(new Date(startDate).getTime() - beforeTimeInSec * 1000),
            frequency: 24 * 3600 * 1000,
            type: '',
            status: 'ACTIVE',
            active: true,
            token
        }).catch(console.error)

        console.log('addReminderNotification :: ', result)
        return { success: true }
    }

    async deleteNotification({ userHabitId }) {
        //get token of one first and return token, else false if nothing
        let notification = await Notification.findOne({ userHabitId })
        if (notification) {
            await Notification.deleteMany({ userHabitId })
            return {
                success: true,
                token: notification.token,
            }
        }
        return { success: false }
    }

    // async addNewLogActivityNotification({ startDate, userId, userHabitId, body, title }, beforeTimeInSec) {
    //     let result = await Notification.create({
    //         userId,
    //         userHabitId,
    //         body,
    //         title,
    //         time: startDate - beforeTimeInSec * 1000,
    //         frequency: 24 * 3600 * 1000,
    //         type: '',
    //         status: 'ACTIVE',
    //         active: true,
    //     })
    //     return { success: true }
    // }


}

module.exports = new NotificationLogic()


    //send a notfication for new routine added
    // await addRoutineSuccessFullyAddedNotification()
    // await addReminderNotification()
    // await addNewLogActivityNotification()

    //save to notification Queue which will renew everyday
    // 0 minute before start time --
    // 5 minute before start time
    // 30 minute before start time 
