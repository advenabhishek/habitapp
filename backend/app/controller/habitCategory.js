const habitCategoryLogic = require('../logic/habitCategory')
class HabitCategoryController {
    async getHabitCategoryList(ctx) {
        let response = await habitCategoryLogic.getHabitCategoryList()
        ctx.body = response
    }

    async getHabitCategory(ctx) {
        let {id} = ctx.params
        let response = await habitCategoryLogic.getHabitCategory({id})
        ctx.body = response
    }
}

module.exports = new HabitCategoryController()
