const userHabitLogLogic = require('../logic/userHabitLog')
class UserHabitController {
    async createUserHabitLog(ctx) {
        let { amount, time, userHabitId, location } = ctx.request.body
        let response = await userHabitLogLogic.createUserHabitLog({ amount, time, userHabitId, location })
        ctx.status = 201
        ctx.body = response
    }

    async getUserHabitLog(ctx) {
        let { id } = ctx.params
        let response = await userHabitLogLogic.getUserHabitLog({ id })
        ctx.body = response
    }

    async editUserHabitLog(ctx) {
        let { id } = ctx.params
        let { amount, time, location } = ctx.request.body
        let response = await userHabitLogLogic.editUserHabitLog({ id, amount, time, location })
        ctx.body = response
    }

    async deleteUserHabitLog(ctx) {
        let { id } = ctx.params
        let response = await userHabitLogLogic.deleteUserHabitLog({ id })
        ctx.body = response
    }

    async getSummary(ctx) {
        let { userHabitId } = ctx.params
        let response = await userHabitLogLogic.getSummary({ userHabitId })
        ctx.body = response
    }

    async getSummaryByUser(ctx) {
        let { userId } = ctx.params
        let response = await userHabitLogLogic.getSummaryByUser({ userId })
        ctx.body = response
    }

    async getUserHabitLogList(ctx) {
        let { userId } = ctx.params
        let response = await userHabitLogLogic.getUserHabitLogList({ userId })
        ctx.body = response
    }
}

module.exports = new UserHabitController();