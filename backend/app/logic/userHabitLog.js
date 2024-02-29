const UserHabitLog = require('../model/userHabitLog')
const UserHabit = require('../model/userHabit')
const UserHabitLogic = require('./userHabit')
const { getSignedUrl } = require('../service/aws')
const { count } = require('../model/userHabit')

class UserHabitLogLogic {
    async createUserHabitLog({ amount, time, userHabitId, location }) {
        let result = await UserHabitLog.create({ amount, time, userHabitId, location })
        let summary = await this.getSummary({ userHabitId })
        return { result, summary }
    }

    async getUserHabitLog({ id }) {
        let result = await UserHabitLog.findById(id)
        return result
    }

    async deleteUserHabitLog({ id }) {
        let result = await UserHabitLog.deleteOne({ _id: id })
        return result
    }

    async editUserHabitLog({ id, amount, time, location }) {
        let result = await UserHabitLog.updateOne({ _id: id }, {
            $set: { amount, time, location }
        })
        let summary = await this.getSummary({ userHabitId })
        return { result, summary }
    }

    async getSummary({ userHabitId }) {
        return {}
        let result = await UserHabitLog.find({ userHabitId }) // need to change this
        return result
    }

    async getSummaryByUser({ userId }) {
        let userHabitIdListObject = await UserHabitLogic.getuserHabitByUser({ userId }) // get all user habits
        let userHabitIdList = userHabitIdListObject.map(i => i._id) // list of all user habit ids
        let result = await UserHabitLog.aggregate([
            {
                $match: { userHabitId: { $in: userHabitIdList }, amount: { $ne: 0 } } // filter for userHabitId (of UserHabitLog) in userHabitIdList and amount <> 0 (remove skip days)
            },
            {
                "$group": {
                    _id: "$userHabitId", // group by on userhabitid as _id
                    total: { $sum: "$amount" },
                    count: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$time", timezone: "+0530" } } },
                    logStartDate: { $min: "$time" }, // 1st StartDate of all the logs by the user
                    skip: { $sum: { $cond: [{ $eq: ['$amount', 0] }, 1, 0] } } // number of days skipped
                }
            },
            {
                $lookup: {
                    from: 'userhabits', // join grouped data with user habits
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userHabits'
                }
            },
            { $unwind: '$userHabits' }, // part of left join
            {
                $lookup: {
                    from: 'habits',  // join with habits
                    localField: 'userHabits.habitId',
                    foreignField: '_id',
                    as: 'habits'
                }
            },
            { $unwind: '$habits' },
            {
                $project: { // output fields
                    _id: 1,
                    totalAmt: "$total",
                    logStartDate: "$logStartDate",
                    startDate: "$userHabits.routine.startTime",
                    count: { $size: "$count" },
                    skip: 1,
                    location: "$userHabits.routine.location",
                    amount: "$userHabits.routine.amount",
                    unit: "$userHabits.routine.name",
                    type: "$userHabits.routine.type",
                    habitObj: "$habits",
                    habitName: "$habits.name",
                    awsKey: "$habits.awsKey"
                }
            }
        ])

        result = result.map(item => {
            const minStartDate = new Date(item.startDate).getTime() > new Date(item.logStartDate).getTime()
                ? item.logStartDate
                : item.startDate
            let startDate = new Date(minStartDate)
            startDate.setHours(0)
            startDate.setMinutes(0)
            startDate.setSeconds(0)
            item.minStartDate = minStartDate
            let dateDiff = (new Date().getTime() - startDate.getTime())
            let dayDiff = dateDiff / (24 * 3600 * 1000)
            item.maxCount = Math.floor(dayDiff)
            item.maxCount = item.maxCount < 1 ? 1 : item.maxCount
            item.average = (item.totalAmt / (item.maxCount || 1)).toFixed(1)
            item.awsKey = getSignedUrl(item.awsKey)
            return item
        })

        var remainingResult = []

        if (result.length < userHabitIdList.length) {
            remainingResult = await this.getDefaultSummary({ userId, habitIds: result.map(i => i._id) })
        }
        return [...result, ...remainingResult]
    }

    async getDefaultSummary({ userId, habitIds }) {
        let result = await UserHabit.aggregate([
            {
                $match: {
                    userId,
                    _id: { $nin: habitIds }
                }
            },
            {
                $lookup: {
                    from: 'habits',
                    localField: 'habitId',
                    foreignField: '_id',
                    as: 'habits'
                }
            },
            { $unwind: '$habits' },
        ])

        result = result.map(i => {
            let dateDiff = (new Date().getTime() - new Date(i.routine.startTime).getTime())
            let dayDiff = dateDiff / (24 * 3600 * 1000)
            let maxCount = Math.floor(dayDiff)
            return {
                "_id": i._id,
                "total": 0,
                "count": 0,
                "startDate": i.routine.startTime,
                "location": i.routine.location,
                "amount": i.routine.amount,
                "unit": i.routine.name,
                "type": i.routine.type,
                "habitObj": i.habits,
                "habitName": i.habits.name,
                "awsKey": getSignedUrl(i.habits.awsKey),
                "maxCount": maxCount,
                "average": 0,
                "skip": 0,
                minStartDate: i.routine.startTime,
            }
        })
        return result
    }

    async getUserHabitLogList({ userId }) {
        let result = await UserHabitLog.find({ userId })
        return result
    }
}

module.exports = new UserHabitLogLogic()



