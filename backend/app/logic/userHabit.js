const UserHabit = require('../model/userHabit')
const Habit = require('../model/habit')
const NotificationLogic = require('../logic/notification')

class UserHabitLogic {

    async getUserHabit({ id }) {
        let result = await UserHabit.findById(id)
        return result
    }

    // async createUserHabit({ selectedFrequency, startDate, userId, habit, selectedMetric, location, token }) { 
    async createUserHabit({ token, routine, habit, userId }) {
        let data = await UserHabit.create({
            userId: userId,
            habitId: habit._id,
            routine: routine,
            active: true
        })
        return { success: true, data }
    }

    async editUserHabit({ id, routine }) {
        let result = await UserHabit.updateOne({ _id: id }, {
            $set: {
                routine,
            }
        })

        return { success: true }
    }

    async getUserHabbitObject({ userId }) {
        let result = await UserHabit.find({ userId }) // change this to aggregate
        let obj = result.reduce((obj, curr) => {
            obj[curr._id] = curr
            return obj
        }, {})

        return obj
    }

    async deleteUserHabit({ id }) {
        let result = await UserHabit.deleteOne({ _id: id })
        NotificationLogic.deleteNotification({ userHabitId: id })
        return { success: true }
    }

    async getuserHabitByUser({ userId }) {
        let result = await UserHabit.find({ userId, active: true })
        return result
    }

    async getuserHabit({ id }) {
        let result = await UserHabit.findById(id)
        return result
    }

}

module.exports = new UserHabitLogic()



