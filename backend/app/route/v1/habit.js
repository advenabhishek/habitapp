const Router = require('koa-router')
const router = new Router({
    prefix: '/habit'
})

const habitController = require('../../controller/habit')
router.get('/habit-category/:habitCategoryId', habitController.getHabitByHabitCategory)
router.get('/:id', habitController.getHabit)
module.exports = router
