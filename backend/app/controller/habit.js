const habitLogic = require('../logic/habit')
class HabitController {
    async getHabitByHabitCategory(ctx) {
        let { params: { habitCategoryId } } = ctx
        if (!habitCategoryId) { //also add valid object Id validation
            throw new Error('Invalid Habit Category')
        }
        let response = await habitLogic.getHabitByHabitCategory(habitCategoryId)
        ctx.body = response
    }

    async getHabit(ctx) {
        let { id } = ctx.params
        let response = await habitLogic.getHabit(id)
        ctx.body = response
    }
}

module.exports = new HabitController()
