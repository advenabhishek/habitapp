const Router = require('koa-router')
const router = new Router({
    prefix: '/user-habit'
})

const userHabitController = require('../../controller/userHabit')
router.get('/:id', userHabitController.getUserHabit)
router.post('/', userHabitController.createUserHabit)
router.put('/:id', userHabitController.editUserHabit)
router.delete('/:id', userHabitController.deleteUserHabit)
router.get('/user/:userId', userHabitController.getuserHabitByUser)
router.get('/user/:userId', userHabitController.getuserHabitByUser)
router.get('/mapping/user/:userId', userHabitController.getUserHabbitObject)

module.exports = router