const Router = require('koa-router')
const router = new Router({
    prefix: '/habit-category'
})

const habitCategoryController = require('../../controller/habitCategory')
router.get('/', habitCategoryController.getHabitCategoryList)
router.get('/:id', habitCategoryController.getHabitCategory)
module.exports = router
