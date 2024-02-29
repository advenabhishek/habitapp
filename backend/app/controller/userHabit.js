const userHabitLogic = require('../logic/userHabit')
class UserHabitController {

    async getUserHabit(ctx) {
        let { id } = ctx.params
        let response = await userHabitLogic.getUserHabit({ id })
        ctx.status = 200
        ctx.body = response
    }

    async getUserHabbitObject(ctx) {
        let { userId } = ctx.params
        let response = await userHabitLogic.getUserHabbitObject({ userId })
        ctx.status = 200
        ctx.body = response
    }

    async createUserHabit(ctx) {
        let { deviceId, token, routine, habit } = ctx.request.body
        let userId = deviceId
        let response = await userHabitLogic.createUserHabit({ deviceId, token, routine, habit, userId })
        ctx.status = 201
        ctx.body = response
    }

    async editUserHabit(ctx) {
        let { routine } = ctx.request.body
        let { id } = ctx.params
        let response = await userHabitLogic.editUserHabit({ id, routine })
        ctx.status = 201
        ctx.body = response
    }

    async deleteUserHabit(ctx) {
        let { id } = ctx.params
        let response = await userHabitLogic.deleteUserHabit({ id })
        ctx.status = 201
        ctx.body = response
    }

    async getuserHabitByUser(ctx) {
        let { userId } = ctx.params
        let response = await userHabitLogic.getuserHabitByUser({ userId })
        ctx.body = response
    }

    async getuserHabit(ctx) {
        let { id } = ctx.params
        let response = await userHabitLogic.getuserHabit({ id })
        ctx.body = response
    }
    //
}

module.exports = new UserHabitController();